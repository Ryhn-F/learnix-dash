import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db, hasFirebaseConfig } from "../lib/firebase/firebase";
import { ChatMessage, ChatSession } from "../types/chat";

export class ChatService {
  static async createSession(
    userId: string,
    topic: string,
  ): Promise<ChatSession> {
    try {
      const docRef = await addDoc(collection(db, "chats"), {
        userId: userId,
        topic: topic,
        createdAt: serverTimestamp(),
      });

      const session: ChatSession = {
        id: docRef.id,
        topic,
        messages: [],
        createdAt: Date.now(),
      };
      return session;
    } catch (e: any) {
      console.log(e);
      throw new Error("Firebase Error", e.message);
    }
  }

  static async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    if (!hasFirebaseConfig) return [];

    try {
      const q = query(
        collection(db, "chats", sessionId, "messages"),
        orderBy("timestamp", "asc"),
      );
      const querySnapshot = await getDocs(q);

      const messages: ChatMessage[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        } as ChatMessage);
      });

      return messages;
    } catch (e) {
      console.warn("Failed retrieving chat from firebase", e);
      return [];
    }
  }

  static async saveMessage(
    sessionId: string,
    message: Omit<ChatMessage, "id">,
  ) {
    try {
      const docRef = await addDoc(
        collection(db, "chats", sessionId, "messages"),
        message,
      );

      console.log(docRef);
      return docRef.id;
    } catch (e) {
      console.warn("Failed saving message to firebase", e);
    }
  }
}
