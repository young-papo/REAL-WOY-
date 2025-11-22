import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  TextInput,
  FlatList,
  useColorScheme,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowBackIosRounded,
  Heart,
  HeartOutline,
  Repeat,
  ShoppingCart,
  ShareForwardFill,
  EyeFill,
  ClockFilled,
  MapMarkerAlt,
  Truck,
  Warning,
  Close,
  StarSolid,
  VerifiedCheckFill,
  ChevronRight,
} from '../components/icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProductDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scrollViewRef = useRef(null);

  // Product data (mock or from route params)
  const product = route?.params?.product || {
    id: '1',
    title: 'Chaussures Nike Air Max 90',
    price: 85000,
    originalPrice: 120000,
    views: 234,
    timeAgo: '2h',
    distance: '2.5 km',
    deliverable: true,
    condition: 'Très bon état',
    category: 'Chaussures',
    size: '42',
    color: 'Noir/Blanc',
    brand: 'Nike',
    description: 'Chaussures Nike Air Max 90 en très bon état. Portées seulement quelques fois. Taille 42. Couleur noir et blanc. Idéales pour le sport ou un look casual. #nike #airmax #sneakers #chaussures',
    images: [
      'https://picsum.photos/400/400?random=1',
      'https://picsum.photos/400/400?random=2',
      'https://picsum.photos/400/400?random=3',
      'https://picsum.photos/400/400?random=4',
    ],
    seller: {
      id: 'seller1',
      username: 'john',
      avatar: 'https://picsum.photos/100/100?random=10',
      rating: 4.8,
      reviews: 56,
      verified: true,
      followers: 234,
      isFollowing: false,
    },
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isFollowing, setIsFollowing] = useState(product.seller.isFollowing);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showTooltip, setShowTooltip] = useState({ visible: false, message: '' });

  // Similar products mock data
  const similarProducts = [
    { id: 's1', title: 'Nike Air Force 1', price: 65000, image: 'https://picsum.photos/150/150?random=20' },
    { id: 's2', title: 'Adidas Stan Smith', price: 55000, image: 'https://picsum.photos/150/150?random=21' },
    { id: 's3', title: 'Puma RS-X', price: 72000, image: 'https://picsum.photos/150/150?random=22' },
    { id: 's4', title: 'New Balance 574', price: 68000, image: 'https://picsum.photos/150/150?random=23' },
  ];

  const reportReasons = [
    'Contenu inapproprié',
    'Arnaque suspectée',
    'Article contrefait',
    'Prix incorrect',
    'Autre',
  ];

  // Theme colors
  const colors = {
    background: isDark ? '#000000' : '#FFFFFF',
    surface: isDark ? '#1C1C1E' : '#F5F5F5',
    text: isDark ? '#FFFFFF' : '#000000',
    textSecondary: isDark ? '#8E8E93' : '#666666',
    border: isDark ? '#2C2C2E' : '#E0E0E0',
    primary: '#007AFF',
    accent: '#FF3B30',
    success: '#34C759',
  };

  const showTooltipMessage = (message) => {
    setShowTooltip({ visible: true, message });
    setTimeout(() => setShowTooltip({ visible: false, message: '' }), 2000);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    showTooltipMessage(isLiked ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const handleRepost = () => {
    setIsReposted(!isReposted);
    showTooltipMessage(isReposted ? 'Republication annulée' : 'Republié sur votre profil');
  };

  const handleAddToCart = () => {
    setIsInCart(!isInCart);
    showTooltipMessage(isInCart ? 'Retiré du panier' : 'Ajouté au panier');
  };

  const handleShare = () => {
    showTooltipMessage('Lien copié !');
  };

  const handleMessage = () => {
    navigation.navigate('Chat', {
      recipientId: product.seller.id,
      recipientName: product.seller.username,
      productId: product.id,
      productTitle: product.title,
    });
  };

  const handleMakeOffer = () => {
    setShowOfferModal(true);
  };

  const handleSubmitOffer = () => {
    if (offerAmount && parseInt(offerAmount) > 0) {
      setShowOfferModal(false);
      showTooltipMessage('Offre envoyée au vendeur');
      navigation.navigate('Chat', {
        recipientId: product.seller.id,
        recipientName: product.seller.username,
        productId: product.id,
        offer: parseInt(offerAmount),
      });
      setOfferAmount('');
    }
  };

  const handleMapPress = () => {
    navigation.navigate('Map', {
      sellerId: product.seller.id,
      sellerName: product.seller.username,
      distance: product.distance,
    });
  };

  const handleProfilePress = () => {
    navigation.navigate('UserProfile', {
      userId: product.seller.id,
      userName: product.seller.username,
    });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    showTooltipMessage(isFollowing ? 'Désabonné' : 'Abonné');
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  const handleSubmitReport = () => {
    if (selectedReport) {
      setShowReportModal(false);
      showTooltipMessage('Signalement envoyé');
      setSelectedReport(null);
    }
  };

  const handleSimilarProductPress = (item) => {
    navigation.push('ProductDetail', { productId: item.id, product: item });
  };

  const handleViewMore = () => {
    navigation.navigate('Explore', {
      category: product.category,
      title: 'Articles similaires',
    });
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
  };

  const parseHashtags = (text) => {
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <Text key={index} style={{ color: colors.primary }}>
            {part}
          </Text>
        );
      }
      return part;
    });
  };

  const onImageScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentImageIndex(slideIndex);
  };

  const renderImageGallery = () => (
    <View style={styles.imageGalleryContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onImageScroll}
        scrollEventThrottle={16}
      >
        {product.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Image pagination */}
      <View style={styles.paginationContainer}>
        {product.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: index === currentImageIndex ? colors.primary : colors.border,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );

  const renderProductActions = () => (
    <View style={[styles.actionsRow, { borderBottomColor: colors.border }]}>
      <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
        {isLiked ? (
          <Heart color={colors.accent} size={24} />
        ) : (
          <HeartOutline color={colors.text} size={24} />
        )}
        <Text style={[styles.actionText, { color: colors.textSecondary }]}>
          {isLiked ? 'Aimé' : 'Aimer'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleRepost}>
        <Repeat color={isReposted ? colors.success : colors.text} size={24} />
        <Text style={[styles.actionText, { color: colors.textSecondary }]}>
          Republier
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleAddToCart}>
        <ShoppingCart color={isInCart ? colors.primary : colors.text} size={22} />
        <Text style={[styles.actionText, { color: colors.textSecondary }]}>
          {isInCart ? 'Dans panier' : 'Panier'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
        <ShareForwardFill color={colors.text} size={24} />
        <Text style={[styles.actionText, { color: colors.textSecondary }]}>
          Partager
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderProductInfo = () => (
    <View style={styles.productInfoSection}>
      <Text style={[styles.productTitle, { color: colors.text }]}>
        {product.title}
      </Text>

      <View style={styles.priceRow}>
        <Text style={[styles.price, { color: colors.text }]}>
          {formatPrice(product.price)}
        </Text>
        {product.originalPrice && product.originalPrice > product.price && (
          <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
            {formatPrice(product.originalPrice)}
          </Text>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <EyeFill color={colors.textSecondary} size={16} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {product.views} vues
          </Text>
        </View>

        <View style={styles.statItem}>
          <ClockFilled color={colors.textSecondary} size={16} />
          <Text style={[styles.statText, { color: colors.textSecondary }]}>
            {product.timeAgo}
          </Text>
        </View>

        <TouchableOpacity style={styles.statItem} onPress={handleMapPress}>
          <MapMarkerAlt color={colors.primary} size={16} />
          <Text style={[styles.statText, { color: colors.primary }]}>
            {product.distance}
          </Text>
        </TouchableOpacity>

        {product.deliverable && (
          <View style={styles.statItem}>
            <Truck color={colors.success} size={16} />
            <Text style={[styles.statText, { color: colors.success }]}>
              Livrable
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderDetailsGrid = () => (
    <View style={[styles.detailsGrid, { backgroundColor: colors.surface }]}>
      <View style={styles.detailItem}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>État</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{product.condition}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Catégorie</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{product.category}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Taille</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{product.size}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Couleur</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{product.color}</Text>
      </View>
      <View style={styles.detailItem}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Marque</Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>{product.brand}</Text>
      </View>
    </View>
  );

  const renderDescription = () => (
    <View style={styles.descriptionSection}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
      <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
        {parseHashtags(product.description)}
      </Text>
    </View>
  );

  const renderSellerInfo = () => (
    <View style={[styles.sellerSection, { backgroundColor: colors.surface }]}>
      <TouchableOpacity style={styles.sellerInfo} onPress={handleProfilePress}>
        <Image
          source={{ uri: product.seller.avatar }}
          style={styles.sellerAvatar}
        />
        <View style={styles.sellerDetails}>
          <View style={styles.sellerNameRow}>
            <Text style={[styles.sellerName, { color: colors.text }]}>
              {product.seller.username}
            </Text>
            {product.seller.verified && (
              <VerifiedCheckFill color={colors.primary} size={14} />
            )}
          </View>
          <View style={styles.sellerRating}>
            <StarSolid color="#FFD700" size={14} />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {product.seller.rating} ({product.seller.reviews} avis)
            </Text>
          </View>
          <Text style={[styles.followersText, { color: colors.textSecondary }]}>
            {product.seller.followers} abonnés
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.followButton,
          {
            backgroundColor: isFollowing ? colors.surface : colors.primary,
            borderColor: isFollowing ? colors.border : colors.primary,
          },
        ]}
        onPress={handleFollow}
      >
        <Text
          style={[
            styles.followButtonText,
            { color: isFollowing ? colors.text : '#FFFFFF' },
          ]}
        >
          {isFollowing ? 'Abonné' : 'Suivre'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSimilarProducts = () => (
    <View style={styles.similarSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Articles similaires
        </Text>
        <TouchableOpacity onPress={handleViewMore}>
          <Text style={[styles.viewMoreText, { color: colors.primary }]}>
            Voir plus
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={similarProducts}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.similarItem, { backgroundColor: colors.surface }]}
            onPress={() => handleSimilarProductPress(item)}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.similarImage}
            />
            <Text
              style={[styles.similarTitle, { color: colors.text }]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={[styles.similarPrice, { color: colors.primary }]}>
              {formatPrice(item.price)}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.similarList}
      />
    </View>
  );

  const renderBottomActions = () => (
    <View
      style={[
        styles.bottomActions,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom || 16,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.messageButton, { borderColor: colors.primary }]}
        onPress={handleMessage}
      >
        <Text style={[styles.messageButtonText, { color: colors.primary }]}>
          Message
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.offerButton, { backgroundColor: colors.primary }]}
        onPress={handleMakeOffer}
      >
        <Text style={styles.offerButtonText}>Faire une offre</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOfferModal = () => (
    <Modal
      visible={showOfferModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowOfferModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Faire une offre
            </Text>
            <TouchableOpacity onPress={() => setShowOfferModal(false)}>
              <Close color={colors.text} size={24} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
            Prix demandé: {formatPrice(product.price)}
          </Text>

          <TextInput
            style={[
              styles.offerInput,
              {
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Votre offre (FCFA)"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
            value={offerAmount}
            onChangeText={setOfferAmount}
          />

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmitOffer}
          >
            <Text style={styles.submitButtonText}>Envoyer l'offre</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderReportModal = () => (
    <Modal
      visible={showReportModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowReportModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Signaler l'annonce
            </Text>
            <TouchableOpacity onPress={() => setShowReportModal(false)}>
              <Close color={colors.text} size={24} />
            </TouchableOpacity>
          </View>

          {reportReasons.map((reason, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.reportOption,
                {
                  backgroundColor:
                    selectedReport === reason ? colors.primary + '20' : colors.surface,
                  borderColor:
                    selectedReport === reason ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setSelectedReport(reason)}
            >
              <Text
                style={[
                  styles.reportOptionText,
                  {
                    color: selectedReport === reason ? colors.primary : colors.text,
                  },
                ]}
              >
                {reason}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[
              styles.submitButton,
              {
                backgroundColor: selectedReport ? colors.accent : colors.border,
              },
            ]}
            onPress={handleSubmitReport}
            disabled={!selectedReport}
          >
            <Text style={styles.submitButtonText}>Envoyer le signalement</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderTooltip = () => {
    if (!showTooltip.visible) return null;

    return (
      <View style={[styles.tooltip, { backgroundColor: colors.text }]}>
        <Text style={[styles.tooltipText, { color: colors.background }]}>
          {showTooltip.message}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <ArrowBackIosRounded color={colors.text} size={24} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Détails
        </Text>

        <TouchableOpacity onPress={handleReport} style={styles.headerButton}>
          <Warning color={colors.textSecondary} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderImageGallery()}
        {renderProductActions()}
        {renderProductInfo()}
        {renderDetailsGrid()}
        {renderDescription()}
        {renderSellerInfo()}
        {renderSimilarProducts()}
      </ScrollView>

      {renderBottomActions()}
      {renderOfferModal()}
      {renderReportModal()}
      {renderTooltip()}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageGalleryContainer: {
    position: 'relative',
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    marginTop: 4,
  },
  productInfoSection: {
    padding: 16,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginLeft: 12,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    gap: 16,
  },
  detailItem: {
    width: '45%',
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  sellerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  sellerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  sellerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  followersText: {
    fontSize: 12,
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  similarSection: {
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
  similarList: {
    paddingHorizontal: 16,
  },
  similarItem: {
    width: 140,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  similarImage: {
    width: 140,
    height: 140,
  },
  similarTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 8,
    paddingBottom: 4,
  },
  similarPrice: {
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  messageButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  offerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  offerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  offerInput: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: 16,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reportOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  reportOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tooltip: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tooltipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProductDetailScreen;
