import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  ScrollView,
  Modal,
  Platform,
  Keyboard,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PencilSquareSolid,
  VerifiedBadge,
  StarFourPointsCircle,
  PinFill,
  Trash,
  Check,
  CheckAll,
  MessageDotsFill,
} from '../components/icons';

const MessagesScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMessageSearch, setNewMessageSearch] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [longPressedItem, setLongPressedItem] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const slideAnim = useRef(new Animated.Value(500)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const colors = {
    background: isDarkMode ? '#000000' : '#FFFFFF',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#F0F0F0',
    cardBg: isDarkMode ? '#1A1A1A' : '#F5F5F5',
    searchBg: isDarkMode ? '#1A1A1A' : '#F2F2F2',
    iconActive: isDarkMode ? '#FFFFFF' : '#000000',
    iconInactive: isDarkMode ? '#666666' : '#999999',
    skeletonBg: isDarkMode ? '#1A1A1A' : '#E0E0E0',
    skeletonHighlight: isDarkMode ? '#2A2A2A' : '#F0F0F0',
    emptyText: isDarkMode ? '#4A4A4A' : '#888888',
  };

  const [conversations, setConversations] = useState([
    {
      id: '1',
      user: {
        username: 'john',
        profileImage: 'https://i.pravatar.cc/150?img=8',
        verified: true,
      },
      lastMessage: 'Salut, le produit est toujours disponible ?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 2,
      favorite: false,
      isPinned: true,
      isOnline: true,
      isTyping: false,
      isSentByMe: false,
      isRead: false,
      hasOffer: true,
      lastSeen: null,
      product: {
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80',
        title: 'Nike Air Force 1',
        offer: '4 500 HTG',
        messageText: null,
      },
    },
    {
      id: '2',
      user: {
        username: 'marie',
        profileImage: 'https://i.pravatar.cc/150?img=5',
        verified: true,
      },
      lastMessage: 'Merci beaucoup ! À bientôt',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      favorite: true,
      isPinned: false,
      isOnline: false,
      isTyping: false,
      isSentByMe: true,
      isRead: true,
      hasOffer: false,
      lastSeen: new Date(Date.now() - 45 * 60 * 1000),
      product: null,
    },
    {
      id: '3',
      user: {
        username: 'sarah',
        profileImage: 'https://i.pravatar.cc/150?img=9',
        verified: true,
      },
      lastMessage: 'Je peux venir le chercher demain ?',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unreadCount: 5,
      favorite: false,
      isPinned: true,
      isOnline: true,
      isTyping: true,
      isSentByMe: false,
      isRead: false,
      hasOffer: false,
      lastSeen: null,
      product: {
        image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=80&q=80',
        title: 'Jordan 1 Retro',
        offer: null,
        messageText: 'Je peux venir le chercher demain ?',
      },
    },
    {
      id: '4',
      user: {
        username: 'alex',
        profileImage: 'https://i.pravatar.cc/150?img=12',
        verified: false,
      },
      lastMessage: 'Ok, parfait. Je te confirme ce soir.',
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      unreadCount: 0,
      favorite: false,
      isPinned: false,
      isOnline: false,
      isTyping: false,
      isSentByMe: true,
      isRead: false,
      hasOffer: false,
      lastSeen: new Date(Date.now() - 5 * 60 * 60 * 1000),
      product: null,
    },
    {
      id: '5',
      user: {
        username: 'paul',
        profileImage: 'https://i.pravatar.cc/150?img=15',
        verified: false,
      },
      lastMessage: 'Super ! Merci pour l\'info',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      unreadCount: 0,
      favorite: true,
      isPinned: false,
      isOnline: false,
      isTyping: false,
      isSentByMe: false,
      isRead: false,
      hasOffer: false,
      lastSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      product: null,
    },
  ]);

  const [suggestions] = useState([
    {
      id: 's1',
      username: 'john',
      profileImage: 'https://i.pravatar.cc/150?img=8',
      verified: true,
      isFollowing: true,
      lastMessage: true,
    },
    {
      id: 's2',
      username: 'marie',
      profileImage: 'https://i.pravatar.cc/150?img=5',
      verified: true,
      isFollowing: true,
      lastMessage: true,
    },
    {
      id: 's3',
      username: 'sarah',
      profileImage: 'https://i.pravatar.cc/150?img=9',
      verified: true,
      isFollowing: true,
      lastMessage: true,
    },
    {
      id: 's4',
      username: 'alex',
      profileImage: 'https://i.pravatar.cc/150?img=12',
      verified: false,
      isFollowing: true,
      lastMessage: true,
    },
    {
      id: 's5',
      username: 'paul',
      profileImage: 'https://i.pravatar.cc/150?img=15',
      verified: false,
      isFollowing: true,
      lastMessage: false,
    },
    {
      id: 's6',
      username: 'emma',
      profileImage: 'https://i.pravatar.cc/150?img=20',
      verified: true,
      isFollowing: true,
      lastMessage: false,
    },
    {
      id: 's7',
      username: 'lucas',
      profileImage: 'https://i.pravatar.cc/150?img=25',
      verified: false,
      isFollowing: true,
      lastMessage: true,
    },
  ]);

  // Simulation chargement
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  // Gestion du clavier
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Animation modal
  useEffect(() => {
    if (showNewMessageModal) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 500,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showNewMessageModal]);

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'maintenant';
    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'hier';
    if (diffDays < 7) return `${diffDays}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getLastSeenText = (lastSeen) => {
    if (!lastSeen) return '';

    const now = new Date();
    const diffMs = now - lastSeen;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'vu à l\'instant';
    if (diffMins < 60) return `vu il y a ${diffMins} min`;
    if (diffHours < 24) return `vu il y a ${diffHours}h`;
    if (diffDays === 1) return 'vu hier';
    return `vu il y a ${diffDays}j`;
  };

  const getReadStatus = (item) => {
    if (!item.isSentByMe) return null;

    if (item.isRead) {
      return <CheckAll color="#3B82F6" size={16} />;
    } else if (item.user.isOnline) {
      return <CheckAll color="#999999" size={16} />;
    } else {
      return <Check color="#999999" size={16} />;
    }
  };

  const handleNewMessage = () => {
    setShowNewMessageModal(true);
    setNewMessageSearch('');
    setIsSearchFocused(false);
  };

  const handleFilterSelect = (filter) => {
    setFilterType(filter);
  };

  const handleConversationPress = (conversation) => {
    navigation.navigate('Chat', {
      oderId: conversation.id,
      username: conversation.user.username,
      profileImage: conversation.user.profileImage,
      verified: conversation.user.verified,
      isOnline: conversation.isOnline,
    });
  };

  const handleLongPress = (item) => {
    setLongPressedItem(item);
    setShowActionModal(true);
  };

  const handlePinConversation = () => {
    if (!longPressedItem) return;

    setConversations(prev =>
      prev.map(c =>
        c.id === longPressedItem.id
          ? { ...c, isPinned: !c.isPinned }
          : c
      )
    );
    setShowActionModal(false);
    setLongPressedItem(null);
  };

  const handleFavoriteConversation = () => {
    if (!longPressedItem) return;

    setConversations(prev =>
      prev.map(c =>
        c.id === longPressedItem.id
          ? { ...c, favorite: !c.favorite }
          : c
      )
    );
    setShowActionModal(false);
    setLongPressedItem(null);
  };

  const handleDeleteConversation = () => {
    if (!longPressedItem) return;

    setConversations(prev => prev.filter(c => c.id !== longPressedItem.id));
    setShowActionModal(false);
    setLongPressedItem(null);
  };

  const handleSelectUser = (user) => {
    setShowNewMessageModal(false);
    setIsSearchFocused(false);
    navigation.navigate('Chat', {
      oderId: user.id,
      username: user.username,
      profileImage: user.profileImage,
      verified: user.verified,
    });
  };

  const handleModalOverlayPress = () => {
    Keyboard.dismiss();
    if (!isSearchFocused) {
      setShowNewMessageModal(false);
    }
    setIsSearchFocused(false);
  };

  const getFilteredConversations = () => {
    let filtered = conversations;

    // Tri: épinglés en premier
    filtered = filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.timestamp - a.timestamp;
    });

    if (filterType === 'unread') {
      filtered = filtered.filter(c => c.unreadCount > 0);
    } else if (filterType === 'favorite') {
      filtered = filtered.filter(c => c.favorite);
    } else if (filterType === 'offers') {
      filtered = filtered.filter(c => c.hasOffer);
    } else if (filterType === 'online') {
      filtered = filtered.filter(c => c.isOnline);
    } else if (filterType === 'verified') {
      filtered = filtered.filter(c => c.user.verified);
    }

    if (searchText) {
      filtered = filtered.filter(c =>
        c.user.username.toLowerCase().includes(searchText.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filtered;
  };

  const getFilteredSuggestions = () => {
    let filtered = suggestions;

    if (newMessageSearch) {
      filtered = filtered.filter(s =>
        s.username.toLowerCase().includes(newMessageSearch.toLowerCase())
      );
    }

    if (keyboardHeight > 0) {
      return filtered.slice(0, 2);
    }

    return filtered;
  };

  const renderSkeletonItem = () => (
    <View style={[styles.conversationContent, { borderBottomWidth: 0 }]}>
      <View style={[styles.skeletonCircle, { backgroundColor: colors.skeletonBg }]} />
      <View style={styles.conversationMiddle}>
        <View style={[styles.skeletonLine, { width: '40%', backgroundColor: colors.skeletonBg }]} />
        <View style={[styles.skeletonLine, { width: '80%', marginTop: 8, backgroundColor: colors.skeletonBg }]} />
      </View>
    </View>
  );

  const renderConversation = ({ item }) => {
    const readStatus = getReadStatus(item);

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => handleConversationPress(item)}
        onLongPress={() => handleLongPress(item)}
        delayLongPress={500}
        activeOpacity={0.8}
      >
        <View style={styles.conversationContent}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: item.user.profileImage }} style={styles.profileImage} />
            {item.isOnline && (
              <View style={[
                styles.onlineDot,
                {
                  backgroundColor: colors.text,
                  borderColor: isDarkMode ? '#000000' : '#FFFFFF'
                }
              ]} />
            )}
          </View>

          <View style={styles.conversationMiddle}>
            <View style={styles.conversationHeader}>
              <View style={styles.userNameRow}>
                <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
                  {item.user.username}
                </Text>
                {item.user.verified && <VerifiedBadge color="#3B82F6" size={14} />}
                {!item.isOnline && !item.isTyping && item.lastSeen && (
                  <Text style={[styles.lastSeenTextInline, { color: colors.textSecondary }]}>
                    • {getLastSeenText(item.lastSeen)}
                  </Text>
                )}
              </View>
              <View style={styles.timestampRow}>
                {item.isPinned && <PinFill color={colors.text} size={12} />}
                <Text style={[styles.timestamp, { color: colors.textSecondary }]}>{getTimeAgo(item.timestamp)}</Text>
              </View>
            </View>

            {item.isTyping ? (
              <Text style={[styles.typingIndicator, { color: colors.text }]}>en train d'écrire...</Text>
            ) : (
              <>
                {!item.hasOffer && (
                  <View style={styles.lastMessageRow}>
                    {readStatus && <View style={styles.readStatusIcon}>{readStatus}</View>}
                    <Text
                      style={[
                        styles.lastMessage,
                        { color: colors.textSecondary },
                        item.unreadCount > 0 && { fontWeight: '600', color: colors.text }
                      ]}
                      numberOfLines={1}
                    >
                      {item.lastMessage}
                    </Text>
                  </View>
                )}

                {item.product && (
                  <View style={styles.productInfo}>
                    <Image source={{ uri: item.product.image }} style={styles.productThumbnail} />
                    <View style={styles.productTextInfo}>
                      <Text style={[styles.productTitle, { color: colors.textSecondary }]} numberOfLines={1}>
                        {item.product.title}
                      </Text>
                      {item.product.offer ? (
                        <Text style={[styles.productOffer, { color: colors.text }]}>
                          Offre: {item.product.offer}
                        </Text>
                      ) : item.product.messageText ? (
                        <Text style={[styles.productMessage, { color: colors.textSecondary }]} numberOfLines={1}>
                          {item.product.messageText}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                )}
              </>
            )}
          </View>

          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.text }]}>
              <Text style={[styles.unreadBadgeText, { color: colors.background }]}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectUser(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.profileImage }} style={styles.suggestionImage} />
      <View style={styles.suggestionInfo}>
        <View style={styles.suggestionNameRow}>
          <Text style={[styles.suggestionName, { color: colors.text }]}>{item.username}</Text>
          {item.verified && <VerifiedBadge color="#3B82F6" size={14} />}
        </View>
        <Text style={[styles.suggestionSubtext, { color: colors.textSecondary }]}>
          {item.isFollowing && item.lastMessage ? 'Abonné • Message récent' : item.isFollowing ? 'Abonné' : 'Suggéré'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const filteredConversations = getFilteredConversations();
  const filteredSuggestions = getFilteredSuggestions();
  const pinnedCount = conversations.filter(c => c.isPinned).length;

  // Masquer les filtres vides
  const availableFilters = [
    { key: 'all', label: 'Tous', count: conversations.length },
    { key: 'unread', label: 'Non lus', count: conversations.filter(c => c.unreadCount > 0).length },
    { key: 'offers', label: 'Offres', count: conversations.filter(c => c.hasOffer).length },
    { key: 'online', label: 'En ligne', count: conversations.filter(c => c.isOnline).length },
    { key: 'favorite', label: 'Favoris', count: conversations.filter(c => c.favorite).length },
    { key: 'verified', label: 'Vérifié', count: conversations.filter(c => c.user.verified).length },
  ].filter(f => f.count > 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Modal Nouveau Message */}
      <Modal visible={showNewMessageModal} transparent={true} animationType="none" onRequestClose={() => setShowNewMessageModal(false)}>
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={styles.modalOverlayTouchable}
              onPress={handleModalOverlayPress}
              activeOpacity={1}
            />
          </Animated.View>

          <Animated.View style={[
            styles.modalContent,
            { backgroundColor: colors.background },
            {
              transform: [{ translateY: slideAnim }],
              bottom: keyboardHeight
            }
          ]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Nouveau message</Text>
              <TouchableOpacity onPress={() => setShowNewMessageModal(false)}>
                <Text style={[styles.modalCloseIcon, { color: colors.text }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalSearchBar}>
              <TextInput
                style={[styles.modalSearchInput, { backgroundColor: colors.searchBg, color: colors.text }]}
                placeholder="Rechercher un correspondant..."
                placeholderTextColor={colors.textSecondary}
                value={newMessageSearch}
                onChangeText={setNewMessageSearch}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </View>

            <Text style={[styles.suggestionsSectionTitle, { color: colors.textSecondary }]}>
              {newMessageSearch ? 'Résultats' : 'Suggestions'}
            </Text>

            <FlatList
              data={filteredSuggestions}
              renderItem={renderSuggestion}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.suggestionsList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={keyboardHeight === 0}
            />
          </Animated.View>
        </View>
      </Modal>

      {/* Modal Actions */}
      <Modal visible={showActionModal} transparent={true} animationType="fade" onRequestClose={() => setShowActionModal(false)}>
        <TouchableOpacity
          style={styles.actionModalOverlay}
          activeOpacity={1}
          onPress={() => setShowActionModal(false)}
        >
          <View style={[styles.actionModal, { backgroundColor: colors.background }]}>
            {(pinnedCount < 3 || longPressedItem?.isPinned) && (
              <TouchableOpacity
                style={styles.actionModalButton}
                onPress={handlePinConversation}
              >
                <PinFill color={colors.text} size={20} />
                <Text style={[styles.actionModalButtonText, { color: colors.text }]}>
                  {longPressedItem?.isPinned ? 'Désépingler' : 'Épingler'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionModalButton}
              onPress={handleFavoriteConversation}
            >
              <StarFourPointsCircle color={colors.text} size={20} />
              <Text style={[styles.actionModalButtonText, { color: colors.text }]}>
                {longPressedItem?.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionModalButton}
              onPress={handleDeleteConversation}
            >
              <Trash color="#EF4444" size={20} />
              <Text style={[styles.actionModalButtonText, { color: '#EF4444' }]}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={[styles.searchBar, { borderBottomColor: colors.border, backgroundColor: colors.background, paddingTop: insets.top + 10 }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.searchBg }]}>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Rechercher une conversation..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} style={styles.searchClearButton}>
              <Text style={[styles.searchClear, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.newMessageButton} onPress={handleNewMessage}>
          <PencilSquareSolid color={colors.text} size={24} />
        </TouchableOpacity>
      </View>

      {availableFilters.length > 0 && (
        <View style={[styles.filtersContainer, { borderBottomColor: conversations.length === 0 ? 'transparent' : colors.border }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          >
            {availableFilters.map(filter => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  { borderColor: colors.border, backgroundColor: colors.background },
                  filterType === filter.key && { backgroundColor: colors.text, borderColor: colors.text }
                ]}
                onPress={() => handleFilterSelect(filter.key)}
              >
                <Text style={[
                  styles.filterButtonText,
                  { color: colors.textSecondary },
                  filterType === filter.key && { color: colors.background }
                ]}>{filter.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {isLoading ? (
        <View>
          {[1, 2, 3, 4, 5].map(i => (
            <View key={i}>{renderSkeletonItem()}</View>
          ))}
        </View>
      ) : filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        />
      ) : (
        <View style={styles.emptyState}>
          <MessageDotsFill color={colors.emptyText} size={64} />
          <Text style={[styles.emptyStateText, { color: colors.emptyText }]}>
            {searchText ? 'Aucun résultat' : 'Tes messages apparaîtront ici. Commence une discussion.'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
  },
  searchClearButton: {
    padding: 4,
  },
  searchClear: {
    fontSize: 16,
  },
  newMessageButton: {
    padding: 8,
  },
  filtersContainer: {
    borderBottomWidth: 1,
  },
  filtersList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  conversationItem: {
    position: 'relative',
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  conversationMiddle: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    flexShrink: 1,
  },
  lastSeenTextInline: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  readStatusIcon: {
    marginRight: 2,
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
  },
  typingIndicator: {
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  productThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
  },
  productTextInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 12,
    marginBottom: 2,
  },
  productOffer: {
    fontSize: 13,
    fontWeight: '600',
  },
  productMessage: {
    fontSize: 12,
  },
  unreadBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  skeletonCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlayTouchable: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalCloseIcon: {
    fontSize: 24,
  },
  modalSearchBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  modalSearchInput: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  suggestionsSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  suggestionsList: {
    paddingBottom: 20,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  suggestionImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    marginRight: 12,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionSubtext: {
    fontSize: 12,
  },
  actionModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  actionModal: {
    borderRadius: 12,
    width: '80%',
    overflow: 'hidden',
  },
  actionModalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  actionModalButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default MessagesScreen;
