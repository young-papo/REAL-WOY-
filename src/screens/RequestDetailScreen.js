import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Platform,
  Share,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Animated,
  Dimensions,
  useColorScheme,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowBackIosRounded,
  Heart,
  Repeat,
  ShareForwardFill,
  MessageDotsFill,
  EyeFill12,
  ClockFilled,
  MapMarkerAlt,
  StarSolid,
  VerifiedCheckFill,
  Warning,
  Close,
} from '../components/icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RequestDetailScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1250);
  const [isReposted, setIsReposted] = useState(false);
  const [repostCount, setRepostCount] = useState(387);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [activeTooltip, setActiveTooltip] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const likeScaleAnim = useRef(new Animated.Value(1)).current;
  const repostScaleAnim = useRef(new Animated.Value(1)).current;
  const shareScaleAnim = useRef(new Animated.Value(1)).current;
  const messageScaleAnim = useRef(new Animated.Value(1)).current;

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#F0F0F0',
    cardBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    inputBg: isDarkMode ? '#1F1F1F' : '#F2F2F2',
    overlay: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.7)',
    modalBg: isDarkMode ? '#1F1F1F' : '#FFFFFF',
  };

  // Request data (mock or from route params)
  const request = route?.params?.request || {
    id: 'req1',
    title: 'Je cherche des Air Force 1 taille 43 en bon état',
    description:
      "Bonjour, je recherche des Nike Air Force 1 en taille 43. Je préfère du blanc mais je suis ouvert à d'autres couleurs. Budget flexible selon l'état. Contactez-moi si vous en avez ! #nike #airforce #taille43 #chaussures #sneakers",
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    ],
    distance: 3.2,
    views: 2450,
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    author: {
      id: 'user1',
      username: 'john',
      profileImage: 'https://i.pravatar.cc/150?img=8',
      verified: true,
      location: 'Delmas',
      type: 'Acheteur',
      rating: 4.7,
    },
  };

  const suggestedProducts = [
    {
      id: 's1',
      title: 'Nike Air Force 1',
      price: '5 000',
      currency: 'HTG',
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80',
      status: 'available',
    },
    {
      id: 's2',
      title: 'Adidas Superstar',
      price: '4 500',
      currency: 'HTG',
      image:
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&q=80',
      status: 'available',
    },
    {
      id: 's3',
      title: 'Puma RS-X',
      price: '6 000',
      currency: 'HTG',
      image:
        'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&q=80',
      status: 'available',
    },
    {
      id: 's4',
      title: 'Converse Chuck Taylor',
      price: '3 500',
      currency: 'HTG',
      image:
        'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=300&q=80',
      status: 'sold',
    },
    {
      id: 's5',
      title: 'Vans Old Skool',
      price: '5 200',
      currency: 'HTG',
      image:
        'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=300&q=80',
      status: 'available',
    },
    {
      id: 's6',
      title: 'New Balance 574',
      price: '5 800',
      currency: 'HTG',
      image:
        'https://images.unsplash.com/photo-1574847820404-5a8b5b8f7dd0?w=300&q=80',
      status: 'available',
    },
  ];

  const reportReasons = [
    'Contenu inapproprié',
    'Spam ou arnaque',
    'Fausses informations',
    'Autre',
  ];

  const availableSuggestedProducts = suggestedProducts.filter(
    (item) => item.status !== 'sold'
  );

  useEffect(() => {
    if (activeTooltip) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1800),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setActiveTooltip(null));
    }
  }, [activeTooltip]);

  useEffect(() => {
    if (isReportModalVisible) {
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
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isReportModalVisible]);

  const formatNumber = (num) => {
    if (num >= 1000000)
      return (num / 1000000).toFixed(1).replace('.', ',') + 'M';
    if (num >= 100000) return (num / 1000).toFixed(0) + 'k';
    if (num >= 10000) return (num / 1000).toFixed(1).replace('.', ',') + 'k';
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.', ',') + 'k';
    return num.toString();
  };

  const formatPrice = (price) => {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffMonths = Math.floor(diffMs / 2592000000);

    if (diffMins < 1) return "à l'instant";
    if (diffMins < 60) return `il y a ${diffMins} min`;
    if (diffHours < 24) return `il y a ${diffHours}h`;
    if (diffDays < 30) return `il y a ${diffDays}j`;
    if (diffMonths < 12) return `il y a ${diffMonths} mois`;

    const day = date.getDate();
    const months = [
      'jan',
      'fév',
      'mar',
      'avr',
      'mai',
      'jun',
      'jul',
      'aoû',
      'sep',
      'oct',
      'nov',
      'déc',
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const showTooltip = (type) => {
    setActiveTooltip(type);
    fadeAnim.setValue(0);
  };

  const getTooltipText = (type) => {
    const tooltips = {
      views: `${formatNumber(request.views)} personnes ont vu cette requête`,
      time: `Publiée ${getTimeAgo(request.publishedAt)}`,
      distance: `À ${request.distance} km de toi`,
      likeAdd: 'Vous avez aimé cette requête',
      likeRemove: "Vous n'aimez plus cette requête",
      repostAdd: 'Requête republiée',
      repostRemove: 'Requête retirée',
      likes: `${formatNumber(likeCount)} personnes ont aimé`,
      reposts: `${formatNumber(repostCount)} personnes ont republié`,
      share: 'Requête partagée',
      message: 'Ouverture de la messagerie',
      followAdd: 'Vous suivez maintenant ce profil',
      followRemove: 'Vous ne suivez plus ce profil',
      reported: 'Requête signalée',
    };
    return tooltips[type] || '';
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

  const animateButton = (animRef) => {
    Animated.sequence([
      Animated.timing(animRef, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animRef, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    showTooltip(isFollowing ? 'followRemove' : 'followAdd');
  };

  const handleLike = () => {
    animateButton(likeScaleAnim);

    if (!isLiked) {
      setLikeCount(likeCount + 1);
      setIsLiked(true);
      showTooltip('likeAdd');
    } else {
      setLikeCount(likeCount - 1);
      setIsLiked(false);
      showTooltip('likeRemove');
    }
  };

  const handleRepost = () => {
    animateButton(repostScaleAnim);

    if (!isReposted) {
      setRepostCount(repostCount + 1);
      setIsReposted(true);
      showTooltip('repostAdd');
    } else {
      setRepostCount(repostCount - 1);
      setIsReposted(false);
      showTooltip('repostRemove');
    }
  };

  const handleShare = async () => {
    animateButton(shareScaleAnim);
    try {
      await Share.share({
        message: `Regarde cette requête sur WOY: ${request.title}`,
      });
      showTooltip('share');
    } catch (error) {
      console.log('Erreur partage:', error);
    }
  };

  const handleMessage = () => {
    animateButton(messageScaleAnim);
    showTooltip('message');
    setTimeout(() => {
      navigation.navigate('Chat', {
        recipientId: request.author.id,
        recipientName: request.author.username,
        requestId: request.id,
        requestTitle: request.title,
      });
    }, 300);
  };

  const handleMapPress = () => {
    navigation.navigate('Map', {
      userId: request.author.id,
      userName: request.author.username,
      distance: request.distance,
      location: request.author.location,
    });
  };

  const handleViewMore = () => {
    navigation.navigate('Explore', {
      searchQuery: 'sneakers',
      title: 'Suggestions',
    });
  };

  const handleViewProfile = () => {
    navigation.navigate('UserProfile', {
      userId: request.author.id,
      userName: request.author.username,
    });
  };

  const submitReport = () => {
    if (!reportReason) {
      return;
    }
    if (reportReason === 'Autre' && otherReason.trim().length === 0) {
      return;
    }
    setIsReportModalVisible(false);
    setReportReason('');
    setOtherReason('');
    showTooltip('reported');
  };

  const handleProductPress = (item) => {
    navigation.navigate('ProductDetail', {
      productId: item.id,
      product: item,
    });
  };

  const renderSuggestedProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestedProductCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.suggestedProductImage}
      />

      <LinearGradient
        colors={[
          'transparent',
          isDarkMode ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.8)',
        ]}
        style={styles.suggestedProductGradient}
      />

      {item.status === 'sold' && (
        <View style={styles.soldBadge}>
          <Text style={styles.soldBadgeText}>VENDU</Text>
        </View>
      )}

      <View style={styles.suggestedProductInfoOverlay}>
        <Text style={styles.suggestedProductName} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.suggestedPriceText}>
          {formatPrice(item.price)} {item.currency}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Tooltip */}
      {activeTooltip && (
        <Animated.View
          style={[
            styles.tooltip,
            {
              opacity: fadeAnim,
              backgroundColor: colors.overlay,
              top: insets.top + 60,
            },
          ]}
        >
          <Text style={styles.tooltipText}>{getTooltipText(activeTooltip)}</Text>
        </Animated.View>
      )}

      {/* Report Modal */}
      <Modal
        visible={isReportModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={() => setIsReportModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.reportModalContainer}
        >
          <Animated.View
            style={[styles.reportOverlay, { opacity: fadeAnim }]}
          />

          <Animated.View
            style={[
              styles.reportModalContent,
              {
                backgroundColor: colors.cardBg,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View
              style={[
                styles.reportHeader,
                { borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.reportTitle, { color: colors.text }]}>
                Signaler
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsReportModalVisible(false);
                  setReportReason('');
                  setOtherReason('');
                }}
              >
                <Close color={colors.text} size={28} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.reportScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.reportSection}>
                {reportReasons.map((reason, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.reportOption,
                      { backgroundColor: colors.inputBg },
                    ]}
                    onPress={() => setReportReason(reason)}
                  >
                    <View
                      style={[
                        styles.radioButton,
                        { borderColor: colors.text },
                        reportReason === reason && {
                          backgroundColor: colors.text,
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.reportOptionText,
                        { color: colors.text },
                      ]}
                    >
                      {reason}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {reportReason === 'Autre' && (
                <TextInput
                  style={[
                    styles.otherReasonInput,
                    {
                      backgroundColor: colors.inputBg,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Précisez (max 200 car.)"
                  placeholderTextColor={colors.textSecondary}
                  value={otherReason}
                  onChangeText={(text) => {
                    if (text.length <= 200) setOtherReason(text);
                  }}
                  multiline
                  maxLength={200}
                />
              )}

              <View style={{ height: 80 }} />
            </ScrollView>

            <View
              style={[
                styles.reportButtons,
                { borderTopColor: colors.border },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.reportCancelButton,
                  { borderColor: colors.border },
                ]}
                onPress={() => {
                  setIsReportModalVisible(false);
                  setReportReason('');
                  setOtherReason('');
                }}
              >
                <Text
                  style={[styles.reportCancelText, { color: colors.text }]}
                >
                  Annuler
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.reportSubmitButton,
                  { backgroundColor: colors.text },
                ]}
                onPress={submitReport}
              >
                <Text
                  style={[
                    styles.reportSubmitText,
                    { color: colors.background },
                  ]}
                >
                  Envoyer
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image with overlay buttons */}
        {request.images && request.images.length > 0 && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: request.images[0] }}
              style={styles.requestImage}
            />

            <TouchableOpacity
              style={[styles.backButton, { top: insets.top + 8 }]}
              onPress={handleBack}
            >
              <ArrowBackIosRounded color="#FFFFFF" size={24} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.reportButton, { top: insets.top + 8 }]}
              onPress={() => setIsReportModalVisible(true)}
            >
              <Warning color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        )}

        {/* Main Info */}
        <View style={styles.mainInfoContainer}>
          <Text style={[styles.requestTitle, { color: colors.text }]}>
            {request.title}
          </Text>

          <View style={styles.infoRow}>
            <TouchableOpacity
              style={styles.infoItem}
              onPress={() => showTooltip('views')}
            >
              <EyeFill12 color={colors.textSecondary} size={16} />
              <Text
                style={[styles.infoText, { color: colors.textSecondary }]}
              >
                {formatNumber(request.views)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.infoItem}
              onPress={() => showTooltip('time')}
            >
              <ClockFilled color={colors.textSecondary} size={16} />
              <Text
                style={[styles.infoText, { color: colors.textSecondary }]}
              >
                {getTimeAgo(request.publishedAt)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.infoItem}
              onPress={() => {
                handleMapPress();
                showTooltip('distance');
              }}
            >
              <MapMarkerAlt color={colors.text} size={16} />
              <Text style={[styles.infoText, { color: colors.text }]}>
                {request.distance} km
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={handleLike}>
              <Animated.View
                style={[
                  styles.actionWithCount,
                  { transform: [{ scale: likeScaleAnim }] },
                ]}
              >
                <Heart color={isLiked ? '#EF4444' : colors.text} size={20} />
                <Text style={[styles.actionCount, { color: colors.text }]}>
                  {formatNumber(likeCount)}
                </Text>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRepost}>
              <Animated.View
                style={[
                  styles.actionWithCount,
                  { transform: [{ scale: repostScaleAnim }] },
                ]}
              >
                <Repeat
                  color={isReposted ? '#22C55E' : colors.text}
                  size={20}
                />
                <Text style={[styles.actionCount, { color: colors.text }]}>
                  {formatNumber(repostCount)}
                </Text>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleMessage}>
              <Animated.View
                style={{ transform: [{ scale: messageScaleAnim }] }}
              >
                <MessageDotsFill color={colors.text} size={20} />
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare}>
              <Animated.View
                style={{ transform: [{ scale: shareScaleAnim }] }}
              >
                <ShareForwardFill color={colors.text} size={20} />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Description
          </Text>
          <Text
            style={[styles.descriptionText, { color: colors.textSecondary }]}
          >
            {parseTextWithHashtags(request.description)}
          </Text>
        </View>

        {/* Author */}
        <View style={styles.authorContainer}>
          <TouchableOpacity
            style={styles.authorHeader}
            onPress={handleViewProfile}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: request.author.profileImage }}
              style={styles.authorImage}
            />
            <View style={styles.authorInfo}>
              <View style={styles.authorNameRow}>
                <Text style={[styles.authorName, { color: colors.text }]}>
                  {request.author.username}
                </Text>
                {request.author.verified && (
                  <VerifiedCheckFill color="#3B82F6" size={18} />
                )}
              </View>
              <View style={styles.authorLocationRow}>
                <Text
                  style={[styles.authorType, { color: colors.textSecondary }]}
                >
                  {request.author.type}
                </Text>
              </View>
              <View style={styles.authorStatsRow}>
                <StarSolid color="#FFA500" size={14} />
                <Text style={[styles.authorStats, { color: colors.text }]}>
                  {request.author.rating}
                </Text>
              </View>
            </View>
            {!isFollowing && (
              <TouchableOpacity
                style={styles.followButtonCompact}
                onPress={(e) => {
                  e.stopPropagation();
                  handleFollow();
                }}
              >
                <Text style={styles.followButtonCompactText}>+ S'abonner</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        {/* Suggested Products */}
        <View style={styles.suggestedContainer}>
          <Text
            style={[
              styles.sectionTitle,
              styles.suggestionTitle,
              { color: colors.text },
            ]}
          >
            Suggestions
          </Text>
          <FlatList
            data={availableSuggestedProducts}
            renderItem={renderSuggestedProduct}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestedList}
          />
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={handleViewMore}
          >
            <Text style={[styles.viewMoreText, { color: colors.text }]}>
              Voir plus →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  imageContainer: {
    height: 400,
    position: 'relative',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  requestImage: {
    width: SCREEN_WIDTH,
    height: 400,
    backgroundColor: '#E0E0E0',
  },

  backButton: { position: 'absolute', left: 16, zIndex: 10 },
  reportButton: { position: 'absolute', right: 16, zIndex: 10 },

  tooltip: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1000,
    maxWidth: '80%',
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },

  mainInfoContainer: { padding: 16, paddingBottom: 8 },
  requestTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 12,
  },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { fontSize: 12, fontWeight: '500' },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 24,
    paddingTop: 12,
    marginTop: 12,
  },
  actionWithCount: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionCount: { fontSize: 14, fontWeight: '600' },

  descriptionContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  descriptionText: { fontSize: 14, lineHeight: 20 },

  authorContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  authorHeader: { flexDirection: 'row', alignItems: 'center' },
  authorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  authorInfo: { flex: 1, gap: 2 },
  authorNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  authorName: { fontSize: 16, fontWeight: '600' },
  authorLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  authorType: { fontSize: 12 },
  authorStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  authorStats: { fontSize: 14, fontWeight: '600' },

  followButtonCompact: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#000000',
  },
  followButtonCompactText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  suggestedContainer: { paddingTop: 16 },
  suggestionTitle: { paddingHorizontal: 16 },
  suggestedList: { paddingHorizontal: 16, gap: 12, paddingBottom: 8 },
  suggestedProductCard: {
    width: 140,
    aspectRatio: 0.75,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  suggestedProductImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  suggestedProductGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  soldBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  soldBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  suggestedProductInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  suggestedProductName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  suggestedPriceText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },

  viewMoreButton: { paddingVertical: 12, alignItems: 'center' },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  reportModalContainer: { flex: 1 },
  reportOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  reportModalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  reportTitle: { fontSize: 20, fontWeight: '700' },
  reportScroll: { paddingHorizontal: 20, paddingTop: 16 },
  reportSection: { marginBottom: 24 },
  reportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    marginRight: 12,
  },
  reportOptionText: { fontSize: 14, fontWeight: '500' },
  otherReasonInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  reportButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
  },
  reportCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  reportCancelText: { fontSize: 16, fontWeight: '600' },
  reportSubmitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  reportSubmitText: { fontSize: 16, fontWeight: '700' },
});

export default RequestDetailScreen;
