const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

/**
 * Trigger: Création d'un nouvel utilisateur
 * Crée automatiquement un document utilisateur dans Firestore
 */
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user;

  try {
    await db.collection('users').doc(uid).set({
      email: email || null,
      displayName: displayName || null,
      photoURL: photoURL || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      rating: 0,
      totalRatings: 0,
      productsCount: 0,
      requestsCount: 0,
    });

    console.log(`Utilisateur créé: ${uid}`);
    return null;
  } catch (error) {
    console.error('Erreur lors de la création du profil utilisateur:', error);
    throw error;
  }
});

/**
 * Trigger: Suppression d'un utilisateur
 * Nettoie les données associées à l'utilisateur
 */
exports.onUserDelete = functions.auth.user().onDelete(async (user) => {
  const { uid } = user;

  try {
    // Supprimer le document utilisateur
    await db.collection('users').doc(uid).delete();

    // Optionnel: Supprimer les produits de l'utilisateur
    const productsSnapshot = await db.collection('products')
      .where('userId', '==', uid)
      .get();

    const batch = db.batch();
    productsSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    console.log(`Données utilisateur supprimées: ${uid}`);
    return null;
  } catch (error) {
    console.error('Erreur lors de la suppression des données utilisateur:', error);
    throw error;
  }
});

/**
 * Trigger: Nouveau produit publié
 * Met à jour le compteur de produits de l'utilisateur
 */
exports.onProductCreate = functions.firestore
  .document('products/{productId}')
  .onCreate(async (snap, context) => {
    const product = snap.data();
    const userId = product.userId;

    try {
      await db.collection('users').doc(userId).update({
        productsCount: admin.firestore.FieldValue.increment(1),
      });

      console.log(`Produit créé: ${context.params.productId}`);
      return null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du compteur:', error);
      throw error;
    }
  });

/**
 * Trigger: Produit supprimé
 * Met à jour le compteur de produits de l'utilisateur
 */
exports.onProductDelete = functions.firestore
  .document('products/{productId}')
  .onDelete(async (snap, context) => {
    const product = snap.data();
    const userId = product.userId;

    try {
      await db.collection('users').doc(userId).update({
        productsCount: admin.firestore.FieldValue.increment(-1),
      });

      console.log(`Produit supprimé: ${context.params.productId}`);
      return null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du compteur:', error);
      throw error;
    }
  });

/**
 * Trigger: Nouvelle évaluation
 * Met à jour la moyenne des évaluations de l'utilisateur ciblé
 */
exports.onRatingCreate = functions.firestore
  .document('ratings/{ratingId}')
  .onCreate(async (snap, context) => {
    const rating = snap.data();
    const targetUserId = rating.targetUserId;
    const ratingValue = rating.rating;

    try {
      const userRef = db.collection('users').doc(targetUserId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const currentRating = userData.rating || 0;
        const totalRatings = userData.totalRatings || 0;

        // Calculer la nouvelle moyenne
        const newTotalRatings = totalRatings + 1;
        const newRating = ((currentRating * totalRatings) + ratingValue) / newTotalRatings;

        await userRef.update({
          rating: newRating,
          totalRatings: newTotalRatings,
        });
      }

      console.log(`Évaluation créée: ${context.params.ratingId}`);
      return null;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'évaluation:', error);
      throw error;
    }
  });

/**
 * HTTP Function: Envoyer une notification
 * Exemple d'endpoint pour envoyer des notifications push
 */
exports.sendNotification = functions.https.onCall(async (data, context) => {
  // Vérifier l'authentification
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'L\'utilisateur doit être authentifié.'
    );
  }

  const { targetUserId, title, body, type } = data;

  if (!targetUserId || !title || !body) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'targetUserId, title et body sont requis.'
    );
  }

  try {
    // Créer une notification dans Firestore
    await db.collection('notifications').add({
      userId: targetUserId,
      title,
      body,
      type: type || 'general',
      read: false,
      senderId: context.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: 'Notification envoyée' };
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    throw new functions.https.HttpsError('internal', 'Erreur interne');
  }
});

/**
 * HTTP Function: Nettoyer les anciennes données
 * Endpoint pour supprimer les données obsolètes (à appeler périodiquement)
 */
exports.cleanupOldData = functions.https.onRequest(async (req, res) => {
  // Vérifier la méthode HTTP
  if (req.method !== 'POST') {
    res.status(405).send('Méthode non autorisée');
    return;
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Supprimer les notifications lues de plus de 30 jours
    const oldNotifications = await db.collection('notifications')
      .where('read', '==', true)
      .where('createdAt', '<', thirtyDaysAgo)
      .get();

    const batch = db.batch();
    oldNotifications.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    res.status(200).json({
      success: true,
      deletedCount: oldNotifications.size,
    });
  } catch (error) {
    console.error('Erreur lors du nettoyage:', error);
    res.status(500).json({ error: 'Erreur interne' });
  }
});
