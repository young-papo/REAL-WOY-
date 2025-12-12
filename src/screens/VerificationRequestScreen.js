import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  useColorScheme,
  TextInput,
  Alert,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowBackIosRounded,
  VerifiedCheckFill,
  Upload2Rounded,
  CloseCircle,
} from '../components/icons';

export default function VerificationRequestScreen({ route, navigation }) {
  const hasPendingRequest = route?.params?.hasPendingRequest ?? false;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    headerBg: isDarkMode ? '#1A1A1A' : '#FFFFFF',
    inputBg: isDarkMode ? '#1A1A1A' : '#F5F5F5',
    buttonBg: isDarkMode ? '#FFFFFF' : '#000000',
    buttonText: isDarkMode ? '#000000' : '#FFFFFF',
    errorBorder: '#EF4444',
    uploadedBg: isDarkMode ? '#1E293B' : '#E0F2FE',
    noteBg: isDarkMode ? '#1A1A1A' : '#FEF3C7',
    noteText: isDarkMode ? '#FBBF24' : '#92400E',
    selectedBg: isDarkMode ? '#1E293B' : '#DBEAFE',
  };

  const [fullName, setFullName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [idDocument, setIdDocument] = useState(null);
  const [selfieDocument, setSelfieDocument] = useState(null);
  const [reason, setReason] = useState('');
  const [businessDocument, setBusinessDocument] = useState(null);
  const [links, setLinks] = useState([{ title: '', url: '' }]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValidUrl = (url) => {
    const pattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/i;
    return pattern.test(url);
  };

  const validateDocumentNumber = (type, number) => {
    if (!number) return false;

    switch (type) {
      case 'id':
        return /^\d{10}$/.test(number);
      case 'passport':
        return /^[A-Z]{2}\d{7}$/i.test(number);
      case 'license':
        return /^[A-Z0-9]{8,10}$/i.test(number);
      default:
        return false;
    }
  };

  useEffect(() => {
    if (links.length > 0) {
      const lastLink = links[links.length - 1];
      if (lastLink.url && isValidUrl(lastLink.url) && links.length < 3) {
        setLinks([...links, { title: '', url: '' }]);
      }
    }
  }, [links]);

  const handleBack = () => {
    navigation.goBack();
  };

  const showImagePickerOptions = (setDocument, documentName) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            'Annuler',
            'Prendre une photo',
            'Choisir dans la galerie',
            'Choisir un fichier',
          ],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            takePhoto(setDocument, documentName);
          } else if (buttonIndex === 2) {
            pickImage(setDocument, documentName);
          } else if (buttonIndex === 3) {
            pickDocument(setDocument, documentName);
          }
        }
      );
    } else {
      Alert.alert('Sélectionner', 'Choisissez une option', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Prendre une photo', onPress: () => takePhoto(setDocument, documentName) },
        { text: 'Galerie', onPress: () => pickImage(setDocument, documentName) },
        { text: 'Fichier', onPress: () => pickDocument(setDocument, documentName) },
      ]);
    }
  };

  const takePhoto = async (setDocument, documentName) => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission refusée', "Vous devez autoriser l'accès à la caméra");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setDocument({
          name: `${documentName}_${Date.now()}.jpg`,
          uri: result.assets[0].uri,
          type: 'image',
        });
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    }
  };

  const pickImage = async (setDocument, documentName) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('Permission refusée', "Vous devez autoriser l'accès à la galerie");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setDocument({
          name: `${documentName}_${Date.now()}.jpg`,
          uri: result.assets[0].uri,
          type: 'image',
        });
      }
    } catch (error) {
      Alert.alert('Erreur', "Impossible de sélectionner l'image");
    }
  };

  const pickDocument = async (setDocument, documentName) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success' || !result.canceled) {
        const doc = result.assets ? result.assets[0] : result;
        setDocument({
          name: doc.name,
          uri: doc.uri,
          type: 'document',
        });
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner le fichier');
    }
  };

  const removeDocument = (setDocument) => {
    setDocument(null);
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const removeLink = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    if (newLinks.length === 0) {
      setLinks([{ title: '', url: '' }]);
    } else {
      setLinks(newLinks);
    }
  };

  const getDocumentNumberPlaceholder = () => {
    switch (documentType) {
      case 'id':
        return '10 chiffres (ex: 1234567890)';
      case 'passport':
        return '2 lettres + 7 chiffres (ex: AB1234567)';
      case 'license':
        return '8 à 10 caractères (ex: A1B2C3D4E5)';
      default:
        return 'Numéro du document';
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = true;
    }

    if (!documentType) {
      newErrors.documentType = true;
    }

    if (!documentNumber || !validateDocumentNumber(documentType, documentNumber)) {
      newErrors.documentNumber = true;
    }

    if (!idDocument) {
      newErrors.idDocument = true;
    }

    if (!selfieDocument) {
      newErrors.selfieDocument = true;
    }

    if (!reason.trim()) {
      newErrors.reason = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitted(true);
  };

  if (hasPendingRequest || submitted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={colors.headerBg}
          translucent={false}
        />
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.headerBg,
              borderBottomColor: colors.border,
              paddingTop: insets.top,
            },
          ]}
        >
          <TouchableOpacity onPress={handleBack} style={styles.headerLeft}>
            <ArrowBackIosRounded color={colors.text} size={24} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Demande de vérification
            </Text>
          </View>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.pendingContainer}>
          <VerifiedCheckFill color="#3B82F6" size={80} />
          <Text style={[styles.pendingTitle, { color: colors.text }]}>
            Demande en cours de traitement
          </Text>
          <Text style={[styles.pendingMessage, { color: colors.textSecondary }]}>
            Votre demande de vérification a bien été envoyée. Elle est actuellement en cours de
            traitement par notre équipe. Vous recevrez une notification dès qu'une décision aura été
            prise. Merci pour votre patience.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.headerBg}
        translucent={false}
      />
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBg,
            borderBottomColor: colors.border,
            paddingTop: insets.top,
          },
        ]}
      >
        <TouchableOpacity onPress={handleBack} style={styles.headerLeft}>
          <ArrowBackIosRounded color={colors.text} size={24} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Demande de vérification</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.iconContainer}>
          <VerifiedCheckFill color="#3B82F6" size={48} />
        </View>

        <View style={styles.introSection}>
          <Text style={[styles.introTitle, { color: colors.text }]}>
            Pourquoi se faire vérifier ?
          </Text>
          <Text style={[styles.introText, { color: colors.textSecondary }]}>
            La vérification permet d'assurer que votre compte est authentique, fiable et représente
            réellement la personne ou l'entité qu'il prétend être. Elle aide la communauté à
            reconnaître les profils sérieux et à renforcer la sécurité des échanges.
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.formTitle, { color: colors.text }]}>
            Formulaire de demande de vérification
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            1. Informations personnelles
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Nom complet <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: errors.fullName ? colors.errorBorder : colors.border,
                },
              ]}
              placeholder="Votre nom complet"
              placeholderTextColor={colors.textSecondary}
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) {
                  setErrors({ ...errors, fullName: false });
                }
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Type de document <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.documentTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.documentTypeButton,
                  { borderColor: errors.documentType ? colors.errorBorder : colors.border },
                  documentType === 'id' && { backgroundColor: colors.selectedBg },
                ]}
                onPress={() => {
                  setDocumentType('id');
                  setDocumentNumber('');
                  if (errors.documentType) {
                    setErrors({ ...errors, documentType: false });
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.documentTypeText, { color: colors.text }]}>
                  Carte d'identité
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.documentTypeButton,
                  { borderColor: errors.documentType ? colors.errorBorder : colors.border },
                  documentType === 'passport' && { backgroundColor: colors.selectedBg },
                ]}
                onPress={() => {
                  setDocumentType('passport');
                  setDocumentNumber('');
                  if (errors.documentType) {
                    setErrors({ ...errors, documentType: false });
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.documentTypeText, { color: colors.text }]}>Passeport</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.documentTypeButton,
                  { borderColor: errors.documentType ? colors.errorBorder : colors.border },
                  documentType === 'license' && { backgroundColor: colors.selectedBg },
                ]}
                onPress={() => {
                  setDocumentType('license');
                  setDocumentNumber('');
                  if (errors.documentType) {
                    setErrors({ ...errors, documentType: false });
                  }
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.documentTypeText, { color: colors.text }]}>
                  Permis de conduire
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {documentType && (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Numéro du document <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.inputBg,
                    color: colors.text,
                    borderColor: errors.documentNumber ? colors.errorBorder : colors.border,
                  },
                ]}
                placeholder={getDocumentNumberPlaceholder()}
                placeholderTextColor={colors.textSecondary}
                value={documentNumber}
                onChangeText={(text) => {
                  setDocumentNumber(text.toUpperCase());
                  if (errors.documentNumber) {
                    setErrors({ ...errors, documentNumber: false });
                  }
                }}
                autoCapitalize="characters"
              />
              {documentNumber && !validateDocumentNumber(documentType, documentNumber) && (
                <Text style={[styles.errorText, { color: colors.errorBorder }]}>
                  Format invalide
                </Text>
              )}
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Pièce d'identité officielle <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.noteBox, { backgroundColor: colors.noteBg }]}>
              <Text style={[styles.noteText, { color: colors.noteText }]}>
                Veille à ce que tous les documents soient lisibles et complets. Les informations
                doivent être claires et visibles.
              </Text>
            </View>
            {idDocument ? (
              <View style={[styles.uploadedContainer, { backgroundColor: colors.uploadedBg }]}>
                <Text style={[styles.uploadedText, { color: colors.text }]} numberOfLines={1}>
                  {idDocument.name}
                </Text>
                <TouchableOpacity onPress={() => removeDocument(setIdDocument)} activeOpacity={0.7}>
                  <CloseCircle color="#EF4444" size={24} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  {
                    backgroundColor: colors.inputBg,
                    borderColor: errors.idDocument ? colors.errorBorder : colors.border,
                  },
                ]}
                onPress={() => {
                  showImagePickerOptions(setIdDocument, 'ID');
                  if (errors.idDocument) {
                    setErrors({ ...errors, idDocument: false });
                  }
                }}
                activeOpacity={0.7}
              >
                <Upload2Rounded color={colors.text} size={24} />
                <Text style={[styles.uploadButtonText, { color: colors.text }]}>
                  Téléverser le document
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Selfie avec la pièce d'identité <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.noteBox, { backgroundColor: colors.noteBg }]}>
              <Text style={[styles.noteText, { color: colors.noteText }]}>
                Assure-toi que ton visage est bien visible, que la photo est nette et prise en bonne
                lumière. Évite les filtres ou les angles qui cachent ton visage.
              </Text>
            </View>
            {selfieDocument ? (
              <View style={[styles.uploadedContainer, { backgroundColor: colors.uploadedBg }]}>
                <Text style={[styles.uploadedText, { color: colors.text }]} numberOfLines={1}>
                  {selfieDocument.name}
                </Text>
                <TouchableOpacity
                  onPress={() => removeDocument(setSelfieDocument)}
                  activeOpacity={0.7}
                >
                  <CloseCircle color="#EF4444" size={24} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  {
                    backgroundColor: colors.inputBg,
                    borderColor: errors.selfieDocument ? colors.errorBorder : colors.border,
                  },
                ]}
                onPress={() => {
                  showImagePickerOptions(setSelfieDocument, 'Selfie');
                  if (errors.selfieDocument) {
                    setErrors({ ...errors, selfieDocument: false });
                  }
                }}
                activeOpacity={0.7}
              >
                <Upload2Rounded color={colors.text} size={24} />
                <Text style={[styles.uploadButtonText, { color: colors.text }]}>
                  Téléverser la photo
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            2. Raison de la vérification
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Courte description <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: errors.reason ? colors.errorBorder : colors.border,
                },
              ]}
              placeholder="Explique pourquoi ton compte mérite d'être vérifié (ex. : activité réelle, notoriété, projet professionnel)"
              placeholderTextColor={colors.textSecondary}
              value={reason}
              onChangeText={(text) => {
                setReason(text);
                if (errors.reason) {
                  setErrors({ ...errors, reason: false });
                }
              }}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            3. Preuves professionnelles ou institutionnelles
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Document professionnel</Text>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Si tu représentes une marque ou entreprise
            </Text>
            {businessDocument ? (
              <View style={[styles.uploadedContainer, { backgroundColor: colors.uploadedBg }]}>
                <Text style={[styles.uploadedText, { color: colors.text }]} numberOfLines={1}>
                  {businessDocument.name}
                </Text>
                <TouchableOpacity
                  onPress={() => removeDocument(setBusinessDocument)}
                  activeOpacity={0.7}
                >
                  <CloseCircle color="#EF4444" size={24} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.uploadButton,
                  { backgroundColor: colors.inputBg, borderColor: colors.border },
                ]}
                onPress={() => showImagePickerOptions(setBusinessDocument, 'Business')}
                activeOpacity={0.7}
              >
                <Upload2Rounded color={colors.text} size={24} />
                <Text style={[styles.uploadButtonText, { color: colors.text }]}>
                  Certificat, page professionnelle, email officiel
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            4. Informations supplémentaires
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Réseaux sociaux ou sites web
            </Text>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Maximum 3 liens
            </Text>

            {links.map((link, index) => (
              <View key={index} style={styles.linkItemContainer}>
                <Text style={[styles.linkNumber, { color: colors.text }]}>Lien {index + 1}</Text>
                <View
                  style={[
                    styles.linkContainer,
                    { backgroundColor: colors.inputBg, borderColor: colors.border },
                  ]}
                >
                  <TextInput
                    style={[styles.linkTitleInput, { color: colors.text }]}
                    placeholder="Titre du lien"
                    placeholderTextColor={colors.textSecondary}
                    value={link.title}
                    onChangeText={(text) => handleLinkChange(index, 'title', text)}
                  />
                  <TextInput
                    style={[styles.linkUrlInput, { color: colors.text }]}
                    placeholder="https://exemple.com"
                    placeholderTextColor={colors.textSecondary}
                    value={link.url}
                    onChangeText={(text) => handleLinkChange(index, 'url', text)}
                    autoCapitalize="none"
                    keyboardType="url"
                  />
                  {link.url && !isValidUrl(link.url) && (
                    <Text style={[styles.invalidUrlText, { color: colors.errorBorder }]}>
                      URL invalide
                    </Text>
                  )}
                </View>
                {links.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeLink(index)}
                    style={styles.removeLinkButton}
                    activeOpacity={0.7}
                  >
                    <CloseCircle color="#EF4444" size={24} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={[styles.instructionsTitle, { color: colors.text }]}>Instructions :</Text>
            <Text style={[styles.instructionsText, { color: colors.textSecondary }]}>
              • Tous les documents doivent être lisibles et authentiques.{'\n'}• Plus le formulaire
              est complet, plus la vérification sera rapide et fiable.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.buttonBg }]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={isSubmitting}
          >
            <Text style={[styles.submitButtonText, { color: colors.buttonText }]}>
              {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

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
  headerLeft: { width: 40, alignItems: 'flex-start' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerRight: { width: 40 },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 24 },
  iconContainer: { alignItems: 'center', marginBottom: 24 },
  introSection: { paddingHorizontal: 24, marginBottom: 32 },
  introTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  introText: { fontSize: 14, lineHeight: 22, textAlign: 'center' },
  formSection: { paddingHorizontal: 24 },
  formTitle: { fontSize: 18, fontWeight: '700', marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16, marginTop: 8 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  required: { color: '#EF4444' },
  helperText: { fontSize: 12, marginBottom: 8, lineHeight: 18 },
  noteBox: { padding: 12, borderRadius: 8, marginBottom: 12 },
  noteText: { fontSize: 12, lineHeight: 18 },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    fontSize: 14,
    borderWidth: 1,
    minHeight: 120,
  },
  documentTypeContainer: { gap: 10 },
  documentTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  documentTypeText: { fontSize: 14, fontWeight: '600' },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  uploadButtonText: { fontSize: 14, flex: 1 },
  uploadedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
  },
  uploadedText: { fontSize: 14, flex: 1, marginRight: 12 },
  linkItemContainer: { marginBottom: 16 },
  linkNumber: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  linkContainer: { padding: 12, borderRadius: 8, borderWidth: 1 },
  linkTitleInput: {
    fontSize: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 8,
  },
  linkUrlInput: { fontSize: 14, paddingVertical: 8 },
  invalidUrlText: { fontSize: 11, marginTop: 4 },
  removeLinkButton: { alignSelf: 'flex-end', marginTop: 8 },
  errorText: { fontSize: 12, marginTop: 4 },
  instructionsContainer: { marginTop: 16, marginBottom: 24 },
  instructionsTitle: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  instructionsText: { fontSize: 13, lineHeight: 20 },
  submitButton: { paddingVertical: 16, borderRadius: 10, alignItems: 'center' },
  submitButtonText: { fontSize: 16, fontWeight: '700' },
  pendingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  pendingTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  pendingMessage: { fontSize: 14, lineHeight: 22, textAlign: 'center' },
});
