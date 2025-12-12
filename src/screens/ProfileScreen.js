import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  useColorScheme,
  Linking,
  Dimensions,
  Platform,
  StatusBar,
  Modal,
  Animated,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {
  ArrowBackIosRounded,
  Setting,
  MoreVertical,
  BlockOutline,
  ReportProblemOutline,
  VerifiedCheckFill,
  StarSolid,
  Pencil,
  ShareForwardFill,
  MessageDotsFill,
  BoxBold,
  Megaphone,
  Repeat,
  Link3Fill,
  HouseUser,
  ProfileFill,
} from '../components/icons';

// Initialisation de Firebase
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Vérifier si Firebase est déjà initialisé
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const COVER_HEIGHT = SCREEN_HEIGHT * 0.25;

export default function ProfileScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const isMyProfile = route?.params?.isMyProfile ?? auth.currentUser ? auth.currentUser.uid === (route?.params?.userId ?? 'me') : true;
  const userId = route?.params?.userId ?? auth.currentUser?.uid ?? 'me';

  const [activeTabContent, setActiveTabContent] = useState('products');
  const [showMenu, setShowMenu] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [longPressedItem, setLongPressedItem] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const scrollViewRef = useRef(null);
  const linePosition = useRef(new Animated.Value(0)).current;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#F0F0F0',
    cardBg: isDarkMode ? '#1A1A1A' : '#F5F5F5',
    cardBorder: isDarkMode ? '#2A2A2A' : '#E0E0E0',
    requestBg: isDarkMode ? '#1A1A1A' : '#F8F8F8',
    iconActive: isDarkMode ? '#FFFFFF' : '#000000',
    iconInactive: isDarkMode ? '#666666' : '#999999',
    emptyText: isDarkMode ? '#4A4A4A' : '#888888',
    error: '#EF4444',
  };

  const [userData, setUserData] = useState({
    id: 'user123',
    username: 'jean_dupont',
    fullName: 'Jean Dupont',
    profileImage: 'https://i.pravatar.cc/150?img=8',
    coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80',
    verified: true,
    accountType: 'Particulier',
    bio: 'Passionné de sneakers et tech\nPort-au-Prince, Haïti #fashion #tech',
    address: 'Delmas 32, Port-au-Prince',
    website: 'https://jeandupont.com',
    followersCount: 1247,
    followingCount: 589,
    rating: 4.8,
    reviewsCount: 156,
    mutualFollowers: [
      'https://i.pravatar.cc/150?img=1',
      'https://i.pravatar.cc/150?img=2',
      'https://i.pravatar.cc/150?img=3',
    ],
    mutualFollowersCount: 47,
  });

  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reposts, setReposts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          setUserData({ id: userId, ...userDoc.data() });
        } else {
          setError('Utilisateur non trouvé');
        }

        if (!isMyProfile && auth.currentUser) {
          const currentUserDoc = await db.collection('users').doc(auth.currentUser.uid).get();
          const following = currentUserDoc.data()?.following || [];
          setIsFollowing(following.includes(userId));
        }

        const productsDoc = await db.collection('users').doc(userId).collection('content').doc('products').get();
        if (productsDoc.exists) {
          setProducts(productsDoc.data().items || []);
        }

        const requestsDoc = await db.collection('users').doc(userId).collection('content').doc('requests').get();
        if (requestsDoc.exists) {
          setRequests(requestsDoc.data().items || []);
        }

        const repostsDoc = await db.collection('users').doc(userId).collection('content').doc('reposts').get();
        if (repostsDoc.exists) {
          setReposts(repostsDoc.data().items || []);
        }
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId, isMyProfile]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace('.', ',') + 'M';
    if (num >= 100000) return (num / 1000).toFixed(0) + 'k';
    if (num >= 10000) return (num / 1000).toFixed(1).replace('.', ',') + 'k';
    if (num >= 1000) return (num / 1000).toFixed(1).replace('.', ',') + 'k';
    return num.toString();
  };

  const formatPrice = (price) => {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const parseTextWithHashtags = (text) => {
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return <Text key={index} style={{ color: '#3B82F6', fontWeight: '600' }}>{part}</Text>;
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        setUserData({ id: userId, ...userDoc.data() });
      }
      const productsDoc = await db.collection('users').doc(userId).collection('content').doc('products').get();
      if (productsDoc.exists) {
        setProducts(productsDoc.data().items || []);
      }
      const requestsDoc = await db.collection('users').doc(userId).collection('content').doc('requests').get();
      if (requestsDoc.exists) {
        setRequests(requestsDoc.data().items || []);
      }
      const repostsDoc = await db.collection('users').doc(userId).collection('content').doc('reposts').get();
      if (repostsDoc.exists) {
        setReposts(repostsDoc.data().items || []);
      }
    } catch (err) {
      setError('Erreur lors du rafraîchissement');
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { userData });
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleFollow = async () => {
    if (!auth.currentUser) {
      navigation.navigate('Login');
      return;
    }
    try {
      const currentUserRef = db.collection('users').doc(auth.currentUser.uid);
      const profileUserRef = db.collection('users').doc(userId);
      if (isFollowing) {
        await currentUserRef.update({ following: firebase.firestore.FieldValue.arrayRemove(userId) });
        await profileUserRef.update({ followersCount: userData.followersCount - 1 });
        setUserData((prev) => ({ ...prev, followersCount: prev.followersCount - 1 }));
        setIsFollowing(false);
      } else {
        await currentUserRef.update({ following: firebase.firestore.FieldValue.arrayUnion(userId) });
        await profileUserRef.update({ followersCount: userData.followersCount + 1 });
        setUserData((prev) => ({ ...prev, followersCount: prev.followersCount + 1 }));
        setIsFollowing(true);
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du suivi');
      console.error(err);
    }
  };

  const handleContact = () => {
    if (!auth.currentUser) {
      navigation.navigate('Login');
      return;
    }
    navigation.navigate('Chat', { recipientId: userId, recipientUsername: userData.username });
  };

  const handleShareProfile = async () => {
    try {
      await db.collection('shares').doc(`${userId}_${Date.now()}`).set({
        userId,
        username: userData.username,
        sharedBy: auth.currentUser?.uid,
        timestamp: new Date(),
      });
      navigation.navigate('ShareSuccess', { type: 'profile', username: userData.username });
    } catch (err) {
      setError('Erreur lors du partage');
      console.error(err);
    }
  };

  const handleWebsitePress = () => {
    if (userData.website) {
      Linking.openURL(userData.website);
    }
  };

  const handleAddressPress = () => {
    navigation.navigate('Map', { address: userData.address });
  };

  const handleRatingPress = () => {
    navigation.navigate('Reviews', {
      userId: userId,
      username: userData.username,
      rating: userData.rating,
      reviewsCount: userData.reviewsCount
    });
  };

  const handleMenuAction = async (action) => {
    setShowMenu(false);
    if (action === 'block') {
      try {
        await db.collection('blocks').doc(`${auth.currentUser.uid}_${userId}`).set({
          blocker: auth.currentUser.uid,
          blocked: userId,
          timestamp: new Date(),
        });
        navigation.navigate('BlockSuccess', { username: userData.username });
      } catch (err) {
        setError('Erreur lors du blocage');
        console.error(err);
      }
    } else if (action === 'report') {
      try {
        await db.collection('reports').doc(`${auth.currentUser.uid}_${userId}_${Date.now()}`).set({
          reporter: auth.currentUser.uid,
          reported: userId,
          reason: 'Signalement de profil',
          timestamp: new Date(),
        });
        navigation.navigate('ReportSuccess', { type: 'user', username: userData.username });
      } catch (err) {
        setError('Erreur lors du signalement');
        console.error(err);
      }
    }
  };

  const handleFollowersPress = () => {
    navigation.navigate('Followers', { userId });
  };

  const handleFollowingPress = () => {
    navigation.navigate('Following', { userId });
  };

  const handleMutualFollowersPress = () => {
    navigation.navigate('MutualFollowers', { userId });
  };

  const handleTabContentChange = (tab) => {
    const tabIndex = tab === 'products' ? 0 : tab === 'requests' ? 1 : 2;
    Animated.spring(linePosition, {
      toValue: tabIndex * (100 / 3),
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
    setActiveTabContent(tab);
    if (tab === 'products') {
      scrollViewRef.current?.scrollTo({ y: 600, animated: true });
    }
  };

  const handleProductPress = (item) => {
    navigation.navigate('ProductDetail', { productId: item.id });
  };

  const handleRequestPress = (item) => {
    navigation.navigate('RequestDetail', { requestId: item.id });
  };

  const handleProfilePress = () => {
    setShowProfileModal(true);
  };

  const handleLongPressProfile = () => {
    setShowProfileModal(true);
  };

  const handleLongPressItem = (item, type) => {
    setLongPressedItem({ item, type });
  };

  const handleMorePress = (item) => {
    setSelectedItem(item);
    setShowActionModal(true);
  };

  const handleActionModalOption = async (action) => {
    setShowActionModal(false);
    if (action === 'share') {
      try {
        await db.collection('shares').doc(`${selectedItem.id}_${Date.now()}`).set({
          itemId: selectedItem.id,
          type: selectedItem.type,
          sharedBy: auth.currentUser?.uid,
          timestamp: new Date(),
        });
        navigation.navigate('ShareSuccess', { type: 'content' });
      } catch (err) {
        setError('Erreur lors du partage');
        console.error(err);
      }
    } else if (action === 'report') {
      try {
        await db.collection('reports').doc(`${auth.currentUser.uid}_${selectedItem.id}_${Date.now()}`).set({
          reporter: auth.currentUser.uid,
          reportedItem: selectedItem.id,
          type: selectedItem.type,
          reason: 'Signalement de contenu',
          timestamp: new Date(),
        });
        navigation.navigate('ReportSuccess', { type: 'content' });
      } catch (err) {
        setError('Erreur lors du signalement');
        console.error(err);
      }
    }
    setSelectedItem(null);
  };

  const handleDeleteItem = async () => {
    if (!longPressedItem) return;

    const { item, type } = longPressedItem;
    try {
      if (type === 'product') {
        await db.collection('users').doc(userId).collection('content').doc('products').update({
          items: firebase.firestore.FieldValue.arrayRemove(item),
        });
        setProducts((prev) => prev.filter((p) => p.id !== item.id));
      } else if (type === 'request') {
        await db.collection('users').doc(userId).collection('content').doc('requests').update({
          items: firebase.firestore.FieldValue.arrayRemove(item),
        });
        setRequests((prev) => prev.filter((r) => r.id !== item.id));
      } else if (type === 'repost-product' || type === 'repost-request') {
        await db.collection('users').doc(userId).collection('content').doc('reposts').update({
          items: firebase.firestore.FieldValue.arrayRemove(item),
        });
        setReposts((prev) => prev.filter((r) => r.id !== item.id));
      }
    } catch (err) {
      setError('Erreur lors de la suppression');
      console.error(err);
    } finally {
      setLongPressedItem(null);
    }
  };

  const renderProduct = (item, isLeft, isRepost = false) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.productCard,
          isLeft ? styles.itemLeft : styles.itemRight,
          { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
        ]}
        activeOpacity={0.9}
        onPress={() => handleProductPress(item)}
        onLongPress={() => handleLongPressItem(item, isRepost ? 'repost-product' : 'product')}
        delayLongPress={500}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.8)']}
          style={styles.gradientOverlay}
        />
        <View style={styles.productInfoOverlay}>
          <View style={styles.productTextSection}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.priceRow}>
              {item.originalPrice && (
                <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
              )}
              <Text style={styles.priceText}>{formatPrice(item.price)} {item.currency}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRequest = (item) => {
    const isRepost = item.isRepost;
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.requestCard,
          { backgroundColor: colors.requestBg, borderColor: colors.cardBorder },
        ]}
        onPress={() => handleRequestPress(item)}
        onLongPress={() => handleLongPressItem(item, isRepost ? 'repost-request' : 'request')}
        delayLongPress={500}
        activeOpacity={0.9}
      >
        {item.hasImage && (
          <Image source={{ uri: item.image }} style={styles.requestThumbnail} />
        )}
        <View style={styles.requestContent}>
          {isRepost && (
            <View style={styles.requestHeader}>
              <Image source={{ uri: item.userImage }} style={styles.userAvatar} />
              <Text style={[styles.usernameRequest, { color: colors.text }]}>
                {item.username}
              </Text>
              {item.verified && <VerifiedCheckFill color="#3B82F6" size={14} />}
              <TouchableOpacity
                style={styles.requestMoreButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleMorePress(item);
                }}
              >
                <MoreVertical color={colors.text} size={18} />
              </TouchableOpacity>
            </View>
          )}
          <Text
            style={[styles.requestText, { color: colors.text }]}
            numberOfLines={2}
          >
            {parseTextWithHashtags(item.text)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    let icon, message;
    if (activeTabContent === 'products') {
      icon = <BoxBold color={colors.emptyText} size={48} />;
      message = isMyProfile
        ? "Vous n'avez encore rien publié. Ajoutez votre premier produit dès maintenant !"
        : "Cet utilisateur n'a pas encore ajouté d'article.";
    } else if (activeTabContent === 'requests') {
      icon = <Megaphone color={colors.emptyText} size={48} />;
      message = isMyProfile
        ? "Vous n'avez pas encore fait de requête. Faites savoir ce que vous cherchez !"
        : "Cet utilisateur n'a pas encore fait de demande.";
    } else if (activeTabContent === 'reposts') {
      icon = <Repeat color={colors.emptyText} size={40} />;
      message = isMyProfile
        ? "Vous n'avez encore rien republié. Découvrez des produits et republiez ceux que vous aimez !"
        : "Cet utilisateur n'a pas encore repartagé d'annonce.";
    }
    return (
      <View style={styles.emptyStateContainer}>
        {icon}
        <Text style={[styles.emptyStateText, { color: colors.emptyText }]}>{message}</Text>
      </View>
    );
  };

  const renderContentGrid = () => {
    let dataToRender = [];
    let isRepost = false;
    if (activeTabContent === 'products') {
      dataToRender = products;
    } else if (activeTabContent === 'reposts') {
      dataToRender = reposts.filter((item) => item.type === 'product');
      isRepost = true;
    }
    if (dataToRender.length === 0) {
      return renderEmptyState();
    }
    const rows = [];
    for (let i = 0; i < dataToRender.length; i += 3) {
      const row = dataToRender.slice(i, i + 3);
      rows.push(
        <View key={`row-${i}`} style={styles.gridRow}>
          {row.map((item, index) => renderProduct(item, index === 0, isRepost))}
        </View>
      );
    }
    return rows;
  };

  const renderRequestsList = () => {
    let dataToRender = [];
    if (activeTabContent === 'requests') {
      dataToRender = requests;
    } else if (activeTabContent === 'reposts') {
      dataToRender = reposts.filter((item) => item.type === 'request');
    }
    if (dataToRender.length === 0) {
      return renderEmptyState();
    }
    return dataToRender.map((item) => renderRequest(item));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={[styles.emptyStateText, { color: colors.text }]}>Chargement...</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={[styles.emptyStateText, { color: colors.error }]}>{error}</Text>
        </View>
      );
    }
    if (activeTabContent === 'products') {
      return <View style={styles.gridContent}>{renderContentGrid()}</View>;
    } else if (activeTabContent === 'requests') {
      return <View style={styles.requestsContent}>{renderRequestsList()}</View>;
    } else if (activeTabContent === 'reposts') {
      const hasRequests = reposts.filter((item) => item.type === 'request').length > 0;
      const hasProducts = reposts.filter((item) => item.type === 'product').length > 0;
      if (!hasRequests && !hasProducts) {
        return renderEmptyState();
      }
      return (
        <View>
          {hasRequests && <View style={styles.requestsContent}>{renderRequestsList()}</View>}
          {hasProducts && <View style={styles.gridContent}>{renderContentGrid()}</View>}
        </View>
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text}
            colors={[colors.text]}
          />
        }
      >
        <View style={styles.coverContainer}>
          <Image source={{ uri: userData.coverImage }} style={styles.coverImage} />
          <View style={[styles.headerOverlay, { paddingTop: insets.top }]}>
            <View style={styles.headerButtons}>
              {!isMyProfile && (
                <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
                  <ArrowBackIosRounded color="#FFFFFF" size={24} />
                </TouchableOpacity>
              )}
              {isMyProfile && <View style={styles.headerButton} />}
              {!isMyProfile && (
                <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.headerButton}>
                  <MoreVertical color="#FFFFFF" size={24} />
                </TouchableOpacity>
              )}
              {isMyProfile && (
                <TouchableOpacity onPress={handleSettings} style={styles.headerButton}>
                  <Setting color="#FFFFFF" size={22} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={handleProfilePress}
            onLongPress={handleLongPressProfile}
            delayLongPress={500}
            activeOpacity={1}
          >
            <View style={styles.profileImageWrapper}>
              <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
            </View>
          </TouchableOpacity>
        </View>
        {showMenu && !isMyProfile && (
          <View style={[styles.menuDropdown, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={() => handleMenuAction('block')}>
              <BlockOutline color={colors.text} size={20} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Bloquer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuAction('report')}>
              <ReportProblemOutline color={colors.text} size={20} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Signaler</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={[styles.profileInfoContainer, { borderBottomColor: colors.border }]}>
          <View style={styles.nameRow}>
            <Text style={[styles.username, { color: colors.text }]}>{userData.username}</Text>
            {userData.verified && <VerifiedCheckFill color="#3B82F6" size={18} />}
          </View>
          <Text style={[styles.accountType, { color: colors.textSecondary }]}>{userData.accountType}</Text>
          <View style={[styles.statsRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
            <TouchableOpacity style={styles.statItem} onPress={handleRatingPress}>
              <View style={styles.statValueRow}>
                <StarSolid color="#FFA500" size={16} />
                <Text style={[styles.statValue, { color: colors.text }]}>{userData.rating}</Text>
              </View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={() => handleTabContentChange('products')}>
              <Text style={[styles.statValue, { color: colors.text }]}>{products.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Produits</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={handleFollowersPress}>
              <Text style={[styles.statValue, { color: colors.text }]}>{formatNumber(userData.followersCount)}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Abonnés</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={handleFollowingPress}>
              <Text style={[styles.statValue, { color: colors.text }]}>{formatNumber(userData.followingCount)}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Abonnements</Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.bio, { color: colors.textSecondary }]}>
            {parseTextWithHashtags(userData.bio)}
          </Text>
          {userData.address && (
            <TouchableOpacity style={styles.addressContainer} onPress={handleAddressPress}>
              <HouseUser color="#3B82F6" size={16} />
              <Text style={styles.addressText}>{userData.address}</Text>
            </TouchableOpacity>
          )}
          {userData.website && (
            <TouchableOpacity style={styles.websiteContainer} onPress={handleWebsitePress}>
              <Link3Fill color="#3B82F6" size={16} />
              <Text style={styles.websiteText}>{userData.website}</Text>
            </TouchableOpacity>
          )}
          {!isMyProfile && userData.mutualFollowers.length > 0 && (
            <TouchableOpacity style={styles.mutualFollowersContainer} onPress={handleMutualFollowersPress}>
              <View style={styles.mutualAvatarsRow}>
                {userData.mutualFollowers.slice(0, 3).map((avatar, index) => (
                  <Image key={index} source={{ uri: avatar }} style={[styles.mutualAvatar, { marginLeft: index > 0 ? -8 : 0 }]} />
                ))}
              </View>
              <Text style={[styles.mutualText, { color: colors.textSecondary }]}>
                +{userData.mutualFollowersCount} personnes suivent ce compte
              </Text>
            </TouchableOpacity>
          )}
          <View style={styles.actionButtons}>
            {isMyProfile ? (
              <>
                <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.text }]} onPress={handleEditProfile}>
                  <Pencil color={colors.background} size={18} />
                  <Text style={[styles.editButtonText, { color: colors.background }]}>Modifier profil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.shareProfileButton, { backgroundColor: isDarkMode ? '#FFFFFF' : '#000000' }]} onPress={handleShareProfile}>
                  <ShareForwardFill color={isDarkMode ? '#000000' : '#FFFFFF'} size={18} />
                  <Text style={[styles.shareProfileButtonText, { color: isDarkMode ? '#000000' : '#FFFFFF' }]}>Partager profil</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[
                    styles.followButton,
                    { backgroundColor: isFollowing ? colors.background : colors.text, borderColor: colors.text, borderWidth: isFollowing ? 1 : 0 },
                  ]}
                  onPress={handleFollow}
                >
                  <Text style={[styles.followButtonText, { color: isFollowing ? colors.text : colors.background }]}>
                    {isFollowing ? '✓ Abonné' : '+ S\'abonner'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.messageButton, { borderColor: colors.text }]} onPress={handleContact}>
                  <MessageDotsFill color={colors.text} size={20} />
                  <Text style={[styles.messageButtonText, { color: colors.text }]}>Message</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        <View style={[styles.tabsWrapper, { borderBottomColor: colors.border }]}>
          <TouchableOpacity style={styles.tab} onPress={() => handleTabContentChange('products')}>
            <BoxBold color={activeTabContent === 'products' ? colors.text : colors.textSecondary} size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => handleTabContentChange('requests')}>
            <Megaphone color={activeTabContent === 'requests' ? colors.text : colors.textSecondary} size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => handleTabContentChange('reposts')}>
            <Repeat color={activeTabContent === 'reposts' ? colors.text : colors.textSecondary} size={20} />
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                backgroundColor: colors.text,
                left: linePosition.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
        {renderContent()}
        <View style={{ height: 20 }} />
      </ScrollView>
      <Modal
        visible={showProfileModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileModal(false)}
        >
          <BlurView intensity={90} style={styles.blurView}>
            <View style={styles.modalContent}>
              <Image source={{ uri: userData.profileImage }} style={styles.modalProfileImage} />
            </View>
          </BlurView>
        </TouchableOpacity>
      </Modal>
      <Modal
        visible={longPressedItem !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setLongPressedItem(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLongPressedItem(null)}
        >
          <View style={[styles.deleteModal, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.deleteModalText, { color: colors.text }]}>
              {longPressedItem?.type === 'product' && 'Supprimer cette publication ?'}
              {longPressedItem?.type === 'request' && 'Supprimer cette requête ?'}
              {(longPressedItem?.type === 'repost-product' || longPressedItem?.type === 'repost-request') && 'Supprimer cette republication ?'}
            </Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalButton, { backgroundColor: '#EF4444' }]}
                onPress={handleDeleteItem}
              >
                <Text style={styles.deleteModalButtonText}>Supprimer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteModalButton, { backgroundColor: colors.cardBg }]}
                onPress={() => setLongPressedItem(null)}
              >
                <Text style={[styles.deleteModalButtonText, { color: colors.text }]}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        visible={showActionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActionModal(false)}
        >
          <View style={[styles.actionModal, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.actionModalButton, { borderBottomColor: colors.border }]}
              onPress={() => handleActionModalOption('share')}
            >
              <ShareForwardFill color={colors.text} size={20} />
              <Text style={[styles.actionModalButtonText, { color: colors.text }]}>Partager</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionModalButton}
              onPress={() => handleActionModalOption('report')}
            >
              <ReportProblemOutline color="#EF4444" size={20} />
              <Text style={[styles.actionModalButtonText, { color: '#EF4444' }]}>Signaler</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  coverContainer: { position: 'relative', height: COVER_HEIGHT },
  coverImage: { width: '100%', height: '100%', backgroundColor: '#E0E0E0' },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  headerButtons: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8 },
  headerButton: { padding: 8 },
  menuDropdown: { position: 'absolute', top: 60, right: 16, borderRadius: 8, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, zIndex: 1000 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  menuItemText: { fontSize: 14, fontWeight: '500' },
  profileImageContainer: { position: 'absolute', bottom: -40, left: 16 },
  profileImageWrapper: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#FFFFFF', padding: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  profileImage: { width: '100%', height: '100%', borderRadius: 45 },
  profileInfoContainer: { paddingHorizontal: 16, paddingTop: 48, paddingBottom: 16, borderBottomWidth: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  username: { fontSize: 20, fontWeight: '600' },
  accountType: { fontSize: 14, marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, marginVertical: 12, borderTopWidth: 1, borderBottomWidth: 1 },
  statItem: { alignItems: 'center' },
  statValueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statValue: { fontSize: 16, fontWeight: '600' },
  statLabel: { fontSize: 11, marginTop: 2 },
  bio: { fontSize: 14, lineHeight: 20, marginTop: 8 },
  addressContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  addressText: { fontSize: 14, color: '#3B82F6' },
  websiteContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  websiteText: { fontSize: 14, color: '#3B82F6' },
  mutualFollowersContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  mutualAvatarsRow: { flexDirection: 'row' },
  mutualAvatar: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#FFFFFF' },
  mutualText: { fontSize: 12, flex: 1 },
  actionButtons: { flexDirection: 'row', gap: 8, marginTop: 16 },
  editButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, flex: 1, justifyContent: 'center' },
  editButtonText: { fontSize: 14, fontWeight: '600' },
  shareProfileButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, flex: 1, justifyContent: 'center' },
  shareProfileButtonText: { fontSize: 14, fontWeight: '600' },
  followButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, flex: 1, alignItems: 'center', justifyContent: 'center' },
  followButtonText: { fontSize: 14, fontWeight: '600' },
  messageButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, flex: 1, justifyContent: 'center' },
  messageButtonText: { fontSize: 14, fontWeight: '600' },
  tabsWrapper: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, position: 'relative' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  tabIndicator: { position: 'absolute', bottom: 0, width: `${100 / 3}%`, height: 2 },
  gridContent: { paddingHorizontal: 8, paddingTop: 16 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  productCard: { width: (SCREEN_WIDTH - 24) / 3, height: (SCREEN_WIDTH - 24) / 3, borderRadius: 8, overflow: 'hidden', borderWidth: 1 },
  itemLeft: { marginRight: 4 },
  itemRight: { marginLeft: 4 },
  productImage: { width: '100%', height: '100%' },
  gradientOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%' },
  productInfoOverlay: { position: 'absolute', bottom: 8, left: 8, right: 8 },
  productTextSection: { flexDirection: 'column', gap: 2 },
  productName: { fontSize: 11, color: '#FFFFFF', fontWeight: '500' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  priceText: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },
  originalPrice: { fontSize: 10, color: '#FFFFFF', textDecorationLine: 'line-through' },
  requestsContent: { paddingHorizontal: 16, paddingTop: 16 },
  requestCard: { flexDirection: 'row', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  requestThumbnail: { width: 48, height: 48, borderRadius: 8, marginRight: 12 },
  requestContent: { flex: 1 },
  requestHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  userAvatar: { width: 20, height: 20, borderRadius: 10 },
  usernameRequest: { fontSize: 12, fontWeight: '600' },
  requestMoreButton: { marginLeft: 'auto' },
  requestText: { fontSize: 14, lineHeight: 20 },
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyStateText: { fontSize: 14, textAlign: 'center', marginTop: 12, paddingHorizontal: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  blurView: { width: '80%', height: '60%', borderRadius: 16, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  modalProfileImage: { width: '90%', height: '90%', borderRadius: 16 },
  deleteModal: { padding: 16, borderRadius: 12, borderWidth: 1, width: '80%' },
  deleteModalText: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 16 },
  deleteModalButtons: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  deleteModalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  deleteModalButtonText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  actionModal: { width: '60%', borderRadius: 12, borderWidth: 1 },
  actionModalButton: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  actionModalButtonText: { fontSize: 14, fontWeight: '500' },
});
