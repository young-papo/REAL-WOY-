import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  Keyboard,
  useColorScheme,
  Platform,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowBackIosRounded,
  Search,
  Close,
  BoxBold,
  Megaphone,
  ProfileFill,
  VerifiedCheckFill,
  StarSolid,
} from '../components/icons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const SearchResultsScreen = ({ route, navigation }) => {
  const { initialQuery = '', query = '' } = route?.params || {};
  const searchQuery = initialQuery || query;

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [searchText, setSearchText] = useState(searchQuery);
  const [previousQuery, setPreviousQuery] = useState(searchQuery);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  const [tabWidth, setTabWidth] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchRecent, setShowSearchRecent] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!searchQuery);

  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
  const scrollRefProducts = useRef(null);
  const scrollRefProfiles = useRef(null);
  const scrollRefRequests = useRef(null);

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#F0F0F0',
    cardBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    inputBg: isDarkMode ? '#1F1F1F' : '#F2F2F2',
    requestBg: isDarkMode ? '#1A1A1A' : '#F8F9FA',
  };

  const [recentSearches, setRecentSearches] = useState([
    'Nike Air Force',
    'iPhone 13',
    'Sac Gucci',
    'MacBook Pro',
    'AirPods',
  ]);

  // Simulation de données backend - À remplacer par vraie API
  const [searchResults, setSearchResults] = useState({
    products: [],
    profiles: [],
    requests: [],
  });

  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    }
  }, []);

  useEffect(() => {
    if (tabWidth === 0) return;

    let targetValue = 0;
    if (activeTab === 'products') targetValue = 0;
    if (activeTab === 'profiles') targetValue = tabWidth;
    if (activeTab === 'requests') targetValue = tabWidth * 2;

    Animated.spring(tabIndicatorAnim, {
      toValue: targetValue,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [activeTab, tabWidth]);

  const performSearch = (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    // TODO: Remplacer par appel API réel
    // fetch(`/api/search?q=${query}`)
    //   .then(res => res.json())
    //   .then(data => setSearchResults(data))

    setTimeout(() => {
      // Simulation résultats backend basés sur la requête
      const lowerQuery = query.toLowerCase();

      const mockResults = {
        products:
          lowerQuery.includes('nike')
            ? [
                {
                  id: 'p1',
                  title: 'Nike Air Force 1',
                  price: '5 000',
                  originalPrice: '7 500',
                  discount: 33,
                  currency: 'HTG',
                  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
                },
                {
                  id: 'p2',
                  title: 'Nike Air Max 90',
                  price: '6 500',
                  currency: 'HTG',
                  image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80',
                },
              ]
            : lowerQuery.includes('iphone')
              ? [
                  {
                    id: 'p3',
                    title: 'iPhone 13 Pro Max',
                    price: '45 000',
                    currency: 'HTG',
                    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&q=80',
                  },
                ]
              : [],

        profiles:
          lowerQuery.includes('nike') || lowerQuery.includes('sneaker')
            ? [
                {
                  id: 'u1',
                  username: 'sneaker_shop',
                  name: 'Sneaker Shop Haiti',
                  verified: true,
                  image: 'https://i.pravatar.cc/150?img=12',
                  accountType: 'Boutique',
                  rating: 4.8,
                },
                {
                  id: 'u2',
                  username: 'nike_haiti',
                  name: 'Nike Haiti Official',
                  verified: true,
                  image: 'https://i.pravatar.cc/150?img=33',
                  accountType: 'Marque',
                  rating: 4.9,
                },
              ]
            : [],

        requests:
          lowerQuery.includes('nike') || lowerQuery.includes('air force')
            ? [
                {
                  id: 'r1',
                  title: 'Je cherche des Air Force taille 43 en bon état #nike #airforce #taille43',
                  author: 'marie_dev',
                  authorId: 'user12',
                  authorImage: 'https://i.pravatar.cc/150?img=12',
                  verified: true,
                  productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
                },
              ]
            : [],
      };

      setSearchResults(mockResults);
      setLoading(false);
    }, 800);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowSearchRecent(true);
  };

  const handleSearchCancel = () => {
    setSearchText(previousQuery);
    setIsSearchFocused(false);
    setShowSearchRecent(false);
    Keyboard.dismiss();
  };

  const handleSearchSubmit = () => {
    if (searchText.trim().length === 0) return;
    Keyboard.dismiss();
    setShowSearchRecent(false);
    setIsSearchFocused(false);

    const newSearches = [searchText, ...recentSearches.filter((s) => s !== searchText)].slice(0, 5);
    setRecentSearches(newSearches);
    setPreviousQuery(searchText);

    performSearch(searchText);
  };

  const handleRecentSearchPress = (search) => {
    setSearchText(search);
    setShowSearchRecent(false);
    setIsSearchFocused(false);
    Keyboard.dismiss();
    setPreviousQuery(search);
    performSearch(search);
  };

  const handleRemoveRecentSearch = (search) => {
    setRecentSearches(recentSearches.filter((s) => s !== search));
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', {
      productId: product.id,
      product: product,
    });
  };

  const handleProfilePress = (profile) => {
    navigation.navigate('UserProfile', {
      userId: profile.id,
      user: profile,
    });
  };

  const handleRequestPress = (request) => {
    navigation.navigate('RequestDetail', {
      requestId: request.id,
      request: request,
    });
  };

  const parseTextWithHashtags = (text) => {
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <Text key={index} style={{ color: '#3B82F6', fontWeight: '600' }}>
            {part}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const getAvailableTabs = () => {
    const tabs = [];
    if (searchResults.products?.length > 0) {
      tabs.push({ key: 'products', label: 'Produits', icon: BoxBold });
    }
    if (searchResults.profiles?.length > 0) {
      tabs.push({ key: 'profiles', label: 'Profils', icon: ProfileFill });
    }
    if (searchResults.requests?.length > 0) {
      tabs.push({ key: 'requests', label: 'Requêtes', icon: Megaphone });
    }
    return tabs;
  };

  const availableTabs = getAvailableTabs();

  useEffect(() => {
    // Auto-sélectionner le premier onglet disponible
    if (availableTabs.length > 0 && !availableTabs.find((t) => t.key === activeTab)) {
      setActiveTab(availableTabs[0].key);
    }
  }, [availableTabs]);

  const renderProductItem = ({ item, index }) => {
    const isLeft = index % 2 === 0;
    const titleLength = item.title.length;
    const priceLength = `${item.price} ${item.currency}`.length;
    const shouldReduceText = titleLength > 20 || priceLength > 15;

    return (
      <TouchableOpacity
        style={[styles.productCard, isLeft ? styles.itemLeft : styles.itemRight]}
        onPress={() => handleProductPress(item)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />

        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradientOverlay} />

        <View style={styles.productInfoOverlay}>
          <View style={styles.productTextSection}>
            <Text
              style={[styles.productName, shouldReduceText && styles.productNameSmall]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {item.discount ? (
              <View style={styles.priceRow}>
                <Text
                  style={[styles.originalPrice, shouldReduceText && styles.originalPriceSmall]}
                >
                  {item.originalPrice}
                </Text>
                <Text style={[styles.priceText, shouldReduceText && styles.priceTextSmall]}>
                  {item.price} {item.currency}
                </Text>
              </View>
            ) : (
              <Text style={[styles.priceText, shouldReduceText && styles.priceTextSmall]}>
                {item.price} {item.currency}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderProfileItem = ({ item }) => (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={() => handleProfilePress(item)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.profileImage} />

      <View style={styles.profileInfo}>
        <View style={styles.profileNameRow}>
          <Text style={[styles.profileName, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          {item.verified && <VerifiedCheckFill color="#3B82F6" size={14} />}
        </View>

        <Text style={[styles.profileUsername, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.username}
        </Text>

        <Text style={[styles.profileAccountType, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.accountType}
        </Text>

        <View style={styles.profileRatingRow}>
          <StarSolid color="#FFA500" size={12} />
          <Text style={[styles.profileRating, { color: colors.text }]}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestWrapper} key={item.id}>
      <TouchableOpacity
        style={[styles.requestCard, { backgroundColor: colors.requestBg, borderColor: colors.border }]}
        onPress={() => handleRequestPress(item)}
        activeOpacity={0.9}
      >
        {item.productImage && (
          <Image source={{ uri: item.productImage }} style={styles.requestThumbnail} />
        )}

        <View style={styles.requestContent}>
          <View style={styles.requestHeader}>
            <Image source={{ uri: item.authorImage }} style={styles.userAvatar} />
            <Text style={[styles.username, { color: colors.text }]}>{item.author}</Text>
            {item.verified && <VerifiedCheckFill color="#3B82F6" size={14} />}
          </View>

          <Text style={[styles.requestText, { color: colors.text }]} numberOfLines={2}>
            {parseTextWithHashtags(item.title)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderProductGrid = () => {
    if (loading) {
      return (
        <View style={styles.skeletonContainer}>
          <View style={styles.row}>
            <View
              style={[
                styles.skeletonCard,
                styles.itemLeft,
                { backgroundColor: isDarkMode ? '#2A2A2A' : '#E0E0E0' },
              ]}
            />
            <View
              style={[
                styles.skeletonCard,
                styles.itemRight,
                { backgroundColor: isDarkMode ? '#2A2A2A' : '#E0E0E0' },
              ]}
            />
          </View>
          <View style={styles.row}>
            <View
              style={[
                styles.skeletonCard,
                styles.itemLeft,
                { backgroundColor: isDarkMode ? '#2A2A2A' : '#E0E0E0' },
              ]}
            />
            <View
              style={[
                styles.skeletonCard,
                styles.itemRight,
                { backgroundColor: isDarkMode ? '#2A2A2A' : '#E0E0E0' },
              ]}
            />
          </View>
        </View>
      );
    }

    const rows = [];
    for (let i = 0; i < searchResults.products.length; i += 2) {
      const leftItem = searchResults.products[i];
      const rightItem = searchResults.products[i + 1];

      rows.push(
        <View key={`row-${i}`} style={styles.row}>
          {renderProductItem({ item: leftItem, index: i })}
          {rightItem && renderProductItem({ item: rightItem, index: i + 1 })}
        </View>
      );
    }
    return rows;
  };

  const renderEmptyState = () => {
    const getEmptyConfig = () => {
      switch (activeTab) {
        case 'products':
          return {
            icon: BoxBold,
            title: 'Aucun produit trouvé',
            message: `Aucun produit ne correspond à "${searchText}"`,
          };
        case 'profiles':
          return {
            icon: ProfileFill,
            title: 'Aucun profil trouvé',
            message: `Aucun profil ne correspond à "${searchText}"`,
          };
        case 'requests':
          return {
            icon: Megaphone,
            title: 'Aucune requête trouvée',
            message: `Aucune requête ne correspond à "${searchText}"`,
          };
        default:
          return {
            icon: Search,
            title: 'Aucun résultat',
            message: `Aucun résultat pour "${searchText}"`,
          };
      }
    };

    const config = getEmptyConfig();
    const IconComponent = config.icon;

    return (
      <View style={styles.emptyContainer}>
        <IconComponent color={colors.textSecondary} size={64} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>{config.title}</Text>
        <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>{config.message}</Text>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Recherche en cours...
          </Text>
        </View>
      );
    }

    if (!hasSearched) {
      return null;
    }

    // Si aucun résultat du tout
    if (availableTabs.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Search color={colors.textSecondary} size={64} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun résultat trouvé</Text>
          <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
            Aucun résultat pour "{searchText}". Essayez une autre recherche.
          </Text>
        </View>
      );
    }

    // Afficher le contenu selon l'onglet actif
    switch (activeTab) {
      case 'products':
        return (
          <ScrollView
            ref={scrollRefProducts}
            style={styles.contentScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View style={styles.resultsContainer}>
              {searchResults.products?.length > 0 ? renderProductGrid() : renderEmptyState()}
            </View>
          </ScrollView>
        );

      case 'profiles':
        return (
          <ScrollView
            ref={scrollRefProfiles}
            style={styles.contentScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View style={styles.profilesContainer}>
              {searchResults.profiles?.length > 0 ? (
                <FlatList
                  data={searchResults.profiles}
                  renderItem={renderProfileItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                renderEmptyState()
              )}
            </View>
          </ScrollView>
        );

      case 'requests':
        return (
          <ScrollView
            ref={scrollRefRequests}
            style={styles.contentScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View style={styles.resultsContainer}>
              {searchResults.requests?.length > 0 ? (
                <FlatList
                  data={searchResults.requests}
                  renderItem={renderRequestItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                renderEmptyState()
              )}
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  if (showSearchRecent) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

        {/* Header avec recherche */}
        <View
          style={[
            styles.header,
            { borderBottomColor: colors.border, paddingTop: insets.top + 8 },
          ]}
        >
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowBackIosRounded color={colors.text} size={24} />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <View style={styles.searchIconContainer}>
              <Search color={colors.textSecondary} size={18} />
            </View>

            <TextInput
              style={[styles.searchInput, { backgroundColor: colors.inputBg, color: colors.text }]}
              placeholder="Rechercher..."
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
              onFocus={handleSearchFocus}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              autoFocus={true}
            />

            {searchText.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
                <Close color={colors.textSecondary} size={20} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={handleSearchCancel}>
            <Text style={[styles.cancelText, { color: colors.text }]}>Annuler</Text>
          </TouchableOpacity>
        </View>

        {/* Recherches récentes */}
        <View style={[styles.recentSearchContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.recentSearchHeading, { color: colors.textSecondary }]}>Récent</Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {recentSearches.map((search, index) => (
              <View key={index} style={styles.recentSearchItem}>
                <TouchableOpacity
                  style={styles.recentSearchLeft}
                  onPress={() => handleRecentSearchPress(search)}
                >
                  <Search color={colors.textSecondary} size={18} />
                  <Text style={[styles.recentSearchText, { color: colors.text }]}>{search}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleRemoveRecentSearch(search)}>
                  <Close color={colors.textSecondary} size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header avec recherche */}
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border, paddingTop: insets.top + 8 },
        ]}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowBackIosRounded color={colors.text} size={24} />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <View style={styles.searchIconContainer}>
            <Search color={colors.textSecondary} size={18} />
          </View>

          <TextInput
            style={[styles.searchInput, { backgroundColor: colors.inputBg, color: colors.text }]}
            placeholder="Rechercher..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={handleSearchFocus}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />

          {searchText.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
              <Close color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          )}
        </View>

        {isSearchFocused && (
          <TouchableOpacity onPress={handleSearchCancel}>
            <Text style={[styles.cancelText, { color: colors.text }]}>Annuler</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Onglets */}
      {availableTabs.length > 0 && hasSearched && (
        <View
          style={[styles.tabsContainer, { borderBottomColor: colors.border }]}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setTabWidth(width / availableTabs.length);
          }}
        >
          {availableTabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tab}
                onPress={() => handleTabChange(tab.key)}
              >
                <View style={styles.tabContent}>
                  <IconComponent
                    color={activeTab === tab.key ? colors.text : colors.textSecondary}
                    size={16}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      { color: colors.textSecondary },
                      activeTab === tab.key && { color: colors.text },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <Animated.View
            style={[
              styles.tabIndicator,
              {
                backgroundColor: colors.text,
                width: tabWidth,
                transform: [{ translateX: tabIndicatorAnim }],
              },
            ]}
          />
        </View>
      )}

      {/* Contenu */}
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
  },

  backButton: {
    padding: 4,
  },

  searchContainer: {
    flex: 1,
    position: 'relative',
  },

  searchIconContainer: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },

  searchInput: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingLeft: 40,
    paddingVertical: 10,
    paddingRight: 40,
    fontSize: 14,
  },

  clearButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelText: {
    fontSize: 15,
    fontWeight: '500',
  },

  recentSearchContainer: {
    flex: 1,
    paddingTop: 8,
  },

  recentSearchHeading: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },

  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  recentSearchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  recentSearchText: {
    fontSize: 15,
    flex: 1,
  },

  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    position: 'relative',
  },

  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },

  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
  },

  content: {
    flex: 1,
  },

  contentScroll: {
    flex: 1,
  },

  resultsContainer: {
    padding: 8,
  },

  profilesContainer: {
    padding: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Produits
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  itemLeft: {
    marginRight: 2,
    marginLeft: 0,
  },

  itemRight: {
    marginLeft: 2,
    marginRight: 0,
  },

  productCard: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },

  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },

  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },

  productInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  productTextSection: {
    flex: 1,
    marginRight: 8,
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },

  productNameSmall: {
    fontSize: 13,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  originalPrice: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
    textDecorationLine: 'line-through',
    textDecorationColor: '#EF4444',
    textDecorationStyle: 'solid',
  },

  originalPriceSmall: {
    fontSize: 9,
  },

  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  priceTextSmall: {
    fontSize: 10,
  },

  skeletonContainer: {
    padding: 0,
  },

  skeletonCard: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: 10,
  },

  // Profils
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },

  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
    marginRight: 12,
  },

  profileInfo: {
    flex: 1,
  },

  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },

  profileName: {
    fontSize: 15,
    fontWeight: '700',
  },

  profileUsername: {
    fontSize: 13,
    marginBottom: 2,
  },

  profileAccountType: {
    fontSize: 12,
    marginBottom: 3,
  },

  profileRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  profileRating: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Requêtes
  requestWrapper: {
    width: '100%',
    marginBottom: 4,
  },

  requestCard: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 0,
  },

  requestThumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },

  requestContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    marginRight: 6,
  },

  username: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },

  requestText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
    fontWeight: '500',
  },
});

export default SearchResultsScreen;
