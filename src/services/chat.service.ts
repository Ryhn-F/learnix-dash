import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db, hasFirebaseConfig } from "../lib/firebase/firebase";
import { ChatMessage, ChatSession } from "../types/chat";
import { v4 as uuidv4 } from "uuid";

export class ChatService {
  static async createSession(
    topic: string = "General Learning",
  ): Promise<ChatSession> {
    const session: ChatSession = {
      id: uuidv4(),
      topic,
      messages: [],
      createdAt: Date.now(),
    };
    return session;
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
