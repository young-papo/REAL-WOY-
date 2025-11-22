import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar, useColorScheme, RefreshControl, Image, Modal, Animated, ScrollView, TextInput, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowBackIosRounded,
  ShoppingBagIcon,
  Search,
  Filter2Fill,
  StarSolid,
  CloseIcon,
  VerifiedCheckFill,
} from '../components/icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 24) / 3;

export default function MyPurchasesScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    headerBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    skeletonBg: isDarkMode ? '#2A2A2A' : '#E0E0E0',
    cardBg: isDarkMode ? '#1A1A1A' : '#F9F9F9',
    inputBg: isDarkMode ? '#1A1A1A' : '#F5F5F5',
  };

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const [tempFilters, setTempFilters] = useState({
    sortBy: 'recent',
    stars: null,
    priceRange: '',
  });

  const [filters, setFilters] = useState({
    sortBy: 'recent',
    stars: null,
    priceRange: '',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const flatListRef = useRef(null);

  useEffect(() => {
    loadPurchases(1);
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [purchases, filters, searchQuery]);

  useEffect(() => {
    if (showFilterModal || showDetailModal) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showFilterModal, showDetailModal]);

  const generateMockPurchases = (pageNum) => {
    const itemsPerPage = 15;
    const startIndex = (pageNum - 1) * itemsPerPage;
    const purchasesData = [];

    const baseProducts = [
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
        title: 'iPhone 13 Pro Max',
        price: '45 000',
        originalPrice: '50 000',
        discount: 10,
        currency: 'HTG',
        image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&q=80',
      },
      {
        id: 'p3',
        title: 'MacBook Pro M1',
        price: '85 000',
        currency: 'HTG',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
      },
      {
        id: 'p4',
        title: 'AirPods Pro',
        price: '12 000',
        currency: 'HTG',
        image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&q=80',
      },
    ];

    for (let i = 0; i < itemsPerPage; i++) {
      const index = startIndex + i;
      const baseProduct = baseProducts[index % baseProducts.length];
      const sellerRating = Math.floor(Math.random() * 5) + 1;
      const purchaseDate = new Date(Date.now() - index * 24 * 60 * 60 * 1000);

      purchasesData.push({
        ...baseProduct,
        id: `purchase_${pageNum}_${i}`,
        sellerRating: sellerRating,
        purchaseDate: purchaseDate.toISOString(),
        purchasePrice: (parseInt(baseProduct.price.replace(/\s/g, '')) - 500).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
        description: `Description détaillée du produit ${baseProduct.title}. Article en excellent état, peu utilisé. Vendu avec tous les accessoires d'origine.`,
        images: [
          baseProduct.image,
          'https://picsum.photos/seed/' + (index + 100) + '/400/400',
          'https://picsum.photos/seed/' + (index + 200) + '/400/400',
        ],
        seller: {
          name: `vendeur_${index % 20 + 1}_avec_nom_tres_long`,
          oderId: `seller_${index % 20 + 1}`,
          avatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
          verified: Math.random() > 0.5,
          rating: sellerRating.toFixed(1),
        }
      });
    }

    return purchasesData;
  };

  const loadPurchases = async (pageNum) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newPurchases = generateMockPurchases(pageNum);

      if (pageNum === 1) {
        setPurchases(newPurchases);
      } else {
        setPurchases(prev => [...prev, ...newPurchases]);
      }

      if (pageNum >= 3) {
        setHasMore(false);
      }

      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const applyFiltersAndSearch = async () => {
    setIsFiltering(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    let filtered = [...purchases];

    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.stars) {
      filtered = filtered.filter(item => item.sellerRating === filters.stars);
    }

    if (filters.priceRange) {
      filtered = filtered.filter(item => {
        const price = parseInt(item.purchasePrice.replace(/\s/g, ''));
        const [min, max] = filters.priceRange.split('-').map(p => parseInt(p));
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.purchaseDate);
      const dateB = new Date(b.purchaseDate);

      if (filters.sortBy === 'recent') {
        return dateB - dateA;
      } else if (filters.sortBy === 'oldest') {
        return dateA - dateB;
      }
      return 0;
    });

    setFilteredPurchases(filtered);
    setIsFiltering(false);
  };

  const resetFilters = () => {
    setTempFilters({
      sortBy: 'recent',
      stars: null,
      priceRange: '',
    });
    setFilters({
      sortBy: 'recent',
      stars: null,
      priceRange: '',
    });
    setSearchQuery('');
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilterModal(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await loadPurchases(1);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore && !isFiltering) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadPurchases(nextPage);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleSellerPress = (seller) => {
    setShowDetailModal(false);
    navigation.navigate('UserProfile', {
      oderId: seller.oderId,
      username: seller.name,
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
  };

  const handleViewProduct = () => {
    setShowDetailModal(false);
    if (selectedProduct) {
      navigation.navigate('ProductDetail', {
        productId: selectedProduct.id,
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
        <View key={item} style={[styles.skeletonItem, { backgroundColor: colors.cardBg, width: CARD_WIDTH }]}>
          <View style={[styles.skeletonImage, { backgroundColor: colors.skeletonBg }]} />
          <View style={[styles.skeletonTitle, { backgroundColor: colors.skeletonBg }]} />
          <View style={[styles.skeletonPrice, { backgroundColor: colors.skeletonBg }]} />
        </View>
      ))}
    </View>
  );

  const renderPurchaseItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.purchaseCard, { width: CARD_WIDTH }]}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={[styles.productName, { color: colors.text }]} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={[styles.price, { color: colors.text }]}>
        {item.purchasePrice} {item.currency}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        {[1, 2, 3].map((item) => (
          <View key={item} style={[styles.skeletonItem, { backgroundColor: colors.cardBg, width: CARD_WIDTH }]}>
            <View style={[styles.skeletonImage, { backgroundColor: colors.skeletonBg }]} />
            <View style={[styles.skeletonTitle, { backgroundColor: colors.skeletonBg }]} />
            <View style={[styles.skeletonPrice, { backgroundColor: colors.skeletonBg }]} />
          </View>
        ))}
      </View>
    );
  };

  const renderEmptyState = () => {
    const hasActiveFilters = filters.stars || filters.priceRange || searchQuery.trim();

    if (hasActiveFilters) {
      return (
        <View style={styles.emptyState}>
          <Search color={colors.textSecondary} size={64} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun produit trouvé</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Essayez de modifier vos filtres ou votre recherche
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <ShoppingBagIcon color={colors.textSecondary} size={64} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun achat</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Vous n'avez pas encore effectué d'achat.
        </Text>
      </View>
    );
  };

  const getPurchasesCount = () => {
    if (filteredPurchases.length === 0) {
      return 'Aucun achat';
    }
    return `${filteredPurchases.length} achat${filteredPurchases.length > 1 ? 's' : ''}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBg} translucent={false} />
      <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleBack} style={styles.headerLeft}>
          <ArrowBackIosRounded color={colors.text} size={24} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Mes achats</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={styles.iconButton}>
            <Search color={colors.text} size={22} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFilterModal(true)} style={styles.iconButton}>
            <Filter2Fill color={colors.text} size={22} />
          </TouchableOpacity>
        </View>
      </View>

      {showSearch && (
        <View style={[styles.searchBar, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <View style={[styles.searchInput, { backgroundColor: colors.inputBg }]}>
            <Search color={colors.textSecondary} size={18} />
            <TextInput
              style={[styles.searchTextInput, { color: colors.text }]}
              placeholder="Rechercher un produit..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              returnKeyType="search"
            />
            <TouchableOpacity onPress={clearSearch}>
              <CloseIcon color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {loading || isFiltering ? (
        renderSkeleton()
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredPurchases}
          renderItem={renderPurchaseItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={[
            styles.listContent,
            filteredPurchases.length === 0 && styles.emptyListContent
          ]}
          columnWrapperStyle={filteredPurchases.length > 0 ? styles.columnWrapper : null}
          ListHeaderComponent={
            <View style={[styles.totalPurchasesContainer, { backgroundColor: colors.background }]}>
              <Text style={[styles.totalPurchasesText, { color: colors.text }]}>
                {getPurchasesCount()}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.text}
              colors={[colors.text]}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyState}
        />
      )}

      <Modal visible={showFilterModal} transparent={true} animationType="none" onRequestClose={() => {}}>
        <TouchableWithoutFeedback>
          <View style={styles.filterModalContainer}>
            <Animated.View style={[styles.filterOverlay, { opacity: fadeAnim }]} />

            <Animated.View style={[styles.filterModalContent, { backgroundColor: colors.cardBg, transform: [{ translateY: slideAnim }] }]}>
              <View style={[styles.filterHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.filterTitle, { color: colors.text }]}>Filtres</Text>
                <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                  <Text style={[styles.filterCloseIcon, { color: colors.text }]}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.filterScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.filterSection}>
                  <Text style={[styles.filterLabel, { color: colors.text }]}>Trier par</Text>
                  <View style={styles.filterOptionsRow}>
                    {[
                      { value: 'recent', label: 'Plus récent' },
                      { value: 'oldest', label: 'Plus ancien' }
                    ].map((sort) => (
                      <TouchableOpacity
                        key={sort.value}
                        style={[
                          styles.filterOption,
                          { borderColor: colors.border },
                          tempFilters.sortBy === sort.value && styles.filterOptionActive
                        ]}
                        onPress={() => setTempFilters({ ...tempFilters, sortBy: sort.value })}
                      >
                        <Text style={[
                          styles.filterOptionText,
                          { color: colors.textSecondary },
                          tempFilters.sortBy === sort.value && styles.filterOptionTextActive
                        ]}>
                          {sort.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.filterSection}>
                  <Text style={[styles.filterLabel, { color: colors.text }]}>Note du vendeur</Text>
                  <View style={styles.filterOptionsRow}>
                    <TouchableOpacity
                      style={[
                        styles.filterOption,
                        { borderColor: colors.border },
                        !tempFilters.stars && styles.filterOptionActive
                      ]}
                      onPress={() => setTempFilters({ ...tempFilters, stars: null })}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        { color: colors.textSecondary },
                        !tempFilters.stars && styles.filterOptionTextActive
                      ]}>
                        Tous
                      </Text>
                    </TouchableOpacity>
                    {[5, 4, 3, 2, 1].map(star => (
                      <TouchableOpacity
                        key={star}
                        style={[
                          styles.filterOption,
                          { borderColor: colors.border },
                          tempFilters.stars === star && styles.filterOptionActive
                        ]}
                        onPress={() => setTempFilters({ ...tempFilters, stars: star })}
                      >
                        <StarSolid color="#FFB800" size={14} />
                        <Text style={[
                          styles.filterOptionText,
                          { color: colors.textSecondary },
                          tempFilters.stars === star && styles.filterOptionTextActive
                        ]}>
                          {star}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.filterSection}>
                  <Text style={[styles.filterLabel, { color: colors.text }]}>Prix (HTG)</Text>
                  <View style={styles.filterOptionsRow}>
                    {[
                      { value: '', label: 'Tous' },
                      { value: '100-500', label: '100-500' },
                      { value: '500-1000', label: '500-1 000' },
                      { value: '1000-5000', label: '1 000-5 000' },
                      { value: '5000-10000', label: '5 000-10 000' },
                      { value: '10000-999999999', label: '10 000+' }
                    ].map((price) => (
                      <TouchableOpacity
                        key={price.value}
                        style={[
                          styles.filterOption,
                          { borderColor: colors.border },
                          tempFilters.priceRange === price.value && styles.filterOptionActive
                        ]}
                        onPress={() => setTempFilters({ ...tempFilters, priceRange: price.value })}
                      >
                        <Text style={[
                          styles.filterOptionText,
                          { color: colors.textSecondary },
                          tempFilters.priceRange === price.value && styles.filterOptionTextActive
                        ]}>
                          {price.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>

              <View style={[styles.filterButtons, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                  style={[styles.filterResetButton, { borderColor: colors.text }]}
                  onPress={resetFilters}
                >
                  <Text style={[styles.filterResetText, { color: colors.text }]}>Réinitialiser</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterApplyButton, { backgroundColor: colors.text }]}
                  onPress={applyFilters}
                >
                  <Text style={[styles.filterApplyText, { color: colors.background }]}>Appliquer</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal visible={showDetailModal} transparent={true} animationType="none" onRequestClose={() => {}}>
        <TouchableWithoutFeedback>
          <View style={styles.detailModalContainer}>
            <Animated.View style={[styles.filterOverlay, { opacity: fadeAnim }]} />

            <Animated.View style={[styles.detailModalContent, { backgroundColor: colors.cardBg, transform: [{ translateY: slideAnim }] }]}>
              <View style={[styles.detailHeader, { borderBottomColor: colors.border }]}>
                <Text style={[styles.detailTitle, { color: colors.text }]}>Détails de l'achat</Text>
                <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                  <Text style={[styles.filterCloseIcon, { color: colors.text }]}>✕</Text>
                </TouchableOpacity>
              </View>

              {selectedProduct && (
                <ScrollView style={styles.detailScroll} showsVerticalScrollIndicator={false}>
                  <View style={styles.detailContent}>
                    <Text style={[styles.detailProductName, { color: colors.text }]}>
                      {selectedProduct.title}
                    </Text>

                    <View style={styles.detailPriceSection}>
                      <View style={styles.detailPriceRow}>
                        <Text style={[styles.detailPriceLabel, { color: colors.textSecondary }]}>Prix initial:</Text>
                        <Text style={[styles.detailPriceValue, { color: colors.text }]}>
                          {selectedProduct.originalPrice || selectedProduct.price} {selectedProduct.currency}
                        </Text>
                      </View>
                      {selectedProduct.originalPrice && (
                        <View style={styles.detailPriceRow}>
                          <Text style={[styles.detailPriceLabel, { color: colors.textSecondary }]}>Prix de réduction:</Text>
                          <Text style={[styles.detailDiscountPrice, { color: colors.text, textDecorationLine: 'line-through', textDecorationColor: '#EF4444' }]}>
                            {selectedProduct.price} {selectedProduct.currency}
                          </Text>
                        </View>
                      )}
                      <View style={styles.detailPriceRow}>
                        <Text style={[styles.detailPriceLabel, { color: colors.textSecondary }]}>Prix d'achat:</Text>
                        <Text style={[styles.detailPurchasePrice, { color: colors.text }]}>
                          {selectedProduct.purchasePrice} {selectedProduct.currency}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailInfoRow}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date d'achat:</Text>
                      <Text style={[styles.detailValue, { color: colors.text }]}>
                        {formatDate(selectedProduct.purchaseDate)}
                      </Text>
                    </View>

                    <View style={styles.detailSection}>
                      <Text style={[styles.detailSectionTitle, { color: colors.text }]}>Vendeur</Text>
                      <TouchableOpacity
                        style={styles.sellerInfo}
                        onPress={() => handleSellerPress(selectedProduct.seller)}
                        activeOpacity={0.7}
                      >
                        <Image source={{ uri: selectedProduct.seller.avatar }} style={styles.sellerAvatar} />
                        <View style={styles.sellerDetails}>
                          <View style={styles.sellerNameRow}>
                            <Text style={[styles.sellerName, { color: colors.text }]} numberOfLines={1}>
                              {truncateText(selectedProduct.seller.name, 20)}
                            </Text>
                            {selectedProduct.seller.verified && (
                              <VerifiedCheckFill color="#3B82F6" size={14} />
                            )}
                          </View>
                          <View style={styles.sellerRating}>
                            <StarSolid color="#FFB800" size={14} />
                            <Text style={[styles.sellerRatingText, { color: colors.text }]}>
                              {selectedProduct.seller.rating}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={[styles.viewProductButton, { backgroundColor: colors.text }]}
                      onPress={handleViewProduct}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.viewProductButtonText, { color: colors.background }]}>
                        Voir le produit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerLeft: { width: 40, alignItems: 'flex-start' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerRight: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  iconButton: { padding: 4 },
  searchBar: { paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1 },
  searchInput: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8 },
  searchTextInput: { flex: 1, fontSize: 14 },
  totalPurchasesContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  totalPurchasesText: { fontSize: 16, fontWeight: '700' },
  listContent: { paddingHorizontal: 4, paddingBottom: 20 },
  emptyListContent: { flexGrow: 1 },
  columnWrapper: { gap: 4, marginBottom: 4 },
  purchaseCard: { padding: 6 },
  productImage: { width: '100%', aspectRatio: 1, borderRadius: 8, marginBottom: 6 },
  productName: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  price: { fontSize: 13, fontWeight: '700' },
  skeletonContainer: { flexDirection: 'row', flexWrap: 'wrap', padding: 4 },
  skeletonItem: { margin: 2, padding: 6, borderRadius: 8 },
  skeletonImage: { width: '100%', aspectRatio: 1, borderRadius: 8, marginBottom: 6 },
  skeletonTitle: { width: '80%', height: 12, borderRadius: 4, marginBottom: 4 },
  skeletonPrice: { width: '50%', height: 14, borderRadius: 4 },
  footerLoader: { flexDirection: 'row', flexWrap: 'wrap', padding: 4 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingVertical: 60 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 20, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, marginTop: 8, textAlign: 'center', lineHeight: 20 },
  filterModalContainer: { flex: 1 },
  filterOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  filterModalContent: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  filterTitle: { fontSize: 20, fontWeight: 'bold' },
  filterCloseIcon: { fontSize: 24 },
  filterScroll: { paddingHorizontal: 20, paddingVertical: 16 },
  filterSection: { marginBottom: 20 },
  filterLabel: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  filterOptionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  filterOption: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  filterOptionActive: { backgroundColor: '#000000', borderColor: '#000000' },
  filterOptionText: { fontSize: 12, fontWeight: '600' },
  filterOptionTextActive: { color: '#ffffff' },
  filterButtons: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1 },
  filterResetButton: { flex: 1, borderWidth: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  filterResetText: { fontSize: 14, fontWeight: '600' },
  filterApplyButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  filterApplyText: { fontSize: 14, fontWeight: '600' },
  detailModalContainer: { flex: 1 },
  detailModalContent: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  detailTitle: { fontSize: 20, fontWeight: 'bold' },
  detailScroll: { maxHeight: '100%' },
  detailContent: { padding: 20 },
  detailProductName: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  detailPriceSection: { marginBottom: 16, gap: 8 },
  detailPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailPriceLabel: { fontSize: 14 },
  detailPriceValue: { fontSize: 16, fontWeight: '600' },
  detailDiscountPrice: { fontSize: 16, fontWeight: '600' },
  detailPurchasePrice: { fontSize: 18, fontWeight: '700' },
  detailInfoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '600' },
  detailSection: { marginTop: 20 },
  detailSectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  sellerInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sellerAvatar: { width: 50, height: 50, borderRadius: 25 },
  sellerDetails: { flex: 1, gap: 4 },
  sellerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sellerName: { fontSize: 15, fontWeight: '600', maxWidth: '85%' },
  sellerRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sellerRatingText: { fontSize: 14, fontWeight: '600' },
  viewProductButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 10, marginTop: 20 },
  viewProductButtonText: { fontSize: 16, fontWeight: '700' },
});
