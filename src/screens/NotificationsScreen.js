import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
} from 'react-native';
import {
  ArrowBackIosRounded,
  VerifiedCheckFill,
  NotificationBell,
  WSquare,
} from '../components/icons';

export default function NotificationsScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#121212' : '#F5F5F5',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    headerBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    skeletonBg: isDarkMode ? '#2A2A2A' : '#E0E0E0',
    filterActive: isDarkMode ? '#FFFFFF' : '#000000',
    filterInactive: isDarkMode ? '#666666' : '#999999',
    emptyIcon: '#666666',
    wIcon: isDarkMode ? '#FFFFFF' : '#000000',
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [notifications, setNotifications] = useState([]);

  const filters = ['Tous', 'Offres', 'Avis & Notes', 'Abonnements', 'Requêtes', 'Système'];

  // Données notifications
  const initialNotifications = [
    {
      id: 'n1',
      type: 'offer',
      message: 'marie t\'a fait une offre sur "Nike Air Force 1"',
      userName: 'marie',
      userAvatar: 'https://i.pravatar.cc/150?img=47',
      verified: true,
      productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
      time: 'Il y a 5 min',
      isRecent: true,
      timestamp: Date.now() - 5 * 60 * 1000,
      action: 'chat',
      chatId: 'chat1',
    },
    {
      id: 'n2',
      type: 'follow',
      message: "emma s'est abonné à toi",
      userName: 'emma',
      userAvatar: 'https://i.pravatar.cc/150?img=47',
      verified: true,
      time: 'Il y a 8 min',
      isRecent: true,
      timestamp: Date.now() - 8 * 60 * 1000,
      action: 'profile',
      userId: 'user2',
    },
    {
      id: 'n3',
      type: 'review',
      message: "john t'a laissé un avis 5 étoiles ⭐",
      userName: 'john',
      userAvatar: 'https://i.pravatar.cc/150?img=8',
      verified: true,
      time: 'Il y a 10 min',
      isRecent: true,
      timestamp: Date.now() - 10 * 60 * 1000,
      action: 'reviews',
      reviewId: 'review1',
    },
    {
      id: 'n4',
      type: 'offer',
      message: 'Ton offre sur "Jean Levi\'s 501" a été acceptée',
      productImage: 'https://images.unsplash.com/photo-1542272454315-7f6fabf73e09?w=200&q=80',
      time: 'Il y a 2h',
      isRecent: false,
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      action: 'chat',
      chatId: 'chat2',
    },
    {
      id: 'n5',
      type: 'request',
      message: 'alex a répondu à ta requête "Cherche Air Force taille 43"',
      userName: 'alex',
      userAvatar: 'https://i.pravatar.cc/150?img=33',
      verified: false,
      time: 'Il y a 3h',
      isRecent: false,
      timestamp: Date.now() - 3 * 60 * 60 * 1000,
      action: 'chat',
      chatId: 'chat3',
    },
    {
      id: 'n6',
      type: 'system',
      message: 'Ton compte a été vérifié avec succès ✅',
      time: 'Il y a 1 jour',
      isRecent: false,
      timestamp: Date.now() - 24 * 60 * 60 * 1000,
      action: 'none',
    },
    {
      id: 'n7',
      type: 'follow',
      message: "mike s'est abonné à toi",
      userName: 'mike',
      userAvatar: 'https://i.pravatar.cc/150?img=12',
      verified: false,
      time: 'Il y a 2 jours',
      isRecent: false,
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      action: 'profile',
      userId: 'user3',
    },
    {
      id: 'n8',
      type: 'review',
      message: "sarah t'a laissé un avis",
      userName: 'sarah',
      userAvatar: 'https://i.pravatar.cc/150?img=45',
      verified: true,
      time: 'Il y a 3 jours',
      isRecent: false,
      timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
      action: 'reviews',
      reviewId: 'review2',
    },
    {
      id: 'n9',
      type: 'system',
      message: 'WOY a été mis à jour ! Découvre les nouveautés 🎨',
      time: 'Il y a 5 jours',
      isRecent: false,
      timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
      action: 'none',
    },
  ];

  // Simulation chargement
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Filtrer notifications > 90 jours
      const now = Date.now();
      const ninetyDaysAgo = now - 90 * 24 * 60 * 60 * 1000;
      const validNotifs = initialNotifications.filter((n) => n.timestamp > ninetyDaysAgo);

      setNotifications(validNotifs);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des notifications');
      setLoading(false);
    }
  };

  // Grouper notifications par type (uniquement pour filtre "Tous")
  const groupByType = (notifs) => {
    const grouped = {};
    notifs.forEach((notif) => {
      if (!grouped[notif.type]) {
        grouped[notif.type] = [];
      }
      grouped[notif.type].push(notif);
    });
    return grouped;
  };

  // Filtrer et organiser notifications avec useMemo
  const { recent, older } = useMemo(() => {
    let filtered = notifications;

    if (activeFilter !== 'Tous') {
      if (activeFilter === 'Offres') {
        filtered = notifications.filter((n) => n.type === 'offer');
      } else if (activeFilter === 'Avis & Notes') {
        filtered = notifications.filter((n) => n.type === 'review');
      } else if (activeFilter === 'Abonnements') {
        filtered = notifications.filter((n) => n.type === 'follow');
      } else if (activeFilter === 'Requêtes') {
        filtered = notifications.filter((n) => n.type === 'request');
      } else if (activeFilter === 'Système') {
        filtered = notifications.filter((n) => n.type === 'system');
      }

      // Pour les filtres spécifiques, retourner liste simple
      return {
        recent: filtered.filter((n) => n.isRecent),
        older: filtered.filter((n) => !n.isRecent),
      };
    }

    // Pour "Tous", grouper les anciennes
    const recentNotifs = filtered.filter((n) => n.isRecent);
    const olderNotifs = filtered.filter((n) => !n.isRecent);

    return {
      recent: recentNotifs,
      older: groupByType(olderNotifs),
    };
  }, [notifications, activeFilter]);

  // Handlers
  const handleBack = () => {
    navigation.goBack();
  };

  const handleNotificationPress = useCallback(
    (notif) => {
      if (notif.action === 'chat') {
        navigation.navigate('Chat', { chatId: notif.chatId });
      } else if (notif.action === 'profile') {
        navigation.navigate('UserProfile', { userId: notif.userId, userName: notif.userName });
      } else if (notif.action === 'reviews') {
        navigation.navigate('Reviews', { reviewId: notif.reviewId });
      }
    },
    [navigation]
  );

  const handleGroupPress = useCallback((type) => {
    if (type === 'offer') {
      setActiveFilter('Offres');
    } else if (type === 'review') {
      setActiveFilter('Avis & Notes');
    } else if (type === 'follow') {
      setActiveFilter('Abonnements');
    } else if (type === 'request') {
      setActiveFilter('Requêtes');
    } else if (type === 'system') {
      setActiveFilter('Système');
    }
  }, []);

  // RENDER SKELETON
  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={[styles.skeletonCard, { backgroundColor: colors.skeletonBg }]} />
      ))}
    </View>
  );

  // RENDER NOTIFICATION
  const renderNotification = (notif) => (
    <TouchableOpacity
      key={notif.id}
      style={[styles.notificationItem, { backgroundColor: colors.background }]}
      onPress={() => handleNotificationPress(notif)}
      activeOpacity={0.9}
    >
      <View style={styles.notificationMain}>
        {notif.type === 'system' ? (
          <WSquare color={colors.wIcon} size={44} />
        ) : (
          <>
            {notif.userAvatar && (
              <Image source={{ uri: notif.userAvatar }} style={styles.userAvatar} />
            )}
            {notif.productImage && !notif.userAvatar && (
              <Image source={{ uri: notif.productImage }} style={styles.productThumbnail} />
            )}
          </>
        )}
        <View style={styles.notificationTextSection}>
          {notif.userName && (
            <View style={styles.userNameRow}>
              <Text style={[styles.userName, { color: colors.text }]}>{notif.userName}</Text>
              {notif.verified && <VerifiedCheckFill color="#3B82F6" size={14} />}
            </View>
          )}
          <Text style={[styles.notificationMessage, { color: colors.text }]} numberOfLines={2}>
            {notif.message}
          </Text>
          <Text style={[styles.notificationTime, { color: colors.textSecondary }]}>
            {notif.time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // RENDER GROUP (seulement pour filtre "Tous")
  const renderGroup = (type, notifs) => {
    const hasAvatars = notifs.some((n) => n.userAvatar || n.productImage);

    return (
      <TouchableOpacity
        key={type}
        style={[styles.groupItem, { backgroundColor: colors.background }]}
        onPress={() => handleGroupPress(type)}
        activeOpacity={0.9}
      >
        {type === 'system' ? (
          <WSquare color={colors.wIcon} size={44} />
        ) : hasAvatars ? (
          <View style={styles.groupAvatars}>
            {notifs.slice(0, 3).map((notif, index) => (
              <Image
                key={notif.id}
                source={{ uri: notif.userAvatar || notif.productImage }}
                style={[styles.groupAvatar, { left: index * 24, zIndex: 3 - index }]}
              />
            ))}
          </View>
        ) : null}
        <View
          style={[
            styles.groupTextSection,
            (type === 'system' || !hasAvatars) && { marginLeft: 12 },
          ]}
        >
          <Text style={[styles.groupLabel, { color: colors.text }]}>
            {notifs.length} notification{notifs.length > 1 ? 's' : ''}
          </Text>
          <Text style={[styles.groupTime, { color: colors.textSecondary }]}>{notifs[0].time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={{ backgroundColor: colors.headerBg }} edges={['top']}>
          <View
            style={[
              styles.header,
              { backgroundColor: colors.headerBg, borderBottomColor: colors.border },
            ]}
          >
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={handleBack}>
                <ArrowBackIosRounded color={colors.text} size={24} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerCenter}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
            </View>
            <View style={styles.headerRight} />
          </View>
        </SafeAreaView>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadNotifications}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isFilteredView = activeFilter !== 'Tous';
  const hasRecent = Array.isArray(recent) ? recent.length > 0 : false;
  const hasOlder = isFilteredView
    ? Array.isArray(older) && older.length > 0
    : Object.keys(older).length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.headerBg}
        translucent={true}
      />

      <SafeAreaView style={{ backgroundColor: colors.headerBg }} edges={['top']}>
        <View
          style={[
            styles.header,
            { backgroundColor: colors.headerBg, borderBottomColor: colors.border },
          ]}
        >
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleBack}>
              <ArrowBackIosRounded color={colors.text} size={24} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[
            styles.filtersContainer,
            { backgroundColor: colors.headerBg, borderBottomColor: colors.border },
          ]}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, { borderColor: colors.border }]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: activeFilter === filter ? colors.filterActive : colors.filterInactive },
                  activeFilter === filter && { fontWeight: '700' },
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          renderSkeleton()
        ) : !hasRecent && !hasOlder ? (
          <View style={styles.emptyContainer}>
            <NotificationBell color={colors.emptyIcon} size={64} />
            <Text style={[styles.emptyText, { color: colors.emptyIcon }]}>Aucune notification</Text>
          </View>
        ) : (
          <View style={styles.notificationsContainer}>
            {hasRecent && (
              <>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Nouveau</Text>
                {recent.map(renderNotification)}
              </>
            )}

            {hasRecent && hasOlder && (
              <View style={[styles.separator, { backgroundColor: colors.border }]} />
            )}

            {isFilteredView ? (
              <>{older.map(renderNotification)}</>
            ) : (
              <>{Object.entries(older).map(([type, notifs]) => renderGroup(type, notifs))}</>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: { width: 40 },
  headerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerRight: { width: 40 },
  filtersContainer: { borderBottomWidth: 1 },
  filtersContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 14, fontWeight: '600' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  notificationsContainer: { paddingTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', paddingHorizontal: 16, marginBottom: 12 },
  separator: { height: 1, marginVertical: 16, marginHorizontal: 16 },
  skeletonContainer: { paddingHorizontal: 16, paddingTop: 16 },
  skeletonCard: { height: 70, borderRadius: 12, marginBottom: 12 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 100 },
  emptyText: { fontSize: 16, marginTop: 16 },
  notificationItem: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12 },
  notificationMain: { flexDirection: 'row', flex: 1 },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e0e0',
    marginRight: 12,
  },
  productThumbnail: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    marginRight: 12,
  },
  notificationTextSection: { flex: 1 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  userName: { fontSize: 14, fontWeight: '700' },
  notificationMessage: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  notificationTime: { fontSize: 12 },
  groupItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  groupAvatars: { position: 'relative', width: 96, height: 44, marginRight: 12 },
  groupAvatar: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  groupTextSection: { flex: 1 },
  groupLabel: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  groupTime: { fontSize: 12 },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  retryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});
