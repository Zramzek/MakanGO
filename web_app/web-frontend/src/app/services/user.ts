/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface User {
  id: string;
  createdAt: string;
  email: string;
  jumlah_review: number;
  level: number;
  name: string;
  username: string;
  uid: string;
}

export interface UpdateUserData {
  name?: string;
  username?: string;
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const docRef = doc(db, "User", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        ...data,
      } as User;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function updateUser(
  id: string,
  data: UpdateUserData
): Promise<boolean> {
  try {
    const docRef = doc(db, "User", id);
    await updateDoc(docRef, data as any);
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
}
