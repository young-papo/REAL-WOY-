import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  Animated,
  useColorScheme,
  Platform,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import {
  ArrowBackIosRounded,
  Filter2Fill,
  StarSolid,
  VerifiedCheckFill,
  Close,
  BoxBold,
  Megaphone,
  HandshakeSimple,
  MapMarkerAlt,
} from '../components/icons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const MapScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const mapRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const detailSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const detailFadeAnim = useRef(new Animated.Value(0)).current;

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#F0F0F0',
    cardBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    inputBg: isDarkMode ? '#1F1F1F' : '#F2F2F2',
    badge: '#EF4444',
  };

  const [filters, setFilters] = useState({
    showProducts: true,
    showRequests: true,
    showSellers: true,
    showPartners: true,
    distance: 'Tous',
    rating: 'Tous',
    categories: [],
    priceRange: 'Tous',
    conditions: [],
  });

  // Données mockées pour les marqueurs
  const [markers] = useState([
    // Produits (vert)
    {
      id: 'p1',
      type: 'product',
      title: 'Nike Air Force 1',
      price: '5 000',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      seller: 'jean_marc',
      sellerId: 'user1',
      sellerImage: 'https://i.pravatar.cc/150?img=12',
      sellerVerified: true,
      rating: 4.8,
      condition: 'Neuf',
      coordinate: { latitude: 18.5392, longitude: -72.3380 },
    },
    {
      id: 'p2',
      type: 'product',
      title: 'Sac Louis Vuitton',
      price: '25 000',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
      seller: 'fashion_queen',
      sellerId: 'user2',
      sellerImage: 'https://i.pravatar.cc/150?img=23',
      sellerVerified: true,
      rating: 4.9,
      condition: 'Bon',
      coordinate: { latitude: 18.5410, longitude: -72.3350 },
    },
    {
      id: 'p3',
      type: 'product',
      title: 'iPhone 14 Pro',
      price: '65 000',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&q=80',
      seller: 'tech_store',
      sellerId: 'user5',
      sellerImage: 'https://i.pravatar.cc/150?img=60',
      sellerVerified: true,
      rating: 4.7,
      condition: 'Neuf',
      coordinate: { latitude: 18.5360, longitude: -72.3420 },
    },
    // Requêtes (bleu)
    {
      id: 'r1',
      type: 'request',
      title: 'Je cherche des Air Jordan taille 42',
      author: 'tech_buyer',
      authorId: 'user6',
      authorImage: 'https://i.pravatar.cc/150?img=33',
      authorVerified: false,
      budget: '8 000',
      currency: 'HTG',
      coordinate: { latitude: 18.5425, longitude: -72.3400 },
    },
    {
      id: 'r2',
      type: 'request',
      title: 'Besoin MacBook Pro M2 urgent',
      author: 'dev_pro',
      authorId: 'user7',
      authorImage: 'https://i.pravatar.cc/150?img=8',
      authorVerified: true,
      budget: '100 000',
      currency: 'HTG',
      coordinate: { latitude: 18.5375, longitude: -72.3340 },
    },
    {
      id: 'r3',
      type: 'request',
      title: 'Sneakers vintage années 90',
      author: 'sneaker_fan',
      authorId: 'user8',
      authorImage: 'https://i.pravatar.cc/150?img=15',
      authorVerified: false,
      budget: '5 000',
      currency: 'HTG',
      coordinate: { latitude: 18.5445, longitude: -72.3360 },
    },
    // Vendeurs (profile)
    {
      id: 's1',
      type: 'seller',
      name: 'style_boutique',
      userId: 'user3',
      image: 'https://i.pravatar.cc/150?img=45',
      verified: true,
      rating: 4.9,
      products: 45,
      sales: 230,
      coordinate: { latitude: 18.5400, longitude: -72.3390 },
    },
    {
      id: 's2',
      type: 'seller',
      name: 'bijoux_luxe',
      userId: 'user4',
      image: 'https://i.pravatar.cc/150?img=29',
      verified: true,
      rating: 4.7,
      products: 78,
      sales: 156,
      coordinate: { latitude: 18.5350, longitude: -72.3370 },
    },
    {
      id: 's3',
      type: 'seller',
      name: 'deco_maison',
      userId: 'user9',
      image: 'https://i.pravatar.cc/150?img=52',
      verified: false,
      rating: 4.5,
      products: 34,
      sales: 89,
      coordinate: { latitude: 18.5430, longitude: -72.3310 },
    },
    {
      id: 's4',
      type: 'seller',
      name: 'sport_plus',
      userId: 'user10',
      image: 'https://i.pravatar.cc/150?img=68',
      verified: true,
      rating: 4.8,
      products: 120,
      sales: 450,
      coordinate: { latitude: 18.5385, longitude: -72.3450 },
    },
    // Partenaires (orange)
    {
      id: 'pa1',
      type: 'partner',
      name: 'accessory_shop',
      userId: 'partner1',
      image: 'https://i.pravatar.cc/150?img=50',
      verified: true,
      rating: 4.9,
      specialty: 'Accessoires de luxe',
      description: 'Partenaire officiel WOY - Livraison gratuite',
      coordinate: { latitude: 18.5415, longitude: -72.3330 },
      recentProducts: [
        { id: 'pp1', title: 'Montre Rolex', price: '150 000', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&q=80' },
        { id: 'pp2', title: 'Lunettes Ray-Ban', price: '8 000', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&q=80' },
      ],
    },
    {
      id: 'pa2',
      type: 'partner',
      name: 'marie_style',
      userId: 'partner2',
      image: 'https://i.pravatar.cc/150?img=38',
      verified: true,
      rating: 4.8,
      specialty: 'Mode féminine',
      description: 'Boutique certifiée - Retours acceptés',
      coordinate: { latitude: 18.5365, longitude: -72.3395 },
      recentProducts: [
        { id: 'pp3', title: 'Robe Chanel', price: '35 000', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80' },
        { id: 'pp4', title: 'Sac Hermès', price: '85 000', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&q=80' },
      ],
    },
    {
      id: 'pa3',
      type: 'partner',
      name: 'fashion_hub',
      userId: 'partner3',
      image: 'https://i.pravatar.cc/150?img=41',
      verified: true,
      rating: 4.7,
      specialty: 'Streetwear',
      description: 'Éditions limitées - Authentique garanti',
      coordinate: { latitude: 18.5440, longitude: -72.3440 },
      recentProducts: [
        { id: 'pp5', title: 'Hoodie Supreme', price: '12 000', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80' },
        { id: 'pp6', title: 'Casquette New Era', price: '3 500', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&q=80' },
      ],
    },
    {
      id: 'pa4',
      type: 'partner',
      name: 'electronics_pro',
      userId: 'partner4',
      image: 'https://i.pravatar.cc/150?img=59',
      verified: true,
      rating: 4.9,
      specialty: 'Électronique',
      description: 'Garantie 1 an - Service après-vente',
      coordinate: { latitude: 18.5355, longitude: -72.3460 },
      recentProducts: [
        { id: 'pp7', title: 'MacBook Air M2', price: '95 000', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80' },
        { id: 'pp8', title: 'AirPods Pro', price: '18 000', image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=200&q=80' },
      ],
    },
  ]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
      setLoading(false);
    })();
  }, []);

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

  useEffect(() => {
    if (showDetailModal) {
      Animated.parallel([
        Animated.timing(detailFadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.spring(detailSlideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(detailFadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(detailSlideAnim, { toValue: SCREEN_HEIGHT, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [showDetailModal]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleMarkerPress = (marker) => {
    setSelectedMarker(marker);
    setShowDetailModal(true);
  };

  const handleMyLocation = async () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(userLocation, 500);
    } else {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({});
        const region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
        setUserLocation(region);
        if (mapRef.current) {
          mapRef.current.animateToRegion(region, 500);
        }
      }
    }
  };

  const handleViewDetails = () => {
    setShowDetailModal(false);
    if (!selectedMarker) return;

    if (selectedMarker.type === 'product') {
      navigation.navigate('ProductDetail', {
        productId: selectedMarker.id,
        product: selectedMarker,
      });
    } else if (selectedMarker.type === 'request') {
      navigation.navigate('RequestDetail', {
        requestId: selectedMarker.id,
        request: selectedMarker,
      });
    } else if (selectedMarker.type === 'seller' || selectedMarker.type === 'partner') {
      navigation.navigate('UserProfile', {
        userId: selectedMarker.userId || selectedMarker.id,
        user: selectedMarker,
      });
    }
  };

  const handleProfilePress = () => {
    setShowDetailModal(false);
    if (!selectedMarker) return;

    const userId = selectedMarker.sellerId || selectedMarker.authorId || selectedMarker.userId;
    navigation.navigate('UserProfile', {
      userId: userId,
    });
  };

  const handleRecentProductPress = (product) => {
    setShowDetailModal(false);
    navigation.navigate('ProductDetail', {
      productId: product.id,
      product: product,
    });
  };

  const handleMessage = () => {
    setShowDetailModal(false);
    if (!selectedMarker) return;

    const userId = selectedMarker.sellerId || selectedMarker.authorId || selectedMarker.userId;
    const userName = selectedMarker.seller || selectedMarker.author || selectedMarker.name;

    navigation.navigate('Chat', {
      recipientId: userId,
      recipientName: userName,
    });
  };

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

  const applyFilters = () => {
    const hasFilters =
      !filters.showProducts ||
      !filters.showRequests ||
      !filters.showSellers ||
      !filters.showPartners ||
      filters.distance !== 'Tous' ||
      filters.rating !== 'Tous' ||
      filters.categories.length > 0 ||
      filters.priceRange !== 'Tous' ||
      filters.conditions.length > 0;

    setHasActiveFilters(hasFilters);
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setFilters({
      showProducts: true,
      showRequests: true,
      showSellers: true,
      showPartners: true,
      distance: 'Tous',
      rating: 'Tous',
      categories: [],
      priceRange: 'Tous',
      conditions: [],
    });
    setHasActiveFilters(false);
  };

  const getFilteredMarkers = () => {
    return markers.filter((marker) => {
      if (marker.type === 'product' && !filters.showProducts) return false;
      if (marker.type === 'request' && !filters.showRequests) return false;
      if (marker.type === 'seller' && !filters.showSellers) return false;
      if (marker.type === 'partner' && !filters.showPartners) return false;
      return true;
    });
  };

  const renderMarker = (marker) => {
    if (marker.type === 'product') {
      return (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          onPress={() => handleMarkerPress(marker)}
        >
          <View style={[styles.markerContainer, styles.productMarker]}>
            <BoxBold color="#FFFFFF" size={16} />
          </View>
        </Marker>
      );
    } else if (marker.type === 'request') {
      return (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          onPress={() => handleMarkerPress(marker)}
        >
          <View style={[styles.markerContainer, styles.requestMarker]}>
            <Megaphone color="#FFFFFF" size={16} />
          </View>
        </Marker>
      );
    } else if (marker.type === 'seller') {
      return (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          onPress={() => handleMarkerPress(marker)}
        >
          <View style={styles.sellerMarkerContainer}>
            <Image source={{ uri: marker.image }} style={styles.sellerMarkerImage} />
          </View>
        </Marker>
      );
    } else if (marker.type === 'partner') {
      return (
        <Marker
          key={marker.id}
          coordinate={marker.coordinate}
          onPress={() => handleMarkerPress(marker)}
        >
          <View style={[styles.markerContainer, styles.partnerMarker]}>
            <HandshakeSimple color="#FFFFFF" size={16} />
          </View>
        </Marker>
      );
    }
    return null;
  };

  const renderDetailModal = () => {
    if (!selectedMarker) return null;

    return (
      <Modal
        visible={showDetailModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.detailModalContainer}>
          <TouchableOpacity
            style={styles.detailOverlay}
            activeOpacity={1}
            onPress={() => setShowDetailModal(false)}
          >
            <Animated.View style={[styles.detailOverlayBg, { opacity: detailFadeAnim }]} />
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.detailModalContent,
              {
                backgroundColor: colors.cardBg,
                transform: [{ translateY: detailSlideAnim }],
              },
            ]}
          >
            <View style={[styles.detailHeader, { borderBottomColor: colors.border }]}>
              <View style={styles.detailHeaderHandle} />
            </View>

            {selectedMarker.type === 'product' && (
              <View style={styles.detailBody}>
                <View style={styles.productDetailRow}>
                  <Image source={{ uri: selectedMarker.image }} style={styles.productDetailImage} />
                  <View style={styles.productDetailInfo}>
                    <Text style={[styles.productDetailTitle, { color: colors.text }]} numberOfLines={2}>
                      {selectedMarker.title}
                    </Text>
                    <Text style={styles.productDetailPrice}>
                      {selectedMarker.price} {selectedMarker.currency}
                    </Text>
                    <View style={styles.productDetailMeta}>
                      <Text style={[styles.productDetailCondition, { color: colors.textSecondary }]}>
                        {selectedMarker.condition}
                      </Text>
                      <View style={styles.ratingBadge}>
                        <StarSolid color="#FFA500" size={12} />
                        <Text style={styles.ratingText}>{selectedMarker.rating}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.sellerRow} onPress={handleProfilePress}>
                  <Image source={{ uri: selectedMarker.sellerImage }} style={styles.sellerAvatar} />
                  <Text style={[styles.sellerName, { color: colors.text }]}>{selectedMarker.seller}</Text>
                  {selectedMarker.sellerVerified && <VerifiedCheckFill color="#3B82F6" size={14} />}
                </TouchableOpacity>

                <View style={styles.detailActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton, { borderColor: colors.border }]}
                    onPress={handleMessage}
                  >
                    <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={handleViewDetails}
                  >
                    <Text style={styles.primaryButtonText}>Voir détails</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {selectedMarker.type === 'request' && (
              <View style={styles.detailBody}>
                <TouchableOpacity style={styles.authorRow} onPress={handleProfilePress}>
                  <Image source={{ uri: selectedMarker.authorImage }} style={styles.authorAvatar} />
                  <Text style={[styles.authorName, { color: colors.text }]}>{selectedMarker.author}</Text>
                  {selectedMarker.authorVerified && <VerifiedCheckFill color="#3B82F6" size={14} />}
                </TouchableOpacity>

                <Text style={[styles.requestDetailText, { color: colors.text }]}>
                  {selectedMarker.title}
                </Text>

                <View style={styles.budgetRow}>
                  <Text style={[styles.budgetLabel, { color: colors.textSecondary }]}>Budget:</Text>
                  <Text style={styles.budgetValue}>
                    {selectedMarker.budget} {selectedMarker.currency}
                  </Text>
                </View>

                <View style={styles.detailActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton, { borderColor: colors.border }]}
                    onPress={handleMessage}
                  >
                    <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={handleViewDetails}
                  >
                    <Text style={styles.primaryButtonText}>Voir détails</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {selectedMarker.type === 'seller' && (
              <View style={styles.detailBody}>
                <View style={styles.sellerDetailHeader}>
                  <Image source={{ uri: selectedMarker.image }} style={styles.sellerDetailAvatar} />
                  <View style={styles.sellerDetailInfo}>
                    <View style={styles.sellerDetailNameRow}>
                      <Text style={[styles.sellerDetailName, { color: colors.text }]}>
                        {selectedMarker.name}
                      </Text>
                      {selectedMarker.verified && <VerifiedCheckFill color="#3B82F6" size={16} />}
                    </View>
                    <View style={styles.sellerStats}>
                      <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.text }]}>{selectedMarker.products}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Produits</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={[styles.statValue, { color: colors.text }]}>{selectedMarker.sales}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Ventes</Text>
                      </View>
                      <View style={styles.statItem}>
                        <View style={styles.ratingBadge}>
                          <StarSolid color="#FFA500" size={12} />
                          <Text style={styles.ratingText}>{selectedMarker.rating}</Text>
                        </View>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Note</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.detailActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton, { borderColor: colors.border }]}
                    onPress={handleMessage}
                  >
                    <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={handleViewDetails}
                  >
                    <Text style={styles.primaryButtonText}>Voir profil</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {selectedMarker.type === 'partner' && (
              <View style={styles.detailBody}>
                <View style={styles.partnerHeader}>
                  <Image source={{ uri: selectedMarker.image }} style={styles.partnerAvatar} />
                  <View style={styles.partnerInfo}>
                    <View style={styles.partnerNameRow}>
                      <Text style={[styles.partnerName, { color: colors.text }]}>
                        {selectedMarker.name}
                      </Text>
                      {selectedMarker.verified && <VerifiedCheckFill color="#3B82F6" size={16} />}
                    </View>
                    <View style={styles.partnerBadge}>
                      <HandshakeSimple color="#F97316" size={12} />
                      <Text style={styles.partnerBadgeText}>Partenaire officiel</Text>
                    </View>
                  </View>
                  <View style={styles.ratingBadge}>
                    <StarSolid color="#FFA500" size={12} />
                    <Text style={styles.ratingText}>{selectedMarker.rating}</Text>
                  </View>
                </View>

                <Text style={[styles.partnerSpecialty, { color: colors.textSecondary }]}>
                  {selectedMarker.specialty}
                </Text>
                <Text style={[styles.partnerDescription, { color: colors.text }]}>
                  {selectedMarker.description}
                </Text>

                {selectedMarker.recentProducts && selectedMarker.recentProducts.length > 0 && (
                  <View style={styles.recentProductsSection}>
                    <Text style={[styles.recentProductsTitle, { color: colors.text }]}>
                      Produits récents
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {selectedMarker.recentProducts.map((product) => (
                        <TouchableOpacity
                          key={product.id}
                          style={styles.recentProductCard}
                          onPress={() => handleRecentProductPress(product)}
                        >
                          <Image source={{ uri: product.image }} style={styles.recentProductImage} />
                          <Text style={[styles.recentProductTitle, { color: colors.text }]} numberOfLines={1}>
                            {product.title}
                          </Text>
                          <Text style={styles.recentProductPrice}>{product.price} HTG</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <View style={styles.detailActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.secondaryButton, { borderColor: colors.border }]}
                    onPress={handleMessage}
                  >
                    <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.primaryButton]}
                    onPress={handleViewDetails}
                  >
                    <Text style={styles.primaryButtonText}>Voir boutique</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    );
  };

  const defaultRegion = {
    latitude: 18.5392,
    longitude: -72.3380,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Chargement de la carte...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + 8,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowBackIosRounded color={colors.text} size={24} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Carte</Text>

        <TouchableOpacity onPress={handleFilterPress} style={styles.filterButton}>
          <Filter2Fill color={colors.text} size={24} />
          {hasActiveFilters && (
            <View style={[styles.filterBadge, { backgroundColor: colors.badge }]} />
          )}
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={userLocation || defaultRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {getFilteredMarkers().map(renderMarker)}
      </MapView>

      {/* My Location Button */}
      <TouchableOpacity
        style={[styles.myLocationButton, { backgroundColor: colors.cardBg }]}
        onPress={handleMyLocation}
      >
        <MapMarkerAlt color={colors.text} size={20} />
      </TouchableOpacity>

      {/* Legend */}
      <View style={[styles.legend, { backgroundColor: colors.cardBg }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Produits</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Requêtes</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F97316' }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Partenaires</Text>
        </View>
      </View>

      {/* Detail Modal */}
      {renderDetailModal()}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.filterModalContainer}>
          <TouchableOpacity
            style={styles.filterOverlay}
            activeOpacity={1}
            onPress={() => setShowFilterModal(false)}
          >
            <Animated.View style={[styles.filterOverlayBg, { opacity: fadeAnim }]} />
          </TouchableOpacity>

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
                  Types de marqueurs
                </Text>
                <View style={styles.filterOptionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor: filters.showProducts ? '#22C55E' : colors.inputBg,
                      },
                    ]}
                    onPress={() => setFilters({ ...filters, showProducts: !filters.showProducts })}
                  >
                    <BoxBold color={filters.showProducts ? '#FFFFFF' : colors.text} size={14} />
                    <Text
                      style={[
                        styles.filterOptionText,
                        { color: filters.showProducts ? '#FFFFFF' : colors.text },
                      ]}
                    >
                      Produits
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor: filters.showRequests ? '#3B82F6' : colors.inputBg,
                      },
                    ]}
                    onPress={() => setFilters({ ...filters, showRequests: !filters.showRequests })}
                  >
                    <Megaphone color={filters.showRequests ? '#FFFFFF' : colors.text} size={14} />
                    <Text
                      style={[
                        styles.filterOptionText,
                        { color: filters.showRequests ? '#FFFFFF' : colors.text },
                      ]}
                    >
                      Requêtes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor: filters.showSellers ? colors.text : colors.inputBg,
                      },
                    ]}
                    onPress={() => setFilters({ ...filters, showSellers: !filters.showSellers })}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        { color: filters.showSellers ? colors.background : colors.text },
                      ]}
                    >
                      Vendeurs
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      {
                        backgroundColor: filters.showPartners ? '#F97316' : colors.inputBg,
                      },
                    ]}
                    onPress={() => setFilters({ ...filters, showPartners: !filters.showPartners })}
                  >
                    <HandshakeSimple color={filters.showPartners ? '#FFFFFF' : colors.text} size={14} />
                    <Text
                      style={[
                        styles.filterOptionText,
                        { color: filters.showPartners ? '#FFFFFF' : colors.text },
                      ]}
                    >
                      Partenaires
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>
                  Distance (km)
                </Text>
                <View style={styles.filterOptionsRow}>
                  {['Tous', '1', '5', '10', '20', '50+'].map((dist) => (
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
                              filters.distance === dist ? colors.background : colors.text,
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
                  Catégories
                </Text>
                <View style={styles.filterOptionsRow}>
                  {['Tous', 'Vêtements', 'Chaussures', 'Sacs', 'Accessoires', 'Électronique', 'Bijoux'].map(
                    (cat) => (
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
                    )
                  )}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>
                  Fourchette de prix (HTG)
                </Text>
                <View style={styles.filterOptionsRow}>
                  {['Tous', '100 - 1 000', '1 000 - 10 000', '10 000 - 50 000', '50 000+'].map(
                    (range) => (
                      <TouchableOpacity
                        key={range}
                        style={[
                          styles.filterOption,
                          {
                            backgroundColor:
                              filters.priceRange === range ? colors.text : colors.inputBg,
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

              <View style={styles.filterSection}>
                <Text style={[styles.filterLabel, { color: colors.text }]}>
                  Note minimum
                </Text>
                <View style={styles.filterOptionsRow}>
                  {['Tous', '3', '4', '4.5'].map((rating) => (
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
                                filters.rating === rating ? colors.background : colors.text,
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
                                  filters.rating === rating ? colors.background : colors.text,
                                marginRight: 4,
                              },
                            ]}
                          >
                            {rating}+
                          </Text>
                          <StarSolid
                            color={
                              filters.rating === rating
                                ? isDarkMode
                                  ? '#000000'
                                  : '#FFFFFF'
                                : '#FFA500'
                            }
                            size={12}
                          />
                        </View>
                      )}
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
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  filterButton: {
    padding: 4,
    position: 'relative',
  },

  filterBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 2,
    right: 2,
  },

  map: {
    flex: 1,
  },

  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  productMarker: {
    backgroundColor: '#22C55E',
  },

  requestMarker: {
    backgroundColor: '#3B82F6',
  },

  partnerMarker: {
    backgroundColor: '#F97316',
  },

  sellerMarkerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  sellerMarkerImage: {
    width: '100%',
    height: '100%',
  },

  myLocationButton: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  legend: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Detail Modal
  detailModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  detailOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  detailOverlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  detailModalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },

  detailHeader: {
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },

  detailHeaderHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },

  detailBody: {
    padding: 20,
  },

  productDetailRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  productDetailImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },

  productDetailInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },

  productDetailTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },

  productDetailPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#22C55E',
    marginBottom: 6,
  },

  productDetailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  productDetailCondition: {
    fontSize: 13,
  },

  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFA500',
  },

  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginBottom: 16,
  },

  sellerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },

  sellerName: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },

  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },

  authorName: {
    fontSize: 15,
    fontWeight: '600',
    marginRight: 6,
  },

  requestDetailText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },

  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  budgetLabel: {
    fontSize: 14,
    marginRight: 8,
  },

  budgetValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B82F6',
  },

  sellerDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  sellerDetailAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  sellerDetailInfo: {
    flex: 1,
    marginLeft: 16,
  },

  sellerDetailNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  sellerDetailName: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 6,
  },

  sellerStats: {
    flexDirection: 'row',
    gap: 20,
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: 16,
    fontWeight: '700',
  },

  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },

  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  partnerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  partnerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  partnerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  partnerName: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },

  partnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  partnerBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F97316',
  },

  partnerSpecialty: {
    fontSize: 13,
    marginBottom: 4,
  },

  partnerDescription: {
    fontSize: 14,
    marginBottom: 16,
  },

  recentProductsSection: {
    marginBottom: 16,
  },

  recentProductsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },

  recentProductCard: {
    width: 100,
    marginRight: 12,
  },

  recentProductImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    marginBottom: 6,
  },

  recentProductTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },

  recentProductPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#22C55E',
  },

  detailActions: {
    flexDirection: 'row',
    gap: 12,
  },

  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  secondaryButton: {
    borderWidth: 1,
  },

  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },

  primaryButton: {
    backgroundColor: '#000000',
  },

  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Filter Modal
  filterModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  filterOverlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  filterModalContent: {
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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

export default MapScreen;
