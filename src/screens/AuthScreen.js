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
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Svg, { Path, G } from 'react-native-svg';

// ========================================
// ICÔNES SVG
// ========================================

const ArrowBackIosRounded = ({ color = '#000000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="m3.55 12l7.35 7.35q.375.375.363.875t-.388.875q-.375.375-.875.375t-.875-.375l-7.7-7.675q-.3-.3-.45-.675T.825 12q0-.375.15-.75t.45-.675l7.7-7.7q.375-.375.888-.363t.887.388q.375.375.375.875t-.375.875L3.55 12Z"
    />
  </Svg>
);

const MailRounded = ({ color = '#000000', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M4 20q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.588 1.413T20 20H4Zm8-7.175q.125 0 .263-.038t.262-.112L19.6 8.25q.2-.125.3-.313t.1-.412q0-.5-.425-.75T18.7 6.8L12 11L5.3 6.8q-.45-.275-.875-.012T4 7.525q0 .25.1.438t.3.287l7.075 4.425q.125.075.263.113t.262.037Z"
    />
  </Svg>
);

const Lock = ({ color = '#000000', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M17 9V7c0-2.8-2.2-5-5-5S7 4.2 7 7v2c-1.7 0-3 1.3-3 3v7c0 1.7 1.3 3 3 3h10c1.7 0 3-1.3 3-3v-7c0-1.7-1.3-3-3-3zM9 7c0-1.7 1.3-3 3-3s3 1.3 3 3v2H9V7z"
    />
  </Svg>
);

const Google = ({ color = '#000000', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <G fill="none" fillRule="evenodd" clipRule="evenodd">
      <Path
        fill="#F44336"
        d="M7.209 1.061c.725-.081 1.154-.081 1.933 0a6.57 6.57 0 0 1 3.65 1.82a100 100 0 0 0-1.986 1.93q-1.876-1.59-4.188-.734q-1.696.78-2.362 2.528a78 78 0 0 1-2.148-1.658a.26.26 0 0 0-.16-.027q1.683-3.245 5.26-3.86"
        opacity=".987"
      />
      <Path
        fill="#FFC107"
        d="M1.946 4.92q.085-.013.161.027a78 78 0 0 0 2.148 1.658A7.6 7.6 0 0 0 4.04 7.99q.037.678.215 1.331L2 11.116Q.527 8.038 1.946 4.92"
        opacity=".997"
      />
      <Path
        fill="#448AFF"
        d="M12.685 13.29a26 26 0 0 0-2.202-1.74q1.15-.812 1.396-2.228H8.122V6.713q3.25-.027 6.497.055q.616 3.345-1.423 6.032a7 7 0 0 1-.51.49"
        opacity=".999"
      />
      <Path
        fill="#43A047"
        d="M4.255 9.322q1.23 3.057 4.51 2.854a3.94 3.94 0 0 0 1.718-.626q1.148.812 2.202 1.74a6.62 6.62 0 0 1-4.027 1.684a6.4 6.4 0 0 1-1.02 0Q3.82 14.524 2 11.116z"
        opacity=".993"
      />
    </G>
  </Svg>
);

const SignAtSolid = ({ color = '#000000', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M25.033 1.5C12.255 1.5 1.5 11.425 1.5 24.66c0 11.79 8.7 21.84 20.614 21.84c2.703 0 4.601-.352 5.753-1.13c.98-.63 1.482-1.515 1.618-2.475c.133-.944-.09-1.931-.5-2.805c-.277-.59-.908-.854-1.488-.772c-1.632.228-3.218.42-4.844.42c-8.563 0-14.391-7.497-14.391-15.079c0-8.64 7.63-16.442 16.77-16.442c4.6 0 8.274 1.46 10.793 3.805c2.518 2.343 3.913 5.596 3.913 9.247c0 2.589-.785 4.855-2 6.2c-.604.667-1.303 1.097-2.059 1.25c-.665.136-1.411.065-2.224-.294l1.32-8.578c.338-1.794-.472-3.545-1.906-4.586l-.004-.002c-2.291-1.63-5.002-2.306-7.743-2.306c-6.885 0-11.859 5.227-11.859 12.036c0 2.82.975 5.269 2.687 7.015c1.713 1.747 4.135 2.76 6.972 2.76c1.896 0 3.89-.363 5.604-1.327C30.309 34.516 32.42 35 34.461 35c4.007 0 7.039-1.562 9.058-4.09c2.007-2.514 2.981-5.942 2.981-9.64C46.5 9.262 36.041 1.5 25.033 1.5M22.82 21.39c.635-.804 1.38-1.175 2.257-1.175c.551 0 1.103.06 1.537.252l-.622 6.787c-.496.319-1.08.484-1.768.484c-.847 0-1.415-.308-1.784-.773c-.381-.48-.59-1.183-.59-2.023c0-1.635.348-2.79.965-3.545z"
      clipRule="evenodd"
    />
  </Svg>
);

const ProfileFill = ({ color = '#000000', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0Zm0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5H8Z"
      clipRule="evenodd"
    />
  </Svg>
);

const Calendar = ({ color = '#000000', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 512 512">
    <Path
      fill={color}
      d="M480 128a64 64 0 0 0-64-64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 0 0 368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 0 0 112 48v16H96a64 64 0 0 0-64 64v12a4 4 0 0 0 4 4h440a4 4 0 0 0 4-4ZM32 416a64 64 0 0 0 64 64h320a64 64 0 0 0 64-64V179a3 3 0 0 0-3-3H35a3 3 0 0 0-3 3Zm344-208a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm-80-80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm-80-80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm-80-80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Z"
    />
  </Svg>
);

const ClockFilled = ({ color = '#000000', size = 22 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <G fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <Path d="M0 0h24v24H0z" />
      <Path
        fill={color}
        d="M17 3.34a10 10 0 1 1-14.995 8.984L2 12l.005-.324A10 10 0 0 1 17 3.34zM12 6a1 1 0 0 0-.993.883L11 7v5l.009.131a1 1 0 0 0 .197.477l.087.1l3 3l.094.082a1 1 0 0 0 1.226 0l.094-.083l.083-.094a1 1 0 0 0 0-1.226l-.083-.094L13 11.585V7l-.007-.117A1 1 0 0 0 12 6z"
      />
    </G>
  </Svg>
);

// ========================================
// COMPOSANTS RÉUTILISABLES
// ========================================

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon: Icon,
  error,
  success,
  secureTextEntry,
  toggleSecure,
  keyboardType,
  required,
  maxLength,
  colors,
}) => (
  <Animated.View
    entering={FadeIn.duration(300)}
    exiting={FadeOut.duration(200)}
    style={styles.fieldContainer}
  >
    <View style={styles.labelRow}>
      <View style={styles.labelWithIcon}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
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
      <Icon color={colors.textSecondary} size={22} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {toggleSecure && (
        <TouchableOpacity onPress={toggleSecure}>
          <Ionicons
            name={secureTextEntry ? 'eye-off' : 'eye'}
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
    {error && (
      <View style={styles.messageContainer}>
        <Ionicons name="close-circle" size={14} color={colors.error} />
        <Text style={[styles.messageText, { color: colors.error }]}>{error}</Text>
      </View>
    )}
    {success && (
      <View style={styles.messageContainer}>
        <Ionicons name="checkmark-circle" size={14} color={colors.success} />
        <Text style={[styles.messageText, { color: colors.success }]}>{success}</Text>
      </View>
    )}
  </Animated.View>
);

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
        >
          <View
            style={[
              styles.customCheckbox,
              {
                backgroundColor:
                  value === option.toLowerCase() ? colors.checkbox : colors.checkboxUnchecked,
                borderColor:
                  value === option.toLowerCase() ? colors.checkbox : colors.checkboxUnchecked,
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

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

export default function AuthScreen({ navigation }) {
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

  // MODES: 'login', 'signup', 'forgot', 'otp', 'complete'
  const [mode, setMode] = useState('login');

  // États communs
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // États pour Signup
  const [pseudo, setPseudo] = useState('');
  const [pseudoError, setPseudoError] = useState('');
  const [pseudoAvailable, setPseudoAvailable] = useState(null);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [sexe, setSexe] = useState('');
  const [dateNaissance, setDateNaissance] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateError, setDateError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // États pour OTP - Timer de 60 secondes
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const takenPseudos = ['john', 'marie', 'alex', 'luxe', 'sport', 'fashion'];

  // ========================================
  // TIMER OTP
  // ========================================

  useEffect(() => {
    if (mode === 'otp' && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, mode]);

  // ========================================
  // RÉINITIALISATION DES CHAMPS
  // ========================================

  const resetFields = useCallback(() => {
    setEmail('');
    setEmailError('');
    setPassword('');
    setPasswordError('');
    setPasswordErrors([]);
    setShowPassword(false);
    setPseudo('');
    setPseudoError('');
    setPseudoAvailable(null);
    setNom('');
    setPrenom('');
    setSexe('');
    setDateNaissance(new Date());
    setDateError('');
    setConfirmPassword('');
    setPasswordMismatch('');
    setShowConfirmPassword(false);
    setAgreeTerms(false);
    setOtpValue('');
    setOtpError('');
    setResendTimer(60);
    setCanResend(false);
  }, []);

  // ========================================
  // CHANGEMENT DE MODE
  // ========================================

  const changeMode = useCallback(
    (newMode) => {
      resetFields();
      setMode(newMode);
    },
    [resetFields]
  );

  // ========================================
  // VALIDATION EMAIL
  // ========================================

  const validateEmail = useCallback((text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  }, []);

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError(text.length > 0 && !validateEmail(text) ? 'Email invalide' : '');
  };

  // ========================================
  // VALIDATION MOT DE PASSE
  // ========================================

  const validatePassword = useCallback((text) => {
    const errors = [];
    if (text.length < 8) errors.push('Au moins 8 caractères');
    if (!/[A-Z]/.test(text)) errors.push('Une majuscule');
    if (!/[0-9]/.test(text)) errors.push('Un chiffre');
    return errors;
  }, []);

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (mode === 'login') {
      setPasswordError(text.length > 0 && text.length < 8 ? 'Minimum 8 caractères' : '');
    } else {
      const errors = validatePassword(text);
      setPasswordErrors(errors);
      if (confirmPassword.length > 0 && text !== confirmPassword) {
        setPasswordMismatch('Les mots de passe ne correspondent pas');
      } else {
        setPasswordMismatch('');
      }
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

  // ========================================
  // VALIDATION PSEUDO
  // ========================================

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

  // ========================================
  // VALIDATION DATE
  // ========================================

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

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateNaissance(selectedDate);
      validateDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ========================================
  // VALIDATION FORMULAIRES
  // ========================================

  const isLoginValid = useCallback(() => {
    return (
      email !== '' &&
      validateEmail(email) &&
      password !== '' &&
      password.length >= 8 &&
      emailError === '' &&
      passwordError === ''
    );
  }, [email, emailError, password, passwordError, validateEmail]);

  const isSignupValid = useCallback(() => {
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

  const isForgotValid = useCallback(() => {
    return email !== '' && validateEmail(email) && emailError === '';
  }, [email, emailError, validateEmail]);

  const isOtpValid = useCallback(() => {
    return otpValue.length === 6 && /^\d{6}$/.test(otpValue);
  }, [otpValue]);

  const isCompleteValid = useCallback(() => {
    return (
      pseudo.length >= 3 &&
      pseudoAvailable === true &&
      pseudoError === '' &&
      nom !== '' &&
      prenom !== '' &&
      sexe !== '' &&
      dateError === '' &&
      agreeTerms === true
    );
  }, [pseudo, pseudoAvailable, pseudoError, nom, prenom, sexe, dateError, agreeTerms]);

  // ========================================
  // ACTIONS
  // ========================================

  const handleLogin = async () => {
    if (!isLoginValid()) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (navigation) navigation.navigate('Home', { email });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!isSignupValid()) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      changeMode('otp');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!isForgotValid()) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      changeMode('otp');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!isOtpValid()) {
      setOtpError('Code OTP invalide');
      return;
    }
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (otpValue === '123456') {
        changeMode('complete');
      } else {
        setOtpError('Code incorrect');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    setOtpValue('');
    setOtpError('');
    setResendTimer(60);
    setCanResend(false);
  };

  const handleComplete = async () => {
    if (!isCompleteValid()) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (navigation) navigation.navigate('Welcome', { pseudo });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    if (navigation) navigation.navigate('AuthModal', { provider: 'Google' });
  };

  const handleAppleAuth = () => {
    if (navigation) navigation.navigate('AuthModal', { provider: 'Apple' });
  };

  const handleBack = () => {
    if (mode === 'forgot' || mode === 'otp') {
      changeMode('login');
    } else if (mode === 'signup') {
      changeMode('login');
    }
  };

  // ========================================
  // RENDU SELON MODE
  // ========================================

  const renderLoginForm = () => (
    <Animated.View key="login" entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
      <Text style={[styles.title, { color: colors.text }]}>WOY</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Se connecter</Text>

      <InputField
        label="Email"
        value={email}
        onChangeText={handleEmailChange}
        placeholder="Email"
        icon={MailRounded}
        error={emailError}
        keyboardType="email-address"
        required
        colors={colors}
      />

      <InputField
        label="Mot de passe"
        value={password}
        onChangeText={handlePasswordChange}
        placeholder="Mot de passe"
        icon={Lock}
        secureTextEntry={!showPassword}
        toggleSecure={() => setShowPassword(!showPassword)}
        error={passwordError}
        required
        colors={colors}
      />

      <TouchableOpacity onPress={() => changeMode('forgot')}>
        <Text style={[styles.forgotPasswordLink, { color: colors.text }]}>
          Mot de passe oublié ?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isLoginValid() && !loading ? colors.button : colors.buttonDisabled,
          },
        ]}
        onPress={handleLogin}
        disabled={!isLoginValid() || loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Se connecter</Text>
        )}
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.separatorText, { color: colors.textSecondary }]}>ou</Text>
        <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={[styles.socialButton, { borderColor: colors.border }]}
          onPress={handleGoogleAuth}
        >
          <Google />
          <Text style={[styles.socialText, { color: colors.text }]}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { borderColor: colors.border }]}
          onPress={handleAppleAuth}
        >
          <Ionicons name="logo-apple" size={22} color={colors.text} />
          <Text style={[styles.socialText, { color: colors.text }]}>Apple</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>Pas de compte ? </Text>
        <TouchableOpacity onPress={() => changeMode('signup')}>
          <Text style={[styles.linkText, { color: colors.text }]}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderSignupForm = () => (
    <Animated.View key="signup" entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
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
        colors={colors}
      />

      <InputField
        label="Nom"
        value={nom}
        onChangeText={setNom}
        placeholder="Nom"
        icon={ProfileFill}
        required
        colors={colors}
      />

      <InputField
        label="Prénom"
        value={prenom}
        onChangeText={setPrenom}
        placeholder="Prénom"
        icon={ProfileFill}
        required
        colors={colors}
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
        >
          <Calendar color={colors.textSecondary} size={22} />
          <Text style={[styles.dateText, { color: colors.text }]}>{formatDate(dateNaissance)}</Text>
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
          <View style={styles.messageContainer}>
            <Ionicons name="close-circle" size={14} color={colors.error} />
            <Text style={[styles.messageText, { color: colors.error }]}>{dateError}</Text>
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
        colors={colors}
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
        colors={colors}
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
        colors={colors}
      />

      <Animated.View entering={FadeIn.duration(300)} style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setAgreeTerms(!agreeTerms)} activeOpacity={0.7}>
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: agreeTerms ? colors.checkbox : colors.checkboxUnchecked,
                borderColor: agreeTerms ? colors.checkbox : colors.checkboxUnchecked,
              },
            ]}
          >
            {agreeTerms && <Ionicons name="checkmark" size={16} color={colors.checkboxText} />}
          </View>
        </TouchableOpacity>
        <Text style={[styles.termsText, { color: colors.textSecondary }]}>
          J'accepte les{' '}
          <Text
            style={[styles.termsLink, { color: colors.text }]}
            onPress={() => navigation && navigation.navigate('Terms')}
          >
            conditions d'utilisation
          </Text>{' '}
          et la{' '}
          <Text
            style={[styles.termsLink, { color: colors.text }]}
            onPress={() => navigation && navigation.navigate('Privacy')}
          >
            politique de confidentialité
          </Text>
          <Text style={styles.required}>*</Text>
        </Text>
      </Animated.View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isSignupValid() && !loading ? colors.button : colors.buttonDisabled,
          },
        ]}
        onPress={handleSignup}
        disabled={!isSignupValid() || loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>S'inscrire</Text>
        )}
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.separatorText, { color: colors.textSecondary }]}>ou</Text>
        <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={[styles.socialButton, { borderColor: colors.border }]}
          onPress={handleGoogleAuth}
        >
          <Google />
          <Text style={[styles.socialText, { color: colors.text }]}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { borderColor: colors.border }]}
          onPress={handleAppleAuth}
        >
          <Ionicons name="logo-apple" size={22} color={colors.text} />
          <Text style={[styles.socialText, { color: colors.text }]}>Apple</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>Déjà un compte ? </Text>
        <TouchableOpacity onPress={() => changeMode('login')}>
          <Text style={[styles.linkText, { color: colors.text }]}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderForgotForm = () => (
    <Animated.View key="forgot" entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
      <Text style={[styles.title, { color: colors.text }]}>WOY</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Réinitialiser le mot de passe
      </Text>
      <Text style={[styles.instruction, { color: colors.textSecondary }]}>
        Entrez votre adresse email pour recevoir un code de réinitialisation
      </Text>

      <InputField
        label="Email"
        value={email}
        onChangeText={handleEmailChange}
        placeholder="Email"
        icon={MailRounded}
        error={emailError}
        keyboardType="email-address"
        required
        colors={colors}
      />

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isForgotValid() && !loading ? colors.button : colors.buttonDisabled,
          },
        ]}
        onPress={handleForgotPassword}
        disabled={!isForgotValid() || loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Envoyer</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  const renderOtpForm = () => (
    <Animated.View key="otp" entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
      <Text style={[styles.title, { color: colors.text }]}>WOY</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Vérification OTP</Text>
      <Text style={[styles.instruction, { color: colors.textSecondary }]}>
        Entrez le code à 6 chiffres envoyé à votre email
      </Text>

      <InputField
        label="Code OTP"
        value={otpValue}
        onChangeText={(text) => /^\d{0,6}$/.test(text) && setOtpValue(text)}
        placeholder="123456"
        icon={MailRounded}
        error={otpError}
        keyboardType="numeric"
        maxLength={6}
        required
        colors={colors}
      />

      <View style={styles.resendContainer}>
        <TouchableOpacity onPress={handleResendOtp} disabled={!canResend}>
          <View style={styles.resendRow}>
            <ClockFilled color={canResend ? colors.text : colors.textSecondary} size={22} />
            <Text
              style={[styles.resendText, { color: canResend ? colors.text : colors.textSecondary }]}
            >
              Renvoyer le code {canResend ? '' : `(${resendTimer}s)`}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isOtpValid() && !loading ? colors.button : colors.buttonDisabled,
          },
        ]}
        onPress={handleVerifyOtp}
        disabled={!isOtpValid() || loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Vérifier</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  const renderCompleteForm = () => (
    <Animated.View key="complete" entering={FadeIn.duration(400)} exiting={FadeOut.duration(200)}>
      <Text style={[styles.title, { color: colors.text }]}>Complétez votre profil</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Quelques informations supplémentaires
      </Text>

      <InputField
        label="Pseudo"
        value={pseudo}
        onChangeText={handlePseudoChange}
        placeholder="Pseudo"
        icon={SignAtSolid}
        error={pseudoError}
        success={pseudoAvailable && 'Disponible'}
        required
        colors={colors}
      />

      <InputField
        label="Nom"
        value={nom}
        onChangeText={setNom}
        placeholder="Nom"
        icon={ProfileFill}
        required
        colors={colors}
      />

      <InputField
        label="Prénom"
        value={prenom}
        onChangeText={setPrenom}
        placeholder="Prénom"
        icon={ProfileFill}
        required
        colors={colors}
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
        >
          <Calendar color={colors.textSecondary} size={22} />
          <Text style={[styles.dateText, { color: colors.text }]}>{formatDate(dateNaissance)}</Text>
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
          <View style={styles.messageContainer}>
            <Ionicons name="close-circle" size={14} color={colors.error} />
            <Text style={[styles.messageText, { color: colors.error }]}>{dateError}</Text>
          </View>
        )}
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300)} style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setAgreeTerms(!agreeTerms)} activeOpacity={0.7}>
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: agreeTerms ? colors.checkbox : colors.checkboxUnchecked,
                borderColor: agreeTerms ? colors.checkbox : colors.checkboxUnchecked,
              },
            ]}
          >
            {agreeTerms && <Ionicons name="checkmark" size={16} color={colors.checkboxText} />}
          </View>
        </TouchableOpacity>
        <Text style={[styles.termsText, { color: colors.textSecondary }]}>
          J'accepte les{' '}
          <Text
            style={[styles.termsLink, { color: colors.text }]}
            onPress={() => navigation && navigation.navigate('Terms')}
          >
            conditions d'utilisation
          </Text>{' '}
          et la{' '}
          <Text
            style={[styles.termsLink, { color: colors.text }]}
            onPress={() => navigation && navigation.navigate('Privacy')}
          >
            politique de confidentialité
          </Text>
          <Text style={styles.required}>*</Text>
        </Text>
      </Animated.View>

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isCompleteValid() && !loading ? colors.button : colors.buttonDisabled,
          },
        ]}
        onPress={handleComplete}
        disabled={!isCompleteValid() || loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.buttonText} />
        ) : (
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Terminer</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  // ========================================
  // RENDU PRINCIPAL
  // ========================================

  const shouldShowBackButton = mode === 'forgot' || mode === 'otp' || mode === 'signup';

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
            <View style={styles.container}>
              {shouldShowBackButton && (
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <ArrowBackIosRounded color={colors.text} size={24} />
                </TouchableOpacity>
              )}

              {mode === 'login' && renderLoginForm()}
              {mode === 'signup' && renderSignupForm()}
              {mode === 'forgot' && renderForgotForm()}
              {mode === 'otp' && renderOtpForm()}
              {mode === 'complete' && renderCompleteForm()}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

// ========================================
// STYLES
// ========================================

const styles = StyleSheet.create({
  safeContainer: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, padding: 20, paddingTop: 30, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 20, left: 20, zIndex: 1 },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 30 },
  instruction: { fontSize: 14, textAlign: 'center', marginBottom: 30 },
  fieldContainer: { marginBottom: 16 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  labelWithIcon: { flexDirection: 'row', alignItems: 'center' },
  label: { fontSize: 14, fontWeight: '600' },
  required: {
    fontSize: 14,
    color: '#FF6B6B',
    marginLeft: 4,
    fontWeight: 'bold',
  },
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
  input: { flex: 1, paddingVertical: 14, fontSize: 16, marginLeft: 10 },
  dateText: { flex: 1, paddingVertical: 14, fontSize: 16, marginLeft: 10 },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  messageText: { fontSize: 12, fontWeight: '600' },
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
  forgotPasswordLink: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 24,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  resendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resendText: { fontSize: 14, fontWeight: '500' },
});
