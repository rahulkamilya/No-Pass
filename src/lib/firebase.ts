import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, updateDoc } from "firebase/firestore";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Helper function to generate user ID
const generateUserId = (firstName: string): string => {
  const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generate 4 random numbers
  return `${firstName.toLowerCase()}_${randomNumbers}`;
};

// Check if username exists
export const checkUsernameExists = async (username: string): Promise<boolean> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Create or update user record with custom ID
export const createUserRecord = async (userId: string, userData: any) => {
  // const customId = generateUserId(userData.name?.split(' ')[0] || 'user');
  const customId = userData.email;
  const userRef = doc(db, "users", customId);
  await setDoc(userRef, {
    ...userData,
    isVerified: true,
    createdAt: new Date(),
    passwords: {},
    creditCards: {}
  });
  return customId;
};

// Get user record
export const getUserRecord = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data();
  }
  
  return null;
};

export const addPasswordToUser = async (userId: string, passwordData: any) => {
  const userRef = doc(db, "users", userId);
  
  // Use updateDoc with FieldValue to add to the passwords map
  await updateDoc(userRef, {
    [`passwords.${passwordData.id}`]: passwordData
  });
};

export const getUserPasswords = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data().passwords || {};
  }
  
  return {};
};

export { app, auth, db, googleProvider };
