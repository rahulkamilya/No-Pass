import { useState } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  Timestamp,
  orderBy,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from "../lib/firebase"

interface FirestoreDocument {
  id?: string;
  [key: string]: any;
}

export const useFirestore = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Add a new document to a collection
   */
  const addDocument = async (collectionName: string, data: FirestoreDocument) => {
    setLoading(true);
    setError(null);
    
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: Timestamp.fromDate(new Date()),
        modifiedAt: Timestamp.fromDate(new Date())
      });
      
      setLoading(false);
      return { id: docRef.id, ...data };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw new Error(err);
    }
  };

  /**
   * Update an existing document
   */
  const updateDocument = async (collectionName: string, id: string, data: Partial<FirestoreDocument>) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        modifiedAt: Timestamp.fromDate(new Date())
      });
      
      setLoading(false);
      return { id, ...data };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw new Error(err);
    }
  };

  /**
   * Delete a document
   */
  const deleteDocument = async (collectionName: string, id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw new Error(err);
    }
  };

  /**
   * Get documents by user ID
   */
  const getDocumentsByUserId = async (collectionName: string, userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(
        collectionRef, 
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      const documents = processQuerySnapshot(querySnapshot);
      
      setLoading(false);
      return documents;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw new Error(err);
    }
  };

  /**
   * Get all documents from a collection
   */
  const getAllDocuments = async (collectionName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const collectionRef = collection(db, collectionName);
      const querySnapshot = await getDocs(collectionRef);
      const documents = processQuerySnapshot(querySnapshot);
      
      setLoading(false);
      return documents;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw new Error(err);
    }
  };

  /**
   * Helper function to process query snapshots
   */
  const processQuerySnapshot = (querySnapshot: QuerySnapshot<DocumentData>) => {
    const documents: FirestoreDocument[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  };

  return {
    error,
    loading,
    addDocument,
    updateDocument,
    deleteDocument,
    getDocumentsByUserId,
    getAllDocuments
  };
};