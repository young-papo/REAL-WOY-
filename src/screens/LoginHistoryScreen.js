import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  StatusBar,
  useColorScheme,
  RefreshControl,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import { ArrowBackIosRounded, PhoneFill } from '../components/icons';

export default function LoginHistoryScreen({ navigation }) {
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
    iconColor: isDarkMode ? '#BDBDBD' : '#666666',
    currentBadgeText: isDarkMode ? '#999999' : '#666666',
  };

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loginHistory, setLoginHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentDeviceInfo, setCurrentDeviceInfo] = useState(null);

  useEffect(() => {
    getCurrentDeviceInfo();
    loadLoginHistory(1);
  }, []);

  const getCurrentDeviceInfo = async () => {
    const deviceName = Device.modelName || Device.deviceName || 'Appareil inconnu';
    const osName = Platform.OS === 'ios' ? 'iOS' : 'Android';

    let locationText = 'Localisation non disponible';
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const { city, country } = reverseGeocode[0];
          locationText = `${city || ''}, ${country || ''}`.replace(/, ,/g, ',').trim();
        }
      }
    } catch (error) {
      console.log('Erreur localisation:', error);
    }

    setCurrentDeviceInfo({
      name: deviceName,
      system: osName,
      location: locationText,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const generateMockHistory = (pageNum) => {
    const now = new Date();
    const itemsPerPage = 15;
    const startIndex = (pageNum - 1) * itemsPerPage;

    const history = [];
    for (let i = 0; i < itemsPerPage; i++) {
      const index = startIndex + i;
      const daysAgo = index;
      const loginDate = new Date(now);
      loginDate.setDate(now.getDate() - daysAgo);

      const devices = [
        { name: 'iPhone 14 Pro', system: 'iOS' },
        { name: 'Samsung Galaxy S23', system: 'Android' },
        { name: 'iPad Air', system: 'iOS' },
        { name: 'Google Pixel 7', system: 'Android' },
        { name: 'iPhone 13', system: 'iOS' },
        { name: 'OnePlus 11', system: 'Android' },
      ];

      const locations = [
        'Port-au-Prince, Haïti',
        'Delmas, Haïti',
        'Pétion-Ville, Haïti',
        'Carrefour, Haïti',
        'Cap-Haïtien, Haïti',
        'Saint-Marc, Haïti',
      ];

      const deviceData = devices[index % devices.length];

      history.push({
        id: `login_${pageNum}_${i}`,
        deviceName:
          index === 0 && pageNum === 1
            ? currentDeviceInfo?.name || deviceData.name
            : deviceData.name,
        system:
          index === 0 && pageNum === 1
            ? currentDeviceInfo?.system || deviceData.system
            : deviceData.system,
        date: loginDate.toISOString(),
        location:
          index === 0 && pageNum === 1
            ? currentDeviceInfo?.location || locations[index % locations.length]
            : locations[index % locations.length],
        isCurrent: index === 0 && pageNum === 1,
      });
    }

    return history;
  };

  const loadLoginHistory = async (pageNum) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newHistory = generateMockHistory(pageNum);

      if (pageNum === 1) {
        setLoginHistory(newHistory);
      } else {
        setLoginHistory((prev) => [...prev, ...newHistory]);
      }

      if (pageNum >= 5) {
        setHasMore(false);
      }

      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    await getCurrentDeviceInfo();
    await loadLoginHistory(1);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadLoginHistory(nextPage);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <View key={item} style={styles.skeletonItem}>
          <View style={[styles.skeletonIcon, { backgroundColor: colors.skeletonBg }]} />
          <View style={styles.skeletonTextContainer}>
            <View style={[styles.skeletonName, { backgroundColor: colors.skeletonBg }]} />
            <View style={[styles.skeletonSystem, { backgroundColor: colors.skeletonBg }]} />
            <View style={[styles.skeletonDate, { backgroundColor: colors.skeletonBg }]} />
            <View style={[styles.skeletonLocation, { backgroundColor: colors.skeletonBg }]} />
          </View>
        </View>
      ))}
    </View>
  );

  const renderLoginItem = ({ item }) => (
    <View style={styles.loginItem}>
      <View style={styles.iconContainer}>
        <PhoneFill color={colors.iconColor} size={20} />
      </View>
      <View style={styles.loginInfo}>
        <Text style={[styles.deviceName, { color: colors.text }]} numberOfLines={1}>
          {truncateText(item.deviceName, 30)}
        </Text>
        <Text style={[styles.systemText, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.system}
        </Text>
        <Text style={[styles.dateText, { color: colors.textSecondary }]} numberOfLines={1}>
          {formatDate(item.date)}
        </Text>
        <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
          {truncateText(item.location, 40)}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        {item.isCurrent && (
          <Text style={[styles.currentBadgeText, { color: colors.currentBadgeText }]}>
            Session actuelle
          </Text>
        )}
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <View style={styles.skeletonItem}>
          <View style={[styles.skeletonIcon, { backgroundColor: colors.skeletonBg }]} />
          <View style={styles.skeletonTextContainer}>
            <View style={[styles.skeletonName, { backgroundColor: colors.skeletonBg }]} />
            <View style={[styles.skeletonSystem, { backgroundColor: colors.skeletonBg }]} />
            <View style={[styles.skeletonDate, { backgroundColor: colors.skeletonBg }]} />
            <View style={[styles.skeletonLocation, { backgroundColor: colors.skeletonBg }]} />
          </View>
        </View>
      </View>
    );
  };

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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Historique de connexion</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={loginHistory}
          renderItem={renderLoginItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
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
        />
      )}
    </View>
  );
}

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
    alignItems: 'flex-start',
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
  listContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  loginItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  systemText: {
    fontSize: 12,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    marginBottom: 2,
  },
  locationText: {
    fontSize: 12,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  currentBadgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  skeletonContainer: {
    paddingTop: 8,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  skeletonIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  skeletonTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  skeletonName: {
    width: '60%',
    height: 15,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonSystem: {
    width: '30%',
    height: 12,
    borderRadius: 4,
    marginBottom: 4,
  },
  skeletonDate: {
    width: '35%',
    height: 12,
    borderRadius: 4,
    marginBottom: 4,
  },
  skeletonLocation: {
    width: '50%',
    height: 12,
    borderRadius: 4,
  },
  footerLoader: {
    paddingVertical: 10,
  },
});
