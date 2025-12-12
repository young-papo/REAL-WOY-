import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import {
  ArrowBackIosRounded,
  Close,
  CloseCircleFill,
  EyeOutline,
  Pencil,
  RoundFileUpload,
  PictureSolid,
  CameraFilled,
  FolderFilled,
  TriangleInvertedFilled,
  MapMarkerAlt,
  Plus,
  ChevronRight,
  BoxBold,
  Megaphone,
} from '../components/icons';

const { width, height } = Dimensions.get('window');

const CreateScreen = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  // Tab state
  const [activeTab, setActiveTab] = useState('product'); // 'product' or 'request'

  // Form states
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(null);
  const [condition, setCondition] = useState(null);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [location, setLocation] = useState(null);
  const [deliveryOptions, setDeliveryOptions] = useState({
    shipping: true,
    meetup: true,
  });

  // Modal states
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Animation
  const modalAnimation = useRef(new Animated.Value(0)).current;

  // Data options
  const categories = [
    { id: 1, name: 'Vêtements', icon: '👕' },
    { id: 2, name: 'Chaussures', icon: '👟' },
    { id: 3, name: 'Accessoires', icon: '👜' },
    { id: 4, name: 'Électronique', icon: '📱' },
    { id: 5, name: 'Maison', icon: '🏠' },
    { id: 6, name: 'Sport', icon: '⚽' },
    { id: 7, name: 'Beauté', icon: '💄' },
    { id: 8, name: 'Livres', icon: '📚' },
    { id: 9, name: 'Jeux', icon: '🎮' },
    { id: 10, name: 'Autre', icon: '📦' },
  ];

  const conditions = [
    { id: 1, name: 'Neuf avec étiquette', description: 'Article jamais porté avec étiquettes' },
    { id: 2, name: 'Neuf sans étiquette', description: 'Article jamais porté sans étiquettes' },
    { id: 3, name: 'Très bon état', description: 'Porté quelques fois, sans défauts' },
    { id: 4, name: 'Bon état', description: 'Porté plusieurs fois, légères traces' },
    { id: 5, name: 'État satisfaisant', description: 'Signes d\'usure visibles' },
  ];

  const sizes = [
    { id: 1, name: 'XS' },
    { id: 2, name: 'S' },
    { id: 3, name: 'M' },
    { id: 4, name: 'L' },
    { id: 5, name: 'XL' },
    { id: 6, name: 'XXL' },
    { id: 7, name: 'Unique' },
  ];

  const colors = [
    { id: 1, name: 'Noir', hex: '#000000' },
    { id: 2, name: 'Blanc', hex: '#FFFFFF' },
    { id: 3, name: 'Gris', hex: '#808080' },
    { id: 4, name: 'Rouge', hex: '#FF0000' },
    { id: 5, name: 'Bleu', hex: '#0000FF' },
    { id: 6, name: 'Vert', hex: '#00FF00' },
    { id: 7, name: 'Jaune', hex: '#FFFF00' },
    { id: 8, name: 'Orange', hex: '#FFA500' },
    { id: 9, name: 'Rose', hex: '#FFC0CB' },
    { id: 10, name: 'Violet', hex: '#800080' },
    { id: 11, name: 'Marron', hex: '#8B4513' },
    { id: 12, name: 'Beige', hex: '#F5F5DC' },
  ];

  const theme = {
    background: isDark ? '#000000' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#000000',
    textSecondary: isDark ? '#A0A0A0' : '#666666',
    card: isDark ? '#1C1C1E' : '#F5F5F5',
    border: isDark ? '#2C2C2E' : '#E0E0E0',
    primary: '#8B5CF6',
    inputBackground: isDark ? '#1C1C1E' : '#F5F5F5',
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Image picker functions
  const handleImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 10 - images.length,
    });

    if (!result.canceled) {
      const newImages = result.assets.map(asset => ({
        uri: asset.uri,
        type: 'image',
      }));
      setImages([...images, ...newImages].slice(0, 10));
    }
    setShowImagePicker(false);
  };

  const handleImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages([...images, { uri: result.assets[0].uri, type: 'image' }].slice(0, 10));
    }
    setShowImagePicker(false);
  };

  const handleImageFromFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        multiple: true,
      });

      if (!result.canceled) {
        const newImages = result.assets.map(asset => ({
          uri: asset.uri,
          type: 'file',
        }));
        setImages([...images, ...newImages].slice(0, 10));
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
    setShowImagePicker(false);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Location functions
  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    const [address] = await Location.reverseGeocodeAsync({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    if (address) {
      setLocation({
        name: `${address.city || address.region}, ${address.country}`,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    }
    setShowLocationModal(false);
  };

  // Modal animation
  const openModal = (setModalState) => {
    setModalState(true);
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = (setModalState) => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalState(false));
  };

  // Publish function
  const handlePublish = () => {
    // Validation
    if (images.length === 0) {
      return;
    }
    if (!title.trim()) {
      return;
    }
    if (!description.trim()) {
      return;
    }
    if (activeTab === 'product' && !price.trim()) {
      return;
    }
    if (!category) {
      return;
    }

    // Show preview
    setShowPreviewModal(true);
  };

  const confirmPublish = () => {
    // Here you would send data to Firebase
    console.log('Publishing:', {
      type: activeTab,
      images,
      title,
      description,
      price: activeTab === 'product' ? price : null,
      category,
      condition,
      size,
      color,
      location,
      deliveryOptions,
    });
    setShowPreviewModal(false);
    navigation.goBack();
  };

  // Render image picker modal
  const renderImagePickerModal = () => (
    <Modal
      visible={showImagePicker}
      transparent
      animationType="fade"
      onRequestClose={() => setShowImagePicker(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowImagePicker(false)}
      >
        <View style={[styles.imagePickerModal, { backgroundColor: theme.card }]}>
          <Text style={[styles.imagePickerTitle, { color: theme.text }]}>
            Ajouter une image
          </Text>

          <TouchableOpacity
            style={[styles.imagePickerOption, { borderBottomColor: theme.border }]}
            onPress={handleImageFromGallery}
          >
            <PictureSolid color={theme.primary} size={24} />
            <Text style={[styles.imagePickerOptionText, { color: theme.text }]}>
              Galerie
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.imagePickerOption, { borderBottomColor: theme.border }]}
            onPress={handleImageFromCamera}
          >
            <CameraFilled color={theme.primary} size={24} />
            <Text style={[styles.imagePickerOptionText, { color: theme.text }]}>
              Appareil photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.imagePickerOption}
            onPress={handleImageFromFiles}
          >
            <FolderFilled color={theme.primary} size={24} />
            <Text style={[styles.imagePickerOptionText, { color: theme.text }]}>
              Fichiers
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // Render category modal
  const renderCategoryModal = () => (
    <Modal
      visible={showCategoryModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCategoryModal(false)}
    >
      <View style={[styles.fullModal, { backgroundColor: theme.background }]}>
        <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
            <Close color={theme.text} size={24} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Catégorie</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.optionItem,
                { borderBottomColor: theme.border },
                category?.id === item.id && { backgroundColor: theme.primary + '20' },
              ]}
              onPress={() => {
                setCategory(item);
                setShowCategoryModal(false);
              }}
            >
              <Text style={styles.optionIcon}>{item.icon}</Text>
              <Text style={[styles.optionText, { color: theme.text }]}>{item.name}</Text>
              {category?.id === item.id && (
                <Text style={[styles.checkmark, { color: theme.primary }]}>✓</Text>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );

  // Render condition modal
  const renderConditionModal = () => (
    <Modal
      visible={showConditionModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowConditionModal(false)}
    >
      <View style={[styles.fullModal, { backgroundColor: theme.background }]}>
        <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => setShowConditionModal(false)}>
            <Close color={theme.text} size={24} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.text }]}>État</Text>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={conditions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.conditionItem,
                { borderBottomColor: theme.border },
                condition?.id === item.id && { backgroundColor: theme.primary + '20' },
              ]}
              onPress={() => {
                setCondition(item);
                setShowConditionModal(false);
              }}
            >
              <View style={styles.conditionContent}>
                <Text style={[styles.conditionName, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.conditionDesc, { color: theme.textSecondary }]}>
                  {item.description}
                </Text>
              </View>
              {condition?.id === item.id && (
                <Text style={[styles.checkmark, { color: theme.primary }]}>✓</Text>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );

  // Render size modal
  const renderSizeModal = () => (
    <Modal
      visible={showSizeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSizeModal(false)}
    >
      <View style={[styles.fullModal, { backgroundColor: theme.background }]}>
        <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => setShowSizeModal(false)}>
            <Close color={theme.text} size={24} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Taille</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.sizeGrid}>
          {sizes.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.sizeItem,
                { backgroundColor: theme.card, borderColor: theme.border },
                size?.id === item.id && {
                  backgroundColor: theme.primary,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => {
                setSize(item);
                setShowSizeModal(false);
              }}
            >
              <Text style={[
                styles.sizeText,
                { color: size?.id === item.id ? '#FFFFFF' : theme.text },
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  // Render color modal
  const renderColorModal = () => (
    <Modal
      visible={showColorModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowColorModal(false)}
    >
      <View style={[styles.fullModal, { backgroundColor: theme.background }]}>
        <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => setShowColorModal(false)}>
            <Close color={theme.text} size={24} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Couleur</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.colorGrid}>
          {colors.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.colorItem,
                color?.id === item.id && styles.colorItemSelected,
              ]}
              onPress={() => {
                setColor(item);
                setShowColorModal(false);
              }}
            >
              <View style={[
                styles.colorSwatch,
                { backgroundColor: item.hex },
                item.hex === '#FFFFFF' && { borderWidth: 1, borderColor: theme.border },
              ]} />
              <Text style={[styles.colorName, { color: theme.text }]}>{item.name}</Text>
              {color?.id === item.id && (
                <Text style={[styles.checkmark, { color: theme.primary }]}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  // Render location modal
  const renderLocationModal = () => (
    <Modal
      visible={showLocationModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowLocationModal(false)}
    >
      <View style={[styles.fullModal, { backgroundColor: theme.background }]}>
        <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => setShowLocationModal(false)}>
            <Close color={theme.text} size={24} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Localisation</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.locationOptions}>
          <TouchableOpacity
            style={[styles.locationOption, { backgroundColor: theme.card }]}
            onPress={getCurrentLocation}
          >
            <MapMarkerAlt color={theme.primary} size={24} />
            <View style={styles.locationOptionContent}>
              <Text style={[styles.locationOptionTitle, { color: theme.text }]}>
                Position actuelle
              </Text>
              <Text style={[styles.locationOptionDesc, { color: theme.textSecondary }]}>
                Utiliser ma position GPS
              </Text>
            </View>
            <ChevronRight color={theme.textSecondary} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Render preview modal
  const renderPreviewModal = () => (
    <Modal
      visible={showPreviewModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowPreviewModal(false)}
    >
      <View style={[styles.fullModal, { backgroundColor: theme.background }]}>
        <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => setShowPreviewModal(false)}>
            <Close color={theme.text} size={24} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.text }]}>Aperçu</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.previewContent}>
          {images.length > 0 && (
            <Image source={{ uri: images[0].uri }} style={styles.previewImage} />
          )}

          <View style={styles.previewInfo}>
            <Text style={[styles.previewTitle, { color: theme.text }]}>{title}</Text>
            {activeTab === 'product' && (
              <Text style={[styles.previewPrice, { color: theme.primary }]}>
                {price} FCFA
              </Text>
            )}
            <Text style={[styles.previewDescription, { color: theme.textSecondary }]}>
              {description}
            </Text>

            <View style={styles.previewDetails}>
              {category && (
                <View style={styles.previewDetail}>
                  <Text style={[styles.previewDetailLabel, { color: theme.textSecondary }]}>
                    Catégorie
                  </Text>
                  <Text style={[styles.previewDetailValue, { color: theme.text }]}>
                    {category.icon} {category.name}
                  </Text>
                </View>
              )}
              {condition && (
                <View style={styles.previewDetail}>
                  <Text style={[styles.previewDetailLabel, { color: theme.textSecondary }]}>
                    État
                  </Text>
                  <Text style={[styles.previewDetailValue, { color: theme.text }]}>
                    {condition.name}
                  </Text>
                </View>
              )}
              {size && (
                <View style={styles.previewDetail}>
                  <Text style={[styles.previewDetailLabel, { color: theme.textSecondary }]}>
                    Taille
                  </Text>
                  <Text style={[styles.previewDetailValue, { color: theme.text }]}>
                    {size.name}
                  </Text>
                </View>
              )}
              {color && (
                <View style={styles.previewDetail}>
                  <Text style={[styles.previewDetailLabel, { color: theme.textSecondary }]}>
                    Couleur
                  </Text>
                  <View style={styles.previewColorRow}>
                    <View style={[styles.previewColorSwatch, { backgroundColor: color.hex }]} />
                    <Text style={[styles.previewDetailValue, { color: theme.text }]}>
                      {color.name}
                    </Text>
                  </View>
                </View>
              )}
              {location && (
                <View style={styles.previewDetail}>
                  <Text style={[styles.previewDetailLabel, { color: theme.textSecondary }]}>
                    Localisation
                  </Text>
                  <Text style={[styles.previewDetailValue, { color: theme.text }]}>
                    {location.name}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.previewFooter, { paddingBottom: insets.bottom + 10 }]}>
          <TouchableOpacity
            style={[styles.editButton, { borderColor: theme.primary }]}
            onPress={() => setShowPreviewModal(false)}
          >
            <Pencil color={theme.primary} size={18} />
            <Text style={[styles.editButtonText, { color: theme.primary }]}>Modifier</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={confirmPublish}>
            <LinearGradient
              colors={['#8B5CF6', '#A78BFA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.publishButtonGradient}
            >
              <RoundFileUpload color="#FFFFFF" size={18} />
              <Text style={styles.publishButtonText}>Publier</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowBackIosRounded color={theme.text} size={20} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Créer</Text>
          <TouchableOpacity
            onPress={() => setShowPreviewModal(true)}
            style={styles.previewButton}
          >
            <EyeOutline color={theme.primary} size={24} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={[styles.tabContainer, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'product' && styles.tabActive,
              activeTab === 'product' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setActiveTab('product')}
          >
            <BoxBold color={activeTab === 'product' ? '#FFFFFF' : theme.textSecondary} size={16} />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'product' ? '#FFFFFF' : theme.textSecondary },
            ]}>
              Produit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'request' && styles.tabActive,
              activeTab === 'request' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setActiveTab('request')}
          >
            <Megaphone color={activeTab === 'request' ? '#FFFFFF' : theme.textSecondary} size={16} />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'request' ? '#FFFFFF' : theme.textSecondary },
            ]}>
              Requête
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {/* Images Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Photos ({images.length}/10)
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.imagesRow}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <CloseCircleFill size={20} />
                    </TouchableOpacity>
                  </View>
                ))}

                {images.length < 10 && (
                  <TouchableOpacity
                    style={[styles.addImageButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={() => setShowImagePicker(true)}
                  >
                    <Plus color={theme.primary} size={32} />
                    <Text style={[styles.addImageText, { color: theme.textSecondary }]}>
                      Ajouter
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>

          {/* Title */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Titre *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text }]}
              placeholder="Ex: T-shirt Nike noir taille M"
              placeholderTextColor={theme.textSecondary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Text style={[styles.charCount, { color: theme.textSecondary }]}>
              {title.length}/100
            </Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Description *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: theme.inputBackground, color: theme.text },
              ]}
              placeholder="Décrivez votre article en détail..."
              placeholderTextColor={theme.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={1000}
            />
            <Text style={[styles.charCount, { color: theme.textSecondary }]}>
              {description.length}/1000
            </Text>
          </View>

          {/* Price (only for products) */}
          {activeTab === 'product' && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Prix *</Text>
              <View style={[styles.priceInput, { backgroundColor: theme.inputBackground }]}>
                <TextInput
                  style={[styles.priceField, { color: theme.text }]}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
                <Text style={[styles.currency, { color: theme.textSecondary }]}>FCFA</Text>
              </View>
            </View>
          )}

          {/* Category */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Catégorie *</Text>
            <TouchableOpacity
              style={[styles.selector, { backgroundColor: theme.inputBackground }]}
              onPress={() => setShowCategoryModal(true)}
            >
              <Text style={[
                styles.selectorText,
                { color: category ? theme.text : theme.textSecondary },
              ]}>
                {category ? `${category.icon} ${category.name}` : 'Sélectionner une catégorie'}
              </Text>
              <TriangleInvertedFilled color={theme.textSecondary} size={12} />
            </TouchableOpacity>
          </View>

          {/* Condition */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>État</Text>
            <TouchableOpacity
              style={[styles.selector, { backgroundColor: theme.inputBackground }]}
              onPress={() => setShowConditionModal(true)}
            >
              <Text style={[
                styles.selectorText,
                { color: condition ? theme.text : theme.textSecondary },
              ]}>
                {condition ? condition.name : 'Sélectionner l\'état'}
              </Text>
              <TriangleInvertedFilled color={theme.textSecondary} size={12} />
            </TouchableOpacity>
          </View>

          {/* Size */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Taille</Text>
            <TouchableOpacity
              style={[styles.selector, { backgroundColor: theme.inputBackground }]}
              onPress={() => setShowSizeModal(true)}
            >
              <Text style={[
                styles.selectorText,
                { color: size ? theme.text : theme.textSecondary },
              ]}>
                {size ? size.name : 'Sélectionner la taille'}
              </Text>
              <TriangleInvertedFilled color={theme.textSecondary} size={12} />
            </TouchableOpacity>
          </View>

          {/* Color */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Couleur</Text>
            <TouchableOpacity
              style={[styles.selector, { backgroundColor: theme.inputBackground }]}
              onPress={() => setShowColorModal(true)}
            >
              {color ? (
                <View style={styles.colorSelected}>
                  <View style={[styles.colorDot, { backgroundColor: color.hex }]} />
                  <Text style={[styles.selectorText, { color: theme.text }]}>{color.name}</Text>
                </View>
              ) : (
                <Text style={[styles.selectorText, { color: theme.textSecondary }]}>
                  Sélectionner la couleur
                </Text>
              )}
              <TriangleInvertedFilled color={theme.textSecondary} size={12} />
            </TouchableOpacity>
          </View>

          {/* Location */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Localisation</Text>
            <TouchableOpacity
              style={[styles.selector, { backgroundColor: theme.inputBackground }]}
              onPress={() => setShowLocationModal(true)}
            >
              {location ? (
                <View style={styles.locationSelected}>
                  <MapMarkerAlt color={theme.primary} size={16} />
                  <Text style={[styles.selectorText, { color: theme.text }]}>
                    {location.name}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.selectorText, { color: theme.textSecondary }]}>
                  Ajouter une localisation
                </Text>
              )}
              <TriangleInvertedFilled color={theme.textSecondary} size={12} />
            </TouchableOpacity>
          </View>

          {/* Delivery Options */}
          {activeTab === 'product' && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Options de livraison</Text>
              <View style={styles.deliveryOptions}>
                <TouchableOpacity
                  style={[
                    styles.deliveryOption,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    deliveryOptions.shipping && {
                      backgroundColor: theme.primary + '20',
                      borderColor: theme.primary,
                    },
                  ]}
                  onPress={() => setDeliveryOptions({
                    ...deliveryOptions,
                    shipping: !deliveryOptions.shipping,
                  })}
                >
                  <Text style={[
                    styles.deliveryOptionText,
                    { color: deliveryOptions.shipping ? theme.primary : theme.text },
                  ]}>
                    Livraison
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.deliveryOption,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    deliveryOptions.meetup && {
                      backgroundColor: theme.primary + '20',
                      borderColor: theme.primary,
                    },
                  ]}
                  onPress={() => setDeliveryOptions({
                    ...deliveryOptions,
                    meetup: !deliveryOptions.meetup,
                  })}
                >
                  <Text style={[
                    styles.deliveryOptionText,
                    { color: deliveryOptions.meetup ? theme.primary : theme.text },
                  ]}>
                    Rencontre
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Publish Button */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
          <TouchableOpacity onPress={handlePublish} style={styles.publishButton}>
            <LinearGradient
              colors={['#8B5CF6', '#A78BFA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.publishGradient}
            >
              <RoundFileUpload color="#FFFFFF" size={20} />
              <Text style={styles.publishText}>
                {activeTab === 'product' ? 'Publier le produit' : 'Publier la requête'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Modals */}
      {renderImagePickerModal()}
      {renderCategoryModal()}
      {renderConditionModal()}
      {renderSizeModal()}
      {renderColorModal()}
      {renderLocationModal()}
      {renderPreviewModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  previewButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    // backgroundColor handled dynamically
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  form: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  priceField: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
  },
  currency: {
    fontSize: 14,
    fontWeight: '500',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectorText: {
    fontSize: 16,
  },
  colorSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  locationSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deliveryOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  deliveryOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  deliveryOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  publishButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  publishGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  publishText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imagePickerModal: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
  },
  imagePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  imagePickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  imagePickerOptionText: {
    fontSize: 16,
  },
  fullModal: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '600',
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  conditionContent: {
    flex: 1,
  },
  conditionName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  conditionDesc: {
    fontSize: 14,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 10,
  },
  sizeItem: {
    width: (width - 52) / 4,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  sizeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  colorGrid: {
    padding: 16,
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  colorItemSelected: {
    // Selected state
  },
  colorSwatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  colorName: {
    fontSize: 16,
    flex: 1,
  },
  locationOptions: {
    padding: 16,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  locationOptionContent: {
    flex: 1,
    marginLeft: 12,
  },
  locationOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  locationOptionDesc: {
    fontSize: 14,
  },
  // Preview modal styles
  previewContent: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  previewInfo: {
    padding: 16,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewPrice: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  previewDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  previewDetails: {
    gap: 12,
  },
  previewDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewDetailLabel: {
    fontSize: 14,
  },
  previewDetailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  previewColorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewColorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  previewFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  publishButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateScreen;
