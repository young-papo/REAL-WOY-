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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  useColorScheme,
  Linking,
  Alert,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import MapView, { Marker, Circle } from 'react-native-maps';
import {
  PaperplaneSolid,
  VerifiedCheckFill,
  Check,
  CheckAll,
  ArrowBackIosRounded,
  ProfileFill,
  PresenceBlocked16Regular,
  ReportProblemFilled,
  Trash,
  PictureSolid,
  Camera,
  PositionMan,
  HandHoldingDollarSolid,
  Plus,
  KeyboardFill,
  Search,
  MoreVertical,
  Copy,
  Reply,
  Download2Rounded,
  Pencil,
  CloseCircle,
  StarOutline,
  Close,
} from '../components/icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ChatScreen = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const [messageText, setMessageText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showNewOfferModal, setShowNewOfferModal] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newOfferAmount, setNewOfferAmount] = useState('');
  const [currentOfferAmount, setCurrentOfferAmount] = useState('');
  const [currentProductId, setCurrentProductId] = useState('');
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isUserSeller, setIsUserSeller] = useState(false);
  const [lastRejectedOffer, setLastRejectedOffer] = useState(null);
  const [use24Hour, setUse24Hour] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [longPressedMessage, setLongPressedMessage] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [transactionConfirmed, setTransactionConfirmed] = useState(false);
  const [ratingAuthorized, setRatingAuthorized] = useState(false);

  const flatListRef = useRef(null);
  const textInputRef = useRef(null);
  const tooltipFadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(500)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const attachmentSlideAnim = useRef(new Animated.Value(300)).current;
  const attachmentFadeAnim = useRef(new Animated.Value(0)).current;
  const highlightOpacityAnim = useRef(new Animated.Value(0)).current;

  const colors = {
    background: isDarkMode ? '#121212' : '#F5F5F5',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#BDBDBD' : '#666666',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    bubbleReceived: isDarkMode ? '#FFFFFF' : '#FFFFFF',
    bubbleReceivedText: isDarkMode ? '#000000' : '#000000',
    bubbleSent: isDarkMode ? '#2C2C2E' : '#3A3A3C',
    bubbleSentText: isDarkMode ? '#FFFFFF' : '#FFFFFF',
    inputBg: isDarkMode ? '#2C2C2E' : '#F0F0F0',
    systemBg: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    onlineDot: '#4CAF50',
    linkColor: '#3B82F6',
    headerBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    deletedBg: isDarkMode ? '#2C2C2E' : '#F5F5F5',
    deletedText: isDarkMode ? '#757575' : '#9E9E9E',
    cardBg: isDarkMode ? '#1F1F1F' : '#FFFFFF',
    modalBg: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  };

  const [conversation] = useState({
    user: {
      username: 'john',
      profileImage: 'https://i.pravatar.cc/150?img=8',
      verified: true,
      isOnline: false,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    product: {
      id: 'p1',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80',
      title: 'Nike Air Force 1 blanches',
      price: '5000',
    },
  });

  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'system',
      text: 'Conversation démarrée',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: '2',
      type: 'received',
      text: 'Salut ! Le produit est toujours disponible ?',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      status: 'read',
    },
    {
      id: '3',
      type: 'sent-with-product',
      text: 'Oui, toujours disponible',
      product: {
        id: 'p1',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80',
        title: 'Nike Air Force 1 blanches',
      },
      timestamp: new Date(Date.now() - 85 * 60 * 1000),
      status: 'read',
      isOnline: false,
    },
    {
      id: '4',
      type: 'received',
      text: 'Tu peux faire 4500 HTG ?',
      timestamp: new Date(Date.now() - 80 * 60 * 1000),
      status: 'read',
      deleted: true,
      deletedBy: 'other',
      originalText: 'Tu peux faire 4500 HTG ?',
    },
    {
      id: '5',
      type: 'offer-sent',
      amount: '4800',
      product: {
        id: 'p1',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80',
        title: 'Nike Air Force 1 blanches',
      },
      timestamp: new Date(Date.now() - 75 * 60 * 1000),
      status: 'read',
      isOnline: false,
    },
    {
      id: '6',
      type: 'offer-received',
      amount: '4700',
      product: {
        id: 'p1',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80',
        title: 'Nike Air Force 1 blanches',
      },
      timestamp: new Date(Date.now() - 70 * 60 * 1000),
      status: 'accepted',
    },
    {
      id: '7',
      type: 'sent',
      text: 'Regarde ce site exemple.com et aussi test.io',
      timestamp: new Date(Date.now() - 65 * 60 * 1000),
      status: 'read',
      isOnline: true,
    },
    {
      id: '8',
      type: 'image-sent',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      text: 'Voici les chaussures',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      status: 'read',
      isOnline: true,
    },
    {
      id: '9',
      type: 'system',
      text: isUserSeller ? 'Vous avez accepté l\'offre' : 'Votre offre a été acceptée',
      timestamp: new Date(Date.now() - 55 * 60 * 1000),
      isOfferAccepted: true,
      linkedOfferId: '6',
    },
  ]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        setShowAttachmentMenu(false);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (showMenu || showImageModal || showNewOfferModal || showReportModal || showContextMenu || showRatingModal) {
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
  }, [showMenu, showImageModal, showNewOfferModal, showReportModal, showContextMenu, showRatingModal]);

  useEffect(() => {
    if (showAttachmentMenu && !keyboardVisible) {
      Animated.parallel([
        Animated.timing(attachmentFadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(attachmentSlideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(attachmentFadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(attachmentSlideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showAttachmentMenu, keyboardVisible]);

  useEffect(() => {
    if (activeTooltip) {
      Animated.sequence([
        Animated.timing(tooltipFadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(tooltipFadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setActiveTooltip(null));
    }
  }, [activeTooltip]);

  useEffect(() => {
    if (highlightedMessageId) {
      Animated.sequence([
        Animated.timing(highlightOpacityAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(highlightOpacityAnim, {
          toValue: 0,
          duration: 1900,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setHighlightedMessageId(null);
      });
    }
  }, [highlightedMessageId]);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const getTimeString = (date) => {
    if (use24Hour) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
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

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const showTooltip = (message) => {
    setActiveTooltip(message);
    tooltipFadeAnim.setValue(0);
  };

  const isOfferValid = () => {
    if (!newOfferAmount.trim() || !currentOfferAmount) return false;
    const newAmount = parseFloat(newOfferAmount.replace(/\s/g, ''));
    const currentAmount = parseFloat(currentOfferAmount.replace(/\s/g, ''));

    if (editingOfferId) return newAmount > 0;
    if (isUserSeller) return newAmount > 0;
    if (lastRejectedOffer) return newAmount > parseFloat(lastRejectedOffer.replace(/\s/g, ''));
    return newAmount > currentAmount;
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleProductPress = () => {
    navigation.navigate('ProductDetail', {
      productId: conversation.product.id,
    });
  };

  const handleProfilePress = () => {
    navigation.navigate('UserProfile', {
      username: conversation.user.username,
    });
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);
    if (action === 'profile') {
      handleProfilePress();
    } else if (action === 'block') {
      Alert.alert(
        'Bloquer l\'utilisateur',
        'Êtes-vous sûr de vouloir bloquer cet utilisateur ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Bloquer', style: 'destructive', onPress: () => showTooltip('Utilisateur bloqué') }
        ]
      );
    } else if (action === 'report') {
      setShowReportModal(true);
    } else if (action === 'delete') {
      Alert.alert(
        'Supprimer la conversation',
        'Êtes-vous sûr de vouloir supprimer cette conversation ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Supprimer', style: 'destructive', onPress: () => {
            showTooltip('Conversation supprimée');
            navigation.goBack();
          }}
        ]
      );
    }
  };

  const handleReplyToMessage = (message) => {
    setReplyingTo(message);
    setShowAttachmentMenu(false);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const scrollToMessage = (messageId) => {
    const index = messages.findIndex(m => m.id === messageId);
    if (index !== -1 && flatListRef.current) {
      setHighlightedMessageId(messageId);
      highlightOpacityAnim.setValue(0);
      flatListRef.current.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    }
  };

  const handleSystemMessagePress = (messageId) => {
    const systemMsg = messages.find(m => m.id === messageId);
    if (systemMsg && systemMsg.isOfferAccepted) {
      const offerIndex = messages.findIndex(m =>
        (m.type === 'offer-received' || m.type === 'offer-sent') && m.status === 'accepted'
      );
      if (offerIndex !== -1) {
        scrollToMessage(messages[offerIndex].id);
      }
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        type: 'sent',
        text: messageText.trim(),
        timestamp: new Date(),
        status: 'sent',
        isOnline: false,
        replyTo: replyingTo ? {
          id: replyingTo.id,
          text: replyingTo.text || (replyingTo.amount ? `Offre de ${formatPrice(replyingTo.amount)} HTG` : ''),
          type: replyingTo.type,
          imageUrl: replyingTo.imageUrl,
          product: replyingTo.product,
          amount: replyingTo.amount,
          latitude: replyingTo.latitude,
          longitude: replyingTo.longitude,
        } : null,
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
      setReplyingTo(null);
    }
  };

  const handleAttachmentPress = () => {
    if (showAttachmentMenu && !keyboardVisible) {
      textInputRef.current?.focus();
      setShowAttachmentMenu(false);
    } else if (keyboardVisible) {
      Keyboard.dismiss();
      setTimeout(() => {
        setShowAttachmentMenu(true);
      }, 150);
    } else {
      Keyboard.dismiss();
      setTimeout(() => {
        setShowAttachmentMenu(true);
      }, 150);
    }
  };

  const handleAttachmentOption = (option) => {
    setShowAttachmentMenu(false);

    if (option === 'camera') {
      const newMessage = {
        id: Date.now().toString(),
        type: 'image-sent',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
        text: '',
        timestamp: new Date(),
        status: 'sent',
        isOnline: false,
      };
      setMessages([...messages, newMessage]);
    } else if (option === 'gallery') {
      const newMessage = {
        id: Date.now().toString(),
        type: 'image-sent',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
        text: '',
        timestamp: new Date(),
        status: 'sent',
        isOnline: false,
      };
      setMessages([...messages, newMessage]);
    } else if (option === 'location') {
      const newMessage = {
        id: Date.now().toString(),
        type: 'location-sent',
        latitude: 18.5944,
        longitude: -72.3074,
        timestamp: new Date(),
        status: 'sent',
        isOnline: false,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      };
      setMessages([...messages, newMessage]);
    }
  };

  const getLastSentOfferIndex = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === 'offer-sent' && messages[i].status !== 'superseded') {
        return i;
      }
    }
    return -1;
  };

  const hasReceivedOfferAfterLastSent = () => {
    const lastSentIndex = getLastSentOfferIndex();
    if (lastSentIndex === -1) return false;

    for (let i = lastSentIndex + 1; i < messages.length; i++) {
      if (messages[i].type === 'offer-received') {
        return true;
      }
    }
    return false;
  };

  const handleOfferAction = (messageId, action, isSeller = false, productId = '') => {
    if (action === 'accept') {
      const acceptMessage = {
        id: Date.now().toString(),
        type: 'system',
        text: isSeller ? 'Vous avez accepté l\'offre' : 'Votre offre a été acceptée',
        timestamp: new Date(),
        isOfferAccepted: true,
        linkedOfferId: messageId,
      };
      setMessages([...messages.map(msg =>
        msg.id === messageId ? { ...msg, status: 'accepted' } : msg
      ), acceptMessage]);
    } else if (action === 'new-offer') {
      const originalOffer = messages.find(msg => msg.id === messageId);
      if (originalOffer) {
        setCurrentOfferAmount(originalOffer.amount);
        setCurrentProductId(originalOffer.product?.id || productId);
      }
      setShowNewOfferModal(true);
    } else if (action === 'edit-offer') {
      const lastOfferIndex = getLastSentOfferIndex();
      const originalOffer = messages[lastOfferIndex];

      if (hasReceivedOfferAfterLastSent()) {
        showTooltip('Impossible de modifier : une offre a été reçue');
        return;
      }

      if (originalOffer && originalOffer.id === messageId) {
        setEditingOfferId(messageId);
        setNewOfferAmount(originalOffer.amount);
        setCurrentOfferAmount(originalOffer.amount);
        setCurrentProductId(originalOffer.product?.id || productId);
        setShowNewOfferModal(true);
      } else {
        showTooltip('Vous pouvez modifier uniquement la dernière offre');
      }
    }
  };

  const handleSendNewOffer = () => {
    if (!isOfferValid()) {
      return;
    }

    if (editingOfferId) {
      const updatedMessages = messages.filter(msg => msg.id !== editingOfferId);

      const newOfferMessage = {
        id: Date.now().toString(),
        type: 'offer-sent',
        amount: newOfferAmount.trim(),
        product: conversation.product,
        timestamp: new Date(),
        status: 'sent',
        isOnline: false,
      };

      setMessages([...updatedMessages, newOfferMessage]);
    } else {
      const updatedMessages = messages.map(msg => {
        if ((msg.type === 'offer-sent' || msg.type === 'offer-received') &&
            msg.product?.id === currentProductId &&
            msg.status === 'pending') {
          return { ...msg, status: 'superseded' };
        }
        return msg;
      });

      const newOfferMessage = {
        id: Date.now().toString(),
        type: 'offer-sent',
        amount: newOfferAmount.trim(),
        product: conversation.product,
        timestamp: new Date(),
        status: 'sent',
        isOnline: false,
      };

      setMessages([...updatedMessages, newOfferMessage]);
    }

    setNewOfferAmount('');
    setCurrentOfferAmount('');
    setCurrentProductId('');
    setEditingOfferId(null);
    setShowNewOfferModal(false);
  };

  const handleImagePress = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleLocationPress = (location) => {
    const now = new Date();
    if (now > location.expiresAt) {
      Alert.alert('Position expirée', 'Cette position n\'est plus disponible.');
      return;
    }
    navigation.navigate('Map', {
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  const handleLinkPress = (url) => {
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = 'https://' + url;
    }
    Linking.openURL(finalUrl).catch(() => {
      showTooltip('Impossible d\'ouvrir le lien');
    });
  };

  const handleLongPress = (message) => {
    setLongPressedMessage(message);
    setShowContextMenu(true);
  };

  const handleContextMenuAction = async (action) => {
    setShowContextMenu(false);

    if (action === 'delete-me') {
      Alert.alert(
        'Supprimer le message',
        'Supprimer ce message pour vous ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => {
              setMessages(messages.map(m =>
                m.id === longPressedMessage.id
                  ? {
                      ...m,
                      deleted: true,
                      deletedBy: 'me',
                      originalText: m.text,
                      text: 'Vous avez supprimé ce message'
                    }
                  : m
              ));
              setLongPressedMessage(null);
            }
          }
        ]
      );
    } else if (action === 'delete-all') {
      Alert.alert(
        'Supprimer le message',
        'Supprimer ce message pour tout le monde ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => {
              const messageType = longPressedMessage.type;
              const isSentByMe = messageType.includes('sent');

              setMessages(messages.map(m =>
                m.id === longPressedMessage.id
                  ? {
                      ...m,
                      deleted: true,
                      deletedBy: isSentByMe ? 'me' : 'other',
                      originalText: m.text,
                      text: isSentByMe ? 'Vous avez supprimé ce message' : `${conversation.user.username} a supprimé ce message`
                    }
                  : m
              ));
              setLongPressedMessage(null);
            }
          }
        ]
      );
    } else if (action === 'delete-permanent') {
      Alert.alert(
        'Supprimer définitivement',
        'Voulez-vous supprimer définitivement ce message ?',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => {
              setMessages(messages.filter(m => m.id !== longPressedMessage.id));
              setLongPressedMessage(null);
            }
          }
        ]
      );
    } else if (action === 'copy') {
      if (longPressedMessage.text && !longPressedMessage.deleted) {
        await Clipboard.setStringAsync(longPressedMessage.text);
        showTooltip('Texte copié');
      }
      setLongPressedMessage(null);
    } else if (action === 'reply') {
      handleReplyToMessage(longPressedMessage);
      setLongPressedMessage(null);
    } else if (action === 'download') {
      if (longPressedMessage.imageUrl) {
        showTooltip('Image téléchargée');
      }
      setLongPressedMessage(null);
    }
  };

  const handleReport = () => {
    if (!reportReason.trim()) {
      Alert.alert('Erreur', 'Veuillez sélectionner une raison');
      return;
    }

    setShowReportModal(false);
    setReportReason('');
    Alert.alert('Signalement envoyé', 'Merci pour votre signalement. Notre équipe va examiner votre demande.');
  };

  const handleConfirmTransaction = () => {
    setTransactionConfirmed(true);

    const confirmMessage = {
      id: Date.now().toString(),
      type: 'system',
      text: isUserSeller ? `${conversation.user.username} a confirmé que la transaction a bien eu lieu` : 'Vous avez confirmé que la transaction a bien eu lieu',
      timestamp: new Date(),
      isTransactionConfirmed: true,
    };

    setMessages([...messages, confirmMessage]);

    if (isUserSeller) {
      showTooltip(`${conversation.user.username} a confirmé la transaction`);
    } else {
      showTooltip('Transaction confirmée');
    }
  };

  const handleAuthorizeRating = () => {
    setRatingAuthorized(true);
    showTooltip(`${conversation.user.username} peut maintenant vous noter`);
  };

  const handleSubmitRating = () => {
    if (rating === 0) {
      showTooltip('Veuillez sélectionner une note');
      return;
    }

    const ratingMessage = {
      id: Date.now().toString(),
      type: 'rating-sent',
      rating: rating,
      review: reviewText.trim(),
      timestamp: new Date(),
      status: 'sent',
      isOnline: false,
    };

    setMessages([...messages, ratingMessage]);
    setShowRatingModal(false);
    setRating(0);
    setReviewText('');
    showTooltip('Note envoyée avec succès');
  };

  const isLink = (text) => {
    return /^((https?:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+)$/.test(text);
  };

  const renderTextWithLinks = (text, style, isDeleted = false) => {
    if (isDeleted) {
      return <Text style={[style, { fontStyle: 'italic' }]}>{text}</Text>;
    }

    const words = text.split(/(\s+)/);

    return (
      <Text style={style}>
        {words.map((word, index) => {
          const trimmedWord = word.trim();
          if (trimmedWord && isLink(trimmedWord)) {
            return (
              <Text key={index}>
                <Text
                  style={{ color: colors.linkColor, textDecorationLine: 'underline' }}
                  onPress={() => handleLinkPress(trimmedWord)}
                >
                  {trimmedWord}
                </Text>
                {word !== trimmedWord ? word.replace(trimmedWord, '') : ''}
              </Text>
            );
          }
          return <Text key={index}>{word}</Text>;
        })}
      </Text>
    );
  };

  const hasAcceptedOffer = messages.some(msg => msg.type === 'system' && msg.isOfferAccepted);

  const closeAllModals = () => {
    setShowMenu(false);
    setShowImageModal(false);
    setShowNewOfferModal(false);
    setShowReportModal(false);
    setShowContextMenu(false);
    setShowSearchBar(false);
    setShowRatingModal(false);
    Keyboard.dismiss();
  };

  const getFilteredMessages = () => {
    if (!searchQuery.trim()) {
      const msgs = [...messages];

      if (hasAcceptedOffer && !transactionConfirmed && !msgs.some(m => m.type === 'transaction-agreement')) {
        msgs.push({
          id: 'transaction-agreement',
          type: 'transaction-agreement',
          timestamp: new Date(),
        });
      }

      return msgs;
    }

    return messages.filter(msg => {
      if (msg.text && !msg.deleted) {
        return msg.text.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return false;
    });
  };

  const renderMessage = ({ item }) => {
    const isHighlighted = highlightedMessageId === item.id;

    const highlightColor = highlightOpacityAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [
        'rgba(0, 0, 0, 0)',
        isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)'
      ],
    });

    if (item.type === 'system') {
      return (
        <TouchableOpacity
          style={styles.systemMessageContainer}
          onPress={() => item.isOfferAccepted && handleSystemMessagePress(item.id)}
          disabled={!item.isOfferAccepted}
        >
          <View style={styles.systemMessage}>
            <Text style={[
              styles.systemMessageText,
              { backgroundColor: colors.systemBg, color: colors.textSecondary },
              item.isOfferAccepted && styles.offerAcceptedSystem,
              item.isTransactionConfirmed && styles.transactionConfirmedSystem
            ]}>
              {item.text}
            </Text>
            <Text style={[styles.systemMessageTime, { color: colors.textSecondary }]}>{getTimeString(item.timestamp)}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item.type === 'sent') {
      const showReadStatus = item.status === 'read';
      const showDoubleCheck = item.isOnline;

      return (
        <TouchableOpacity
          style={[styles.messageRow, styles.sentMessageRow]}
          onLongPress={() => handleLongPress(item)}
          delayLongPress={500}
          activeOpacity={0.9}
        >
          <View style={[
            styles.messageBubble,
            styles.sentBubble,
            { backgroundColor: item.deleted ? colors.deletedBg : colors.bubbleSent },
            styles.bubbleShadow
          ]}>
            {renderTextWithLinks(item.text, [styles.sentText, { color: item.deleted ? colors.deletedText : colors.bubbleSentText }], item.deleted)}
            <View style={styles.sentTimeRow}>
              <Text style={[styles.sentTime, { color: item.deleted ? colors.deletedText : 'rgba(255, 255, 255, 0.7)' }]}>{getTimeString(item.timestamp)}</Text>
              {!item.deleted && (
                showReadStatus ? (
                  <CheckAll color="#3B82F6" size={16} />
                ) : showDoubleCheck ? (
                  <CheckAll color="rgba(255, 255, 255, 0.7)" size={16} />
                ) : (
                  <Check color="rgba(255, 255, 255, 0.7)" size={16} />
                )
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    if (item.type === 'received') {
      return (
        <TouchableOpacity
          style={styles.messageRow}
          onLongPress={() => handleLongPress(item)}
          delayLongPress={500}
          activeOpacity={0.9}
        >
          <View style={[
            styles.messageBubble,
            styles.receivedBubble,
            { backgroundColor: item.deleted ? colors.deletedBg : colors.bubbleReceived },
            styles.bubbleShadow
          ]}>
            {renderTextWithLinks(item.text, [styles.receivedText, { color: item.deleted ? colors.deletedText : colors.bubbleReceivedText }], item.deleted)}
            <Text style={[styles.receivedTime, { color: colors.textSecondary }]}>{getTimeString(item.timestamp)}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item.type === 'image-sent') {
      const showReadStatus = item.status === 'read';
      const showDoubleCheck = item.isOnline;

      return (
        <TouchableOpacity
          style={[styles.messageRow, styles.sentMessageRow]}
          onLongPress={() => handleLongPress(item)}
          delayLongPress={500}
          activeOpacity={0.9}
        >
          <View style={[
            styles.imageMessageContainer,
            { backgroundColor: colors.bubbleSent },
            styles.bubbleShadow
          ]}>
            <TouchableOpacity onPress={() => handleImagePress(item.imageUrl)}>
              <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
            </TouchableOpacity>
            {item.text && item.text.trim().length > 0 && (
              <Text style={[styles.imageMessageText, { color: colors.bubbleSentText }]}>{item.text}</Text>
            )}
            <View style={styles.sentTimeRow}>
              <Text style={[styles.sentTime, { color: 'rgba(255, 255, 255, 0.7)' }]}>{getTimeString(item.timestamp)}</Text>
              {showReadStatus ? (
                <CheckAll color="#3B82F6" size={16} />
              ) : showDoubleCheck ? (
                <CheckAll color="rgba(255, 255, 255, 0.7)" size={16} />
              ) : (
                <Check color="rgba(255, 255, 255, 0.7)" size={16} />
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // Simplified render for other message types
    return null;
  };

  const filteredMessages = getFilteredMessages();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.headerBg}
      />

      {activeTooltip && (
        <Animated.View style={[styles.tooltip, { opacity: tooltipFadeAnim }]}>
          <Text style={styles.tooltipText}>{activeTooltip}</Text>
        </Animated.View>
      )}

      {/* Modal Actions Menu */}
      <Modal visible={showMenu} transparent animationType="none" onRequestClose={closeAllModals}>
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeAllModals}>
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.modalContent, { backgroundColor: colors.modalBg, transform: [{ translateY: slideAnim }] }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Actions</Text>
              <TouchableOpacity onPress={closeAllModals}>
                <Close color={colors.text} size={28} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.menuOption} onPress={() => handleMenuAction('profile')}>
              <ProfileFill color={colors.text} size={20} />
              <Text style={[styles.menuOptionText, { color: colors.text }]}>Voir le profil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuOption} onPress={() => handleMenuAction('block')}>
              <PresenceBlocked16Regular color={colors.text} size={20} />
              <Text style={[styles.menuOptionText, { color: colors.text }]}>Bloquer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuOption} onPress={() => handleMenuAction('report')}>
              <ReportProblemFilled color={colors.text} size={20} />
              <Text style={[styles.menuOptionText, { color: colors.text }]}>Signaler</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuOption} onPress={() => handleMenuAction('delete')}>
              <Trash color="#EF4444" size={20} />
              <Text style={[styles.menuOptionText, { color: '#EF4444' }]}>Supprimer la conversation</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Context Menu */}
      <Modal visible={showContextMenu} transparent animationType="fade" onRequestClose={closeAllModals}>
        <TouchableOpacity style={styles.contextMenuOverlay} activeOpacity={1} onPress={closeAllModals}>
          <View style={[styles.contextMenu, { backgroundColor: colors.modalBg, borderColor: colors.border }]}>
            {longPressedMessage?.text && !longPressedMessage?.deleted && (
              <TouchableOpacity style={styles.contextMenuItem} onPress={() => handleContextMenuAction('copy')}>
                <Copy color={colors.text} size={20} />
                <Text style={[styles.contextMenuText, { color: colors.text }]}>Copier</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.contextMenuItem} onPress={() => handleContextMenuAction('reply')}>
              <Reply color={colors.text} size={20} />
              <Text style={[styles.contextMenuText, { color: colors.text }]}>Répondre</Text>
            </TouchableOpacity>

            {longPressedMessage?.imageUrl && (
              <TouchableOpacity style={styles.contextMenuItem} onPress={() => handleContextMenuAction('download')}>
                <Download2Rounded color={colors.text} size={20} />
                <Text style={[styles.contextMenuText, { color: colors.text }]}>Télécharger</Text>
              </TouchableOpacity>
            )}

            {longPressedMessage?.type?.includes('sent') && !longPressedMessage?.deleted && (
              <TouchableOpacity style={styles.contextMenuItem} onPress={() => handleContextMenuAction('delete-all')}>
                <Trash color="#EF4444" size={20} />
                <Text style={[styles.contextMenuText, { color: '#EF4444' }]}>Supprimer pour tout le monde</Text>
              </TouchableOpacity>
            )}

            {!longPressedMessage?.deleted && (
              <TouchableOpacity style={styles.contextMenuItem} onPress={() => handleContextMenuAction('delete-me')}>
                <Trash color="#EF4444" size={20} />
                <Text style={[styles.contextMenuText, { color: '#EF4444' }]}>Supprimer pour moi</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Report */}
      <Modal visible={showReportModal} transparent animationType="none" onRequestClose={closeAllModals}>
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1} onPress={closeAllModals}>
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.modalContent, { backgroundColor: colors.modalBg, transform: [{ translateY: slideAnim }] }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Signaler</Text>
              <TouchableOpacity onPress={closeAllModals}>
                <Close color={colors.text} size={28} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.reportOptions}>
              {['Spam', 'Contenu inapproprié', 'Harcèlement', 'Arnaque', 'Faux profil'].map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={styles.reportOption}
                  onPress={() => setReportReason(reason)}
                >
                  <Text style={[styles.reportOptionText, { color: colors.text }]}>{reason}</Text>
                  {reportReason === reason && (
                    <View style={[styles.reportCheck, { backgroundColor: colors.text }]}>
                      <Text style={[styles.reportCheckIcon, { color: colors.background }]}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.reportSubmit, { backgroundColor: colors.text }]}
              onPress={handleReport}
            >
              <Text style={[styles.reportSubmitText, { color: colors.background }]}>Envoyer le signalement</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Image */}
      <Modal visible={showImageModal} transparent animationType="fade" onRequestClose={closeAllModals}>
        <View style={styles.imageModalContainer}>
          <TouchableOpacity style={styles.imageModalClose} onPress={closeAllModals}>
            <Close color="#FFFFFF" size={32} />
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
          )}
        </View>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.contentContainer}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.border, paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={handleBack}>
            <ArrowBackIosRounded color={colors.text} size={24} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerUser} onPress={handleProfilePress}>
            <View style={styles.headerProfileContainer}>
              <Image source={{ uri: conversation.user.profileImage }} style={styles.headerProfileImage} />
              {conversation.user.isOnline && <View style={[styles.headerOnlineDot, { backgroundColor: colors.onlineDot }]} />}
            </View>
            <View style={styles.headerUserInfo}>
              <View style={styles.headerUserNameRow}>
                <Text style={[styles.headerUserName, { color: colors.text }]}>{conversation.user.username}</Text>
                {conversation.user.verified && <VerifiedCheckFill color="#3B82F6" size={14} />}
              </View>
              <Text style={[styles.headerUserStatus, { color: colors.textSecondary }]}>
                {isTyping ? 'en train d\'écrire...' : conversation.user.isOnline ? 'En ligne' : getLastSeenText(conversation.user.lastSeen)}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowSearchBar(!showSearchBar);
              if (!showSearchBar) {
                setSearchQuery('');
              }
            }}
            style={styles.searchButton}
          >
            <Search color={colors.text} size={20} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.menuButton}>
            <MoreVertical color={colors.text} size={24} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        {showSearchBar && (
          <View style={[styles.searchBarContainer, { backgroundColor: colors.inputBg, borderBottomColor: colors.border }]}>
            <Search color={colors.textSecondary} size={18} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Rechercher dans la conversation..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              setShowSearchBar(false);
            }}>
              <CloseCircle color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>
        )}

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={filteredMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={true}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
            });
          }}
        />

        {/* Reply Preview */}
        {replyingTo && (
          <View style={[styles.replyPreviewContainer, { backgroundColor: colors.inputBg, borderTopColor: colors.border }]}>
            <View style={styles.replyPreviewContent}>
              <View style={[styles.replyPreviewLine, { backgroundColor: colors.text }]} />
              <View style={styles.replyPreviewTextContainer}>
                <Text style={[styles.replyPreviewLabel, { color: colors.textSecondary }]}>Répondre à</Text>
                <Text style={[styles.replyPreviewMessage, { color: colors.text }]} numberOfLines={1}>
                  {replyingTo.text || (replyingTo.amount ? `Offre de ${formatPrice(replyingTo.amount)} HTG` : 'Message')}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleCancelReply} style={styles.replyCancelButton}>
              <Close color={colors.textSecondary} size={24} />
            </TouchableOpacity>
          </View>
        )}

        {/* Attachment Menu */}
        {showAttachmentMenu && !keyboardVisible && (
          <Animated.View style={[
            styles.attachmentMenu,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              opacity: attachmentFadeAnim,
              transform: [{ translateY: attachmentSlideAnim }]
            }
          ]}>
            <TouchableOpacity style={styles.attachmentOption} onPress={() => handleAttachmentOption('camera')}>
              <Camera color={colors.text} size={24} />
              <Text style={[styles.attachmentOptionText, { color: colors.text }]}>Appareil photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachmentOption} onPress={() => handleAttachmentOption('gallery')}>
              <PictureSolid color={colors.text} size={24} />
              <Text style={[styles.attachmentOptionText, { color: colors.text }]}>Galerie</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachmentOption} onPress={() => handleAttachmentOption('location')}>
              <PositionMan color={colors.text} size={24} />
              <Text style={[styles.attachmentOptionText, { color: colors.text }]}>Partager position actuelle</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Input */}
        <View style={[styles.inputContainer, { backgroundColor: colors.headerBg, borderTopColor: colors.border, paddingBottom: insets.bottom + 10 }]}>
          <TouchableOpacity style={styles.inputButton} onPress={handleAttachmentPress}>
            {showAttachmentMenu && !keyboardVisible ? (
              <KeyboardFill color={colors.text} size={26} />
            ) : (
              <Plus color={colors.text} size={26} />
            )}
          </TouchableOpacity>

          <View style={[styles.messageInputWrapper, { backgroundColor: colors.inputBg }]}>
            <TextInput
              ref={textInputRef}
              style={[styles.messageInput, { color: colors.text }]}
              placeholder="Écrire un message..."
              placeholderTextColor={colors.textSecondary}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              onFocus={() => setShowAttachmentMenu(false)}
            />
          </View>

          {messageText.trim().length > 0 && (
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <PaperplaneSolid color={colors.text} size={26} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { flex: 1 },
  tooltip: { position: 'absolute', top: 100, alignSelf: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, zIndex: 1000 },
  tooltipText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  headerUser: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  headerProfileContainer: { position: 'relative', marginRight: 12 },
  headerProfileImage: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e0e0e0' },
  headerOnlineDot: { position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#FFFFFF' },
  headerUserInfo: { flex: 1 },
  headerUserNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerUserName: { fontSize: 16, fontWeight: '600' },
  headerUserStatus: { fontSize: 12, marginTop: 2 },
  searchButton: { marginRight: 12, padding: 4 },
  menuButton: { padding: 4 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 4 },
  messagesList: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 100 },
  messageRow: { marginBottom: 12, maxWidth: '80%' },
  sentMessageRow: { alignSelf: 'flex-end' },
  messageBubble: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  receivedBubble: { borderTopLeftRadius: 4 },
  sentBubble: { borderTopRightRadius: 4 },
  bubbleShadow: { elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  receivedText: { fontSize: 14, marginBottom: 4, lineHeight: 20 },
  receivedTime: { fontSize: 11 },
  sentText: { fontSize: 14, marginBottom: 4, lineHeight: 20 },
  sentTimeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  sentTime: { fontSize: 11 },
  systemMessageContainer: { alignItems: 'center', marginVertical: 12 },
  systemMessage: { alignItems: 'center' },
  systemMessageText: { fontSize: 12, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  offerAcceptedSystem: { backgroundColor: '#E8F5E9', color: '#22C55E', fontWeight: '600' },
  transactionConfirmedSystem: { backgroundColor: '#E3F2FD', color: '#2196F3', fontWeight: '600' },
  systemMessageTime: { fontSize: 10, marginTop: 4 },
  imageMessageContainer: { borderRadius: 12, padding: 4, borderTopRightRadius: 4, overflow: 'hidden' },
  messageImage: { width: 200, height: 200, borderRadius: 8, backgroundColor: '#e0e0e0' },
  imageMessageText: { fontSize: 14, marginTop: 8, paddingHorizontal: 4 },
  replyPreviewContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderTopWidth: 1 },
  replyPreviewContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  replyPreviewLine: { width: 3, height: 40, marginRight: 12, borderRadius: 2 },
  replyPreviewTextContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  replyPreviewLabel: { fontSize: 12, fontWeight: '600', marginRight: 8 },
  replyPreviewMessage: { fontSize: 14, flex: 1 },
  replyCancelButton: { padding: 8 },
  attachmentMenu: { paddingVertical: 12, borderTopWidth: 1 },
  attachmentOption: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12 },
  attachmentOptionText: { fontSize: 15, fontWeight: '500' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1, gap: 8 },
  inputButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  messageInputWrapper: { flex: 1, borderRadius: 20, paddingHorizontal: 4 },
  messageInput: { paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalOverlay: { ...StyleSheet.absoluteFillObject },
  modalContent: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '60%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  menuOption: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 16 },
  menuOptionText: { fontSize: 16 },
  contextMenuOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' },
  contextMenu: { borderRadius: 12, minWidth: 250, borderWidth: 1, overflow: 'hidden' },
  contextMenuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  contextMenuText: { fontSize: 15, fontWeight: '500' },
  reportOptions: { maxHeight: 300 },
  reportOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  reportOptionText: { fontSize: 15 },
  reportCheck: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  reportCheckIcon: { fontSize: 16, fontWeight: 'bold' },
  reportSubmit: { margin: 20, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  reportSubmitText: { fontSize: 16, fontWeight: '600' },
  imageModalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
  imageModalClose: { position: 'absolute', top: 50, right: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.3)', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  fullImage: { width: '100%', height: '100%' },
});

export default ChatScreen;
