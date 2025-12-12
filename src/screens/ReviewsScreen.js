import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  useColorScheme,
  RefreshControl,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ArrowBackIosRounded,
  StarSolid,
  Filter2Fill,
  MessageDotsFill,
  PaperplaneSolid,
  VerifiedCheckFill,
} from '../components/icons';

export default function ReviewsScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const isOwner = route?.params?.isOwner ?? true;
  const currentUserName = route?.params?.userName ?? 'utilisateur_proprietaire';
  const isCurrentUserVerified = route?.params?.isVerified ?? true;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    headerBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    skeletonBg: isDarkMode ? '#2A2A2A' : '#E0E0E0',
    cardBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    inputBg: isDarkMode ? '#2A2A2A' : '#F5F5F5',
    iconColor: isDarkMode ? '#FFFFFF' : '#000000',
    replyBg: isDarkMode ? '#1A1A1A' : '#F5F5F5',
    replyTextColor: isDarkMode ? '#808080' : '#505050',
  };

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [tempFilterStars, setTempFilterStars] = useState(null);
  const [tempSortOrder, setTempSortOrder] = useState('recent');
  const [tempFilterVerified, setTempFilterVerified] = useState(false);

  const [filterStars, setFilterStars] = useState(null);
  const [sortOrder, setSortOrder] = useState('recent');
  const [filterVerified, setFilterVerified] = useState(false);

  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const flatListRef = useRef(null);

  useEffect(() => {
    loadReviews(1);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reviews, filterStars, sortOrder, filterVerified]);

  useEffect(() => {
    if (showFilterModal) {
      setTempFilterStars(filterStars);
      setTempSortOrder(sortOrder);
      setTempFilterVerified(filterVerified);

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
  }, [showFilterModal]);

  const generateMockReviews = (pageNum) => {
    const itemsPerPage = 15;
    const startIndex = (pageNum - 1) * itemsPerPage;
    const reviewsData = [];

    for (let i = 0; i < itemsPerPage; i++) {
      const index = startIndex + i;
      const rating = Math.floor(Math.random() * 5) + 1;
      const hasLongComment = Math.random() > 0.5;
      const verified = Math.random() > 0.5;

      reviewsData.push({
        id: `review_${pageNum}_${i}`,
        oderId: `user_${index}`,
        userName: `utilisateur_${index + 1}_avec_nom_tres_long`,
        userAvatar: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
        verified: verified,
        rating: rating,
        productId: `product_${index % 10}`,
        productName: `Produit Premium ${index + 1}`,
        comment: hasLongComment
          ? 'Excellent produit ! La qualité est au rendez-vous et la livraison a été rapide. Je recommande vivement ce vendeur. Le produit correspond exactement à la description et les photos.'
          : Math.random() > 0.3 ? 'Très bon produit, conforme à mes attentes.' : '',
        date: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
        hasReplied: false,
        reply: null,
      });
    }

    return reviewsData;
  };

  const loadReviews = async (pageNum) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newReviews = generateMockReviews(pageNum);

      if (pageNum === 1) {
        setReviews(newReviews);
        setTotalReviews(45);
        setAverageRating(4.3);
      } else {
        setReviews(prev => [...prev, ...newReviews]);
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

  const applyFilters = () => {
    let filtered = [...reviews];

    if (filterStars) {
      filtered = filtered.filter(review => review.rating === filterStars);
    }

    if (filterVerified) {
      filtered = filtered.filter(review => review.verified === true);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (sortOrder === 'recent') {
        return dateB - dateA;
      } else if (sortOrder === 'oldest') {
        return dateA - dateB;
      } else {
        return Math.random() - 0.5;
      }
    });

    setFilteredReviews(filtered);
  };

  const resetFilters = () => {
    setTempFilterStars(null);
    setTempSortOrder('recent');
    setTempFilterVerified(false);
  };

  const applyFiltersAndClose = () => {
    setFilterStars(tempFilterStars);
    setSortOrder(tempSortOrder);
    setFilterVerified(tempFilterVerified);
    setShowFilterModal(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    setFilterStars(null);
    setSortOrder('recent');
    setFilterVerified(false);
    await loadReviews(1);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadReviews(nextPage);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleUserPress = (review) => {
    navigation.navigate('UserProfile', {
      oderId: review.oderId,
      username: review.userName,
    });
  };

  const handleProductPress = (review) => {
    navigation.navigate('ProductDetail', {
      productId: review.productId,
    });
  };

  const handleReplyPress = (reviewId) => {
    if (replyingTo && replyingTo !== reviewId) {
      setReplyText('');
    }
    setReplyingTo(reviewId);
  };

  const handleSendReply = (reviewId) => {
    if (!replyText.trim()) return;

    const trimmedReply = replyText.trim().substring(0, 200);

    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, hasReplied: true, reply: trimmedReply }
          : review
      )
    );

    setReplyText('');
    setReplyingTo(null);
  };

  const handleCancelReply = () => {
    setReplyText('');
    setReplyingTo(null);
  };

  const toggleExpandComment = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const toggleExpandReply = (reviewId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  };

  const truncateUsername = (username, maxLength = 10) => {
    if (username.length <= maxLength) return username;
    return username.substring(0, maxLength) + '...';
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={styles.skeletonItem}>
          <View style={styles.skeletonHeaderRow}>
            <View style={[styles.skeletonAvatar, { backgroundColor: colors.skeletonBg }]} />
            <View style={styles.skeletonInfo}>
              <View style={[styles.skeletonName, { backgroundColor: colors.skeletonBg }]} />
              <View style={[styles.skeletonProduct, { backgroundColor: colors.skeletonBg }]} />
            </View>
          </View>
          <View style={[styles.skeletonComment, { backgroundColor: colors.skeletonBg }]} />
        </View>
      ))}
    </View>
  );

  const renderReview = ({ item, index }) => {
    const isCommentExpanded = expandedReviews[item.id];
    const isReplyExpanded = expandedReplies[item.id];
    const shouldTruncateComment = item.comment.length > 150;
    const shouldTruncateReply = item.reply && item.reply.length > 80;

    let displayComment = item.comment;
    if (shouldTruncateComment && !isCommentExpanded) {
      displayComment = truncateText(item.comment, 150);
    }

    let displayReply = item.reply || '';
    if (shouldTruncateReply && !isReplyExpanded) {
      displayReply = truncateText(item.reply, 80);
    }

    const isReplying = replyingTo === item.id;

    return (
      <View style={styles.reviewItem}>
        <View style={styles.reviewContent}>
          <View style={styles.reviewHeader}>
            <TouchableOpacity onPress={() => handleUserPress(item)} activeOpacity={0.7} style={styles.userSection}>
              <Image source={{ uri: item.userAvatar }} style={styles.userAvatar} />
              <View style={styles.userInfoContainer}>
                <View style={styles.userNameRow}>
                  <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
                    {truncateText(item.userName, 22)}
                  </Text>
                  {item.verified && <VerifiedCheckFill color="#3B82F6" size={14} />}
                </View>
                <View style={styles.ratingRow}>
                  <Text style={[styles.ratingLabel, { color: colors.textSecondary }]}>
                    {isOwner ? "T'a laissé une note de" : "A laissé une note de"}
                  </Text>
                  <StarSolid color="#FFB800" size={14} />
                  <Text style={[styles.ratingValue, { color: colors.text }]}>{item.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.commentSection}>
            <View style={styles.commentTextContainer}>
              <TouchableOpacity onPress={() => handleProductPress(item)} activeOpacity={0.7}>
                <Text style={[styles.productNameInComment, { color: colors.text }]} numberOfLines={1}>
                  {item.productName}
                </Text>
              </TouchableOpacity>
              {item.comment ? (
                <View>
                  <Text style={[styles.comment, { color: colors.textSecondary }]}>
                    {displayComment}
                    {shouldTruncateComment && !isCommentExpanded && (
                      <Text onPress={() => toggleExpandComment(item.id)} style={[styles.seeMore, { color: colors.text }]}>
                        {' '}Voir plus
                      </Text>
                    )}
                    {shouldTruncateComment && isCommentExpanded && (
                      <Text onPress={() => toggleExpandComment(item.id)} style={[styles.seeMore, { color: colors.text }]}>
                        {' '}Voir moins
                      </Text>
                    )}
                  </Text>
                </View>
              ) : null}
            </View>

            {isOwner && !item.hasReplied && !isReplying && (
              <TouchableOpacity onPress={() => handleReplyPress(item.id)} style={styles.replyButton} activeOpacity={0.8}>
                <MessageDotsFill color={colors.iconColor} size={22} />
              </TouchableOpacity>
            )}
          </View>

          {isReplying && (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
              <View style={[styles.replyInputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <TextInput
                  style={[styles.replyInput, { color: colors.text }]}
                  placeholder="Écrire une réponse..."
                  placeholderTextColor={colors.textSecondary}
                  value={replyText}
                  onChangeText={(text) => setReplyText(text.substring(0, 200))}
                  multiline
                  maxLength={200}
                  autoFocus
                />
                <View style={styles.replyActions}>
                  <TouchableOpacity onPress={handleCancelReply} style={styles.cancelButton} activeOpacity={0.7}>
                    <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSendReply(item.id)}
                    style={[styles.sendButton, { backgroundColor: colors.iconColor }]}
                    activeOpacity={0.8}
                    disabled={!replyText.trim()}
                  >
                    <PaperplaneSolid color={colors.background} size={18} />
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          )}

          {item.reply && (
            <View style={[styles.replyContainer, { backgroundColor: colors.replyBg }]}>
              <Text style={[styles.replyLabel, { color: colors.replyTextColor }]}>
                {isOwner ? 'Vous avez répondu: ' : `${truncateText(item.userName, 15)} a répondu: `}
              </Text>
              <Text style={[styles.replyText, { color: colors.replyTextColor }]}>
                {displayReply}
                {shouldTruncateReply && !isReplyExpanded && (
                  <Text onPress={() => toggleExpandReply(item.id)} style={[styles.seeMore, { color: colors.text }]}>
                    {' '}Voir plus
                  </Text>
                )}
                {shouldTruncateReply && isReplyExpanded && (
                  <Text onPress={() => toggleExpandReply(item.id)} style={[styles.seeMore, { color: colors.text }]}>
                    {' '}Voir moins
                  </Text>
                )}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <View style={styles.skeletonItem}>
          <View style={styles.skeletonHeaderRow}>
            <View style={[styles.skeletonAvatar, { backgroundColor: colors.skeletonBg }]} />
            <View style={styles.skeletonInfo}>
              <View style={[styles.skeletonName, { backgroundColor: colors.skeletonBg }]} />
              <View style={[styles.skeletonProduct, { backgroundColor: colors.skeletonBg }]} />
            </View>
          </View>
          <View style={[styles.skeletonComment, { backgroundColor: colors.skeletonBg }]} />
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <StarSolid color={colors.textSecondary} size={48} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun avis enregistré</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Les notes apparaîtront ici dès qu'un utilisateur laissera une évaluation.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBg} translucent={false} />
      <View style={[styles.safeArea, { backgroundColor: colors.headerBg, paddingTop: insets.top }]}>
        <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.headerLeft}>
            <ArrowBackIosRounded color={colors.text} size={24} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            {isOwner ? (
              <Text style={[styles.headerTitle, { color: colors.text }]}>Notes et Avis</Text>
            ) : (
              <View style={styles.headerUserInfo}>
                <Text style={[styles.headerUserName, { color: colors.text }]} numberOfLines={1}>
                  {truncateUsername(currentUserName, 10)}
                </Text>
                {isCurrentUserVerified && <VerifiedCheckFill color="#3B82F6" size={16} />}
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => setShowFilterModal(true)} style={styles.headerRight}>
            <Filter2Fill color={colors.iconColor} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredReviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            filteredReviews.length === 0 && styles.emptyListContent
          ]}
          ListHeaderComponent={
            <View style={[styles.statsContainer, { backgroundColor: colors.background }]}>
              <View style={styles.statsRow}>
                <StarSolid color="#FFB800" size={22} />
                <Text style={[styles.statsText, { color: colors.text }]}>
                  {averageRating} · {totalReviews} avis
                </Text>
              </View>
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
          keyboardShouldPersistTaps="handled"
        />
      )}

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
          <Animated.View style={[styles.filterOverlay, { opacity: fadeAnim }]} />

          <Animated.View
            style={[
              styles.filterModalContent,
              { backgroundColor: colors.cardBg, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={[styles.filterHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Filtres</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Text style={[styles.filterCloseIcon, { color: colors.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.filterScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={[styles.filterSectionHeader, { color: colors.text, borderBottomColor: colors.border }]}>
                Par étoiles
              </Text>
              <View style={styles.filterSection}>
                <View style={styles.filterOptionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      { borderColor: colors.border },
                      !tempFilterStars && styles.filterOptionActive
                    ]}
                    onPress={() => setTempFilterStars(null)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      { color: colors.textSecondary },
                      !tempFilterStars && styles.filterOptionTextActive
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
                        tempFilterStars === star && styles.filterOptionActive
                      ]}
                      onPress={() => setTempFilterStars(star)}
                    >
                      <StarSolid color="#FFB800" size={14} />
                      <Text style={[
                        styles.filterOptionText,
                        { color: colors.textSecondary },
                        tempFilterStars === star && styles.filterOptionTextActive
                      ]}>
                        {star}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={[styles.filterSectionHeader, { color: colors.text, borderBottomColor: colors.border }]}>
                Trier par date
              </Text>
              <View style={styles.filterSection}>
                <View style={styles.filterOptionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      { borderColor: colors.border },
                      tempSortOrder === 'recent' && styles.filterOptionActive
                    ]}
                    onPress={() => setTempSortOrder('recent')}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      { color: colors.textSecondary },
                      tempSortOrder === 'recent' && styles.filterOptionTextActive
                    ]}>
                      Plus récent
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      { borderColor: colors.border },
                      tempSortOrder === 'oldest' && styles.filterOptionActive
                    ]}
                    onPress={() => setTempSortOrder('oldest')}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      { color: colors.textSecondary },
                      tempSortOrder === 'oldest' && styles.filterOptionTextActive
                    ]}>
                      Plus ancien
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      { borderColor: colors.border },
                      tempSortOrder === 'random' && styles.filterOptionActive
                    ]}
                    onPress={() => setTempSortOrder('random')}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      { color: colors.textSecondary },
                      tempSortOrder === 'random' && styles.filterOptionTextActive
                    ]}>
                      Aléatoire
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.filterSectionHeader, { color: colors.text, borderBottomColor: colors.border }]}>
                Type de compte
              </Text>
              <View style={styles.filterSection}>
                <View style={styles.filterOptionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      { borderColor: colors.border },
                      tempFilterVerified && styles.filterOptionActive
                    ]}
                    onPress={() => setTempFilterVerified(!tempFilterVerified)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      { color: colors.textSecondary },
                      tempFilterVerified && styles.filterOptionTextActive
                    ]}>
                      Vérifiés uniquement
                    </Text>
                  </TouchableOpacity>
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
                onPress={applyFiltersAndClose}
              >
                <Text style={[styles.filterApplyText, { color: colors.background }]}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {},
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerLeft: { width: 40, alignItems: 'flex-start' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerUserInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerUserName: { fontSize: 18, fontWeight: '700', maxWidth: 200 },
  headerRight: { width: 40, alignItems: 'flex-end' },
  statsContainer: { paddingHorizontal: 16, paddingVertical: 14 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statsText: { fontSize: 18, fontWeight: '700' },
  listContent: { paddingBottom: 20 },
  emptyListContent: { flexGrow: 1 },
  reviewItem: { paddingHorizontal: 16, paddingVertical: 14 },
  reviewContent: { gap: 10 },
  reviewHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  userSection: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, gap: 10 },
  userAvatar: { width: 40, height: 40, borderRadius: 20 },
  userInfoContainer: { flex: 1, gap: 4 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { fontSize: 15, fontWeight: '600', flexShrink: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingLabel: { fontSize: 12 },
  ratingValue: { fontSize: 13, fontWeight: '600' },
  commentSection: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  commentTextContainer: { flex: 1, gap: 4 },
  productNameInComment: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  comment: { fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
  seeMore: { fontSize: 14, fontWeight: '600' },
  replyButton: { padding: 4 },
  replyInputContainer: { padding: 12, borderRadius: 8, borderWidth: 1, gap: 10, marginTop: 8 },
  replyInput: { fontSize: 14, minHeight: 60, textAlignVertical: 'top' },
  replyActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelButton: { paddingHorizontal: 16, paddingVertical: 8 },
  cancelButtonText: { fontSize: 14, fontWeight: '600' },
  sendButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  replyContainer: { padding: 10, borderRadius: 6, marginTop: 6 },
  replyLabel: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  replyText: { fontSize: 13, fontStyle: 'italic', lineHeight: 18 },
  skeletonContainer: { paddingTop: 14 },
  skeletonItem: { paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  skeletonHeaderRow: { flexDirection: 'row', gap: 10 },
  skeletonAvatar: { width: 40, height: 40, borderRadius: 20 },
  skeletonInfo: { flex: 1, gap: 6 },
  skeletonName: { width: '60%', height: 15, borderRadius: 4 },
  skeletonProduct: { width: '50%', height: 15, borderRadius: 4 },
  skeletonComment: { width: '90%', height: 40, borderRadius: 4 },
  footerLoader: { paddingVertical: 10 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 20, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, marginTop: 8, textAlign: 'center', lineHeight: 20 },
  filterModalContainer: { flex: 1 },
  filterOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  filterModalContent: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  filterTitle: { fontSize: 20, fontWeight: 'bold' },
  filterCloseIcon: { fontSize: 24 },
  filterScroll: { paddingHorizontal: 20, paddingVertical: 16 },
  filterSectionHeader: { fontSize: 16, fontWeight: 'bold', marginTop: 8, marginBottom: 16, paddingBottom: 8, borderBottomWidth: 2 },
  filterSection: { marginBottom: 10 },
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
});
