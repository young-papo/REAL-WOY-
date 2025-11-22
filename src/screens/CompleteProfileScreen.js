import React, { useState, useCallback } from 'react';
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
import {
  SignAtSolid,
  ProfileFill,
  Calendar,
} from '../components/icons';

// ========================================
// COMPOSANT INPUT FIELD
// ========================================

const InputField = ({ label, value, onChangeText, placeholder, icon: Icon, error, success, required }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const inputColors = {
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    inputBg: isDarkMode ? '#1A1A1A' : '#F2F2F2',
    inputBorder: isDarkMode ? '#333333' : '#E0E0E0',
    placeholder: '#BDBDBD',
    error: '#FF6B6B',
    success: '#22C55E',
  };

  return (
    <View style={styles.fieldContainer}>
      <View style={styles.labelRow}>
        <View style={styles.labelWithIcon}>
          <Text style={[styles.label, { color: inputColors.text }]}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      </View>

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: inputColors.inputBg,
            borderColor: error ? inputColors.error : inputColors.inputBorder,
          },
        ]}
      >
        <Icon color={inputColors.textSecondary} size={22} />
        <TextInput
          style={[styles.input, { color: inputColors.text }]}
          placeholder={placeholder}
          placeholderTextColor={inputColors.placeholder}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {error && (
        <View style={styles.messageContainer}>
          <Ionicons name="close-circle" size={14} color={inputColors.error} />
          <Text style={[styles.messageText, { color: inputColors.error }]}>{error}</Text>
        </View>
      )}

      {success && (
        <View style={styles.messageContainer}>
          <Ionicons name="checkmark-circle" size={14} color={inputColors.success} />
          <Text style={[styles.messageText, { color: inputColors.success }]}>{success}</Text>
        </View>
      )}
    </View>
  );
};

// ========================================
// COMPOSANT SEXE SELECTOR
// ========================================

const SexeSelector = ({ value, onChange, colors }) => (
  <View style={styles.fieldContainer}>
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
  </View>
);

// ========================================
// COMPOSANT PRINCIPAL
// ========================================

