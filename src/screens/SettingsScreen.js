import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  useColorScheme,
  StatusBar,
  Linking,
  TextInput,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  SunFill,
  DarkModeRounded,
  SettingAltFill,
  VerifiedCheckFill,
  DonateHeart,
  Logout1Solid,
  Trash,
  SquareInstagram,
  TiktokSolid,
  Youtube,
  Facebook1Solid,
  SquareXTwitter,
  PinterestSquare,
  ArrowBackIosRounded,
} from '../components/icons';

export default function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const systemColorScheme = useColorScheme();
  const [displayMode, setDisplayMode] = useState('auto');

  // Calcul du mode effectif
  const effectiveColorScheme = displayMode === 'auto' ? systemColorScheme : displayMode;
  const isDarkMode = effectiveColorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#121212' : '#F5F5F5',
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    headerBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  };

  // États des paramètres
  const [language, setLanguage] = useState('fr');
  const [currency, setCurrency] = useState('HTG');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);

  // Modal suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  // Données utilisateur
  const [userData] = useState({
    accountAge: 45,
    lastActive: 2,
    hasCompletedProfile: true,
    hasPublishedContent: true,
    recentReportDays: null,
    isVerified: false,
    canRequestVerification: true,
  });

  // Social links
  const socialLinks = {
    instagram: 'https://www.instagram.com/whats.on.you?igsh=dGkxOHV2enlpYXM5&utm_source=qr',
    tiktok: 'https://www.tiktok.com/@whats.on.you?_r=1&_t=ZM-91MLfRI1zWC',
    youtube: 'https://youtube.com/@whatsonyou?si=J7GpkwTFvpAgEQq6',
    facebook: 'https://www.facebook.com/share/17XkKxHKHi/?mibextid=wwXIfr',
    twitter: 'https://x.com/whats_on_you?s=21',
    pinterest: 'https://pin.it/6TfPjzvol',
  };

  // Handlers
  const handleBack = () => {
    navigation.goBack();
  };

  const handleDisplayModeChange = (mode) => {
    setDisplayMode(mode);
    let modeText = 'automatique';
    if (mode === 'light') modeText = 'clair';
    if (mode === 'dark') modeText = 'sombre';
    Alert.alert('✓ Apparence modifiée', `Le mode ${modeText} a été activé`);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    Alert.alert('✓ Langue modifiée', `La langue a été changée en ${lang === 'fr' ? 'Français' : 'English'}`);
  };

  const handleCurrencyChange = (curr) => {
    setCurrency(curr);
    Alert.alert('✓ Devise modifiée', `La devise a été changée en ${curr}`);
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleEditEmail = () => {
    navigation.navigate('EditEmail');
  };

  const handleEditPassword = () => {
    navigation.navigate('EditPassword');
  };

  const handleRequestVerification = () => {
    navigation.navigate('VerificationRequest');
  };

  const handleSocialConnections = () => {
    navigation.navigate('SocialConnections');
  };

  const handlePurchases = () => {
    navigation.navigate('Purchases');
  };

  const handleSales = () => {
    navigation.navigate('Sales');
  };

  const handleReviewsRatings = () => {
    navigation.navigate('Reviews', { isOwner: true });
  };

  const handleGeolocationToggle = (value) => {
    setGeolocationEnabled(value);
    if (!value) {
      Alert.alert(
        '⚠ Géolocalisation désactivée',
        'La carte et les fonctionnalités de distance seront indisponibles.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('✓ Géolocalisation activée', 'Les fonctionnalités de carte sont maintenant disponibles');
    }
  };

  const handleNotificationToggle = (type, value) => {
    if (type === 'push') {
      setPushNotifications(value);
      Alert.alert(
        value ? '✓ Notifications activées' : '⚠ Notifications désactivées',
        value ? 'Vous recevrez les notifications push' : 'Vous ne recevrez plus de notifications push'
      );
    } else {
      setEmailNotifications(value);
      Alert.alert(
        value ? '✓ Notifications email activées' : '⚠ Notifications email désactivées',
        value ? 'Vous recevrez les notifications par email' : 'Vous ne recevrez plus de notifications par email'
      );
    }
  };

  const handlePrivacyToggle = (value) => {
    setPrivateProfile(value);
    Alert.alert(
      value ? '✓ Profil privé activé' : '✓ Profil public',
      value ? 'Votre profil est maintenant privé' : 'Votre profil est maintenant public'
    );
  };

  const handle2FAToggle = (value) => {
    setTwoFactorAuth(value);
    if (value) {
      Alert.alert('✓ 2FA activée', 'L\'authentification à deux facteurs est maintenant activée');
    } else {
      Alert.alert('⚠ 2FA désactivée', 'L\'authentification à deux facteurs a été désactivée');
    }
  };

  const handleBlockedUsers = () => {
    navigation.navigate('BlockedUsers');
  };

  const handleConnectedDevices = () => {
    navigation.navigate('ConnectedDevices');
  };

  const handleLoginHistory = () => {
    navigation.navigate('LoginHistory');
  };

  const handleTerms = () => {
    navigation.navigate('Terms');
  };

  const handlePrivacy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const handleHelp = () => {
    navigation.navigate('HelpCenter');
  };

  const handleContact = () => {
    navigation.navigate('ContactUs');
  };

  const handleOpenSocialLink = (platform) => {
    Linking.openURL(socialLinks[platform]).catch(() => {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le lien');
    });
  };

  const handleDonate = () => {
    Alert.alert(
      '💖 Nous soutenir',
      'Votre contribution nous aide à maintenir et améliorer la plateforme pour toute la communauté. Merci de votre soutien !',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Continuer', onPress: () => navigation.navigate('Donate') }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnecter', style: 'destructive', onPress: () => navigation.navigate('Login') }
      ]
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    if (!deleteEmail.trim() || !deletePassword.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    // Validation basique email
    if (!deleteEmail.includes('@')) {
      Alert.alert('Erreur', 'Adresse email invalide');
      return;
    }

    setShowDeleteModal(false);
    setDeleteEmail('');
    setDeletePassword('');

    Alert.alert(
      'Compte supprimé',
      'Votre compte a été définitivement supprimé.',
      [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.headerBg}
        translucent={false}
      />

      {/* Header */}
      <View style={[styles.safeArea, { backgroundColor: colors.headerBg, paddingTop: insets.top }]}>
        <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleBack}>
            <ArrowBackIosRounded color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Paramètres</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* COMPTE */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Compte</Text>

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Modifier profil</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleEditEmail}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Email</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleEditPassword}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Mot de passe</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleSocialConnections}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Connexion sociale</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Bouton vérification */}
          {userData.canRequestVerification && !userData.isVerified && (
            <TouchableOpacity style={styles.verificationButton} onPress={handleRequestVerification}>
              <VerifiedCheckFill color="#FFFFFF" size={18} />
              <Text style={styles.verificationButtonText}>Demander la vérification</Text>
            </TouchableOpacity>
          )}

          {userData.isVerified && (
            <View style={styles.verifiedBadgeContainer}>
              <VerifiedCheckFill color="#22C55E" size={18} />
              <Text style={styles.verifiedBadgeText}>Compte vérifié</Text>
            </View>
          )}
        </View>

        {/* ACHATS & VENTES */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Transactions</Text>

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <TouchableOpacity style={styles.settingItem} onPress={handlePurchases}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Mes achats</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleSales}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Mes ventes</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleReviewsRatings}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Notes et avis</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PRÉFÉRENCES */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Préférences</Text>

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            {/* Apparence */}
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Apparence</Text>
              <View style={styles.displayModeButtons}>
                <TouchableOpacity
                  style={[styles.displayModeButton, { borderColor: colors.border, backgroundColor: colors.cardBg }, displayMode === 'light' && { backgroundColor: colors.text, borderColor: colors.text }]}
                  onPress={() => handleDisplayModeChange('light')}
                >
                  <SunFill color={displayMode === 'light' ? colors.cardBg : colors.text} size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.displayModeButton, { borderColor: colors.border, backgroundColor: colors.cardBg }, displayMode === 'dark' && { backgroundColor: colors.text, borderColor: colors.text }]}
                  onPress={() => handleDisplayModeChange('dark')}
                >
                  <DarkModeRounded color={displayMode === 'dark' ? colors.cardBg : colors.text} size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.displayModeButton, { borderColor: colors.border, backgroundColor: colors.cardBg }, displayMode === 'auto' && { backgroundColor: colors.text, borderColor: colors.text }]}
                  onPress={() => handleDisplayModeChange('auto')}
                >
                  <SettingAltFill color={displayMode === 'auto' ? colors.cardBg : colors.text} size={20} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Langue */}
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Langue</Text>
              <View style={styles.languageButtons}>
                <TouchableOpacity
                  style={[styles.languageButton, { borderColor: colors.border, backgroundColor: colors.cardBg }, language === 'fr' && { backgroundColor: colors.text, borderColor: colors.text }]}
                  onPress={() => handleLanguageChange('fr')}
                >
                  <Text style={[styles.languageButtonText, { color: colors.text }, language === 'fr' && { color: colors.cardBg }]}>
                    FR
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.languageButton, { borderColor: colors.border, backgroundColor: colors.cardBg }, language === 'en' && { backgroundColor: colors.text, borderColor: colors.text }]}
                  onPress={() => handleLanguageChange('en')}
                >
                  <Text style={[styles.languageButtonText, { color: colors.text }, language === 'en' && { color: colors.cardBg }]}>
                    EN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Devise */}
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Devise</Text>
              <View style={styles.languageButtons}>
                <TouchableOpacity
                  style={[styles.languageButton, { borderColor: colors.border, backgroundColor: colors.cardBg }, currency === 'HTG' && { backgroundColor: colors.text, borderColor: colors.text }]}
                  onPress={() => handleCurrencyChange('HTG')}
                >
                  <Text style={[styles.languageButtonText, { color: colors.text }, currency === 'HTG' && { color: colors.cardBg }]}>
                    HTG
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.languageButton, { borderColor: colors.border, backgroundColor: colors.cardBg }, currency === 'USD' && { backgroundColor: colors.text, borderColor: colors.text }]}
                  onPress={() => handleCurrencyChange('USD')}
                >
                  <Text style={[styles.languageButtonText, { color: colors.text }, currency === 'USD' && { color: colors.cardBg }]}>
                    USD
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Géolocalisation */}
            <View style={styles.settingItem}>
              <View style={styles.settingLabelContainer}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Géolocalisation</Text>
                {!geolocationEnabled && (
                  <Text style={styles.warningText}>Carte et distances indisponibles</Text>
                )}
              </View>
              <Switch
                value={geolocationEnabled}
                onValueChange={handleGeolocationToggle}
                trackColor={{ false: colors.border, true: colors.text }}
                thumbColor={colors.cardBg}
              />
            </View>

            {/* Notifications push */}
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications push</Text>
              <Switch
                value={pushNotifications}
                onValueChange={(value) => handleNotificationToggle('push', value)}
                trackColor={{ false: colors.border, true: colors.text }}
                thumbColor={colors.cardBg}
              />
            </View>

            {/* Notifications email */}
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications email</Text>
              <Switch
                value={emailNotifications}
                onValueChange={(value) => handleNotificationToggle('email', value)}
                trackColor={{ false: colors.border, true: colors.text }}
                thumbColor={colors.cardBg}
              />
            </View>
          </View>
        </View>

        {/* CONFIDENTIALITÉ */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Confidentialité</Text>

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Profil privé</Text>
              <Switch
                value={privateProfile}
                onValueChange={handlePrivacyToggle}
                trackColor={{ false: colors.border, true: colors.text }}
                thumbColor={colors.cardBg}
              />
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={handleBlockedUsers}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Utilisateurs bloqués</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SÉCURITÉ */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Sécurité</Text>

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Authentification à 2 facteurs</Text>
              <Switch
                value={twoFactorAuth}
                onValueChange={handle2FAToggle}
                trackColor={{ false: colors.border, true: colors.text }}
                thumbColor={colors.cardBg}
              />
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={handleConnectedDevices}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Appareils connectés</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleLoginHistory}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Historique de connexion</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SUIVEZ-NOUS */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Suivez-nous</Text>

          <View style={[styles.socialContainer, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleOpenSocialLink('instagram')}>
              <SquareInstagram color={colors.text} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleOpenSocialLink('tiktok')}>
              <TiktokSolid color={colors.text} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleOpenSocialLink('youtube')}>
              <Youtube color={colors.text} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleOpenSocialLink('facebook')}>
              <Facebook1Solid color={colors.text} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleOpenSocialLink('twitter')}>
              <SquareXTwitter color={colors.text} size={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => handleOpenSocialLink('pinterest')}>
              <PinterestSquare color={colors.text} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* À PROPOS */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>À propos</Text>

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Version</Text>
              <Text style={[styles.settingValueGray, { color: colors.textSecondary }]}>1.0.0</Text>
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={handleTerms}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Conditions d'utilisation</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handlePrivacy}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Politique de confidentialité</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleHelp}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Centre d'aide</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} onPress={handleContact}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Nous contacter</Text>
              <Text style={[styles.settingValue, { color: colors.text }]}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SOUTENIR LE PROJET */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.donateButton} onPress={handleDonate}>
            <DonateHeart color="#FFFFFF" size={20} />
            <Text style={styles.donateButtonText}>Nous soutenir</Text>
          </TouchableOpacity>
        </View>

        {/* ACTIONS */}
        <View style={styles.section}>
          <TouchableOpacity style={[styles.logoutButton, { borderColor: colors.text, backgroundColor: colors.cardBg }]} onPress={handleLogout}>
            <Logout1Solid color={colors.text} size={20} />
            <Text style={[styles.logoutButtonText, { color: colors.text }]}>Se déconnecter</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Trash color="#FFFFFF" size={20} />
            <Text style={styles.deleteButtonText}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal Suppression Compte */}
      <Modal visible={showDeleteModal} transparent={true} animationType="fade" onRequestClose={() => setShowDeleteModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg }]}>
            <View style={styles.modalHeader}>
              <Trash color="#EF4444" size={24} />
              <Text style={[styles.modalTitle, { color: colors.text }]}>Supprimer mon compte</Text>
            </View>

            <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
              Pour confirmer la suppression de votre compte, veuillez entrer votre adresse mail et votre mot de passe.
            </Text>

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Adresse email"
              placeholderTextColor={colors.textSecondary}
              value={deleteEmail}
              onChangeText={setDeleteEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Mot de passe"
              placeholderTextColor={colors.textSecondary}
              value={deletePassword}
              onChangeText={setDeletePassword}
              secureTextEntry
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel, { borderColor: colors.border, backgroundColor: colors.cardBg }]}
                onPress={() => {
                  setShowDeleteModal(false);
                  setDeleteEmail('');
                  setDeletePassword('');
                }}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={confirmDeleteAccount}
              >
                <Text style={styles.modalButtonDeleteText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {},
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '600', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 },
  card: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16 },
  settingLabelContainer: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '500' },
  warningText: { fontSize: 11, color: '#EF4444', marginTop: 2 },
  settingValue: { fontSize: 16, fontWeight: '600' },
  settingValueGray: { fontSize: 14 },
  displayModeButtons: { flexDirection: 'row', gap: 8 },
  displayModeButton: { width: 40, height: 40, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  languageButtons: { flexDirection: 'row', gap: 8 },
  languageButton: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6, borderWidth: 1 },
  languageButtonText: { fontSize: 13, fontWeight: '600' },
  verificationButton: { backgroundColor: '#3B82F6', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 12, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  verificationButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  verifiedBadgeContainer: { backgroundColor: '#E8F5E9', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 12, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  verifiedBadgeText: { color: '#22C55E', fontSize: 14, fontWeight: '600' },
  socialContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, gap: 6 },
  socialButton: { width: '31%', alignItems: 'center', paddingVertical: 6 },
  donateButton: { backgroundColor: '#FF69B4', paddingVertical: 14, borderRadius: 50, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, shadowColor: '#FF69B4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 },
  donateButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
  logoutButton: { borderWidth: 1, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  logoutButtonText: { fontSize: 15, fontWeight: '600' },
  deleteButton: { backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 8, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  deleteButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalContent: { width: '100%', borderRadius: 16, padding: 24, maxWidth: 400 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalDescription: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  modalInput: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalButtonCancel: { borderWidth: 1 },
  modalButtonText: { fontSize: 15, fontWeight: '600' },
  modalButtonDelete: { backgroundColor: '#EF4444' },
  modalButtonDeleteText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
