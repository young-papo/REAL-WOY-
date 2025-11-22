import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  MailRounded,
  ArrowBackIosRounded,
  ClockFilled,
} from '../components/icons';

// Composant OTPInputField pour un seul champ OTP
const OTPInputField = ({ value, onChangeText, error, onSubmit }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    inputBg: isDarkMode ? '#1A1A1A' : '#F2F2F2',
    inputBorder: isDarkMode ? '#333333' : '#E0E0E0',
    placeholder: '#BDBDBD',
    error: '#FF6B6B',
  };

  // Gestion de la saisie (6 chiffres uniquement)
  const handleChange = (text) => {
    if (text === '' || /^\d{0,6}$/.test(text)) {
      onChangeText(text);
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.fieldContainer}>
      <View style={styles.labelRow}>
        <View style={styles.labelWithIcon}>
          <Text style={[styles.label, { color: colors.text }]}>Code OTP</Text>
          <Text style={styles.required}>*</Text>
        </View>
      </View>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBg,
            borderColor: error ? colors.error : colors.inputBorder,
          },
        ]}
      >
        <MailRounded color={colors.textSecondary} size={22} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={handleChange}
          placeholder="123456"
          placeholderTextColor={colors.placeholder}
          keyboardType="numeric"
          maxLength={6}
          onSubmitEditing={onSubmit}
          accessibilityLabel="Entrer le code OTP à 6 chiffres"
        />
      </View>
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={14} color={colors.error} />
          <Text style={[styles.errorMessage, { color: colors.error }]}>{error}</Text>
        </View>
      )}
    </Animated.View>
  );
};

// Écran principal OTPVerificationScreen
export default function OTPVerificationScreen({ route, navigation }) {
  // Gestion sécurisée de route.params.email avec valeur par défaut
  const email = route?.params?.email || 'votre email';
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Palette de couleurs cohérente avec SignupScreen et LoginScreen
  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    inputBg: isDarkMode ? '#1A1A1A' : '#F2F2F2',
    inputBorder: isDarkMode ? '#333333' : '#E0E0E0',
    placeholder: '#BDBDBD',
    error: '#FF6B6B',
    button: isDarkMode ? '#FFFFFF' : '#000000',
    buttonText: isDarkMode ? '#000000' : '#FFFFFF',
    buttonDisabled: '#D3D3D3',
    border: isDarkMode ? '#333333' : '#E0E0E0',
  };

  // Gestion du timer pour le renvoi du code
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Validation du code OTP (mock pour l'instant)
  const validateOTP = useCallback((code) => {
    const mockValidOTP = '123456'; // À remplacer par une vérification API
    return code === mockValidOTP;
  }, []);

  // Soumission du code OTP
  const handleOTPSubmit = useCallback(() => {
    if (otpValue.length !== 6) {
      setOtpError('Le code OTP doit contenir 6 chiffres');
      return;
    }
    if (!/^\d{6}$/.test(otpValue)) {
      setOtpError('Le code OTP doit être numérique');
      return;
    }
    if (!validateOTP(otpValue)) {
      setOtpError('Code OTP incorrect');
      return;
    }
    setOtpError('');
    navigation.navigate('Welcome', { email });
  }, [otpValue, email, navigation, validateOTP]);

  // Renvoyer un nouveau code OTP
  const handleResendOTP = () => {
    if (!canResend) return;
    setOtpValue('');
    setOtpError('');
    setResendTimer(30);
    setCanResend(false);
    // À remplacer par un appel API pour renvoyer le code
    navigation.navigate('InfoModal', { message: 'Un nouveau code OTP a été envoyé' });
  };

  // Retour à l'écran précédent
  const handleBack = () => {
    navigation.goBack();
  };

  // Vérification si le formulaire est valide
  const isFormValid = useCallback(() => {
    return otpValue.length === 6 && otpError === '';
  }, [otpValue, otpError]);

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
            {/* Bouton de retour */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              accessibilityLabel="Retour à l'écran précédent"
            >
              <ArrowBackIosRounded color={colors.text} size={24} />
            </TouchableOpacity>

            {/* Titre et sous-titre */}
            <Text style={[styles.title, { color: colors.text }]}>WOY</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Vérification OTP
            </Text>
            <Text style={[styles.instruction, { color: colors.textSecondary }]}>
              Entrez le code à 6 chiffres envoyé à votre email
            </Text>

            {/* Champ OTP */}
            <OTPInputField
              value={otpValue}
              onChangeText={setOtpValue}
              error={otpError}
              onSubmit={handleOTPSubmit}
            />

            {/* Bouton de renvoi */}
            <View style={styles.resendContainer}>
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={!canResend}
                accessibilityLabel="Renvoyer le code OTP"
              >
                <View style={styles.resendRow}>
                  <ClockFilled color={canResend ? colors.text : colors.textSecondary} size={22} />
                  <Text
                    style={[
                      styles.resendText,
                      { color: canResend ? colors.text : colors.textSecondary },
                    ]}
                  >
                    Renvoyer le code {canResend ? '' : `(${resendTimer}s)`}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Bouton de vérification */}
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: isFormValid() ? colors.button : colors.buttonDisabled },
              ]}
              onPress={handleOTPSubmit}
              disabled={!isFormValid()}
              accessibilityLabel="Vérifier le code OTP"
            >
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>Vérifier</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  keyboardView: { flex: 1 },
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 20, left: 20, zIndex: 1 },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  instruction: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  fieldContainer: { marginBottom: 16 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelWithIcon: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 14, fontWeight: '600' },
  required: { fontSize: 14, color: '#FF6B6B', marginLeft: 4, fontWeight: 'bold' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  input: { flex: 1, paddingVertical: 14, fontSize: 16 },
  errorContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  errorMessage: { fontSize: 12, fontWeight: '600' },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  resendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resendText: { fontSize: 14, fontWeight: '500' },
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
});
