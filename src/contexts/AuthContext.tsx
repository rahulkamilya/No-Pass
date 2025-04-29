import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, createUserRecord, getUserRecord } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { googleProvider } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  currentUser: User | null;
  userProfile: any | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isProfileComplete: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const isProfileComplete =
    userProfile && userProfile.username && userProfile.phoneNumber;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const profile = await getUserRecord(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const profile = await getUserRecord(user.email);
      if (!profile) {
        // Create initial user record
        await createUserRecord(user.uid, {
          name: user.displayName,
          email: user.email,
          // Username and phone will be collected later
        });
      }

      toast({
        title: "Signed in successfully",
        description: "Welcome to Password Vault!",
      });
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast({
        title: "Sign-in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const value = {
    currentUser,
    userProfile,
    signInWithGoogle,
    signOut,
    loading,
    isProfileComplete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
