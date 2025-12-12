import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Alert,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowBackIosRounded,
  PhoneLaptop16Filled,
  PhoneFill,
  Disconnected,
} from '../components/icons';

// ========================================
// COMPOSANT APPAREIL CONNECTÉ
// ========================================

const DeviceCard = ({ device, onDisconnect, loading, isDarkMode, isCurrentDevice }) => {
  const colors = {
    cardBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    iconBg: isDarkMode ? '#2A2A2A' : '#F5F5F5',
    currentBadge: '#10B981',
    buttonBg: isDarkMode ? '#333333' : '#F5F5F5',
    buttonText: isDarkMode ? '#FF6B6B' : '#EF4444',
  };

  const handleDisconnect = () => {
    if (isCurrentDevice) {
      Alert.alert(
        'Appareil actuel',
        "Vous ne pouvez pas déconnecter l'appareil que vous utilisez actuellement."
      );
      return;
    }

    Alert.alert(
      "Déconnecter l'appareil",
      `Voulez-vous vraiment déconnecter "${device.name}" ? Cette action fermera la session sur cet appareil.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: () => onDisconnect(device.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      <View style={styles.cardLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
          <PhoneFill color={colors.text} size={24} />
        </View>
        <View style={styles.cardInfo}>
          <View style={styles.deviceNameRow}>
            <Text style={[styles.deviceName, { color: colors.text }]} numberOfLines={1}>
              {device.name}
            </Text>
            {isCurrentDevice && (
              <View style={[styles.currentBadge, { backgroundColor: colors.currentBadge }]}>
                <Text style={styles.currentBadgeText}>Actuel</Text>
              </View>
            )}
          </View>
          <Text style={[styles.deviceDetails, { color: colors.textSecondary }]}>
            {device.location} • {device.lastActive}
          </Text>
        </View>
      </View>

      {!isCurrentDevice && (
        <TouchableOpacity
          style={[styles.disconnectButton, { backgroundColor: colors.buttonBg }]}
          onPress={handleDisconnect}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.buttonText} />
          ) : (
            <Disconnected color={colors.buttonText} size={20} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

export default function ConnectedDevicesScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    headerBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    emptyIcon: '#4A4A4A',
    dangerButton: '#EF4444',
  };

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [disconnectingId, setDisconnectingId] = useState(null);
  const [devices, setDevices] = useState([]);

  // ========================================
  // CHARGEMENT DES APPAREILS
  // ========================================

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockDevices = [
        {
          id: 'd1',
          name: 'iPhone 15 Pro',
          location: 'Paris, France',
          lastActive: 'Maintenant',
          isCurrent: true,
        },
        {
          id: 'd2',
          name: 'MacBook Pro',
          location: 'Paris, France',
          lastActive: 'Il y a 2 heures',
          isCurrent: false,
        },
        {
          id: 'd3',
          name: 'iPad Air',
          location: 'Lyon, France',
          lastActive: 'Hier',
          isCurrent: false,
        },
        {
          id: 'd4',
          name: 'Samsung Galaxy S23',
          location: 'Marseille, France',
          lastActive: 'Il y a 3 jours',
          isCurrent: false,
        },
      ];

      setDevices(mockDevices);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des appareils:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDevices();
    setRefreshing(false);
  };

  // ========================================
  // GESTION DE LA DÉCONNEXION
  // ========================================

  const handleDisconnect = async (deviceId) => {
    setDisconnectingId(deviceId);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setDevices((prev) => prev.filter((device) => device.id !== deviceId));
      Alert.alert('Succès', "L'appareil a été déconnecté avec succès.");
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur', "Impossible de déconnecter l'appareil. Veuillez réessayer.");
    } finally {
      setDisconnectingId(null);
    }
  };

  const handleDisconnectAll = () => {
    const otherDevices = devices.filter((device) => !device.isCurrent);

    if (otherDevices.length === 0) {
      Alert.alert('Information', "Il n'y a pas d'autres appareils connectés à déconnecter.");
      return;
    }

    Alert.alert(
      'Déconnecter tous les appareils',
      `Voulez-vous vraiment déconnecter ${otherDevices.length} appareil(s) ? Cette action fermera toutes les autres sessions.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter tout',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setDevices((prev) => prev.filter((device) => device.isCurrent));
            setLoading(false);
            Alert.alert('Succès', 'Tous les autres appareils ont été déconnectés.');
          },
        },
      ]
    );
  };

  // ========================================
  // NAVIGATION
  // ========================================

  const handleBack = () => {
    navigation.goBack();
  };

  // ========================================
  // RENDU
  // ========================================

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4].map((item) => (
        <View
          key={item}
          style={[styles.skeletonCard, { backgroundColor: isDarkMode ? '#1A1A1A' : '#F5F5F5' }]}
        >
          <View
            style={[styles.skeletonIcon, { backgroundColor: isDarkMode ? '#2A2A2A' : '#E0E0E0' }]}
          />
          <View style={styles.skeletonTextContainer}>
            <View
              style={[
                styles.skeletonTitle,
                { backgroundColor: isDarkMode ? '#2A2A2A' : '#E0E0E0' },
              ]}
            />
            <View
              style={[
                styles.skeletonSubtitle,
                { backgroundColor: isDarkMode ? '#2A2A2A' : '#E0E0E0' },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <PhoneLaptop16Filled color={colors.emptyIcon} size={64} />
      <Text style={[styles.emptyText, { color: colors.emptyIcon }]}>Aucun appareil connecté</Text>
    </View>
  );

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
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowBackIosRounded color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Appareils connectés</Text>
        <View style={styles.headerRight} />
      </View>

      {/* CONTENU */}
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
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Gérez les appareils connectés à votre compte. Vous pouvez déconnecter les appareils que
          vous ne reconnaissez pas.
        </Text>

        {loading ? (
          renderSkeleton()
        ) : devices.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <View style={styles.cardsContainer}>
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  onDisconnect={handleDisconnect}
                  loading={disconnectingId === device.id}
                  isDarkMode={isDarkMode}
                  isCurrentDevice={device.isCurrent}
                />
              ))}
            </View>

            {/* BOUTON DÉCONNECTER TOUT */}
            {devices.filter((d) => !d.isCurrent).length > 0 && (
              <TouchableOpacity
                style={[styles.disconnectAllButton, { backgroundColor: colors.dangerButton }]}
                onPress={handleDisconnectAll}
                activeOpacity={0.8}
              >
                <Text style={styles.disconnectAllButtonText}>
                  Déconnecter tous les autres appareils
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
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
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 24,
  },
  cardsContainer: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '600',
    flexShrink: 1,
  },
  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  deviceDetails: {
    fontSize: 12,
    marginTop: 2,
  },
  disconnectButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnectAllButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  disconnectAllButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  skeletonContainer: {
    gap: 12,
  },
  skeletonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  skeletonIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeletonTitle: {
    width: '60%',
    height: 16,
    borderRadius: 4,
    marginBottom: 6,
  },
  skeletonSubtitle: {
    width: '80%',
    height: 12,
    borderRadius: 4,
  },
});
