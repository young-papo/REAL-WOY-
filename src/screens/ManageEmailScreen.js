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
  MailRounded,
  ClockFilled,
} from '../components/icons';

export default function ManageEmailScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

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

  // États pour l'email actuel
  const currentEmail = 'john.doe@gmail.com';

  // États pour l'envoi du code à l'ancien email
  const [oldEmailCodeSent, setOldEmailCodeSent] = useState(false);
  const [sendingOldEmailCode, setSendingOldEmailCode] = useState(false);
  const [oldEmailVerificationCode, setOldEmailVerificationCode] = useState('');
  const [oldEmailCodeError, setOldEmailCodeError] = useState('');
  const [oldEmailCodeVerified, setOldEmailCodeVerified] = useState(false);
  const [verifyingOldEmailCode, setVerifyingOldEmailCode] = useState(false);

  // États pour le nouvel email
  const [newEmail, setNewEmail] = useState('');
  const [newEmailError, setNewEmailError] = useState('');

  // États pour l'envoi du code au nouvel email
  const [newEmailCodeSent, setNewEmailCodeSent] = useState(false);
  const [sendingNewEmailCode, setSendingNewEmailCode] = useState(false);
  const [newEmailVerificationCode, setNewEmailVerificationCode] = useState('');
  const [newEmailCodeError, setNewEmailCodeError] = useState('');
  const [verifyingNewEmailCode, setVerifyingNewEmailCode] = useState(false);

  // Timer pour renvoyer le code (ancien email) - 60 secondes
  const [oldEmailResendTimer, setOldEmailResendTimer] = useState(60);
  const [canResendOldEmail, setCanResendOldEmail] = useState(false);

  // Timer pour renvoyer le code (nouvel email) - 60 secondes
  const [newEmailResendTimer, setNewEmailResendTimer] = useState(60);
  const [canResendNewEmail, setCanResendNewEmail] = useState(false);

  // État de chargement
  const [loading, setLoading] = useState(false);

  // État de succès
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (oldEmailCodeSent && oldEmailResendTimer > 0) {
      const timer = setTimeout(() => setOldEmailResendTimer(oldEmailResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (oldEmailResendTimer === 0) {
      setCanResendOldEmail(true);
    }
  }, [oldEmailResendTimer, oldEmailCodeSent]);

  useEffect(() => {
    if (newEmailCodeSent && newEmailResendTimer > 0) {
      const timer = setTimeout(() => setNewEmailResendTimer(newEmailResendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (newEmailResendTimer === 0) {
      setCanResendNewEmail(true);
    }
  }, [newEmailResendTimer, newEmailCodeSent]);

  const maskEmail = (email) => {
    const [localPart, domain] = email.split('@');
    const firstTwo = localPart.substring(0, 2);
    const maskedLocal = firstTwo + '*'.repeat(localPart.length - 2);
    return `${maskedLocal}@${domain}`;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNewEmailChange = (text) => {
    setNewEmail(text);
    setNewEmailError('');

    if (text.length > 0 && !validateEmail(text)) {
      setNewEmailError('Format d\'email invalide');
    } else if (text.toLowerCase() === currentEmail.toLowerCase()) {
      setNewEmailError('Le nouvel email doit être différent de l\'actuel');
    }
  };

  const handleSendOldEmailCode = async () => {
    setSendingOldEmailCode(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOldEmailCodeSent(true);
      setOldEmailResendTimer(60);
      setCanResendOldEmail(false);
      Alert.alert('Code envoyé', `Un code de vérification a été envoyé à ${maskEmail(currentEmail)}`);
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'envoyer le code. Veuillez réessayer.");
    } finally {
      setSendingOldEmailCode(false);
    }
  };

  const handleResendOldEmailCode = () => {
    if (!canResendOldEmail) return;

    setOldEmailVerificationCode('');
    setOldEmailCodeError('');
    handleSendOldEmailCode();
  };

  const handleVerifyOldEmailCode = async () => {
    if (oldEmailVerificationCode.length !== 6) {
      setOldEmailCodeError('Le code doit contenir 6 chiffres');
      return;
    }

    setVerifyingOldEmailCode(true);
    setOldEmailCodeError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (oldEmailVerificationCode === '123456') {
        setOldEmailCodeVerified(true);
        setOldEmailVerificationCode('');
      } else {
        setOldEmailCodeError('Le code entré est incorrect');
      }
    } catch (error) {
      setOldEmailCodeError('Impossible de vérifier le code');
    } finally {
      setVerifyingOldEmailCode(false);
    }
  };

  const handleSendNewEmailCode = async () => {
    if (!newEmail || newEmailError) {
      return;
    }

    setSendingNewEmailCode(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setNewEmailCodeSent(true);
      setNewEmailResendTimer(60);
      setCanResendNewEmail(false);
      Alert.alert('Code envoyé', `Un code de vérification a été envoyé à ${newEmail}`);
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'envoyer le code. Veuillez réessayer.");
    } finally {
      setSendingNewEmailCode(false);
    }
  };

  const handleResendNewEmailCode = () => {
    if (!canResendNewEmail) return;

    setNewEmailVerificationCode('');
    setNewEmailCodeError('');
    handleSendNewEmailCode();
  };

  const handleVerifyNewEmailCode = async () => {
    if (newEmailVerificationCode.length !== 6) {
      setNewEmailCodeError('Le code doit contenir 6 chiffres');
      return;
    }

    setLoading(true);
    setNewEmailCodeError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (newEmailVerificationCode === '123456') {
        // Email changé avec succès
        setShowSuccess(true);
      } else {
        setNewEmailCodeError('Le code entré est incorrect');
        setLoading(false);
      }
    } catch (error) {
      setNewEmailCodeError('Impossible de vérifier le code');
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const isNewEmailValid = () => {
    return newEmail !== '' && !newEmailError && validateEmail(newEmail);
  };

  const renderSuccessScreen = () => (
    <View style={styles.successContainer}>
      <Text style={[styles.successTitle, { color: colors.text }]}>Email modifié avec succès</Text>
      <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
        Votre adresse email a été mise à jour vers {newEmail}
      </Text>
    </View>
  );

  const renderContent = () => {
    if (showSuccess) {
      return renderSuccessScreen();
    }

    // Étape 1: Vérification de l'ancien email
    if (!oldEmailCodeVerified) {
      return (
        <View style={styles.formContainer}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Pour modifier votre email, nous devons d'abord vérifier votre identité.
          </Text>

          {!oldEmailCodeSent ? (
            <>
              <View style={[styles.infoBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="mail" size={24} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={[styles.infoTitle, { color: colors.text }]}>Email actuel</Text>
                  <Text style={[styles.infoText, { color: colors.textSecondary }]}>{currentEmail}</Text>
                  <Text style={[styles.infoSubtext, { color: colors.textSecondary }]}>
                    Un code de vérification sera envoyé à cette adresse
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: sendingOldEmailCode ? colors.buttonDisabled : colors.button }]}
                onPress={handleSendOldEmailCode}
                disabled={sendingOldEmailCode}
              >
                {sendingOldEmailCode ? (
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
                      borderColor: oldEmailCodeError ? colors.error : colors.inputBorder,
                    },
                  ]}
                >
                  <MailRounded color={colors.textSecondary} size={20} />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="Entrez le code à 6 chiffres"
                    placeholderTextColor={colors.placeholder}
                    value={oldEmailVerificationCode}
                    onChangeText={(text) => {
                      setOldEmailVerificationCode(text);
                      setOldEmailCodeError('');
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {oldEmailCodeError && (
                  <View style={styles.messageContainer}>
                    <Ionicons name="close-circle" size={14} color={colors.error} />
                    <Text style={[styles.messageText, { color: colors.error }]}>{oldEmailCodeError}</Text>
                  </View>
                )}
                <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                  Code envoyé à {maskEmail(currentEmail)}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      oldEmailVerificationCode.length === 6 && !verifyingOldEmailCode ? colors.button : colors.buttonDisabled,
                  },
                ]}
                onPress={handleVerifyOldEmailCode}
                disabled={oldEmailVerificationCode.length !== 6 || verifyingOldEmailCode}
              >
                {verifyingOldEmailCode ? (
                  <ActivityIndicator color={colors.buttonText} />
                ) : (
                  <Text style={[styles.buttonText, { color: colors.buttonText }]}>Vérifier le code</Text>
                )}
              </TouchableOpacity>

              <View style={styles.resendContainer}>
                <TouchableOpacity onPress={handleResendOldEmailCode} disabled={!canResendOldEmail}>
                  <View style={styles.resendRow}>
                    <ClockFilled color={canResendOldEmail ? colors.text : colors.textSecondary} size={22} />
                    <Text style={[styles.resendText, { color: canResendOldEmail ? colors.text : colors.textSecondary }]}>
                      Renvoyer le code {canResendOldEmail ? '' : `(${oldEmailResendTimer}s)`}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      );
    }

    // Étape 2: Saisie du nouvel email
    if (!newEmailCodeSent) {
      return (
        <View style={styles.formContainer}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Entrez votre nouvelle adresse email.
          </Text>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Email actuel</Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: colors.inputBorder,
                  opacity: 0.6,
                },
              ]}
            >
              <MailRounded color={colors.textSecondary} size={20} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={currentEmail}
                editable={false}
              />
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Nouvel email</Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.inputBg,
                  borderColor: newEmailError ? colors.error : colors.inputBorder,
                },
              ]}
            >
              <MailRounded color={colors.textSecondary} size={20} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="nouvelle.adresse@exemple.com"
                placeholderTextColor={colors.placeholder}
                value={newEmail}
                onChangeText={handleNewEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {newEmailError && (
              <View style={styles.messageContainer}>
                <Ionicons name="close-circle" size={14} color={colors.error} />
                <Text style={[styles.messageText, { color: colors.error }]}>{newEmailError}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isNewEmailValid() && !sendingNewEmailCode ? colors.button : colors.buttonDisabled,
              },
            ]}
            onPress={handleSendNewEmailCode}
            disabled={!isNewEmailValid() || sendingNewEmailCode}
          >
            {sendingNewEmailCode ? (
              <ActivityIndicator color={colors.buttonText} />
            ) : (
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>Envoyer le code de vérification</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    // Étape 3: Vérification du nouvel email
    return (
      <View style={styles.formContainer}>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Vérifiez votre nouvelle adresse email en entrant le code que nous avons envoyé.
        </Text>

        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Code de vérification</Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.inputBg,
                borderColor: newEmailCodeError ? colors.error : colors.inputBorder,
              },
            ]}
          >
            <MailRounded color={colors.textSecondary} size={20} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Entrez le code à 6 chiffres"
              placeholderTextColor={colors.placeholder}
              value={newEmailVerificationCode}
              onChangeText={(text) => {
                setNewEmailVerificationCode(text);
                setNewEmailCodeError('');
              }}
              keyboardType="number-pad"
              maxLength={6}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {newEmailCodeError && (
            <View style={styles.messageContainer}>
              <Ionicons name="close-circle" size={14} color={colors.error} />
              <Text style={[styles.messageText, { color: colors.error }]}>{newEmailCodeError}</Text>
            </View>
          )}
          <Text style={[styles.hintText, { color: colors.textSecondary }]}>
            Code envoyé à {newEmail}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor:
                newEmailVerificationCode.length === 6 && !loading ? colors.button : colors.buttonDisabled,
            },
          ]}
          onPress={handleVerifyNewEmailCode}
          disabled={newEmailVerificationCode.length !== 6 || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.buttonText} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Modifier l'email</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <TouchableOpacity onPress={handleResendNewEmailCode} disabled={!canResendNewEmail}>
            <View style={styles.resendRow}>
              <ClockFilled color={canResendNewEmail ? colors.text : colors.textSecondary} size={22} />
              <Text style={[styles.resendText, { color: canResendNewEmail ? colors.text : colors.textSecondary }]}>
                Renvoyer le code {canResendNewEmail ? '' : `(${newEmailResendTimer}s)`}
              </Text>
            </View>
          </TouchableOpacity>
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

      <View style={[styles.safeArea, { backgroundColor: colors.headerBg, paddingTop: insets.top }]}>
        <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowBackIosRounded color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Modifier l'email</Text>
          <View style={styles.headerRight} />
        </View>
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {},
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
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  infoText: { fontSize: 14, marginBottom: 4, fontWeight: '500' },
  infoSubtext: { fontSize: 12, lineHeight: 16 },
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
