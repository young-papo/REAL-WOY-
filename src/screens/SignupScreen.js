import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeIn } from 'react-native-reanimated';
import InputField from '../components/InputField';
import {
  MailRounded,
  Lock,
  Google,
  SignAtSolid,
  ProfileFill,
  Calendar,
} from '../components/icons';

// Composant SexeSelector
const SexeSelector = ({ value, onChange, colors }) => (
  <Animated.View entering={FadeIn.duration(300)} style={styles.fieldContainer}>
    <View style={styles.labelRow}>
      <View style={styles.labelWithIcon}>
        <Text style={[styles.label, { color: colors.text }]}>Sexe</Text>
        <Text style={styles.required}>*</Text>
      </View>
    </View>
    <View style={styles.sexeContainer}>
      {['Homme', 'Femme'].map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.sexeOption}
          onPress={() => onChange(option.toLowerCase())}
          activeOpacity={0.7}
          accessibilityLabel={`Sélectionner ${option}`}
        >
          <View
            style={[
              styles.customCheckbox,
              {
                backgroundColor: value === option.toLowerCase() ? colors.checkbox : colors.checkboxUnchecked,
                borderColor: value === option.toLowerCase() ? colors.checkbox : colors.checkboxUnchecked,
              },
            ]}
          >
            {value === option.toLowerCase() && (
              <Ionicons name="checkmark" size={16} color={colors.checkboxText} />
            )}
          </View>
          <Text style={[styles.sexeLabel, { color: colors.text }]}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </Animated.View>
);

