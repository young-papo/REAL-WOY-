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
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import InputField from '../components/InputField';
import { MailRounded, Lock, Google } from '../components/icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    button: isDarkMode ? '#FFFFFF' : '#000000',
    buttonText: isDarkMode ? '#000000' : '#FFFFFF',
    buttonDisabled: '#D3D3D3',
    border: isDarkMode ? '#333333' : '#E0E0E0',
  };

  const validateEmail = useCallback((text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(text);
  }, []);

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError(text.length > 0 && !validateEmail(text) ? 'Email invalide' : '');
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordError(text.length > 0 && text.length < 8 ? 'Minimum 8 caractères' : '');
  };

  const isFormValid = useCallback(() => (
    email !== '' &&
    validateEmail(email) &&
    emailError === '' &&
    password !== '' &&
    password.length >= 8 &&
    passwordError === ''
  ), [email, emailError, password, passwordError, validateEmail]);

  const handleLogin = () => {
    if (!isFormValid()) {
      navigation.navigate('ErrorModal', { message: 'Veuillez remplir correctement tous les champs' });
      return;
    }
    navigation.navigate('Home', { email });
  };

  const handleGoogleLogin = () => {
    navigation.navigate('AuthModal', { provider: 'Google' });
  };

  const handleAppleLogin = () => {
    navigation.navigate('AuthModal', { provider: 'Apple' });
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Signup');
  };

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
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
              error={passwordError}
              required
              accessibilityLabel="Entrer votre mot de passe"
            />

            <TouchableOpacity onPress={handleForgotPassword} accessibilityLabel="Mot de passe oublié">
              <Text style={[styles.forgotPasswordLink, { color: colors.text }]}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: isFormValid() ? colors.button : colors.buttonDisabled },
              ]}
              onPress={handleLogin}
              disabled={!isFormValid()}
              accessibilityLabel="Se connecter"
            >
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>Se connecter</Text>
            </TouchableOpacity>

            <View style={styles.separatorContainer}>
              <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.separatorText, { color: colors.textSecondary }]}>ou</Text>
              <View style={[styles.separatorLine, { backgroundColor: colors.border }]} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={[styles.socialButton, { borderColor: colors.border }]}
                onPress={handleGoogleLogin}
                accessibilityLabel="Se connecter avec Google"
              >
                <Google />
                <Text style={[styles.socialText, { color: colors.text }]}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.socialButton, { borderColor: colors.border }]}
                onPress={handleAppleLogin}
                accessibilityLabel="Se connecter avec Apple"
              >
                <Ionicons name="logo-apple" size={22} color={colors.text} />
                <Text style={[styles.socialText, { color: colors.text }]}>Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>Pas de compte ? </Text>
              <TouchableOpacity onPress={handleRegister} accessibilityLabel="S'inscrire">
                <Text style={[styles.linkText, { color: colors.text }]}>S'inscrire</Text>
              </TouchableOpacity>
            </View>
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
  forgotPasswordLink: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 24,
    textDecorationLine: 'underline',
    textAlign: 'right',
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
});