export default function CompleteProfileScreen({ route, navigation }) {
  // Récupération des paramètres de navigation
  const { userData = {}, authProvider = 'email' } = route?.params || {};

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Couleurs dynamiques
  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    inputBg: isDarkMode ? '#1A1A1A' : '#F2F2F2',
    inputBorder: isDarkMode ? '#333333' : '#E0E0E0',
    button: isDarkMode ? '#FFFFFF' : '#000000',
    buttonText: isDarkMode ? '#000000' : '#FFFFFF',
    buttonDisabled: '#D3D3D3',
    checkbox: isDarkMode ? '#FFFFFF' : '#000000',
    checkboxUnchecked: isDarkMode ? '#333333' : '#E0E0E0',
    checkboxText: isDarkMode ? '#000000' : '#FFFFFF',
    error: '#FF6B6B',
  };

  // États pour les champs
  const [pseudo, setPseudo] = useState(userData?.username || '');
  const [pseudoError, setPseudoError] = useState('');
  const [pseudoAvailable, setPseudoAvailable] = useState(null);

  const [nom, setNom] = useState(userData?.lastName || '');
  const [prenom, setPrenom] = useState(userData?.firstName || '');
  const [sexe, setSexe] = useState(userData?.gender || '');

  const [dateNaissance, setDateNaissance] = useState(
    userData?.birthDate ? new Date(userData.birthDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateError, setDateError] = useState('');

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Détermination des champs manquants
  const [missingFields] = useState({
    username: !userData?.username,
    firstName: !userData?.firstName,
    lastName: !userData?.lastName,
    gender: !userData?.gender,
    birthDate: !userData?.birthDate,
  });

  // Liste des pseudos déjà pris (simulé)
  const takenPseudos = ['john', 'marie', 'alex', 'luxe', 'sport', 'fashion'];

  // ========================================
  // VALIDATION DU PSEUDO
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
  // VALIDATION DE LA DATE
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
  // VALIDATION DU FORMULAIRE
  // ========================================

  const isFormValid = useCallback(() => {
    let valid = true;

    if (missingFields.username) {
      valid = valid && pseudo.length >= 3 && pseudoAvailable === true && pseudoError === '';
    }

    if (missingFields.firstName) {
      valid = valid && prenom.trim() !== '';
    }

    if (missingFields.lastName) {
      valid = valid && nom.trim() !== '';
    }

    if (missingFields.gender) {
      valid = valid && sexe !== '';
    }

    if (missingFields.birthDate) {
      valid = valid && dateError === '';
    }

    valid = valid && agreeTerms === true;

    return valid;
  }, [
    missingFields,
    pseudo,
    pseudoAvailable,
    pseudoError,
    prenom,
    nom,
    sexe,
    dateError,
    agreeTerms,
  ]);

  // ========================================
  // SOUMISSION DU FORMULAIRE
  // ========================================

  const handleComplete = async () => {
    if (!isFormValid()) {
      alert('Veuillez remplir correctement tous les champs obligatoires');
      return;
    }

    setLoading(true);

    try {
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const completeUserData = {
        ...userData,
        username: pseudo,
        firstName: prenom,
        lastName: nom,
        gender: sexe,
        birthDate: dateNaissance.toISOString(),
        termsAccepted: agreeTerms,
        profileComplete: true,
      };

      console.log('Profil complété:', completeUserData);

      // Navigation vers l'écran de bienvenue
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome', params: { pseudo, authProvider } }],
      });
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // NAVIGATION VERS CONDITIONS
  // ========================================

  const handleTermsPress = () => {
    if (navigation) {
      navigation.navigate('Terms');
    }
  };

  const handlePrivacyPress = () => {
    if (navigation) {
      navigation.navigate('Privacy');
    }
  };

  // ========================================
  // RENDU
  // ========================================

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
              {/* TITRE */}
              <Text style={[styles.title, { color: colors.text }]}>Complétez votre profil</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Quelques informations supplémentaires sont nécessaires
              </Text>

              {/* PSEUDO */}
              {missingFields.username && (
                <InputField
                  label="Pseudo"
                  value={pseudo}
                  onChangeText={handlePseudoChange}
                  placeholder="Pseudo"
                  icon={SignAtSolid}
                  error={pseudoError}
                  success={pseudoAvailable && 'Disponible'}
                  required
                />
              )}

              {/* NOM */}
              {missingFields.lastName && (
                <InputField
                  label="Nom"
                  value={nom}
                  onChangeText={setNom}
                  placeholder="Nom"
                  icon={ProfileFill}
                  required
                />
              )}

              {/* PRÉNOM */}
              {missingFields.firstName && (
                <InputField
                  label="Prénom"
                  value={prenom}
                  onChangeText={setPrenom}
                  placeholder="Prénom"
                  icon={ProfileFill}
                  required
                />
              )}

              {/* SEXE */}
              {missingFields.gender && <SexeSelector value={sexe} onChange={setSexe} colors={colors} />}

              {/* DATE DE NAISSANCE */}
              {missingFields.birthDate && (
                <View style={styles.fieldContainer}>
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
                    <View style={styles.messageContainer}>
                      <Ionicons name="close-circle" size={14} color={colors.error} />
                      <Text style={[styles.messageText, { color: colors.error }]}>{dateError}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* ACCEPTATION DES CONDITIONS */}
              <View style={styles.checkboxContainer}>
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
                  <Text style={[styles.termsLink, { color: colors.text }]} onPress={handleTermsPress}>
                    conditions d'utilisation
                  </Text>{' '}
                  et la{' '}
                  <Text style={[styles.termsLink, { color: colors.text }]} onPress={handlePrivacyPress}>
                    politique de confidentialité
                  </Text>
                  <Text style={styles.required}>*</Text>
                </Text>
              </View>

              {/* BOUTON DE SOUMISSION */}
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: isFormValid() && !loading ? colors.button : colors.buttonDisabled,
                  },
                ]}
                onPress={handleComplete}
                disabled={!isFormValid() || loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.buttonText} />
                ) : (
                  <Text style={[styles.buttonText, { color: colors.buttonText }]}>Terminer</Text>
                )}
              </TouchableOpacity>
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
  safeContainer: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
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
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    marginLeft: 10,
  },
  dateText: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    marginLeft: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  messageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sexeContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  sexeOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sexeLabel: {
    fontSize: 14,
    marginLeft: 8,
  },
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
  termsText: {
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
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
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