export default function SignupScreen({ navigation }) {
  const [pseudo, setPseudo] = useState('');
  const [pseudoError, setPseudoError] = useState('');
  const [pseudoAvailable, setPseudoAvailable] = useState(null);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [sexe, setSexe] = useState('');
  const [dateNaissance, setDateNaissance] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateError, setDateError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

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
    success: '#22C55E',
    button: isDarkMode ? '#FFFFFF' : '#000000',
    buttonText: isDarkMode ? '#000000' : '#FFFFFF',
    buttonDisabled: '#D3D3D3',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    checkbox: isDarkMode ? '#FFFFFF' : '#000000',
    checkboxUnchecked: isDarkMode ? '#333333' : '#E0E0E0',
    checkboxText: isDarkMode ? '#000000' : '#FFFFFF',
  };

  const takenPseudos = ['john', 'marie', 'alex', 'luxe', 'sport', 'fashion'];

  const validatePseudo = useCallback(
    (text) => {
      if (text.length === 0) {
        setPseudoError('');
        setPseudoAvailable(null);
        return;
      }
      if (text.length < 3) {
        setPseudoError('Au minimum 3 caractères');
        setPseudoAvailable(null);
        return;
      }
      const pseudoRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!pseudoRegex.test(text)) {
        setPseudoError('Lettres, chiffres et underscore (_) uniquement');
        setPseudoAvailable(null);
        return;
      }
      const isTaken = takenPseudos.includes(text.toLowerCase());
      if (isTaken) {
        setPseudoError('Ce pseudo est déjà pris');
        setPseudoAvailable(false);
      } else {
        setPseudoError('');
        setPseudoAvailable(true);
      }
    },
    [takenPseudos]
  );

  const handlePseudoChange = (text) => {
    setPseudo(text);
    validatePseudo(text);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateNaissance(selectedDate);
      validateDate(selectedDate);
    }
  };

  const validateDate = useCallback((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date > today) {
      setDateError('La date ne peut pas être dans le futur');
      return;
    }

    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();

    let calculatedAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      calculatedAge--;
    }

    if (calculatedAge < 13) {
      setDateError('Vous devez avoir au moins 13 ans');
      return;
    }

    setDateError('');
  }, []);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const validateEmail = useCallback((text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  }, []);

  const handleEmailChange = (text) => {
    setEmail(text);
    if (text.length > 0 && !validateEmail(text)) {
      setEmailError('Email invalide');
    } else {
      setEmailError('');
    }
  };

  const validatePassword = useCallback((text) => {
    const errors = [];
    if (text.length < 8) errors.push('Au moins 8 caractères');
    if (!/[A-Z]/.test(text)) errors.push('Une majuscule');
    if (!/[0-9]/.test(text)) errors.push('Un chiffre');
    setPasswordErrors(errors);
  }, []);

  const handlePasswordChange = (text) => {
    setPassword(text);
    validatePassword(text);
    if (confirmPassword.length > 0 && text !== confirmPassword) {
      setPasswordMismatch('Les mots de passe ne correspondent pas');
    } else {
      setPasswordMismatch('');
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (text.length > 0 && password !== text) {
      setPasswordMismatch('Les mots de passe ne correspondent pas');
    } else {
      setPasswordMismatch('');
    }
  };

  const isFormValid = useCallback(() => {
    return (
      pseudo.length >= 3 &&
      pseudoAvailable === true &&
      pseudoError === '' &&
      nom !== '' &&
      prenom !== '' &&
      sexe !== '' &&
      dateError === '' &&
      email !== '' &&
      emailError === '' &&
      password !== '' &&
      passwordErrors.length === 0 &&
      confirmPassword !== '' &&
      passwordMismatch === '' &&
      agreeTerms === true
    );
  }, [
    pseudo,
    pseudoAvailable,
    pseudoError,
    nom,
    prenom,
    sexe,
    dateError,
    email,
    emailError,
    password,
    passwordErrors,
    confirmPassword,
    passwordMismatch,
    agreeTerms,
  ]);

  const handleSignup = () => {
    if (!isFormValid()) {
      navigation.navigate('ErrorModal', { message: 'Veuillez remplir correctement tous les champs obligatoires' });
      return;
    }
    navigation.navigate('Welcome', { pseudo });
  };

  const handleGoogleSignup = () => {
    navigation.navigate('AuthModal', { provider: 'Google' });
  };

  const handleAppleSignup = () => {
    navigation.navigate('AuthModal', { provider: 'Apple' });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleTermsPress = () => {
    navigation.navigate('Terms');
  };

  const handlePrivacyPress = () => {
    navigation.navigate('Privacy');
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
              <Text style={[styles.title, { color: colors.text }]}>WOY</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>S'inscrire</Text>

              <InputField
                label="Pseudo"
                value={pseudo}
                onChangeText={handlePseudoChange}
                placeholder="Pseudo"
                icon={SignAtSolid}
                error={pseudoError}
                success={pseudoAvailable && 'Disponible'}
                required
                accessibilityLabel="Entrer votre pseudo"
              />

              <InputField
                label="Nom"
                value={nom}
                onChangeText={setNom}
                placeholder="Nom"
                icon={ProfileFill}
                required
                accessibilityLabel="Entrer votre nom"
              />

              <InputField
                label="Prénom"
                value={prenom}
                onChangeText={setPrenom}
                placeholder="Prénom"
                icon={ProfileFill}
                required
                accessibilityLabel="Entrer votre prénom"
              />

              <SexeSelector value={sexe} onChange={setSexe} colors={colors} />

              <Animated.View entering={FadeIn.duration(300)} style={styles.fieldContainer}>
                <View style={styles.labelRow}>
                  <View style={styles.labelWithIcon}>
                    <Text style={[styles.label, { color: colors.text }]}>Date de naissance</Text>
                    <Text style={styles.required}>*</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.inputBg,
                      borderColor: dateError ? colors.error : colors.inputBorder,
                    },
                  ]}
                  accessibilityLabel="Sélectionner la date de naissance"
                >
                  <Calendar color={colors.textSecondary} size={22} />
                  <Text style={[styles.dateText, { color: colors.text }]}>
                    {formatDate(dateNaissance)}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={dateNaissance}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
                {dateError && (
                  <View style={styles.errorContainer}>
                    <Ionicons name="close-circle" size={14} color={colors.error} />
                    <Text style={[styles.errorMessage, { color: colors.error }]}>{dateError}</Text>
                  </View>
                )}
              </Animated.View>

              <InputField
                label="Email"
                value={email}
                onChangeText={handleEmailChange}
                placeholder="Email"
                icon={MailRounded}
                error={emailError}
                keyboardType="email-address"
                required
                accessibilityLabel="Entrer votre email"
              />

              <InputField
                label="Mot de passe"
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="Mot de passe"
                icon={Lock}
                secureTextEntry={!showPassword}
                toggleSecure={() => setShowPassword(!showPassword)}
                error={passwordErrors.length > 0 ? passwordErrors.join(', ') : ''}
                success={password.length > 0 && passwordErrors.length === 0 && 'Mot de passe fort'}
                required
                accessibilityLabel="Entrer votre mot de passe"
              />

              <InputField
                label="Confirmer mot de passe"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                placeholder="Confirmer le mot de passe"
                icon={Lock}
                secureTextEntry={!showConfirmPassword}
                toggleSecure={() => setShowConfirmPassword(!showConfirmPassword)}
                error={passwordMismatch}
                required
                accessibilityLabel="Confirmer votre mot de passe"
              />

              <Animated.View entering={FadeIn.duration(300)} style={styles.checkboxContainer}>
                <TouchableOpacity
                  onPress={() => setAgreeTerms(!agreeTerms)}
                  activeOpacity={0.7}
                  accessibilityLabel="Accepter les conditions d'utilisation"
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: agreeTerms ? colors.checkbox : colors.checkboxUnchecked,
                        borderColor: agreeTerms ? colors.checkbox : colors.checkboxUnchecked,
                      },
                    ]}
                  >
                    {agreeTerms && (
                      <Ionicons name="checkmark" size={16} color={colors.checkboxText} />
                    )}
                  </View>
                </TouchableOpacity>
                <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                  J'accepte les{' '}
                  <Text
                    style={[styles.termsLink, { color: colors.text }]}
                    onPress={handleTermsPress}
                  >
                    conditions d'utilisation
                  </Text>{' '}
                  et la{' '}
                  <Text
                    style={[styles.termsLink, { color: colors.text }]}
                    onPress={handlePrivacyPress}
                  >
                    politique de confidentialité
                  </Text>
                  <Text style={styles.required}>*</Text>
                </Text>
              </Animated.View>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: isFormValid() ? colors.button : colors.buttonDisabled },
                ]}
                onPress={handleSignup}
                disabled={!isFormValid()}
                accessibilityLabel="S'inscrire"
              >
                <Text style={[styles.buttonText, { color: colors.buttonText }]}>S'inscrire</Text>
              </TouchableOpacity>

              <View style={styles.separatorContainer}>
                <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.separatorText, { color: colors.textSecondary }]}>ou</Text>
                <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
              </View>

              <View style={styles.socialContainer}>
                <TouchableOpacity
                  style={[styles.socialButton, { borderColor: colors.border }]}
                  onPress={handleGoogleSignup}
                  accessibilityLabel="S'inscrire avec Google"
                >
                  <Google />
                  <Text style={[styles.socialText, { color: colors.text }]}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.socialButton, { borderColor: colors.border }]}
                  onPress={handleAppleSignup}
                  accessibilityLabel="S'inscrire avec Apple"
                >
                  <Ionicons name="logo-apple" size={22} color={colors.text} />
                  <Text style={[styles.socialText, { color: colors.text }]}>Apple</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                  Déjà un compte ?{' '}
                </Text>
                <TouchableOpacity onPress={handleLogin} accessibilityLabel="Se connecter">
                  <Text style={[styles.linkText, { color: colors.text }]}>Se connecter</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, padding: 20, paddingTop: 30 },
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
    marginBottom: 30,
  },
  fieldContainer: { marginBottom: 16 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  dateText: { flex: 1, paddingVertical: 14, fontSize: 16, marginLeft: 10 },
  errorContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  errorMessage: { fontSize: 12, fontWeight: '600' },
  sexeContainer: { flexDirection: 'row', gap: 20 },
  sexeOption: { flexDirection: 'row', alignItems: 'center' },
  sexeLabel: { fontSize: 14, marginLeft: 8 },
  customCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  termsText: { fontSize: 13, lineHeight: 20, flex: 1 },
  termsLink: { fontWeight: '600', textDecorationLine: 'underline' },
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
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  separatorLine: { flex: 1, height: 1 },
  separatorText: { marginHorizontal: 16, fontSize: 14 },
  socialContainer: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  socialText: { fontSize: 14, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  footerText: { fontSize: 14 },
  linkText: { fontSize: 14, fontWeight: 'bold' },
});
