import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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
    const restaurants: Restaurant[] = [];

    querySnapshot.forEach((doc) => {
      restaurants.push({
        id: doc.id,
        ...doc.data(),
      } as Restaurant);
    });

    return restaurants;
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
    const restaurants: Restaurant[] = [];

    for (const id of ids) {
      const docRef = doc(db, "Restaurant", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        restaurants.push({
          id: docSnap.id,
          ...docSnap.data(),
        } as Restaurant);
      }
    }

    return restaurants;
  } catch (error) {
    console.error("Error fetching restaurants by IDs:", error);
    return [];
  }
}

export async function getRestaurantById(
  id: string
): Promise<Restaurant | null> {
  try {
    const docRef = doc(db, "Restaurant", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Restaurant;
    }

    return null;
  } catch (error) {
    console.error("Error fetching restaurant by ID:", error);
    return null;
  }
}
