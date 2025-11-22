import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Modal,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowBackIosRounded,
  VerifiedCheckFill,
  Trash,
  ShoppingCart,
  MessageDotsFill,
  HandHoldingDollarSolid,
  MapMarkerAlt,
  StarSolid,
  Search,
  CloseFilled,
} from '../components/icons';

export default function CartScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#121212' : '#F5F5F5',
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    headerBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    skeletonBg: isDarkMode ? '#2A2A2A' : '#E0E0E0',
    inputBg: isDarkMode ? '#1F1F1F' : '#F2F2F2',
    modalBg: isDarkMode ? '#1F1F1F' : '#FFFFFF',
    emptyIcon: '#666666',
  };

  const [loading, setLoading] = useState(true);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showTotalModal, setShowTotalModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Données panier
  const initialCartItems = [
    {
      id: 'c1',
      productId: 'p1',
      title: 'Nike Air Force 1',
      price: '5000',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      seller: {
        id: 'u1',
        username: 'john',
        verified: true,
        rating: 4.8,
      },
      offersEnabled: true,
    },
    {
      id: 'c2',
      productId: 'p2',
      title: 'Jean Levi\'s 501',
      price: '3500',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1542272454315-7f6fabf73e09?w=500&q=80',
      seller: {
        id: 'u1',
        username: 'john',
        verified: true,
        rating: 4.8,
      },
      offersEnabled: true,
    },
    {
      id: 'c3',
      productId: 'p3',
      title: 'Veste Adidas Vintage',
      price: '4200',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
      seller: {
        id: 'u2',
        username: 'marie',
        verified: true,
        rating: 4.9,
      },
      offersEnabled: false,
    },
  ];

  // Suggestions
  const suggestions = [
    {
      id: 's1',
      title: 'T-shirt Nike Blanc',
      price: '1 500',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
    },
    {
      id: 's2',
      title: 'Short Nike Dri-FIT',
      price: '1 800',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80',
    },
    {
      id: 's3',
      title: 'Casquette Adidas',
      price: '800',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80',
    },
    {
      id: 's4',
      title: 'Polo Lacoste',
      price: '3 200',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&q=80',
    },
  ];

  // Simulation chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setCartItems(initialCartItems);
      setFilteredItems(initialCartItems);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Recherche
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredItems(cartItems);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = cartItems.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.seller.username.toLowerCase().includes(query) ||
        item.price.includes(query)
      );
      setFilteredItems(filtered);
    }
  }, [searchQuery, cartItems]);

  // Calculer le total
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      return sum + parseInt(item.price);
    }, 0);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Handlers
  const handleBack = () => {
    if (isSearching) {
      setIsSearching(false);
      setSearchQuery('');
    } else {
      navigation.goBack();
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    setSearchQuery('');
  };

  const handleRemoveItem = (item) => {
    setItemToRemove(item);
    setShowRemoveModal(true);
  };

  const confirmRemoveItem = () => {
    setCartItems(cartItems.filter(item => item.id !== itemToRemove.id));
    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  const handleClearCart = () => {
    setShowClearModal(true);
  };

  const confirmClearCart = () => {
    setCartItems([]);
    setShowClearModal(false);
  };

  const handleMessage = (seller) => {
    navigation.navigate('Chat', { recipientId: seller.id, recipientName: seller.username });
  };

  const handleLocation = (seller) => {
    navigation.navigate('SellerLocation', { sellerId: seller.id, sellerName: seller.username });
  };

  const handleOffer = (item) => {
    if (!item.offersEnabled) {
      Alert.alert('Offres non acceptées', 'Le vendeur n\'accepte pas d\'offres pour ce produit');
      return;
    }
    setSelectedProduct(item);
    setIsOfferModalVisible(true);
  };

  const submitOffer = () => {
    const offer = parseInt(offerAmount.replace(/\s/g, ''));

    if (!offerAmount || isNaN(offer)) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    if (offer <= 0) {
      Alert.alert('Erreur', 'Le montant doit être supérieur à 0');
      return;
    }

    setIsOfferModalVisible(false);
    setOfferAmount('');
    setSelectedProduct(null);
    Keyboard.dismiss();

    setTimeout(() => {
      Alert.alert('Offre envoyée', `Votre offre de ${formatPrice(offer)} ${selectedProduct.currency} a été envoyée au vendeur`);
    }, 300);
  };

  const handleProductPress = (item) => {
    navigation.navigate('ProductDetail', { productId: item.productId, product: item });
  };

  const handleSuggestionPress = (item) => {
    navigation.navigate('ProductDetail', { productId: item.id, product: item });
  };

  const handleTotalPress = () => {
    if (cartItems.length > 0) {
      setShowTotalModal(true);
    }
  };

  // RENDER SKELETON
  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((item) => (
        <View key={item} style={[styles.skeletonCard, { backgroundColor: colors.skeletonBg }]} />
      ))}
    </View>
  );

  // RENDER ITEM PANIER
  const renderCartItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.cartItem, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.cartItemImage} />

      <View style={styles.cartItemContent}>
        <Text style={[styles.cartItemTitle, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.sellerRow}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=8' }} style={styles.sellerAvatar} />
          <Text style={[styles.sellerName, { color: colors.textSecondary }]}>{item.seller.username}</Text>
          {item.seller.verified && <VerifiedCheckFill color="#3B82F6" size={12} />}
          <View style={styles.ratingRow}>
            <StarSolid color="#FFC107" size={12} />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{item.seller.rating}</Text>
          </View>
        </View>

        <Text style={[styles.cartItemPrice, { color: colors.text }]}>
          {formatPrice(item.price)} {item.currency}
        </Text>

        <View style={styles.cartItemActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={(e) => {
              e.stopPropagation();
              handleMessage(item.seller);
            }}
          >
            <MessageDotsFill color={colors.text} size={22} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={(e) => {
              e.stopPropagation();
              handleOffer(item);
            }}
          >
            <HandHoldingDollarSolid color={colors.text} size={22} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={(e) => {
              e.stopPropagation();
              handleLocation(item.seller);
            }}
          >
            <MapMarkerAlt color={colors.text} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={(e) => {
          e.stopPropagation();
          handleRemoveItem(item);
        }}
      >
        <Trash color="#EF4444" size={20} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // RENDER SUGGESTION
  const renderSuggestion = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.suggestionCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
      onPress={() => handleSuggestionPress(item)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.suggestionImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.suggestionGradient}
      />
      <View style={styles.suggestionInfo}>
        <Text style={styles.suggestionTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.suggestionPrice}>{item.price} {item.currency}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.headerBg}
        translucent={true}
      />

      {/* Header */}
      <SafeAreaView style={{ backgroundColor: colors.headerBg }} edges={['top']}>
        <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          {isSearching ? (
            <>
              <TouchableOpacity onPress={handleBack} style={styles.headerIconButton}>
                <ArrowBackIosRounded color={colors.text} size={24} />
              </TouchableOpacity>
              <View style={[styles.searchContainer, { backgroundColor: colors.inputBg }]}>
                <Search color={colors.textSecondary} size={18} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Rechercher..."
                  placeholderTextColor={colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <CloseFilled color={colors.textSecondary} size={20} />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={handleCancelSearch}>
                <Text style={[styles.cancelText, { color: colors.text }]}>Annuler</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.headerLeft}>
                <TouchableOpacity onPress={handleBack}>
                  <ArrowBackIosRounded color={colors.text} size={24} />
                </TouchableOpacity>
              </View>
              <View style={styles.headerCenter}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Panier</Text>
              </View>
              <View style={styles.headerRight}>
                {!loading && cartItems.length > 0 && (
                  <>
                    <TouchableOpacity onPress={handleSearch} style={{ marginRight: 12 }}>
                      <Search color={colors.text} size={22} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleClearCart}>
                      <Trash color="#EF4444" size={22} />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </>
          )}
        </View>
      </SafeAreaView>

      {/* Nombre d'articles */}
      {!loading && !isSearching && cartItems.length > 0 && (
        <View style={[styles.articlesBar, { backgroundColor: colors.background }]}>
          <Text style={[styles.articlesText, { color: colors.text }]}>
            Articles ({cartItems.length})
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          renderSkeleton()
        ) : cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ShoppingCart color={colors.emptyIcon} size={64} />
            <Text style={[styles.emptySubtext, { color: colors.emptyIcon }]}>
              Découvre les produits autour de toi et ajoute tes favoris !
            </Text>
          </View>
        ) : (
          <>
            {/* Articles du panier */}
            <View style={styles.section}>
              {filteredItems.map(renderCartItem)}
            </View>

            {/* Total */}
            <TouchableOpacity
              style={[styles.totalCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
              onPress={handleTotalPress}
              activeOpacity={0.8}
            >
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>
                  Total ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
                </Text>
                <Text style={[styles.totalAmount, { color: colors.text }]}>
                  {formatPrice(calculateTotal())} HTG
                </Text>
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* Suggestions (toujours visibles) */}
        <View style={styles.suggestionsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Suggestions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsScroll}
          >
            {suggestions.map(renderSuggestion)}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Modal Vider panier */}
      <Modal
        visible={showClearModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowClearModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Vider le panier ?</Text>
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              Tous les articles seront retirés de votre panier.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel, { borderColor: colors.border }]}
                onPress={() => setShowClearModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmClearCart}
              >
                <Text style={styles.modalButtonConfirmText}>Vider</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Retirer article */}
      <Modal
        visible={showRemoveModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRemoveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Retirer du panier ?</Text>
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              Voulez-vous retirer cet article de votre panier ?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel, { borderColor: colors.border }]}
                onPress={() => {
                  setShowRemoveModal(false);
                  setItemToRemove(null);
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmRemoveItem}
              >
                <Text style={styles.modalButtonConfirmText}>Retirer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Détail Total */}
      <Modal
        visible={showTotalModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTotalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.totalModalContent, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Détail du panier</Text>

            <ScrollView style={styles.totalDetailScroll}>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.totalDetailItem}>
                  <Text style={[styles.totalDetailName, { color: colors.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.totalDetailPrice, { color: colors.text }]}>
                    {formatPrice(item.price)} {item.currency}
                  </Text>
                </View>
              ))}

              <View style={[styles.totalDetailDivider, { backgroundColor: colors.border }]} />

              <View style={styles.totalDetailItem}>
                <Text style={[styles.totalDetailTotal, { color: colors.text }]}>Total</Text>
                <Text style={[styles.totalDetailTotalPrice, { color: colors.text }]}>
                  {formatPrice(calculateTotal())} HTG
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: colors.text }]}
              onPress={() => setShowTotalModal(false)}
            >
              <Text style={[styles.modalCloseText, { color: colors.background }]}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Faire une offre */}
      <Modal visible={isOfferModalVisible} transparent={true} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.offerModalOverlay}
        >
          <TouchableWithoutFeedback onPress={() => {
            setIsOfferModalVisible(false);
            setOfferAmount('');
            setSelectedProduct(null);
            Keyboard.dismiss();
          }}>
            <View style={styles.offerModalBackground}>
              <TouchableWithoutFeedback>
                <View style={[styles.offerModalContent, { backgroundColor: colors.modalBg }]}>
                  <Text style={[styles.offerModalTitle, { color: colors.text }]}>Faire une offre</Text>
                  <Text style={[styles.offerModalSubtitle, { color: colors.textSecondary }]}>
                    Proposez votre prix pour ce produit
                  </Text>

                  <View style={[styles.offerInputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                    <TextInput
                      style={[styles.offerInput, { color: colors.text }]}
                      placeholder="Entrez votre offre"
                      placeholderTextColor={colors.textSecondary}
                      value={offerAmount}
                      onChangeText={setOfferAmount}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.currencyText, { color: colors.textSecondary }]}>
                      {selectedProduct?.currency || 'HTG'}
                    </Text>
                  </View>

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.modalButtonCancel, { borderColor: colors.text }]}
                      onPress={() => {
                        setIsOfferModalVisible(false);
                        setOfferAmount('');
                        setSelectedProduct(null);
                        Keyboard.dismiss();
                      }}
                    >
                      <Text style={[styles.modalButtonText, { color: colors.text }]}>Annuler</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, { backgroundColor: colors.text }]}
                      onPress={submitOffer}
                    >
                      <Text style={[styles.modalButtonText, { color: colors.background }]}>Envoyer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerLeft: { width: 40 },
  headerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerRight: { width: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  headerIconButton: { width: 40 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 8 },
  searchInput: { flex: 1, fontSize: 16 },
  cancelText: { fontSize: 14, fontWeight: '600' },
  articlesBar: { paddingHorizontal: 16, paddingVertical: 10 },
  articlesText: { fontSize: 16, fontWeight: '700' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  section: { paddingHorizontal: 16, paddingTop: 8 },
  skeletonContainer: { paddingHorizontal: 16, paddingTop: 20 },
  skeletonCard: { height: 120, borderRadius: 12, marginBottom: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptySubtext: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40, marginTop: 16 },
  cartItem: { flexDirection: 'row', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12, shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  cartItemImage: { width: 90, height: 90, borderRadius: 8, backgroundColor: '#e0e0e0' },
  cartItemContent: { flex: 1, marginLeft: 12 },
  cartItemTitle: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 4 },
  sellerAvatar: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#e0e0e0' },
  sellerName: { fontSize: 11, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginLeft: 4 },
  ratingText: { fontSize: 11, fontWeight: '600' },
  cartItemPrice: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  cartItemActions: { flexDirection: 'row', gap: 12 },
  iconButton: { padding: 4 },
  removeButton: { padding: 4 },
  totalCard: { marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 12, borderWidth: 1, shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 14 },
  totalAmount: { fontSize: 24, fontWeight: 'bold' },
  suggestionsSection: { marginTop: 24, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, paddingHorizontal: 16 },
  suggestionsScroll: { paddingHorizontal: 16, gap: 12 },
  suggestionCard: { width: 140, aspectRatio: 0.75, borderRadius: 10, overflow: 'hidden', borderWidth: 1, position: 'relative' },
  suggestionImage: { width: '100%', height: '100%', backgroundColor: '#e0e0e0' },
  suggestionGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%' },
  suggestionInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 8 },
  suggestionTitle: { fontSize: 12, fontWeight: '600', color: '#FFFFFF', marginBottom: 2 },
  suggestionPrice: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalContent: { width: '100%', maxWidth: 400, borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  modalText: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalButtonCancel: { borderWidth: 1 },
  modalButtonText: { fontSize: 15, fontWeight: '600' },
  modalButtonConfirm: { backgroundColor: '#EF4444' },
  modalButtonConfirmText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  totalModalContent: { width: '100%', maxWidth: 400, borderRadius: 16, padding: 24, maxHeight: '60%' },
  totalDetailScroll: { maxHeight: 300, marginVertical: 12 },
  totalDetailItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  totalDetailName: { fontSize: 14, flex: 1, marginRight: 12 },
  totalDetailPrice: { fontSize: 14, fontWeight: '600' },
  totalDetailDivider: { height: 1, marginVertical: 12 },
  totalDetailTotal: { fontSize: 16, fontWeight: 'bold' },
  totalDetailTotalPrice: { fontSize: 18, fontWeight: 'bold' },
  modalCloseButton: { paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  modalCloseText: { fontSize: 15, fontWeight: '600' },
  offerModalOverlay: { flex: 1, justifyContent: 'flex-end' },
  offerModalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  offerModalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  offerModalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  offerModalSubtitle: { fontSize: 14, marginBottom: 16, textAlign: 'center' },
  offerInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, marginBottom: 16, paddingRight: 12 },
  offerInput: { flex: 1, padding: 12, fontSize: 16 },
  currencyText: { fontSize: 16, fontWeight: '600' },
});
