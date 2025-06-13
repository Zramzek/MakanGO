// Firebase service functions for Restaurant
import {
  collection,
  getDocs,
  query,
  where,
  documentId,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export interface Restaurant {
  id: string;
  address: string;
  category: string;
  imagePath: string;
  latitude: number;
  longitude: number;
  name: string;
  rating: number;
  reviews: number;
  time: string;
}

export async function getAllRestaurants(): Promise<Restaurant[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "Restaurant"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Restaurant[];
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
}

export async function getRestaurantsByIds(
  ids: string[]
): Promise<Restaurant[]> {
  if (ids.length === 0) return [];

  try {
    const q = query(
      collection(db, "Restaurant"),
      where(documentId(), "in", ids)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Restaurant[];
  } catch (error) {
    console.error("Error fetching restaurants by IDs:", error);
    return [];
  }
}

export async function getRestaurantById(
  id: string
): Promise<Restaurant | null> {
  try {
    const q = query(
      collection(db, "Restaurant"),
      where(documentId(), "==", id)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as Restaurant;
  } catch (error) {
    console.error("Error fetching restaurant by ID:", error);
    return null;
  }
}
