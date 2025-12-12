import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowBackIosRounded,
  Google,
  Facebook,
} from '../components/icons';

// ========================================
// COMPOSANT CONNEXION SOCIALE
// ========================================

const SocialConnectionCard = ({ provider, icon: Icon, isConnected, onConnect, onDisconnect, loading, isDarkMode }) => {
  const colors = {
    cardBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    buttonAdd: isDarkMode ? '#FFFFFF' : '#000000',
    buttonAddText: isDarkMode ? '#000000' : '#FFFFFF',
    buttonRemove: isDarkMode ? '#333333' : '#F5F5F5',
    buttonRemoveText: isDarkMode ? '#FFFFFF' : '#000000',
  };

  const handleAction = () => {
    if (isConnected) {
      Alert.alert(
        'Retirer le compte',
        `Êtes-vous sûr de vouloir retirer votre compte ${provider} ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Retirer',
            style: 'destructive',
            onPress: onDisconnect,
          },
        ]
      );
    } else {
      onConnect();
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      <View style={styles.cardLeft}>
        <View style={styles.iconContainer}>
          <Icon size={24} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{provider}</Text>
          {isConnected && (
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>Connecté</Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          {
            backgroundColor: isConnected ? colors.buttonRemove : colors.buttonAdd,
          },
        ]}
        onPress={handleAction}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={isConnected ? colors.buttonRemoveText : colors.buttonAddText}
          />
        ) : (
          <Text
            style={[
              styles.actionButtonText,
              {
                color: isConnected ? colors.buttonRemoveText : colors.buttonAddText,
              },
            ]}
          >
            {isConnected ? 'Retirer' : 'Ajouter'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

export default function SocialConnectionsScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    headerBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    border: isDarkMode ? '#333333' : '#E0E0E0',
  };

  // États des connexions
  const [connections, setConnections] = useState({
    google: {
      connected: false,
      externalId: null,
      loading: false,
    },
    apple: {
      connected: false,
      externalId: null,
      loading: false,
    },
    facebook: {
      connected: false,
      externalId: null,
      loading: false,
    },
  });

  // ========================================
  // GESTION DE LA CONNEXION
  // ========================================

  const handleConnect = async (provider) => {
    setConnections((prev) => ({
      ...prev,
      [provider]: { ...prev[provider], loading: true },
    }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const externalId = `${provider}_${Math.random().toString(36).substr(2, 9)}`;

      setConnections((prev) => ({
        ...prev,
        [provider]: {
          connected: true,
          externalId: externalId,
          loading: false,
        },
      }));

      Alert.alert('Succès', `Votre compte ${provider.charAt(0).toUpperCase() + provider.slice(1)} a été ajouté avec succès.`);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      Alert.alert('Erreur', `Impossible d'ajouter votre compte ${provider}. Veuillez réessayer.`);

      setConnections((prev) => ({
        ...prev,
        [provider]: { ...prev[provider], loading: false },
      }));
    }
  };

  // ========================================
  // GESTION DE LA DÉCONNEXION
  // ========================================

  const handleDisconnect = async (provider) => {
    setConnections((prev) => ({
      ...prev,
      [provider]: { ...prev[provider], loading: true },
    }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setConnections((prev) => ({
        ...prev,
        [provider]: {
          connected: false,
          externalId: null,
          loading: false,
        },
      }));

      Alert.alert('Succès', `Votre compte ${provider.charAt(0).toUpperCase() + provider.slice(1)} a été retiré.`);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur', `Impossible de retirer votre compte ${provider}. Veuillez réessayer.`);

      setConnections((prev) => ({
        ...prev,
        [provider]: { ...prev[provider], loading: false },
      }));
    }
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.headerBg} translucent={false} />

      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowBackIosRounded color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Connexion sociale</Text>
        <View style={styles.headerRight} />
      </View>

      {/* CONTENU */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Utilisez un moyen de connexion pour accéder rapidement à l'application. Vous pouvez le retirer à tout moment.
        </Text>

        <View style={styles.cardsContainer}>
          {/* GOOGLE */}
          <SocialConnectionCard
            provider="Google"
            icon={Google}
            isConnected={connections.google.connected}
            onConnect={() => handleConnect('google')}
            onDisconnect={() => handleDisconnect('google')}
            loading={connections.google.loading}
            isDarkMode={isDarkMode}
          />

          {/* APPLE */}
          <SocialConnectionCard
            provider="Apple"
            icon={(props) => <Ionicons name="logo-apple" size={24} color={isDarkMode ? '#FFFFFF' : '#000000'} />}
            isConnected={connections.apple.connected}
            onConnect={() => handleConnect('apple')}
            onDisconnect={() => handleDisconnect('apple')}
            loading={connections.apple.loading}
            isDarkMode={isDarkMode}
          />

          {/* FACEBOOK */}
          <SocialConnectionCard
            provider="Facebook"
            icon={Facebook}
            isConnected={connections.facebook.connected}
            onConnect={() => handleConnect('facebook')}
            onDisconnect={() => handleDisconnect('facebook')}
            loading={connections.facebook.loading}
            isDarkMode={isDarkMode}
          />
        </View>
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
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  actionButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 75,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
