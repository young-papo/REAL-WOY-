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
  Modal,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  useColorScheme,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MapFoldSolid,
  Filter2Fill,
  StarSolid,
  VerifiedCheckFill,
  Search,
  Close,
  BoxBold,
  Megaphone,
} from '../components/icons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const ExplorerScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [searchText, setSearchText] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [tabWidth, setTabWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(null);
  const [currentSubTab, setCurrentSubTab] = useState('products');
  const [showSearchRecent, setShowSearchRecent] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
  const scrollRefProducts = useRef(null);
  const scrollRefRequests = useRef(null);
  const bannerScrollRef = useRef(null);

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#F0F0F0',
    cardBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    inputBg: isDarkMode ? '#1F1F1F' : '#F2F2F2',
    toast: isDarkMode ? 'rgba(31, 31, 31, 0.95)' : 'rgba(51, 51, 51, 0.95)',
    requestBg: isDarkMode ? '#1A1A1A' : '#F8F9FA',
    badge: '#EF4444',
  };

  const [filters, setFilters] = useState({
    distance: 'Tous',
    rating: 'Tous',
    date: 'Tous',
    conditions: [],
    categories: [],
    priceRange: 'Tous',
  });

  const [recentSearches, setRecentSearches] = useState([
    'Nike Air Force',
    'iPhone 13',
    'Sac Gucci',
    'MacBook Pro',
    'AirPods',
  ]);

  const productCategories = [
    { id: '1', name: 'Vêtements', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80' },
    { id: '2', name: 'Chaussures', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&q=80' },
    { id: '3', name: 'Sacs', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80' },
    { id: '4', name: 'Accessoires', image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80' },
    { id: '5', name: 'Bijoux', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80' },
    { id: '6', name: 'En soldes', image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400&q=80' },
    { id: '0', name: 'Tout près', image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&q=80' },
    { id: '00', name: 'Suivies', image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80' },
  ];

  const requestCategories = [
    { id: 'r2', name: 'Récentes', image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80' },
    { id: 'r3', name: 'Tout près', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
    { id: 'r1', name: 'Plus recherchées', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&q=80' },
    { id: 'r0', name: 'Suivies', image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80' },
  ];

  const productSuggestions = [
    {
      id: 's1',
      title: 'Nike Air Force 1',
      price: '5 000',
      originalPrice: '7 500',
      discount: 33,
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      status: 'available',
    },
    {
      id: 's2',
      title: 'iPhone 13 Pro Max',
      price: '45 000',
      originalPrice: '50 000',
      discount: 10,
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&q=80',
      status: 'available',
    },
    {
      id: 's3',
      title: 'MacBook Pro M1',
      price: '85 000',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
      status: 'available',
    },
    {
      id: 's4',
      title: 'AirPods Pro',
      price: '12 000',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&q=80',
      status: 'available',
    },
  ];

  const requestSuggestions = [
    {
      id: 'rs1',
      title: 'Je cherche des Air Force taille 43 en bon état #nike #airforce #taille43',
      author: 'marie',
      authorId: 'user1',
      authorImage: 'https://i.pravatar.cc/150?img=12',
      verified: true,
      productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
    },
    {
      id: 'rs2',
      title: "Besoin d'un sac noir pour soirée #sac #noir #soirée",
      author: 'alex',
      authorId: 'user2',
      authorImage: 'https://i.pravatar.cc/150?img=33',
      verified: false,
      productImage: null,
    },
    {
      id: 'rs3',
      title: 'Qui vend des montres Apple Watch? #applewatch #montre',
      author: 'john',
      authorId: 'user3',
      authorImage: 'https://i.pravatar.cc/150?img=8',
      verified: true,
      productImage: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200&q=80',
    },
  ];

  const bannerConfig = {
    enabled: true,
    banners: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
        label: 'Promo -50%',
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
        label: 'Nouveautés',
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        label: 'Best Sellers',
      },
    ],
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    if (tabWidth === 0) return;

    let targetValue = 0;
    if (currentSubTab === 'products') targetValue = 0;
    if (currentSubTab === 'requests') targetValue = tabWidth;

    Animated.spring(tabIndicatorAnim, {
      toValue: targetValue,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [currentSubTab, tabWidth]);

  useEffect(() => {
    if (showFilterModal) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [showFilterModal]);

  const toggleFilterArray = (key, value) => {
    const current = filters[key];
    if (value === 'Tous') {
      setFilters({ ...filters, [key]: [] });
    } else if (current.includes(value)) {
      setFilters({ ...filters, [key]: current.filter((v) => v !== value) });
    } else {
      setFilters({ ...filters, [key]: [...current, value] });
    }
  };

  const showSuccessToast = (message) => setShowToast(message);

  const handleSearch = (text) => {
    setSearchText(text);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowSearchRecent(true);
  };

  const handleSearchCancel = () => {
    setIsSearchFocused(false);
    setShowSearchRecent(false);
    setSearchText('');
    Keyboard.dismiss();
  };

  const handleSearchSubmit = () => {
    if (searchText.trim().length === 0) return;
    Keyboard.dismiss();
    setShowSearchRecent(false);

    const newSearches = [searchText, ...recentSearches.filter((s) => s !== searchText)].slice(0, 5);
    setRecentSearches(newSearches);

    navigation.navigate('SearchResults', { query: searchText });
  };

  const handleRecentSearchPress = (search) => {
    setSearchText(search);
    setShowSearchRecent(false);
    Keyboard.dismiss();
    navigation.navigate('SearchResults', { query: search });
  };

  const handleRemoveRecentSearch = (search) => {
    setRecentSearches(recentSearches.filter((s) => s !== search));
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryProducts', {
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  const handleMapPress = () => {
    navigation.navigate('Map');
  };

  const handleFilterPress = () => setShowFilterModal(true);

  const applyFilters = () => {
    const hasFilters =
      filters.distance !== 'Tous' ||
      filters.rating !== 'Tous' ||
      filters.date !== 'Tous' ||
      filters.conditions.length > 0 ||
      filters.categories.length > 0 ||
      filters.priceRange !== 'Tous';

    setHasActiveFilters(hasFilters);
    setShowFilterModal(false);
    showSuccessToast('Filtres appliqués');
  };

  const resetFilters = () => {
    setFilters({
      distance: 'Tous',
      rating: 'Tous',
      date: 'Tous',
      conditions: [],
      categories: [],
      priceRange: 'Tous',
    });
    setHasActiveFilters(false);
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', {
      productId: product.id,
      product: product,
    });
  };

  const handleRequestPress = (request) => {
    navigation.navigate('RequestDetail', {
      requestId: request.id,
      request: request,
    });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    if (!searchText) {
      setShowSearchRecent(false);
      setIsSearchFocused(false);
    }
  };

  const handleSubTabChange = (tab) => {
    setCurrentSubTab(tab);
  };

  const onBannerScroll = (event) => {
    const slideSize = SCREEN_WIDTH - 8;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentBannerIndex(index);
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

  const renderBanner = () => {
    if (!bannerConfig.enabled || bannerConfig.banners.length === 0) {
      return null;
    }

    return (
      <View style={styles.bannerWrapper}>
        <FlatList
          ref={bannerScrollRef}
          data={bannerConfig.banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onBannerScroll}
          scrollEventThrottle={16}
          snapToInterval={SCREEN_WIDTH - 8}
          decelerationRate="fast"
          contentContainerStyle={styles.bannerFlatList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.bannerSlide} activeOpacity={0.9}>
              <Image source={{ uri: item.image }} style={styles.bannerImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.bannerGradient}
              />
              <View style={styles.bannerLabelContainer}>
                <Text style={styles.bannerLabel}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {bannerConfig.banners.length > 1 && (
          <View style={styles.bannerIndicators}>
            {bannerConfig.banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.bannerDot,
                  {
                    backgroundColor: '#FFFFFF',
                    opacity: currentBannerIndex === index ? 1 : 0.5,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <View style={styles.categoryGradient}>
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderProductSuggestion = ({ item, index }) => {
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

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        />

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
                  style={[
                    styles.originalPrice,
                    shouldReduceText && styles.originalPriceSmall,
                  ]}
                >
                  {item.originalPrice}
                </Text>
                <Text
                  style={[styles.priceText, shouldReduceText && styles.priceTextSmall]}
                >
                  {item.price} {item.currency}
                </Text>
              </View>
            ) : (
              <Text
                style={[styles.priceText, shouldReduceText && styles.priceTextSmall]}
              >
                {item.price} {item.currency}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRequestSuggestion = ({ item }) => (
    <View style={styles.requestWrapper} key={item.id}>
      <TouchableOpacity
        style={[
          styles.requestCard,
          { backgroundColor: colors.requestBg, borderColor: colors.border },
        ]}
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
    for (let i = 0; i < productSuggestions.length; i += 2) {
      const leftItem = productSuggestions[i];
      const rightItem = productSuggestions[i + 1];

      rows.push(
        <View key={`row-${i}`} style={styles.row}>
          {renderProductSuggestion({ item: leftItem, index: i })}
          {rightItem && renderProductSuggestion({ item: rightItem, index: i + 1 })}
        </View>
      );
    }
    return rows;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Toast */}
      {showToast && (
        <View style={[styles.toastContainer, { backgroundColor: colors.toast, top: insets.top + 10 }]}>
          <Text style={styles.toastText}>{showToast}</Text>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.filterModalContainer}
        >
          <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
            <Animated.View style={[styles.filterOverlay, { opacity: fadeAnim }]} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.filterModalContent,
              {
                backgroundColor: colors.cardBg,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={[styles.filterHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Filtres</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Close color={colors.text} size={28} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>
                  Type de recherche
                </Text>
                <View style={styles.filterOptionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor:
                          currentSubTab === 'products' ? colors.text : colors.inputBg,
                      },
                    ]}
                    onPress={() => handleSubTabChange('products')}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color:
                            currentSubTab === 'products'
                              ? colors.background
                              : colors.text,
                        },
                      ]}
                    >
                      Produits
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor:
                          currentSubTab === 'requests' ? colors.text : colors.inputBg,
                      },
                    ]}
                    onPress={() => handleSubTabChange('requests')}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        {
                          color:
                            currentSubTab === 'requests'
                              ? colors.background
                              : colors.text,
                        },
                      ]}
                    >
                      Requêtes
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {currentSubTab === 'products' && (
                <>
                  <View style={styles.filterSection}>
                    <Text style={[styles.filterLabel, { color: colors.text }]}>
                      Catégories
                    </Text>
                    <View style={styles.filterOptionsRow}>
                      {[
                        'Tous',
                        'Vêtements',
                        'Chaussures',
                        'Sacs',
                        'Accessoires',
                        'Bijoux',
                        'Électronique',
                        'Maison',
                        'Sport',
                        'Autres',
                      ].map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.filterOption,
                            {
                              backgroundColor:
                                filters.categories.includes(cat) ||
                                (cat === 'Tous' && filters.categories.length === 0)
                                  ? colors.text
                                  : colors.inputBg,
                            },
                          ]}
                          onPress={() => toggleFilterArray('categories', cat)}
                        >
                          <Text
                            style={[
                              styles.filterOptionText,
                              {
                                color:
                                  filters.categories.includes(cat) ||
                                  (cat === 'Tous' && filters.categories.length === 0)
                                    ? colors.background
                                    : colors.text,
                              },
                            ]}
                          >
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.filterSection}>
                    <Text style={[styles.filterLabel, { color: colors.text }]}>
                      Fourchette de prix (HTG)
                    </Text>
                    <View style={styles.filterOptionsRow}>
                      {['Tous', '100 - 500', '500 - 1 000', '1 000 - 5 000', '5 000+'].map(
                        (range) => (
                          <TouchableOpacity
                            key={range}
                            style={[
                              styles.filterOption,
                              {
                                backgroundColor:
                                  filters.priceRange === range
                                    ? colors.text
                                    : colors.inputBg,
                              },
                            ]}
                            onPress={() => setFilters({ ...filters, priceRange: range })}
                          >
                            <Text
                              style={[
                                styles.filterOptionText,
                                {
                                  color:
                                    filters.priceRange === range
                                      ? colors.background
                                      : colors.text,
                                },
                              ]}
                            >
                              {range}
                            </Text>
                          </TouchableOpacity>
                        )
                      )}
                    </View>
                  </View>

                  <View style={styles.filterSection}>
                    <Text style={[styles.filterLabel, { color: colors.text }]}>États</Text>
                    <View style={styles.filterOptionsRow}>
                      {['Tous', 'Neuf', 'Bon', 'Utilisé'].map((cond) => (
                        <TouchableOpacity
                          key={cond}
                          style={[
                            styles.filterOption,
                            {
                              backgroundColor:
                                filters.conditions.includes(cond) ||
                                (cond === 'Tous' && filters.conditions.length === 0)
                                  ? colors.text
                                  : colors.inputBg,
                            },
                          ]}
                          onPress={() => toggleFilterArray('conditions', cond)}
                        >
                          <Text
                            style={[
                              styles.filterOptionText,
                              {
                                color:
                                  filters.conditions.includes(cond) ||
                                  (cond === 'Tous' && filters.conditions.length === 0)
                                    ? colors.background
                                    : colors.text,
                              },
                            ]}
                          >
                            {cond}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              )}

              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>
                  Distance (km)
                </Text>
                <View style={styles.filterOptionsRow}>
                  {['Tous', '5', '10', '20', '50+'].map((dist) => (
                    <TouchableOpacity
                      key={dist}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor:
                            filters.distance === dist ? colors.text : colors.inputBg,
                        },
                      ]}
                      onPress={() => setFilters({ ...filters, distance: dist })}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          {
                            color:
                              filters.distance === dist
                                ? colors.background
                                : colors.text,
                          },
                        ]}
                      >
                        {dist} {dist !== 'Tous' && 'km'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>
                  Note minimum
                </Text>
                <View style={styles.filterOptionsRow}>
                  {['Tous', '1', '2', '3', '4', '5'].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor:
                            filters.rating === rating ? colors.text : colors.inputBg,
                        },
                      ]}
                      onPress={() => setFilters({ ...filters, rating: rating })}
                    >
                      {rating === 'Tous' ? (
                        <Text
                          style={[
                            styles.filterOptionText,
                            {
                              color:
                                filters.rating === rating
                                  ? colors.background
                                  : colors.text,
                            },
                          ]}
                        >
                          Tous
                        </Text>
                      ) : (
                        <View style={styles.ratingOption}>
                          <Text
                            style={[
                              styles.filterOptionText,
                              {
                                color:
                                  filters.rating === rating
                                    ? colors.background
                                    : colors.text,
                                marginRight: 4,
                              },
                            ]}
                          >
                            {rating}
                          </Text>
                          <StarSolid
                            color={
                              filters.rating === rating
                                ? isDarkMode
                                  ? '#000000'
                                  : '#FFFFFF'
                                : '#FFA500'
                            }
                            size={14}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>Publié</Text>
                <View style={styles.filterOptionsRow}>
                  {[
                    { key: 'Tous', label: 'Tous' },
                    { key: 'today', label: "Aujourd'hui" },
                    { key: 'week', label: 'Cette semaine' },
                    { key: 'month', label: 'Ce mois' },
                  ].map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor:
                            filters.date === option.key ? colors.text : colors.inputBg,
                        },
                      ]}
                      onPress={() => setFilters({ ...filters, date: option.key })}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          {
                            color:
                              filters.date === option.key
                                ? colors.background
                                : colors.text,
                          },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={{ height: 80 }} />
            </ScrollView>

            <View style={[styles.filterButtons, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.filterResetButton, { borderColor: colors.border }]}
                onPress={resetFilters}
              >
                <Text style={[styles.filterResetText, { color: colors.text }]}>
                  Réinitialiser
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterApplyButton, { backgroundColor: colors.text }]}
                onPress={applyFilters}
              >
                <Text style={[styles.filterApplyText, { color: colors.background }]}>
                  Appliquer
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Search Header */}
      <View
        style={[
          styles.searchHeader,
          { borderBottomColor: colors.border, paddingTop: insets.top + 8 },
        ]}
      >
        {!isSearchFocused && (
          <TouchableOpacity onPress={handleMapPress}>
            <MapFoldSolid color={colors.text} size={24} />
          </TouchableOpacity>
        )}

        <View
          style={[styles.searchContainer, isSearchFocused && styles.searchContainerExpanded]}
        >
          <View style={styles.searchIconContainer}>
            <Search color={colors.textSecondary} size={18} />
          </View>

          <TextInput
            style={[
              styles.searchInput,
              { backgroundColor: colors.inputBg, color: colors.text },
            ]}
            placeholder="Rechercher..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={handleSearch}
            onFocus={handleSearchFocus}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />

          {searchText.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearSearch}>
              <Text style={[styles.clearIcon, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {isSearchFocused ? (
          <TouchableOpacity onPress={handleSearchCancel}>
            <Text style={[styles.cancelText, { color: colors.text }]}>Annuler</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleFilterPress} style={styles.filterIconContainer}>
            <Filter2Fill color={colors.text} size={24} />
            {hasActiveFilters && (
              <View style={[styles.filterBadge, { backgroundColor: colors.badge }]} />
            )}
          </TouchableOpacity>
        )}
      </View>

      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.mainContainer}>
          {showSearchRecent ? (
            <View style={[styles.recentSearchContainer, { backgroundColor: colors.background }]}>
              <Text style={[styles.recentSearchHeading, { color: colors.textSecondary }]}>
                Récent
              </Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {recentSearches.map((search, index) => (
                  <View key={index} style={styles.recentSearchItem}>
                    <TouchableOpacity
                      style={styles.recentSearchLeft}
                      onPress={() => handleRecentSearchPress(search)}
                    >
                      <Search color={colors.textSecondary} size={18} />
                      <Text style={[styles.recentSearchText, { color: colors.text }]}>
                        {search}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleRemoveRecentSearch(search)}>
                      <Close color={colors.textSecondary} size={20} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : (
            <>
              {/* Tabs */}
              <View
                style={[styles.tabsContainer, { borderBottomColor: colors.border }]}
                onLayout={(event) => {
                  const { width } = event.nativeEvent.layout;
                  setTabWidth(width / 2);
                }}
              >
                <TouchableOpacity
                  style={styles.tab}
                  onPress={() => handleSubTabChange('products')}
                >
                  <View style={styles.tabContent}>
                    <BoxBold
                      color={
                        currentSubTab === 'products' ? colors.text : colors.textSecondary
                      }
                      size={16}
                    />
                    <Text
                      style={[
                        styles.tabText,
                        { color: colors.textSecondary },
                        currentSubTab === 'products' && { color: colors.text },
                      ]}
                    >
                      Produits
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.tab}
                  onPress={() => handleSubTabChange('requests')}
                >
                  <View style={styles.tabContent}>
                    <Megaphone
                      color={
                        currentSubTab === 'requests' ? colors.text : colors.textSecondary
                      }
                      size={16}
                    />
                    <Text
                      style={[
                        styles.tabText,
                        { color: colors.textSecondary },
                        currentSubTab === 'requests' && { color: colors.text },
                      ]}
                    >
                      Requêtes
                    </Text>
                  </View>
                </TouchableOpacity>

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

              {/* Content */}
              <View style={styles.mainContent}>
                {currentSubTab === 'products' ? (
                  <ScrollView
                    ref={scrollRefProducts}
                    style={styles.mainScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    {renderBanner()}

                    <View style={styles.categoriesSection}>
                      <FlatList
                        data={productCategories}
                        renderItem={renderCategory}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesList}
                      />
                    </View>

                    <View style={styles.suggestionsSection}>
                      <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
                        Suggestions
                      </Text>

                      <View style={styles.gridContainer}>{renderProductGrid()}</View>
                    </View>
                  </ScrollView>
                ) : (
                  <ScrollView
                    ref={scrollRefRequests}
                    style={styles.mainScroll}
                    showsVerticalScrollIndicator={false}
                  >
                    {renderBanner()}

                    <View style={styles.categoriesSection}>
                      <FlatList
                        data={requestCategories}
                        renderItem={renderCategory}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesList}
                      />
                    </View>

                    <View style={styles.suggestionsSection}>
                      <Text style={[styles.suggestionsTitle, { color: colors.text }]}>
                        Suggestions
                      </Text>

                      <FlatList
                        data={requestSuggestions}
                        renderItem={renderRequestSuggestion}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                      />
                    </View>
                  </ScrollView>
                )}
              </View>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  mainContainer: {
    flex: 1,
  },

  toastContainer: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },

  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
  },

  searchContainer: {
    flex: 1,
    position: 'relative',
  },

  searchContainerExpanded: {
    marginLeft: 0,
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

  clearIcon: {
    fontSize: 18,
    fontWeight: '300',
  },

  cancelText: {
    fontSize: 15,
    fontWeight: '500',
  },

  filterIconContainer: {
    position: 'relative',
  },

  filterBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: -2,
    right: -2,
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

  mainContent: {
    flex: 1,
  },

  mainScroll: {
    flex: 1,
  },

  bannerWrapper: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    position: 'relative',
  },

  bannerFlatList: {
    paddingHorizontal: 0,
  },

  bannerSlide: {
    width: SCREEN_WIDTH - 8,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },

  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },

  bannerLabelContainer: {
    position: 'absolute',
    bottom: 10,
    left: 12,
  },

  bannerLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  bannerIndicators: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    flexDirection: 'row',
    gap: 5,
  },

  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  categoriesSection: {
    paddingVertical: 8,
  },

  categoriesList: {
    paddingHorizontal: 16,
    gap: 12,
  },

  categoryCard: {
    width: 100,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },

  categoryImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },

  categoryGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 8,
  },

  categoryName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  suggestionsSection: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },

  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 8,
  },

  gridContainer: {
    gap: 4,
  },

  skeletonContainer: {
    padding: 0,
  },

  skeletonCard: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: 10,
  },

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
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
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

  filterModalContainer: {
    flex: 1,
  },

  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  filterModalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },

  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },

  filterTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  filterScroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  filterSection: {
    marginBottom: 24,
  },

  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },

  filterOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },

  filterOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },

  ratingOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  filterButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
  },

  filterResetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },

  filterResetText: {
    fontSize: 16,
    fontWeight: '600',
  },

  filterApplyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  filterApplyText: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ExplorerScreen;
