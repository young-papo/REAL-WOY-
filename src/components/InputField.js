import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

/**
 * Composant InputField réutilisable
 * Utilisé dans les écrans d'authentification (Login, Signup)
 */
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon: Icon,
  error,
  secureTextEntry,
  toggleSecure,
  keyboardType,
  accessibilityLabel,
  required,
  ...props
}) => {
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

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.fieldContainer}>
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
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityLabel={accessibilityLabel}
          {...props}
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
        <View style={styles.errorContainer}>
          <Ionicons name="close-circle" size={14} color={colors.error} />
          <Text style={[styles.errorMessage, { color: colors.error }]}>{error}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
  input: { flex: 1, paddingVertical: 14, fontSize: 16 },
  errorContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  errorMessage: { fontSize: 12, fontWeight: '600' },
});

export default InputField;
