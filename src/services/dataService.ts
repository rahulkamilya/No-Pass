
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

// Encryption/decryption functions (simplified - in production, use a proper encryption library)
const encrypt = (text: string): string => {
  return btoa(text);
};

const decrypt = (text: string): string => {
  return atob(text);
};

// Password management
export const addPassword = async (userId: string, passwordData: {
  website: string;
  username: string;
  passwordVal: string;
}) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const passwords = userData.passwords || {};
    const passwordId = `pwd_${Date.now()}`;
    
    passwords[passwordId] = {
      website: passwordData.website,
      username: passwordData.username,
      passwordVal: encrypt(passwordData.passwordVal),
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    };

    await updateDoc(userRef, { passwords });
    return passwordId;
  } catch (error) {
    console.error("Error adding password:", error);
    throw error;
  }
};

export const getUserPasswords = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return [];
    }

    const userData = userDoc.data();
    const passwords = userData.passwords || {};
    
    return Object.entries(passwords).map(([id, data]: [string, any]) => ({
      id,
      website: data.website,
      username: data.username,
      passwordVal: decrypt(data.passwordVal),
      createdAt: data.createdAt?.toDate(),
      modifiedAt: data.modifiedAt?.toDate(),
    }));
  } catch (error) {
    console.error("Error fetching passwords:", error);
    throw error;
  }
};

export const updatePassword = async (userId: string, passwordId: string, passwordData: {
  website?: string;
  username?: string;
  passwordVal?: string;
}) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const passwords = userData.passwords || {};
    
    if (!passwords[passwordId]) {
      throw new Error("Password not found");
    }

    passwords[passwordId] = {
      ...passwords[passwordId],
      ...passwordData,
      passwordVal: passwordData.passwordVal ? encrypt(passwordData.passwordVal) : passwords[passwordId].passwordVal,
      modifiedAt: serverTimestamp(),
    };

    await updateDoc(userRef, { passwords });
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
};

export const deletePassword = async (userId: string, passwordId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const passwords = userData.passwords || {};
    
    if (!passwords[passwordId]) {
      throw new Error("Password not found");
    }

    delete passwords[passwordId];
    await updateDoc(userRef, { passwords });
  } catch (error) {
    console.error("Error deleting password:", error);
    throw error;
  }
};

// Credit Card management
export const addCreditCard = async (userId: string, cardData: {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const creditCards = userData.creditCards || {};
    const cardId = `card_${Date.now()}`;
    
    creditCards[cardId] = {
      cardName: cardData.cardName,
      cardNumber: encrypt(cardData.cardNumber),
      expiryDate: cardData.expiryDate,
      cvv: encrypt(cardData.cvv),
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    };

    await updateDoc(userRef, { creditCards });
    return cardId;
  } catch (error) {
    console.error("Error adding credit card:", error);
    throw error;
  }
};

export const getUserCreditCards = async (userId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return [];
    }

    const userData = userDoc.data();
    const creditCards = userData.creditCards || {};
    
    return Object.entries(creditCards).map(([id, data]: [string, any]) => ({
      id,
      cardName: data.cardName,
      cardNumber: decrypt(data.cardNumber),
      expiryDate: data.expiryDate,
      cvv: decrypt(data.cvv),
      createdAt: data.createdAt?.toDate(),
      modifiedAt: data.modifiedAt?.toDate(),
    }));
  } catch (error) {
    console.error("Error fetching credit cards:", error);
    throw error;
  }
};

export const updateCreditCard = async (userId: string, cardId: string, cardData: {
  cardName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const creditCards = userData.creditCards || {};
    
    if (!creditCards[cardId]) {
      throw new Error("Credit card not found");
    }

    creditCards[cardId] = {
      ...creditCards[cardId],
      ...cardData,
      cardNumber: cardData.cardNumber ? encrypt(cardData.cardNumber) : creditCards[cardId].cardNumber,
      cvv: cardData.cvv ? encrypt(cardData.cvv) : creditCards[cardId].cvv,
      modifiedAt: serverTimestamp(),
    };

    await updateDoc(userRef, { creditCards });
  } catch (error) {
    console.error("Error updating credit card:", error);
    throw error;
  }
};

export const deleteCreditCard = async (userId: string, cardId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const creditCards = userData.creditCards || {};
    
    if (!creditCards[cardId]) {
      throw new Error("Credit card not found");
    }

    delete creditCards[cardId];
    await updateDoc(userRef, { creditCards });
  } catch (error) {
    console.error("Error deleting credit card:", error);
    throw error;
  }
};
