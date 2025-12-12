import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  useColorScheme,
  Modal,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowBackIosRounded,
  VerifiedCheckFill,
  Trash,
  ShoppingCart,
  MessageDotsFill,
  HandHoldingDollarSolid,
  MapMarkerAlt,
  StarSolid,
  ChevronDown,
  ChevronUp,
  CheckCircleFill,
} from '../components/icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function CartScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    cardBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    headerBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    tabBg: isDarkMode ? '#1A1A1A' : '#F5F5F5',
    tabActive: isDarkMode ? '#FFFFFF' : '#000000',
    tabInactive: isDarkMode ? '#666666' : '#999999',
    badgeBlue: '#3B82F6',
    badgeRed: '#EF4444',
    emptyIcon: '#666666',
    actionButton: isDarkMode ? '#2A2A2A' : '#F5F5F5',
  };

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' ou 'livraisons'
  const [cartItems, setCartItems] = useState([]);
  const [deliveryItems, setDeliveryItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});

  // Modals
  const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  // Animations
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ========================================
  // DONNÉES MOCKÉES
  // ========================================

  const initialCartItems = [
    {
      id: 'c1',
      productId: 'p1',
      title: 'Nike Air Force 1',
      price: '5000',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      distance: '2.3 km',
      location: 'Delmas 33',
      seller: {
        id: 'u1',
        username: 'jean_marc',
        verified: true,
        rating: 4.8,
      },
      hasOffer: true,
      offerAmount: '4500',
      sellerConfirmed: false,
      buyerConfirmed: false,
      canRate: false,
      hasRated: false,
    },
    {
      id: 'c2',
      productId: 'p2',
      title: 'Jean Levi\'s 501 Original',
      price: '3500',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1542272454315-7f6fabf73e09?w=500&q=80',
      distance: '1.8 km',
      location: 'Pétion-Ville',
      seller: {
        id: 'u2',
        username: 'marie_claire',
        verified: true,
        rating: 4.9,
      },
      hasOffer: true,
      offerAmount: '3200',
      sellerConfirmed: true,
      buyerConfirmed: false,
      canRate: false,
      hasRated: false,
    },
    {
      id: 'c3',
      productId: 'p3',
      title: 'MacBook Pro 13" 2020',
      price: '45000',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
      distance: '5.2 km',
      location: 'Tabarre',
      seller: {
        id: 'u3',
        username: 'tech_shop',
        verified: true,
        rating: 4.7,
      },
      hasOffer: true,
      offerAmount: '42000',
      sellerConfirmed: true,
      buyerConfirmed: true,
      canRate: true,
      hasRated: false,
    },
    {
      id: 'c4',
      productId: 'p4',
      title: 'Veste Adidas Vintage',
      price: '2800',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
      distance: '0.9 km',
      location: 'Delmas 75',
      seller: {
        id: 'u4',
        username: 'vintage_style',
        verified: false,
        rating: 4.5,
      },
      hasOffer: false,
      sellerConfirmed: false,
      buyerConfirmed: false,
      canRate: false,
      hasRated: false,
    },
  ];

  const initialDeliveryItems = [
    {
      id: 'd1',
      productId: 'p1',
      title: 'Nike Air Force 1',
      price: '5000',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      buyer: {
        id: 'b1',
        username: 'patricia_jean',
        verified: true,
        rating: 4.9,
      },
      offerAmount: '4500',
      sellerConfirmed: false,
      buyerConfirmed: false,
      hasReceivedRating: false,
      isCancelled: false,
    },
    {
      id: 'd2',
      productId: 'p5',
      title: 'iPhone 12 Pro 128GB',
      price: '38000',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500&q=80',
      buyer: {
        id: 'b2',
        username: 'paul_henri',
        verified: true,
        rating: 4.7,
      },
      offerAmount: '36000',
      sellerConfirmed: true,
      buyerConfirmed: false,
      hasReceivedRating: false,
      isCancelled: false,
    },
    {
      id: 'd3',
      productId: 'p6',
      title: 'Samsung Galaxy S21',
      price: '28000',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80',
      buyer: {
        id: 'b3',
        username: 'sophie_m',
        verified: false,
        rating: 4.6,
      },
      offerAmount: '27000',
      sellerConfirmed: true,
      buyerConfirmed: true,
      hasReceivedRating: true,
      ratingReceived: 5,
      reviewReceived: 'Excellent vendeur, très professionnel !',
      isCancelled: false,
    },
  ];

  // ========================================
  // EFFECTS
  // ========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setCartItems(initialCartItems);
      setDeliveryItems(initialDeliveryItems);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Animation de l'indicateur de tab
  useEffect(() => {
    const targetValue = activeTab === 'articles' ? 0 : SCREEN_WIDTH / 2;
    Animated.spring(tabIndicatorAnim, {
      toValue: targetValue,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [activeTab]);

  // ========================================
  // HELPERS
  // ========================================

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const toggleExpand = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // ========================================
  // HANDLERS - NAVIGATION
  // ========================================

  const handleBack = () => {
    navigation.goBack();
  };

  const handleMessage = (user) => {
    navigation.navigate('Chat', { recipientId: user.id, recipientName: user.username });
  };

  const handleLocation = (user) => {
    navigation.navigate('SellerLocation', { sellerId: user.id, sellerName: user.username });
  };

  // ========================================
  // HANDLERS - OFFRES
  // ========================================

  const handleMakeOffer = (item) => {
    setSelectedProduct(item);
    setOfferAmount('');
    openOfferModal();
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

    // Mettre à jour l'item avec l'offre
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === selectedProduct.id
          ? { ...item, hasOffer: true, offerAmount: offer.toString() }
          : item
      )
    );

    closeOfferModal();
    setTimeout(() => {
      Alert.alert('Offre envoyée', `Votre offre de ${formatPrice(offer)} ${selectedProduct.currency} a été envoyée au vendeur`);
    }, 300);
  };

  // ========================================
  // HANDLERS - CONFIRMATIONS
  // ========================================

  const handleConfirmDelivery = (item) => {
    Alert.alert(
      'Confirmer la livraison',
      'Confirmez-vous avoir livré ce produit à l\'acheteur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            setDeliveryItems((prev) =>
              prev.map((d) =>
                d.id === item.id ? { ...d, sellerConfirmed: true } : d
              )
            );
            Alert.alert('Succès', 'Livraison confirmée ! L\'acheteur sera notifié.');
          },
        },
      ]
    );
  };

  const handleConfirmReception = (item) => {
    Alert.alert(
      'Confirmer la réception',
      'Confirmez-vous avoir reçu ce produit du vendeur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            setCartItems((prev) =>
              prev.map((c) =>
                c.id === item.id
                  ? { ...c, buyerConfirmed: true, canRate: true }
                  : c
              )
            );
            Alert.alert('Succès', 'Réception confirmée ! Vous pouvez maintenant noter le vendeur.');
          },
        },
      ]
    );
  };

  // ========================================
  // HANDLERS - NOTATION
  // ========================================

  const handleRateProduct = (item) => {
    setSelectedProduct(item);
    setRating(0);
    setReview('');
    openRatingModal();
  };

  const submitRating = () => {
    if (rating === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner une note');
      return;
    }

    // Mettre à jour l'item avec la notation
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === selectedProduct.id
          ? { ...item, hasRated: true, ratingGiven: rating, reviewGiven: review }
          : item
      )
    );

    closeRatingModal();
    setTimeout(() => {
      Alert.alert('Merci !', 'Votre avis a été enregistré avec succès.');
    }, 300);
  };

  // ========================================
  // HANDLERS - SUPPRESSION
  // ========================================

  const handleRemoveItem = (item) => {
    setItemToRemove(item);
    setShowRemoveModal(true);
  };

  const confirmRemoveItem = () => {
    if (activeTab === 'articles') {
      // Si l'item avait une offre, marquer la livraison correspondante comme annulée
      if (itemToRemove.hasOffer) {
        setDeliveryItems((prev) =>
          prev.map((d) =>
            d.productId === itemToRemove.productId
              ? { ...d, isCancelled: true }
              : d
          )
        );
      }

      setCartItems((prev) => prev.filter((item) => item.id !== itemToRemove.id));
    } else {
      // Pour les livraisons, simplement marquer comme annulé
      setDeliveryItems((prev) =>
        prev.map((d) =>
          d.id === itemToRemove.id ? { ...d, isCancelled: true } : d
        )
      );
    }

    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  // ========================================
  // MODAL ANIMATIONS
  // ========================================

  const openOfferModal = () => {
    setIsOfferModalVisible(true);
    slideAnim.setValue(SCREEN_HEIGHT);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeOfferModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOfferModalVisible(false);
      setSelectedProduct(null);
      setOfferAmount('');
    });
  };

  const openRatingModal = () => {
    setIsRatingModalVisible(true);
    slideAnim.setValue(SCREEN_HEIGHT);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeRatingModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsRatingModalVisible(false);
      setSelectedProduct(null);
      setRating(0);
      setReview('');
    });
  };

  // ========================================
  // RENDER - ITEM PANIER (ACHETEUR)
  // ========================================

  const renderCartItem = (item) => {
    const isExpanded = expandedItems[item.id];
    const showBlueBadge = item.hasOffer && !item.sellerConfirmed;
    const showRedBadge = item.isCancelled;

    return (
      <View
        key={item.id}
        style={[
          styles.cartItem,
          { backgroundColor: colors.cardBg, borderColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={styles.itemHeader}
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.9}
        >
          <Image source={{ uri: item.image }} style={styles.itemImage} />

          <View style={styles.itemInfo}>
            <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.itemPrice, { color: colors.text }]}>
              {formatPrice(item.price)} {item.currency}
            </Text>
            <Text style={[styles.itemLocation, { color: colors.textSecondary }]}>
              {item.distance} • {item.location}
            </Text>
          </View>

          <View style={styles.itemRight}>
            {showBlueBadge && (
              <View style={[styles.badge, { backgroundColor: colors.badgeBlue }]}>
                <Text style={styles.badgeText}>En attente</Text>
              </View>
            )}
            {showRedBadge && (
              <View style={[styles.badge, { backgroundColor: colors.badgeRed }]}>
                <Text style={styles.badgeText}>Annulé</Text>
              </View>
            )}
            {isExpanded ? (
              <ChevronUp color={colors.textSecondary} size={20} />
            ) : (
              <ChevronDown color={colors.textSecondary} size={20} />
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Vendeur */}
            <View style={styles.sellerRow}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=8' }}
                style={styles.sellerAvatar}
              />
              <Text style={[styles.sellerName, { color: colors.textSecondary }]}>
                {item.seller.username}
              </Text>
              {item.seller.verified && <VerifiedCheckFill color="#3B82F6" size={14} />}
              <View style={styles.ratingRow}>
                <StarSolid color="#FFC107" size={14} />
                <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                  {item.seller.rating}
                </Text>
              </View>
            </View>

            {/* Status */}
            {!item.hasOffer && (
              <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                Vous n'avez pas encore fait d'offre pour ce produit
              </Text>
            )}
            {item.hasOffer && !item.sellerConfirmed && (
              <Text style={[styles.statusText, { color: colors.badgeBlue }]}>
                Offre de {formatPrice(item.offerAmount)} {item.currency} envoyée • En attente de confirmation du vendeur
              </Text>
            )}
            {item.sellerConfirmed && !item.buyerConfirmed && (
              <Text style={[styles.statusText, { color: '#10B981' }]}>
                Le vendeur a confirmé la livraison • Confirmez la réception
              </Text>
            )}
            {item.buyerConfirmed && item.canRate && !item.hasRated && (
              <Text style={[styles.statusText, { color: '#10B981' }]}>
                Transaction terminée • Vous pouvez noter le vendeur
              </Text>
            )}
            {item.hasRated && (
              <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                Vous avez noté ce vendeur {item.ratingGiven} ⭐
              </Text>
            )}

            {/* Actions */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.actionButton }]}
                onPress={() => handleMessage(item.seller)}
              >
                <MessageDotsFill color={colors.text} size={20} />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>
                  Message
                </Text>
              </TouchableOpacity>

              {!item.hasOffer && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.actionButton }]}
                  onPress={() => handleMakeOffer(item)}
                >
                  <HandHoldingDollarSolid color={colors.text} size={20} />
                  <Text style={[styles.actionButtonText, { color: colors.text }]}>
                    Faire une offre
                  </Text>
                </TouchableOpacity>
              )}

              {item.sellerConfirmed && !item.buyerConfirmed && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                  onPress={() => handleConfirmReception(item)}
                >
                  <CheckCircleFill color="#FFFFFF" size={20} />
                  <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
                    Confirmer réception
                  </Text>
                </TouchableOpacity>
              )}

              {item.canRate && !item.hasRated && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#FFC107' }]}
                  onPress={() => handleRateProduct(item)}
                >
                  <StarSolid color="#FFFFFF" size={20} />
                  <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
                    Noter le vendeur
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Bouton supprimer */}
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(item)}
            >
              <Trash color="#EF4444" size={18} />
              <Text style={[styles.removeButtonText, { color: '#EF4444' }]}>
                Retirer du panier
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // ========================================
  // RENDER - ITEM LIVRAISON (VENDEUR)
  // ========================================

  const renderDeliveryItem = (item) => {
    const isExpanded = expandedItems[item.id];
    const showBlueBadge = !item.sellerConfirmed && !item.isCancelled;
    const showRedBadge = item.isCancelled;

    return (
      <View
        key={item.id}
        style={[
          styles.cartItem,
          { backgroundColor: colors.cardBg, borderColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={styles.itemHeader}
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.9}
        >
          <Image source={{ uri: item.image }} style={styles.itemImage} />

          <View style={styles.itemInfo}>
            <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={[styles.itemPrice, { color: colors.text }]}>
              {formatPrice(item.offerAmount)} {item.currency}
            </Text>
            <Text style={[styles.itemLocation, { color: colors.textSecondary }]}>
              Acheteur: {item.buyer.username}
            </Text>
          </View>

          <View style={styles.itemRight}>
            {showBlueBadge && (
              <View style={[styles.badge, { backgroundColor: colors.badgeBlue }]}>
                <Text style={styles.badgeText}>À livrer</Text>
              </View>
            )}
            {showRedBadge && (
              <View style={[styles.badge, { backgroundColor: colors.badgeRed }]}>
                <Text style={styles.badgeText}>Annulé</Text>
              </View>
            )}
            {isExpanded ? (
              <ChevronUp color={colors.textSecondary} size={20} />
            ) : (
              <ChevronDown color={colors.textSecondary} size={20} />
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Acheteur */}
            <View style={styles.sellerRow}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
                style={styles.sellerAvatar}
              />
              <Text style={[styles.sellerName, { color: colors.textSecondary }]}>
                {item.buyer.username}
              </Text>
              {item.buyer.verified && <VerifiedCheckFill color="#3B82F6" size={14} />}
              <View style={styles.ratingRow}>
                <StarSolid color="#FFC107" size={14} />
                <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
                  {item.buyer.rating}
                </Text>
              </View>
            </View>

            {/* Status */}
            {!item.sellerConfirmed && !item.isCancelled && (
              <Text style={[styles.statusText, { color: colors.badgeBlue }]}>
                L'acheteur a fait une offre de {formatPrice(item.offerAmount)} {item.currency} • Confirmez la livraison
              </Text>
            )}
            {item.sellerConfirmed && !item.buyerConfirmed && !item.isCancelled && (
              <Text style={[styles.statusText, { color: '#FFA500' }]}>
                Vous avez confirmé la livraison • En attente de confirmation de l'acheteur
              </Text>
            )}
            {item.buyerConfirmed && !item.hasReceivedRating && !item.isCancelled && (
              <Text style={[styles.statusText, { color: '#10B981' }]}>
                L'acheteur a confirmé la réception • Transaction terminée
              </Text>
            )}
            {item.hasReceivedRating && !item.isCancelled && (
              <View>
                <Text style={[styles.statusText, { color: '#10B981' }]}>
                  Vous avez reçu une note de {item.ratingReceived} ⭐
                </Text>
                {item.reviewReceived && (
                  <Text style={[styles.reviewText, { color: colors.textSecondary }]}>
                    "{item.reviewReceived}"
                  </Text>
                )}
              </View>
            )}
            {item.isCancelled && (
              <Text style={[styles.statusText, { color: colors.badgeRed }]}>
                Cette transaction a été annulée
              </Text>
            )}

            {/* Actions */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.actionButton }]}
                onPress={() => handleMessage(item.buyer)}
              >
                <MessageDotsFill color={colors.text} size={20} />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>
                  Message
                </Text>
              </TouchableOpacity>

              {!item.sellerConfirmed && !item.isCancelled && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                  onPress={() => handleConfirmDelivery(item)}
                >
                  <CheckCircleFill color="#FFFFFF" size={20} />
                  <Text style={[styles.actionButtonText, { color: '#FFFFFF' }]}>
                    Confirmer livraison
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  // ========================================
  // RENDER - EMPTY STATE
  // ========================================

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ShoppingCart color={colors.emptyIcon} size={64} />
      <Text style={[styles.emptyText, { color: colors.emptyIcon }]}>
        {activeTab === 'articles'
          ? 'Aucun article dans votre panier'
          : 'Aucune livraison en cours'}
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.emptyIcon }]}>
        {activeTab === 'articles'
          ? 'Découvre les produits autour de toi et ajoute tes favoris !'
          : 'Vos produits en attente de livraison apparaîtront ici'}
      </Text>
    </View>
  );

  // ========================================
  // RENDER - SKELETON
  // ========================================

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3].map((item) => (
        <View
          key={item}
          style={[styles.skeletonCard, { backgroundColor: colors.border }]}
        />
      ))}
    </View>
  );

  // ========================================
  // RENDER PRINCIPAL
  // ========================================

  const currentItems = activeTab === 'articles' ? cartItems : deliveryItems;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.headerBg}
        translucent={false}
      />

      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBg,
            borderBottomColor: colors.border,
            paddingTop: insets.top,
          },
        ]}
      >
        <TouchableOpacity onPress={handleBack} style={styles.headerLeft}>
          <ArrowBackIosRounded color={colors.text} size={24} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Panier</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* TABS */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.tabBg }]}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('articles')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'articles' ? colors.tabActive : colors.tabInactive,
                fontWeight: activeTab === 'articles' ? '700' : '500',
              },
            ]}
          >
            Mes articles
          </Text>
          {!loading && cartItems.length > 0 && (
            <View
              style={[
                styles.tabBadge,
                {
                  backgroundColor:
                    activeTab === 'articles' ? colors.tabActive : colors.tabInactive,
                },
              ]}
            >
              <Text style={[styles.tabBadgeText, { color: colors.background }]}>
                {cartItems.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('livraisons')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'livraisons' ? colors.tabActive : colors.tabInactive,
                fontWeight: activeTab === 'livraisons' ? '700' : '500',
              },
            ]}
          >
            Mes livraisons
          </Text>
          {!loading && deliveryItems.length > 0 && (
            <View
              style={[
                styles.tabBadge,
                {
                  backgroundColor:
                    activeTab === 'livraisons' ? colors.tabActive : colors.tabInactive,
                },
              ]}
            >
              <Text style={[styles.tabBadgeText, { color: colors.background }]}>
                {deliveryItems.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Indicateur animé */}
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              backgroundColor: colors.tabActive,
              transform: [{ translateX: tabIndicatorAnim }],
            },
          ]}
        />
      </View>

      {/* CONTENU */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          renderSkeleton()
        ) : currentItems.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.section}>
            {activeTab === 'articles'
              ? cartItems.map(renderCartItem)
              : deliveryItems.map(renderDeliveryItem)}
          </View>
        )}
      </ScrollView>

      {/* MODAL - FAIRE UNE OFFRE */}
      <Modal
        visible={isOfferModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeOfferModal}
      >
        <Animated.View
          style={[styles.modalOverlay, { opacity: fadeAnim }]}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.cardBg,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Faire une offre
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Proposez votre prix pour {selectedProduct?.title}
            </Text>

            <View
              style={[
                styles.offerInputContainer,
                { backgroundColor: colors.actionButton, borderColor: colors.border },
              ]}
            >
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
                style={[
                  styles.modalButton,
                  styles.modalButtonCancel,
                  { borderColor: colors.border },
                ]}
                onPress={closeOfferModal}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Annuler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.tabActive }]}
                onPress={submitOffer}
              >
                <Text
                  style={[
                    styles.modalButtonText,
                    { color: isDarkMode ? '#000000' : '#FFFFFF' },
                  ]}
                >
                  Envoyer
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* MODAL - NOTATION */}
      <Modal
        visible={isRatingModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeRatingModal}
      >
        <Animated.View
          style={[styles.modalOverlay, { opacity: fadeAnim }]}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.cardBg,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Noter le vendeur
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Comment s'est passée votre expérience ?
            </Text>

            {/* Étoiles */}
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <StarSolid
                    color={star <= rating ? '#FFC107' : colors.border}
                    size={40}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Commentaire */}
            <TextInput
              style={[
                styles.reviewInput,
                {
                  backgroundColor: colors.actionButton,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Ajouter un commentaire (optionnel)"
              placeholderTextColor={colors.textSecondary}
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalButtonCancel,
                  { borderColor: colors.border },
                ]}
                onPress={closeRatingModal}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Annuler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#FFC107' }]}
                onPress={submitRating}
              >
                <Text style={[styles.modalButtonText, { color: '#000000' }]}>
                  Envoyer
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* MODAL - CONFIRMATION SUPPRESSION */}
      <Modal
        visible={showRemoveModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowRemoveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Retirer du panier ?
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Voulez-vous vraiment retirer cet article ?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalButtonCancel,
                  { borderColor: colors.border },
                ]}
                onPress={() => {
                  setShowRemoveModal(false);
                  setItemToRemove(null);
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Annuler
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#EF4444' }]}
                onPress={confirmRemoveItem}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  Retirer
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    width: 40,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    width: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    position: 'relative',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  tabText: {
    fontSize: 15,
  },
  tabBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    width: SCREEN_WIDTH / 2 - 16,
    height: 3,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  skeletonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  skeletonCard: {
    height: 100,
    borderRadius: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  cartItem: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    padding: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 12,
  },
  itemRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  expandedContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  sellerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  sellerName: {
    fontSize: 12,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  removeButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  offerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    paddingRight: 12,
  },
  offerInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  starButton: {
    padding: 4,
  },
  reviewInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    marginBottom: 20,
    minHeight: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
