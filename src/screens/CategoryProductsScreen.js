import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  useColorScheme,
  Modal,
  TouchableWithoutFeedback,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowBackIosRounded,
  VerifiedCheckFill,
  MoreVertical,
  ShareForwardFill,
  ReportProblemFilled,
} from '../components/icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CategoryProductsScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, categoryType = 'product' } = route?.params || {};

  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const colors = {
    background: isDarkMode ? '#121212' : '#F5F5F5',
    cardBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    headerBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    requestBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    skeletonBg: isDarkMode ? '#2A2A2A' : '#E0E0E0',
    menuBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  };

  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(null);

  // Catégorie actuelle (provenant de la navigation)
  const category = {
    id: categoryId || 'cat1',
    name: categoryName || 'Vêtements',
    type: categoryType,
  };

  // DONNÉES PRODUITS
  const productSuggestions = [
    {
      id: 's1',
      title: 'Nike Air Force 1',
      price: '5 000',
      originalPrice: '7 500',
      discount: 33,
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      status: 'available',
    },
    {
      id: 's2',
      title: "Jean Levi's 501",
      price: '3 500',
      originalPrice: '5 000',
      discount: 30,
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1542272454315-7f6fabf73e09?w=500&q=80',
      status: 'available',
    },
    {
      id: 's3',
      title: 'Veste Adidas Vintage',
      price: '4 200',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80',
      status: 'available',
    },
    {
      id: 's4',
      title: 'T-shirt Nike Blanc',
      price: '1 500',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
      status: 'available',
    },
    {
      id: 's5',
      title: 'Short Nike Dri-FIT',
      price: '1 800',
      originalPrice: '2 500',
      discount: 28,
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80',
      status: 'available',
    },
    {
      id: 's6',
      title: 'Robe Zara Élégante',
      price: '5 500',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80',
      status: 'available',
    },
    {
      id: 's7',
      title: 'Polo Lacoste Classic',
      price: '3 200',
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&q=80',
      status: 'available',
    },
    {
      id: 's8',
      title: 'Pantalon Cargo Beige',
      price: '2 600',
      originalPrice: '3 500',
      discount: 26,
      currency: 'HTG',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80',
      status: 'available',
    },
  ];

  // DONNÉES REQUÊTES
  const requestSuggestions = [
    {
      id: 'rs1',
      title: 'Je cherche des Air Force taille 43 en bon état #nike #airforce #taille43',
      author: 'marie',
      authorId: 'user1',
      authorImage: 'https://i.pravatar.cc/150?img=12',
      verified: true,
      productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80',
    },
    {
      id: 'rs2',
      title: "Besoin d'un jean noir slim fit taille 32 #jean #noir #slim",
      author: 'alex',
      authorId: 'user2',
      authorImage: 'https://i.pravatar.cc/150?img=33',
      verified: false,
      productImage: null,
    },
    {
      id: 'rs3',
      title: 'Qui vend des chemises habillées blanches? #chemise #blanche #formal',
      author: 'john',
      authorId: 'user3',
      authorImage: 'https://i.pravatar.cc/150?img=8',
      verified: true,
      productImage: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=200&q=80',
    },
    {
      id: 'rs4',
      title: 'Cherche robe de soirée élégante pour événement #robe #soirée #élégante',
      author: 'emma',
      authorId: 'user4',
      authorImage: 'https://i.pravatar.cc/150?img=47',
      verified: true,
      productImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200&q=80',
    },
  ];

  // Simulation chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handlers
  const handleBack = () => {
    navigation.goBack();
  };

  const handleProductPress = (item) => {
    navigation.navigate('ProductDetail', {
      productId: item.id,
      product: item,
    });
  };

  const handleRequestPress = (item) => {
    navigation.navigate('RequestDetail', {
      requestId: item.id,
      request: item,
    });
  };

  const handleMenuPress = (itemId) => {
    setShowMenu(showMenu === itemId ? null : itemId);
  };

  const handleShare = async (item) => {
    setShowMenu(null);
    try {
      await Share.share({
        message: `Regarde ${category.type === 'product' ? 'ce produit' : 'cette requête'} sur WOY!`,
      });
    } catch (error) {
      console.log('Erreur partage:', error);
    }
  };

  const handleReport = (item) => {
    setShowMenu(null);
    navigation.navigate('Report', {
      itemId: item?.id,
      itemType: category.type,
    });
  };

  // Parse hashtags
  const parseTextWithHashtags = (text) => {
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <Text key={index} style={{ color: '#3B82F6', fontWeight: '600' }}>
            {part}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };

  // Détermine l'élément courant
  const currentItem = [...productSuggestions, ...requestSuggestions].find(
    (item) => item.id === showMenu
  );

  // RENDER PRODUIT
  const renderProductSuggestion = ({ item, index }) => {
    const isLeft = index % 2 === 0;
    const titleLength = item.title.length;
    const priceLength = `${item.price} ${item.currency}`.length;
    const shouldReduceText = titleLength > 20 || priceLength > 15;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.productCard, isLeft ? styles.itemLeft : styles.itemRight]}
        onPress={() => handleProductPress(item)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        />

        <View style={styles.productInfoOverlay}>
          <View style={styles.productTextSection}>
            <Text
              style={[styles.productName, shouldReduceText && styles.productNameSmall]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {item.discount ? (
              <View style={styles.priceRow}>
                <Text style={[styles.originalPrice, shouldReduceText && styles.originalPriceSmall]}>
                  {item.originalPrice}
                </Text>
                <Text style={[styles.priceText, shouldReduceText && styles.priceTextSmall]}>
                  {item.price} {item.currency}
                </Text>
              </View>
            ) : (
              <Text style={[styles.priceText, shouldReduceText && styles.priceTextSmall]}>
                {item.price} {item.currency}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // RENDER REQUÊTE
  const renderRequestSuggestion = ({ item }) => (
    <View style={styles.requestWrapper} key={item.id}>
      <TouchableOpacity
        style={[
          styles.requestCard,
          { backgroundColor: colors.requestBg, borderColor: colors.border },
        ]}
        onPress={() => handleRequestPress(item)}
        activeOpacity={0.9}
      >
        {item.productImage && (
          <Image source={{ uri: item.productImage }} style={styles.requestThumbnail} />
        )}

        <View style={styles.requestContent}>
          <View style={styles.requestHeader}>
            <Image source={{ uri: item.authorImage }} style={styles.userAvatar} />
            <Text style={[styles.username, { color: colors.text }]}>{item.author}</Text>
            {item.verified && <VerifiedCheckFill color="#3B82F6" size={14} />}

            <TouchableOpacity
              style={styles.requestMenuButton}
              onPress={(e) => {
                e.stopPropagation();
                handleMenuPress(item.id);
              }}
            >
              <MoreVertical color={colors.text} size={18} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.requestText, { color: colors.text }]} numberOfLines={2}>
            {parseTextWithHashtags(item.title)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // RENDER GRILLE PRODUITS
  const renderProductGrid = () => {
    if (loading) {
      return (
        <View style={styles.skeletonContainer}>
          <View style={styles.row}>
            <View
              style={[styles.skeletonCard, styles.itemLeft, { backgroundColor: colors.skeletonBg }]}
            />
            <View
              style={[
                styles.skeletonCard,
                styles.itemRight,
                { backgroundColor: colors.skeletonBg },
              ]}
            />
          </View>
          <View style={styles.row}>
            <View
              style={[styles.skeletonCard, styles.itemLeft, { backgroundColor: colors.skeletonBg }]}
            />
            <View
              style={[
                styles.skeletonCard,
                styles.itemRight,
                { backgroundColor: colors.skeletonBg },
              ]}
            />
          </View>
          <View style={styles.row}>
            <View
              style={[styles.skeletonCard, styles.itemLeft, { backgroundColor: colors.skeletonBg }]}
            />
            <View
              style={[
                styles.skeletonCard,
                styles.itemRight,
                { backgroundColor: colors.skeletonBg },
              ]}
            />
          </View>
        </View>
      );
    }

    const rows = [];
    for (let i = 0; i < productSuggestions.length; i += 2) {
      const leftItem = productSuggestions[i];
      const rightItem = productSuggestions[i + 1];

      rows.push(
        <View key={`row-${i}`} style={styles.row}>
          {renderProductSuggestion({ item: leftItem, index: i })}
          {rightItem && renderProductSuggestion({ item: rightItem, index: i + 1 })}
        </View>
      );
    }
    return rows;
  };

  // RENDER SKELETON REQUÊTES
  const renderRequestSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4].map((item) => (
        <View
          key={item}
          style={[styles.requestSkeletonCard, { backgroundColor: colors.skeletonBg }]}
        />
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.headerBg}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBg,
            borderBottomColor: colors.border,
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowBackIosRounded color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{category.name}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Grille */}
      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {category.type === 'request' ? (
          loading ? (
            renderRequestSkeleton()
          ) : (
            requestSuggestions.map((item) => renderRequestSuggestion({ item }))
          )
        ) : (
          <View style={styles.gridContainer}>{renderProductGrid()}</View>
        )}
      </ScrollView>

      {/* Modal Menu */}
      <Modal
        visible={showMenu !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(null)}
      >
        <TouchableWithoutFeedback onPress={() => setShowMenu(null)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.miniModal, { backgroundColor: colors.menuBg }]}>
              <TouchableOpacity
                style={styles.miniModalItem}
                onPress={() => handleShare(currentItem)}
              >
                <ShareForwardFill color={colors.text} size={18} />
                <Text style={[styles.miniModalText, { color: colors.text }]}>Partager</Text>
              </TouchableOpacity>

              <View style={[styles.miniModalDivider, { backgroundColor: colors.border }]} />

              <TouchableOpacity
                style={styles.miniModalItem}
                onPress={() => handleReport(currentItem)}
              >
                <ReportProblemFilled color="#EF4444" size={18} />
                <Text style={[styles.miniModalText, { color: '#EF4444' }]}>Signaler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  contentScroll: {
    flex: 1,
  },

  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },

  // GRILLE PRODUITS
  gridContainer: {
    gap: 4,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  itemLeft: {
    marginRight: 2,
    marginLeft: 0,
  },

  itemRight: {
    marginLeft: 2,
    marginRight: 0,
  },

  productCard: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },

  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },

  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },

  productInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  productTextSection: {
    flex: 1,
    marginRight: 8,
  },

  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },

  productNameSmall: {
    fontSize: 13,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  originalPrice: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
    textDecorationLine: 'line-through',
    textDecorationColor: '#EF4444',
    textDecorationStyle: 'solid',
  },

  originalPriceSmall: {
    fontSize: 9,
  },

  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  priceTextSmall: {
    fontSize: 10,
  },

  // REQUÊTES
  requestWrapper: {
    width: '100%',
    marginBottom: 4,
  },

  requestCard: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },

  requestThumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },

  requestContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    marginRight: 6,
  },

  username: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },

  requestMenuButton: {
    marginLeft: 'auto',
    padding: 2,
  },

  requestText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
    fontWeight: '500',
  },

  // SKELETONS
  skeletonContainer: {
    padding: 0,
  },

  skeletonCard: {
    flex: 1,
    aspectRatio: 0.75,
    borderRadius: 10,
  },

  requestSkeletonCard: {
    height: 90,
    borderRadius: 10,
    marginBottom: 4,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  miniModal: {
    width: 160,
    borderRadius: 10,
    padding: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },

  miniModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },

  miniModalText: {
    fontSize: 14,
    fontWeight: '500',
  },

  miniModalDivider: {
    height: 1,
    marginHorizontal: 8,
  },
});

export default CategoryProductsScreen;
