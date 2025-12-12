import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  useColorScheme,
  Alert,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowBackIosRounded,
  PresenceBlocked16Regular,
  VerifiedCheckFill,
} from '../components/icons';

export default function BlockedUsersScreen({ navigation }) {
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
    emptyIcon: '#4A4A4A',
    buttonBg: isDarkMode ? '#FFFFFF' : '#000000',
    buttonText: isDarkMode ? '#000000' : '#FFFFFF',
    placeholderBg: isDarkMode ? '#2A2A2A' : '#E0E0E0',
    placeholderIcon: isDarkMode ? '#666666' : '#999999',
  };

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const mockBlockedUsers = [
        {
          id: 'b1',
          oderId: 'user_b1',
          username: 'spam_account',
          avatar: 'https://i.pravatar.cc/150?img=10',
          verified: false,
        },
        { id: 'b2', oderId: 'user_b2', username: 'toxic_user', avatar: null, verified: false },
        {
          id: 'b3',
          oderId: 'user_b3',
          username: 'annoying_person',
          avatar: 'https://i.pravatar.cc/150?img=25',
          verified: true,
        },
        {
          id: 'b4',
          oderId: 'user_b4',
          username: 'fake_profile',
          avatar: 'https://i.pravatar.cc/150?img=35',
          verified: false,
        },
        { id: 'b5', oderId: 'user_b5', username: 'blocked_seller', avatar: null, verified: true },
        {
          id: 'b6',
          oderId: 'user_b6',
          username: 'verified_scammer',
          avatar: 'https://i.pravatar.cc/150?img=40',
          verified: true,
        },
      ];
      setBlockedUsers(mockBlockedUsers);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBlockedUsers();
    setRefreshing(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleUnblock = (user) => {
    Alert.alert('Débloquer cet utilisateur', `Voulez-vous vraiment débloquer ${user.username} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Débloquer',
        style: 'destructive',
        onPress: () => {
          setBlockedUsers((prev) => prev.filter((u) => u.id !== user.id));
          Alert.alert('Débloqué', `${user.username} a été débloqué`);
        },
      },
    ]);
  };

  const handleUserPress = () => {
    Alert.alert(
      'Accès limité',
      "L'accès est limité. Débloquez l'utilisateur pour voir son profil."
    );
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5].map((item) => (
        <View key={item} style={styles.skeletonItem}>
          <View style={[styles.skeletonAvatar, { backgroundColor: colors.skeletonBg }]} />
          <View style={styles.skeletonTextContainer}>
            <View style={[styles.skeletonUsername, { backgroundColor: colors.skeletonBg }]} />
          </View>
          <View style={[styles.skeletonButton, { backgroundColor: colors.skeletonBg }]} />
        </View>
      ))}
    </View>
  );

  const renderUserItem = (user) => (
    <TouchableOpacity
      key={user.id}
      style={styles.userItem}
      onPress={handleUserPress}
      activeOpacity={0.7}
    >
      {user.avatar ? (
        <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
      ) : (
        <View style={[styles.userAvatarPlaceholder, { backgroundColor: colors.placeholderBg }]}>
          <PresenceBlocked16Regular color={colors.placeholderIcon} size={24} />
        </View>
      )}
      <View style={styles.userInfo}>
        <View style={styles.usernameRow}>
          <Text style={[styles.username, { color: colors.text }]} numberOfLines={1}>
            {user.username}
          </Text>
          {user.verified && <VerifiedCheckFill color="#3B82F6" size={14} />}
        </View>
      </View>
      <TouchableOpacity
        style={[styles.unblockButton, { backgroundColor: colors.buttonBg }]}
        onPress={(e) => {
          e.stopPropagation();
          handleUnblock(user);
        }}
        activeOpacity={0.8}
      >
        <Text style={[styles.unblockButtonText, { color: colors.buttonText }]}>Débloquer</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <PresenceBlocked16Regular color={colors.emptyIcon} size={64} />
      <Text style={[styles.emptyText, { color: colors.emptyIcon }]}>
        Vous n'avez bloqué personne
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.headerBg}
        translucent={false}
      />
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Utilisateurs bloqués</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text}
            colors={[colors.text]}
          />
        }
      >
        {loading ? (
          renderSkeleton()
        ) : blockedUsers.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.listContainer}>
            {blockedUsers.map((user) => renderUserItem(user))}
          </View>
        )}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: { width: 40, alignItems: 'flex-start' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerRight: { width: 40 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  listContainer: { paddingTop: 8 },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  userAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: { flex: 1, marginRight: 8 },
  usernameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  username: { fontSize: 15, fontWeight: '600', flexShrink: 1 },
  unblockButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  unblockButtonText: { fontSize: 13, fontWeight: '700' },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 32,
  },
  emptyText: { fontSize: 14, textAlign: 'center', marginTop: 16, lineHeight: 20 },
  skeletonContainer: { paddingTop: 8 },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  skeletonAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  skeletonTextContainer: { flex: 1 },
  skeletonUsername: { width: '60%', height: 16, borderRadius: 4 },
  skeletonButton: { width: 100, height: 32, borderRadius: 8 },
});
