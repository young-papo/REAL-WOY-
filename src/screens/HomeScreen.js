import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  RefreshControl,
  Platform,
  useColorScheme,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Linking,
} from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ========================================
// ICÔNES SVG
// ========================================

const Home24Filled = ({ color = '#000000', size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M13.45 2.533a2.25 2.25 0 0 0-2.9 0L3.8 8.228a2.25 2.25 0 0 0-.8 1.72v9.305c0 .966.784 1.75 1.75 1.75h3a1.75 1.75 0 0 0 1.75-1.75V15.25c0-.68.542-1.232 1.217-1.25h2.566a1.25 1.25 0 0 1 1.217 1.25v4.003c0 .966.784 1.75 1.75 1.75h3a1.75 1.75 0 0 0 1.75-1.75V9.947a2.25 2.25 0 0 0-.8-1.72l-6.75-5.694Z"
    />
  </Svg>
);

const SearchCategorySolid = ({ color = '#000000', size = 25 }) => (
  <Svg width={size} height={size} viewBox="0 0 14 14">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M3.188.05c-.503 0-.99.046-1.447.097A1.826 1.826 0 0 0 .134 1.759a14 14 0 0 0-.092 1.436c0 .499.043.982.092 1.437c.09.844.765 1.518 1.607 1.612c.457.051.944.097 1.447.097q.353-.001.693-.026a4.8 4.8 0 0 1 .987-1.437a4.8 4.8 0 0 1 1.44-.988q.024-.341.025-.695c0-.498-.043-.981-.092-1.436A1.826 1.826 0 0 0 4.634.147A13 13 0 0 0 3.187.05m0 7.604q.144 0 .287.005q-.104.602-.103 1.223c0 1.487.424 2.933 1.496 4.004q.327.327.698.576a1.8 1.8 0 0 1-.932.387c-.457.05-.944.096-1.447.096s-.99-.045-1.446-.096a1.826 1.826 0 0 1-1.607-1.612A14 14 0 0 1 .042 10.8c0-.498.043-.982.092-1.437A1.826 1.826 0 0 1 1.74 7.751c.457-.05.944-.097 1.447-.097m10.678-3.022a1.8 1.8 0 0 1-.404.958a4.7 4.7 0 0 0-.586-.712c-1.071-1.072-2.517-1.496-4.004-1.496a7 7 0 0 0-1.2.1a9 9 0 0 1-.005-.287c0-.498.043-.981.092-1.436A1.826 1.826 0 0 1 9.366.147C9.823.096 10.31.05 10.813.05s.99.046 1.446.097a1.825 1.825 0 0 1 1.607 1.612c.049.455.092.938.092 1.436c0 .499-.043.982-.092 1.437m-7.054 2.19c-.416.417-.69 1.078-.69 2.06s.274 1.643.69 2.06c.417.416 1.078.69 2.06.69s1.643-.274 2.06-.69c.416-.417.69-1.078.69-2.06s-.274-1.643-.69-2.06c-.417-.416-1.078-.69-2.06-.69s-1.643.274-2.06.69m-1.06-1.06c.773-.774 1.862-1.13 3.12-1.13s2.347.356 3.12 1.13s1.13 1.862 1.13 3.12c0 .967-.21 1.834-.659 2.535l1.253 1.253a.75.75 0 1 1-1.06 1.06l-1.254-1.254c-.7.447-1.565.656-2.53.656c-1.258 0-2.347-.356-3.12-1.13s-1.13-1.862-1.13-3.12s.356-2.347 1.13-3.12"
      clipRule="evenodd"
    />
  </Svg>
);

const AddSquareSolid = ({ color = '#000000', size = 25 }) => (
  <Svg width={size} height={size} viewBox="0 0 14 14">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M0 3.5A3.5 3.5 0 0 1 3.5 0h7A3.5 3.5 0 0 1 14 3.5v7a3.5 3.5 0 0 1-3.5 3.5h-7A3.5 3.5 0 0 1 0 10.5zm7-.25a.75.75 0 0 1 .75.75v2.25H10a.75.75 0 0 1 0 1.5H7.75V10a.75.75 0 0 1-1.5 0V7.75H4a.75.75 0 0 1 0-1.5h2.25V4A.75.75 0 0 1 7 3.25"
      clipRule="evenodd"
    />
  </Svg>
);

const MessageDotsFill = ({ color = '#000000', size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M20.605 4.17a4.67 4.67 0 0 0-3.33-1.38H6.705a4.71 4.71 0 0 0-4.71 4.72v6.6a4.71 4.71 0 0 0 4.71 4.72h2.33l1.95 1.94c.127.143.284.255.46.33c.175.072.361.11.55.11c.189-.002.375-.04.55-.11a1.58 1.58 0 0 0 .44-.31l2-2h2.33a4.69 4.69 0 0 0 3.33-1.38a4.8 4.8 0 0 0 1-1.53c.234-.575.357-1.19.36-1.81v-6.6a4.67 4.67 0 0 0-1.4-3.3m-13.24 8.17a1.66 1.66 0 1 1 1.66-1.66a1.67 1.67 0 0 1-1.66 1.66m4.63 0a1.66 1.66 0 1 1 0-3.32a1.66 1.66 0 0 1 0 3.32m4.62 0a1.66 1.66 0 1 1 1.66-1.66a1.67 1.67 0 0 1-1.66 1.66"
    />
  </Svg>
);

const ProfileFillNav = ({ color = '#000000', size = 26 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0Zm0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5H8Z"
      clipRule="evenodd"
    />
  </Svg>
);

const ShoppingCart = ({ color = '#000000', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 640 512">
    <Path
      fill={color}
      d="M24-16C10.7-16 0-5.3 0 8s10.7 24 24 24h45.3c3.9 0 7.2 2.8 7.9 6.6l52.1 286.3c6.2 34.2 36 59.1 70.8 59.1H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H200.1c-11.6 0-21.5-8.3-23.6-19.7l-5.1-28.3H475c30.8 0 57.2-21.9 62.9-52.2l31-165.9c3.7-19.7-11.4-37.9-31.5-37.9H124.7l-.4-2c-4.8-26.6-28-46-55.1-46zm184 528a48 48 0 1 0 0-96a48 48 0 1 0 0 96m224 0a48 48 0 1 0 0-96a48 48 0 1 0 0 96"
    />
  </Svg>
);

const Bell = ({ color = '#000000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22zm7-7.414V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.185 4.074 5 6.783 5 10v4.586l-1.707 1.707A.996.996 0 0 0 3 17v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-1a.996.996 0 0 0-.293-.707L19 14.586z"
    />
  </Svg>
);

const VerifiedCheckFill = ({ color = '#3B82F6', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M22.02 11.164a1.84 1.84 0 0 0-.57-.67l-1.33-1a.35.35 0 0 1-.14-.2a.36.36 0 0 1 0-.25l.55-1.63a2 2 0 0 0 .06-.9a1.809 1.809 0 0 0-.36-.84a1.859 1.859 0 0 0-.7-.57a1.75 1.75 0 0 0-.85-.17h-1.5a.41.41 0 0 1-.39-.3l-.43-1.5a1.88 1.88 0 0 0-.46-.81a2 2 0 0 0-.78-.49a2 2 0 0 0-.92-.06a1.88 1.88 0 0 0-.83.39l-1.14.9a.35.35 0 0 1-.23.09a.36.36 0 0 1-.22-.05l-1.13-.9a1.85 1.85 0 0 0-.8-.38a1.87 1.87 0 0 0-.88 0a1.93 1.93 0 0 0-.78.43a2.08 2.08 0 0 0-.51.79l-.43 1.51a.38.38 0 0 1-.15.22a.41.41 0 0 1-.27.07H5.41a1.92 1.92 0 0 0-.89.18a1.78 1.78 0 0 0-.71.57a1.93 1.93 0 0 0-.36.83c-.05.293-.03.595.06.88L4 8.993a.41.41 0 0 1-.14.45l-1.33 1c-.242.18-.44.412-.58.68a1.93 1.93 0 0 0 0 1.71a2 2 0 0 0 .58.68l1.33 1a.41.41 0 0 1 .14.45l-.55 1.63a2 2 0 0 0-.07.91c.05.298.174.58.36.82c.183.25.428.45.71.58c.265.126.557.184.85.17h1.49a.38.38 0 0 1 .25.08a.34.34 0 0 1 .14.21l.43 1.51a2 2 0 0 0 .46.8a1.89 1.89 0 0 0 2.54.17l1.15-.91a.39.39 0 0 1 .49 0l1.13.9c.24.202.53.337.84.39c.113.01.227.01.34 0a1.9 1.9 0 0 0 .58-.09a1.871 1.871 0 0 0 1.24-1.28l.44-1.52a.34.34 0 0 1 .14-.21a.4.4 0 0 1 .27-.08h1.43a2 2 0 0 0 .89-.17a1.911 1.911 0 0 0 1.06-1.4a1.92 1.92 0 0 0-.07-.92l-.54-1.62a.36.36 0 0 1 0-.25a.35.35 0 0 1 .14-.2l1.33-1a1.87 1.87 0 0 0 .57-.68a1.82 1.82 0 0 0 .21-.86a1.881 1.881 0 0 0-.23-.78m-5.44-.76l-4.42 4.42a2.011 2.011 0 0 1-.59.4c-.222.09-.46.138-.7.14a1.711 1.711 0 0 1-.71-.15a1.863 1.863 0 0 1-.6-.4l-2.18-2.19a1 1 0 0 1 1.41-1.41l2.08 2.08l4.3-4.31a1 1 0 0 1 1.41 0a.998.998 0 0 1 0 1.46z"
    />
  </Svg>
);

const DownFill = ({ color = '#000000', size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G fill="none" fillRule="evenodd">
      <Path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
      <Path
        fill={color}
        d="M13.06 16.06a1.5 1.5 0 0 1-2.12 0l-5.658-5.656a1.5 1.5 0 1 1 2.122-2.121L12 12.879l4.596-4.596a1.5 1.5 0 0 1 2.122 2.12l-5.657 5.658Z"
      />
    </G>
  </Svg>
);

const GroupFill = ({ color = '#000000', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G fill="none">
      <Path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
      <Path
        fill={color}
        d="M13 13a4 4 0 0 1 4 4v1.5a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 2 18.5V17a4 4 0 0 1 4-4h7Zm6 0a3 3 0 0 1 3 3v1.5a1.5 1.5 0 0 1-1.5 1.5H19v-2a4.992 4.992 0 0 0-2-4h2ZM9.5 3a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9ZM18 6a3 3 0 1 1 0 6a3 3 0 0 1 0-6Z"
      />
    </G>
  </Svg>
);

const Heart = ({ color = '#EF4444', size = 18 }) => (
  <Svg width={size} height={size} viewBox="0 0 512 512">
    <Path
      fill={color}
      d="m241 87.1l15 20.7l15-20.7C296 52.5 336.2 32 378.9 32C452.4 32 512 91.6 512 165.1v2.6c0 112.2-139.9 242.5-212.9 298.2c-12.4 9.4-27.6 14.1-43.1 14.1s-30.8-4.6-43.1-14.1C139.9 410.2 0 279.9 0 167.7v-2.6C0 91.6 59.6 32 133.1 32C175.8 32 216 52.5 241 87.1"
    />
  </Svg>
);

const CloseFill = ({ color = '#000000', size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
    />
  </Svg>
);

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [hasMessages, setHasMessages] = useState(true);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerScrollRef = useRef(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#F0F0F0',
    cardBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    cardBorder: isDarkMode ? '#333333' : '#E0E0E0',
    requestBg: isDarkMode ? '#1A1A1A' : '#F8F9FA',
    hashtag: '#3B82F6',
    iconActive: isDarkMode ? '#FFFFFF' : '#000000',
    iconInactive: isDarkMode ? '#666666' : '#BDBDBD',
    menuBg: isDarkMode ? '#1F1F1F' : '#FFFFFF',
    modalOverlay: 'rgba(0, 0, 0, 0.4)',
    toast: isDarkMode ? 'rgba(31, 31, 31, 0.95)' : 'rgba(51, 51, 51, 0.95)',
    badge: '#EF4444',
  };

  // Configuration bannière (sera remplacée par les données backend)
  const [bannerConfig] = useState({
    enabled: true,
    banners: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
        label: 'Promo -50%',
        link: 'https://example.com/promo1',
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
        label: 'Nouveautés',
        link: 'https://example.com/nouveautes',
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        label: 'Best Sellers',
        link: 'https://example.com/bestsellers',
      },
    ],
  });

  const [feedItems] = useState([
    {
      type: 'product',
      id: 'p1',
      title: 'Nike Air Force 1',
      category: 'Sneakers',
      price: '5 000',
      originalPrice: '7 500',
      discount: 33,
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      status: 'available',
      isLarge: true,
      isFollowed: true,
      isLiked: false,
    },
    {
      type: 'request',
      id: 'r1',
      userImage: 'https://i.pravatar.cc/150?img=12',
      username: '@marie_style',
      verified: true,
      image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80',
      text: 'Cherche Nike Air Max en bon état, pointure 42 #nike #sneakers #airmax',
      hasImage: true,
      isFollowed: false,
    },
    {
      type: 'product',
      id: 'p2',
      title: 'iPhone 13 Pro Max',
      category: 'Smartphone',
      price: '45 000',
      originalPrice: '50 000',
      discount: 10,
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&q=80',
      status: 'available',
      isLarge: false,
      isFollowed: false,
      isLiked: true,
    },
    {
      type: 'product',
      id: 'p3',
      title: 'MacBook Pro M1',
      category: 'Laptop',
      price: '85 000',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
      status: 'available',
      isLarge: false,
      isFollowed: true,
      isLiked: true,
    },
    {
      type: 'request',
      id: 'r2',
      userImage: 'https://i.pravatar.cc/150?img=33',
      username: '@gamer_pro',
      verified: false,
      image: null,
      text: 'Cherche PS5 en bon état, de préférence avec boîte et accessoires complets #ps5 #gaming #console',
      hasImage: false,
      isFollowed: true,
    },
    {
      type: 'product',
      id: 'p4',
      title: 'AirPods Pro 2',
      category: 'Audio',
      price: '12 000',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500&q=80',
      status: 'available',
      isLarge: true,
      isFollowed: false,
      isLiked: false,
    },
    {
      type: 'request',
      id: 'r3',
      userImage: 'https://i.pravatar.cc/150?img=8',
      username: '@tech_lover',
      verified: true,
      image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&q=80',
      text: 'Recherche MacBook Pro pour développement #macbook #apple #laptop',
      hasImage: true,
      isFollowed: true,
    },
  ]);

  const getFilteredItems = () => {
    let items = feedItems.filter((item) => item.type !== 'product' || item.status === 'available');

    if (activeFilter === 'followed') {
      items = items.filter((item) => item.isFollowed);
    } else if (activeFilter === 'liked') {
      items = items.filter((item) => item.type === 'product' && item.isLiked);
    }

    return items;
  };

  const availableItems = getFilteredItems();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (showToast) {
      setTimeout(() => setShowToast(null), 2500);
    }
  }, [showToast]);

  const showSuccessToast = (message) => {
    setShowToast(message);
  };

  const handleCart = () => {
    // Navigation vers le panier
    if (navigation) {
      navigation.navigate('Cart');
    }
  };

  const handleNotifications = () => {
    setHasNotifications(false);
    // Navigation vers les notifications
    if (navigation) {
      navigation.navigate('Notifications');
    }
  };

  const handleProductPress = (item) => {
    // Navigation vers le détail du produit
    if (navigation) {
      navigation.navigate('ProductDetail', { product: item });
    }
  };

  const handleRequestPress = (item) => {
    // Navigation vers le détail de la requête
    if (navigation) {
      navigation.navigate('RequestDetail', { request: item });
    }
  };

  const handleFilterSelect = (filter) => {
    setActiveFilter(filter);
    setShowFilterModal(false);
    showSuccessToast(`Filtre "${filter === 'followed' ? 'Suivies' : 'Aimés'}" appliqué`);
  };

  const handleRemoveFilter = () => {
    setActiveFilter(null);
    setShowFilterModal(false);
    showSuccessToast('Filtre retiré');
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'messages') {
      setHasMessages(false);
    }
    // Navigation vers les différents onglets
    if (navigation) {
      if (tab === 'explore') navigation.navigate('Explore');
      if (tab === 'add') navigation.navigate('CreatePost');
      if (tab === 'messages') navigation.navigate('Messages');
      if (tab === 'profile') navigation.navigate('Profile');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleBannerPress = async (banner) => {
    try {
      const supported = await Linking.canOpenURL(banner.link);
      if (supported) {
        await Linking.openURL(banner.link);
      }
    } catch (error) {
      console.error("Erreur lors de l'ouverture du lien:", error);
    }
  };

  const onBannerScroll = (event) => {
    const slideSize = SCREEN_WIDTH - 8;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentBannerIndex(index);
  };

  const parseTextWithHashtags = (text) => {
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <Text key={index} style={{ color: colors.hashtag, fontWeight: '600' }}>
            {part}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  const renderBanner = () => {
    if (!bannerConfig.enabled || bannerConfig.banners.length === 0) {
      return null;
    }

    return (
      <View style={styles.bannerWrapper}>
        <FlatList
          ref={bannerScrollRef}
          data={bannerConfig.banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onBannerScroll}
          scrollEventThrottle={16}
          snapToInterval={SCREEN_WIDTH - 8}
          decelerationRate="fast"
          contentContainerStyle={styles.bannerFlatList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bannerSlide}
              onPress={() => handleBannerPress(item)}
              activeOpacity={0.9}
            >
              <Image source={{ uri: item.image }} style={styles.bannerImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.bannerGradient}
              />
              <View style={styles.bannerLabelContainer}>
                <Text style={styles.bannerLabel}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {bannerConfig.banners.length > 1 && (
          <View style={styles.bannerIndicators}>
            {bannerConfig.banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.bannerDot,
                  {
                    backgroundColor: '#FFFFFF',
                    opacity: currentBannerIndex === index ? 1 : 0.5,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderProduct = (item, isLeft) => {
    const titleLength = item.title.length;
    const priceLength = `${item.price} ${item.currency}`.length;
    const shouldReduceText = titleLength > 20 || priceLength > 15;

    return (
      <TouchableOpacity
        style={[styles.productCard, isLeft ? styles.itemLeft : styles.itemRight]}
        onPress={() => handleProductPress(item)}
        activeOpacity={0.9}
        key={item.id}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        />

        <View style={styles.productInfoOverlay}>
          <View style={styles.productTextSection}>
            <Text
              style={[styles.productName, shouldReduceText && styles.productNameSmall]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {item.discount ? (
              <View style={styles.priceRow}>
                <Text style={[styles.originalPrice, shouldReduceText && styles.originalPriceSmall]}>
                  {item.originalPrice}
                </Text>
                <Text style={[styles.priceText, shouldReduceText && styles.priceTextSmall]}>
                  {item.price} {item.currency}
                </Text>
              </View>
            ) : (
              <Text style={[styles.priceText, shouldReduceText && styles.priceTextSmall]}>
                {item.price} {item.currency}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRequest = (item) => {
    return (
      <View style={styles.requestWrapper} key={item.id}>
        <TouchableOpacity
          style={[
            styles.requestCard,
            { backgroundColor: colors.requestBg, borderColor: colors.cardBorder },
          ]}
          onPress={() => handleRequestPress(item)}
          activeOpacity={0.9}
        >
          {item.hasImage && <Image source={{ uri: item.image }} style={styles.requestThumbnail} />}

          <View style={styles.requestContent}>
            <View style={styles.requestHeader}>
              <Image source={{ uri: item.userImage }} style={styles.userAvatar} />
              <Text style={[styles.username, { color: colors.text }]}>{item.username}</Text>
              {item.verified && <VerifiedCheckFill color="#3B82F6" size={14} />}
            </View>

            <Text style={[styles.requestText, { color: colors.text }]} numberOfLines={2}>
              {parseTextWithHashtags(item.text)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderSkeleton = () => {
    return (
      <View style={styles.skeletonContainer}>
        <View style={styles.row}>
          <View
            style={[
              styles.skeletonCard,
              styles.itemLeft,
              { backgroundColor: isDarkMode ? '#2A2A2A' : '#E0E0E0' },
            ]}
          />
          <View
            style={[
              styles.skeletonCard,
              styles.itemRight,
              { backgroundColor: isDarkMode ? '#2A2A2A' : '#E0E0E0' },
            ]}
          />
        </View>
        <View
          style={[styles.skeletonRequest, { backgroundColor: isDarkMode ? '#2A2A2A' : '#E0E0E0' }]}
        />
        <View style={styles.row}>
          <View
            style={[
              styles.skeletonCard,
              styles.itemLeft,
              { backgroundColor: isDarkMode ? '#2A2A2A' : '#E0E0E0' },
            ]}
          />
          <View
            style={[
              styles.skeletonCard,
              styles.itemRight,
              { backgroundColor: isDarkMode ? '#2A2A2A' : '#E0E0E0' },
            ]}
          />
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeleton();
    }

    const rows = [];
    let currentRow = [];
    let productIndex = 0;

    availableItems.forEach((item, index) => {
      if (item.type === 'request') {
        if (currentRow.length > 0) {
          rows.push(
            <View style={styles.row} key={`row-${index}`}>
              {currentRow}
            </View>
          );
          currentRow = [];
          productIndex = 0;
        }
        rows.push(renderRequest(item));
      } else if (item.type === 'product') {
        const isLeft = productIndex % 2 === 0;
        currentRow.push(renderProduct(item, isLeft));
        productIndex++;

        if (currentRow.length === 2) {
          rows.push(
            <View style={styles.row} key={`row-${index}`}>
              {currentRow}
            </View>
          );
          currentRow = [];
        }
      }
    });

    if (currentRow.length > 0) {
      rows.push(
        <View style={styles.row} key={`row-last`}>
          {currentRow}
        </View>
      );
    }

    return rows;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.logoWrapper}>
            <Text style={[styles.logo, { color: colors.text }]}>WOY</Text>
            {activeFilter && (
              <View style={[styles.filterIndicator, { backgroundColor: colors.badge }]} />
            )}
          </View>
          <DownFill color={colors.text} size={14} />
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={handleNotifications} style={styles.iconButton}>
            <Bell color={colors.text} size={24} />
            {hasNotifications && (
              <View style={[styles.notificationBadge, { backgroundColor: colors.badge }]} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCart} style={styles.iconButton}>
            <ShoppingCart color={colors.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {renderBanner()}
        {renderContent()}
      </ScrollView>

      <View
        style={[
          styles.bottomNav,
          { backgroundColor: colors.background, borderTopColor: colors.border },
        ]}
      >
        <TouchableOpacity style={styles.navButton} onPress={() => handleTabPress('home')}>
          <Home24Filled
            color={activeTab === 'home' ? colors.iconActive : colors.iconInactive}
            size={26}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => handleTabPress('explore')}>
          <SearchCategorySolid
            color={activeTab === 'explore' ? colors.iconActive : colors.iconInactive}
            size={24}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => handleTabPress('add')}>
          <AddSquareSolid
            color={activeTab === 'add' ? colors.iconActive : colors.iconInactive}
            size={25}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => handleTabPress('messages')}>
          <View>
            <MessageDotsFill
              color={activeTab === 'messages' ? colors.iconActive : colors.iconInactive}
              size={28}
            />
            {hasMessages && (
              <View style={[styles.messagesBadge, { backgroundColor: colors.badge }]} />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => handleTabPress('profile')}>
          <ProfileFillNav
            color={activeTab === 'profile' ? colors.iconActive : colors.iconInactive}
            size={28}
          />
        </TouchableOpacity>
      </View>

      {showToast && (
        <View style={[styles.toastContainer, { backgroundColor: colors.toast }]}>
          <Text style={styles.toastText}>{showToast}</Text>
        </View>
      )}

      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.filterModal, { backgroundColor: colors.menuBg }]}>
              <TouchableOpacity
                style={styles.filterOption}
                onPress={() => handleFilterSelect('followed')}
              >
                <GroupFill color={colors.text} size={18} />
                <Text style={[styles.filterOptionText, { color: colors.text }]}>Suivies</Text>
                {activeFilter === 'followed' && (
                  <TouchableOpacity
                    style={styles.removeFilterButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleRemoveFilter();
                    }}
                  >
                    <CloseFill color={colors.text} size={16} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              <View style={[styles.filterDivider, { backgroundColor: colors.border }]} />

              <TouchableOpacity
                style={styles.filterOption}
                onPress={() => handleFilterSelect('liked')}
              >
                <Heart color="#EF4444" size={18} />
                <Text style={[styles.filterOptionText, { color: colors.text }]}>Aimés</Text>
                {activeFilter === 'liked' && (
                  <TouchableOpacity
                    style={styles.removeFilterButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleRemoveFilter();
                    }}
                  >
                    <CloseFill color={colors.text} size={16} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
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

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  logoWrapper: {
    position: 'relative',
  },

  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 2,
  },

  filterIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 2,
    right: -3,
  },

  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },

  iconButton: {
    padding: 4,
    position: 'relative',
  },

  notificationBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 5,
    right: 5,
  },

  messagesBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    right: 0,
  },

  scrollView: {
    flex: 1,
  },

  feedContent: {
    paddingBottom: 80,
  },

  bannerWrapper: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    position: 'relative',
  },

  bannerFlatList: {
    paddingHorizontal: 0,
  },

  bannerSlide: {
    width: SCREEN_WIDTH - 8,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },

  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },

  bannerLabelContainer: {
    position: 'absolute',
    bottom: 10,
    left: 12,
  },

  bannerLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  bannerIndicators: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    flexDirection: 'row',
    gap: 5,
  },

  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  skeletonContainer: {
    padding: 4,
  },

  skeletonCard: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: 10,
  },

  skeletonRequest: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    marginVertical: 4,
    marginHorizontal: 4,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingHorizontal: 4,
  },

  itemLeft: {
    marginRight: 2,
  },

  itemRight: {
    marginLeft: 2,
  },

  productCard: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },

  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },

  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },

  productInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  productTextSection: {
    flex: 1,
    marginRight: 8,
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },

  productNameSmall: {
    fontSize: 13,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  originalPrice: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
    textDecorationLine: 'line-through',
    textDecorationColor: '#EF4444',
    textDecorationStyle: 'solid',
  },

  originalPriceSmall: {
    fontSize: 9,
  },

  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  priceTextSmall: {
    fontSize: 10,
  },

  requestWrapper: {
    width: '100%',
    marginBottom: 4,
    paddingHorizontal: 4,
  },

  requestCard: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },

  requestThumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },

  requestContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    marginRight: 6,
  },

  username: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },

  requestText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
    fontWeight: '500',
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },

  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },

  toastContainer: {
    position: 'absolute',
    top: 70,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 60,
    paddingLeft: 16,
  },

  filterModal: {
    width: 180,
    borderRadius: 10,
    padding: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },

  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },

  filterOptionText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },

  removeFilterButton: {
    padding: 4,
  },

  filterDivider: {
    height: 1,
    marginHorizontal: 8,
  },
});
