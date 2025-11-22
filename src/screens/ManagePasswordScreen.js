import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Alert,
  ActivityIndicator,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowBackIosRounded,
  Lock,
  MailRounded,
  ClockFilled,
} from '../components/icons';

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

export default function ManagePasswordScreen({ navigation }) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    headerBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    inputBg: isDarkMode ? '#1A1A1A' : '#F2F2F2',
    inputBorder: isDarkMode ? '#333333' : '#E0E0E0',
    placeholder: '#BDBDBD',
    button: isDarkMode ? '#FFFFFF' : '#000000',
    buttonText: isDarkMode ? '#000000' : '#FFFFFF',
    buttonDisabled: '#D3D3D3',
    error: '#FF6B6B',
    success: '#22C55E',
  };

  const [hasPassword, setHasPassword] = useState(false);

  // États pour l'envoi du code
  const [codeSent, setCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeVerified, setCodeVerified] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);

  // Timer pour renvoyer le code - 60 secondes
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // États pour les mots de passe
  const [oldPassword, setOldPassword] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // États de validation
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordMismatch, setPasswordMismatch] = useState('');
  const [samePasswordError, setSamePasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  // État de succès
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', subtitle: '' });

  const userEmail = 'john.doe@gmail.com';

  // ========================================
  // TIMER POUR RENVOYER LE CODE
  // ========================================

  useEffect(() => {
    if (codeSent && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, codeSent]);

  // ========================================
  // MASQUER EMAIL
  // ========================================

  const maskEmail = (email) => {
    const [localPart, domain] = email.split('@');
    const firstTwo = localPart.substring(0, 2);
    const maskedLocal = firstTwo + '*'.repeat(localPart.length - 2);
    return `${maskedLocal}@${domain}`;
  };

  // ========================================
  // VALIDATION DU MOT DE PASSE
  // ========================================

  const validatePassword = (text) => {
    const errors = [];
    if (text.length < 8) errors.push('Au moins 8 caractères');
    if (!/[A-Z]/.test(text)) errors.push('Une majuscule');
    if (!/[0-9]/.test(text)) errors.push('Un chiffre');
    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    validatePassword(text);

    // Vérifier si le nouveau mot de passe est différent de l'ancien
    if (hasPassword && oldPassword && text === oldPassword) {
      setSamePasswordError('Le nouveau mot de passe doit être différent de l\'ancien');
    } else {
      setSamePasswordError('');
    }

    if (confirmPassword.length > 0 && text !== confirmPassword) {
      setPasswordMismatch('Les mots de passe ne correspondent pas');
    } else {
      setPasswordMismatch('');
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (text.length > 0 && newPassword !== text) {
      setPasswordMismatch('Les mots de passe ne correspondent pas');
    } else {
      setPasswordMismatch('');
    }
  };

  const handleOldPasswordChange = (text) => {
    setOldPassword(text);
    setOldPasswordError('');

    // Vérifier si le nouveau mot de passe est différent
    if (newPassword && text === newPassword) {
      setSamePasswordError('Le nouveau mot de passe doit être différent de l\'ancien');
    } else {
      setSamePasswordError('');
    }
  };

  // ========================================
  // ENVOI DU CODE PAR EMAIL
  // ========================================

  const handleSendCode = async () => {
    setSendingCode(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCodeSent(true);
      setResendTimer(60);
      setCanResend(false);
      Alert.alert('Code envoyé', `Un code de vérification a été envoyé à ${maskEmail(userEmail)}`);
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'envoyer le code. Veuillez réessayer.");
    } finally {
      setSendingCode(false);
    }
  };

  const handleResendCode = () => {
    if (!canResend) return;

    setVerificationCode('');
    setCodeError('');
    handleSendCode();
  };

  // ========================================
  // VÉRIFICATION DU CODE
  // ========================================

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setCodeError('Le code doit contenir 6 chiffres');
      return;
    }

    setVerifyingCode(true);
    setCodeError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (verificationCode === '123456') {
        setCodeVerified(true);
        // Réinitialiser les champs
        setVerificationCode('');
      } else {
        setCodeError('Le code entré est incorrect');
      }
    } catch (error) {
      setCodeError('Impossible de vérifier le code');
    } finally {
      setVerifyingCode(false);
    }
  };

  // ========================================
  // CRÉATION DU MOT DE PASSE
  // ========================================

  const handleCreatePassword = async () => {
    if (passwordErrors.length > 0) {
      return;
    }

    if (passwordMismatch) {
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Réinitialiser les champs
      setNewPassword('');
      setConfirmPassword('');

      // Mettre à jour l'état
      setHasPassword(true);

      // Afficher l'écran de succès
      setSuccessMessage({
        title: 'Mot de passe créé avec succès',
        subtitle: 'Vous pouvez maintenant vous connecter avec ce mot de passe.',
      });
      setShowSuccess(true);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le mot de passe. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // MODIFICATION DU MOT DE PASSE
  // ========================================

  const handleUpdatePassword = async () => {
    if (!oldPassword) {
      setOldPasswordError('Veuillez entrer votre ancien mot de passe');
      return;
    }

    if (passwordErrors.length > 0) {
      return;
    }

    if (passwordMismatch) {
      return;
    }

    if (samePasswordError) {
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulation de vérification de l'ancien mot de passe
      // En production, cela se ferait côté serveur
      const oldPasswordCorrect = true; // Simuler la validation

      if (!oldPasswordCorrect) {
        setOldPasswordError('L\'ancien mot de passe est incorrect');
        setLoading(false);
        return;
      }

      // Réinitialiser les champs
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Afficher l'écran de succès
      setSuccessMessage({
        title: 'Mot de passe modifié avec succès',
        subtitle: 'Votre mot de passe a été mis à jour.',
      });
      setShowSuccess(true);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le mot de passe. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // NAVIGATION
  // ========================================

  const handleBack = () => {
    navigation.goBack();
  };

  // ========================================
  // VALIDATION DES FORMULAIRES
  // ========================================

  const isCreateFormValid = () => {
    return (
      newPassword !== '' &&
      confirmPassword !== '' &&
      passwordErrors.length === 0 &&
      passwordMismatch === ''
    );
  };

  const isUpdateFormValid = () => {
    return (
      oldPassword !== '' &&
      newPassword !== '' &&
      confirmPassword !== '' &&
      passwordErrors.length === 0 &&
      passwordMismatch === '' &&
      samePasswordError === ''
    );
  };

  // ========================================
  // RENDU ÉCRAN DE SUCCÈS
  // ========================================

  const renderSuccessScreen = () => (
    <View style={styles.successContainer}>
      <Text style={[styles.successTitle, { color: colors.text }]}>{successMessage.title}</Text>
      <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>{successMessage.subtitle}</Text>
    </View>
  );

  // ========================================
  // RENDU CONDITIONNEL
  // ========================================

  const renderContent = () => {
    if (showSuccess) {
      return renderSuccessScreen();
    }

    // Cas 1: Utilisateur avec mot de passe existant
    if (hasPassword) {
      return (
        <View style={styles.formContainer}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Entrez votre ancien mot de passe puis choisissez un nouveau mot de passe.
          </Text>

          {/* ANCIEN MOT DE PASSE */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Ancien mot de passe</Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: oldPasswordError ? colors.error : colors.inputBorder,
                },
              ]}
            >
              <Lock color={colors.textSecondary} size={20} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Ancien mot de passe"
                placeholderTextColor={colors.placeholder}
                value={oldPassword}
                onChangeText={handleOldPasswordChange}
                secureTextEntry={!showOldPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                <Ionicons name={showOldPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {oldPasswordError && (
              <View style={styles.messageContainer}>
                <Ionicons name="close-circle" size={14} color={colors.error} />
                <Text style={[styles.messageText, { color: colors.error }]}>{oldPasswordError}</Text>
              </View>
            )}
          </View>

          {/* NOUVEAU MOT DE PASSE */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Nouveau mot de passe</Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: passwordErrors.length > 0 || samePasswordError ? colors.error : colors.inputBorder,
                },
              ]}
            >
              <Lock color={colors.textSecondary} size={20} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Nouveau mot de passe"
                placeholderTextColor={colors.placeholder}
                value={newPassword}
                onChangeText={handleNewPasswordChange}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {passwordErrors.length > 0 && (
              <View style={styles.messageContainer}>
                <Ionicons name="close-circle" size={14} color={colors.error} />
                <Text style={[styles.messageText, { color: colors.error }]}>{passwordErrors.join(', ')}</Text>
              </View>
            )}
            {samePasswordError && (
              <View style={styles.messageContainer}>
                <Ionicons name="close-circle" size={14} color={colors.error} />
                <Text style={[styles.messageText, { color: colors.error }]}>{samePasswordError}</Text>
              </View>
            )}
          </View>

          {/* CONFIRMER NOUVEAU MOT DE PASSE */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Confirmer le nouveau mot de passe</Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: passwordMismatch ? colors.error : colors.inputBorder,
                },
              ]}
            >
              <Lock color={colors.textSecondary} size={20} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor={colors.placeholder}
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {passwordMismatch && (
              <View style={styles.messageContainer}>
                <Ionicons name="close-circle" size={14} color={colors.error} />
                <Text style={[styles.messageText, { color: colors.error }]}>{passwordMismatch}</Text>
              </View>
            )}
          </View>

          {/* BOUTON MODIFIER */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isUpdateFormValid() && !loading ? colors.button : colors.buttonDisabled },
            ]}
            onPress={handleUpdatePassword}
            disabled={!isUpdateFormValid() || loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>Modifier le mot de passe</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    // Cas 2: Utilisateur sans mot de passe - Code non encore vérifié
    if (!codeVerified) {
      return (
        <View style={styles.formContainer}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Pour créer un mot de passe, nous devons d'abord vérifier votre identité.
          </Text>

          {!codeSent ? (
            <>
              <View style={[styles.infoBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="mail" size={24} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoTitle, { color: colors.text }]}>Vérification par email</Text>
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                    Un code de vérification sera envoyé à {maskEmail(userEmail)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: sendingCode ? colors.buttonDisabled : colors.button }]}
                onPress={handleSendCode}
                disabled={sendingCode}
              >
                {sendingCode ? (
                  <ActivityIndicator color={colors.buttonText} />
                ) : (
                  <Text style={[styles.buttonText, { color: colors.buttonText }]}>Envoyer le code</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Code de vérification</Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.inputBg,
                      borderColor: codeError ? colors.error : colors.inputBorder,
                    },
                  ]}
                >
                  <MailRounded color={colors.textSecondary} size={20} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Entrez le code à 6 chiffres"
                    placeholderTextColor={colors.placeholder}
                    value={verificationCode}
                    onChangeText={(text) => {
                      setVerificationCode(text);
                      setCodeError('');
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {codeError && (
                  <View style={styles.messageContainer}>
                    <Ionicons name="close-circle" size={14} color={colors.error} />
                    <Text style={[styles.messageText, { color: colors.error }]}>{codeError}</Text>
                  </View>
                )}
                <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                  Code envoyé à {maskEmail(userEmail)}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      verificationCode.length === 6 && !verifyingCode ? colors.button : colors.buttonDisabled,
                  },
                ]}
                onPress={handleVerifyCode}
                disabled={verificationCode.length !== 6 || verifyingCode}
              >
                {verifyingCode ? (
                  <ActivityIndicator color={colors.buttonText} />
                ) : (
                  <Text style={[styles.buttonText, { color: colors.buttonText }]}>Vérifier le code</Text>
                )}
              </TouchableOpacity>

              <View style={styles.resendContainer}>
                <TouchableOpacity onPress={handleResendCode} disabled={!canResend}>
                  <View style={styles.resendRow}>
                    <ClockFilled color={canResend ? colors.text : colors.textSecondary} size={22} />
                    <Text style={[styles.resendText, { color: canResend ? colors.text : colors.textSecondary }]}>
                      Renvoyer le code {canResend ? '' : `(${resendTimer}s)`}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      );
    }

    // Cas 3: Code vérifié - Créer le mot de passe
    return (
      <View style={styles.formContainer}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Choisissez un mot de passe sécurisé pour protéger votre compte.
        </Text>

        {/* NOUVEAU MOT DE PASSE */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Mot de passe</Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.inputBg,
                borderColor: passwordErrors.length > 0 ? colors.error : colors.inputBorder,
              },
            ]}
          >
            <Lock color={colors.textSecondary} size={20} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Mot de passe"
              placeholderTextColor={colors.placeholder}
              value={newPassword}
              onChangeText={handleNewPasswordChange}
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {passwordErrors.length > 0 && (
            <View style={styles.messageContainer}>
              <Ionicons name="close-circle" size={14} color={colors.error} />
              <Text style={[styles.messageText, { color: colors.error }]}>{passwordErrors.join(', ')}</Text>
            </View>
          )}
        </View>

        {/* CONFIRMER MOT DE PASSE */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Confirmer le mot de passe</Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.inputBg,
                borderColor: passwordMismatch ? colors.error : colors.inputBorder,
              },
            ]}
          >
            <Lock color={colors.textSecondary} size={20} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={colors.placeholder}
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          {passwordMismatch && (
            <View style={styles.messageContainer}>
              <Ionicons name="close-circle" size={14} color={colors.error} />
              <Text style={[styles.messageText, { color: colors.error }]}>{passwordMismatch}</Text>
            </View>
          )}
        </View>

        {/* BOUTON CRÉER */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isCreateFormValid() && !loading ? colors.button : colors.buttonDisabled },
          ]}
          onPress={handleCreatePassword}
          disabled={!isCreateFormValid() || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.buttonText} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Créer le mot de passe</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // ========================================
  // RENDU PRINCIPAL
  // ========================================

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.headerBg}
        translucent={false}
      />

      <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border, paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowBackIosRounded color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {hasPassword ? 'Modifier le mot de passe' : 'Créer un mot de passe'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {renderContent()}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
}

// ========================================
// STYLES
// ========================================

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
  backButton: { width: 40, alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center' },
  headerRight: { width: 40 },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, padding: 20 },
  formContainer: { flex: 1 },
  description: { fontSize: 14, lineHeight: 20, marginBottom: 24 },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  infoText: { fontSize: 13, lineHeight: 18 },
  fieldContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 16 },
  messageContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  messageText: { fontSize: 12, fontWeight: '600' },
  hintText: { fontSize: 12, marginTop: 6, lineHeight: 16 },
  button: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold' },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  resendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resendText: { fontSize: 14, fontWeight: '500' },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  successTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  successSubtitle: { fontSize: 15, lineHeight: 22, textAlign: 'center' },
});
