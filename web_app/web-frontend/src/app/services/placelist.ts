// Updated placelist.ts
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export interface PlaceList {
  id: string;
  title: string;
  notes: string;
  isPublic: boolean;
  creatorId: string;
  restaurantId: string[];
  createdAt: string;
}

export async function getUserPlaceList(
  userId: string
): Promise<PlaceList | null> {
  const q = query(
    collection(db, "PlaceLists"),
    where("creatorId", "==", userId)
  );
  const snapshot = await getDocs(q);
  const docSnap = snapshot.docs[0];
  return docSnap
    ? ({
        id: docSnap.id,
        ...docSnap.data(),
        createdAt:
          docSnap.data().createdAt?.toDate?.()?.toISOString() ||
          docSnap.data().createdAt,
      } as PlaceList)
    : null;
}

export async function createPlaceList(
  userId: string,
  title: string,
  notes: string,
  isPublic: boolean
): Promise<PlaceList | null> {
  try {
    const newPlaceList: PlaceList = {
      id: "",
      title,
      notes,
      isPublic,
      creatorId: userId,
      restaurantId: [],
      createdAt: Timestamp.now().toDate().toISOString(),
    };

    const docRef = await addDoc(collection(db, "PlaceLists"), newPlaceList);
    return { ...newPlaceList, id: docRef.id };
  } catch (error) {
    console.error("Failed to create PlaceList:", error);
    return null;
  }
}

export async function addRestaurantToPlaceList(
  userId: string,
  restaurantId: string
): Promise<boolean> {
  try {
    const q = query(
      collection(db, "PlaceLists"),
      where("creatorId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      const existingData = existingDoc.data() as PlaceList;
      const updatedIds = [...existingData.restaurantId, restaurantId];

      await updateDoc(doc(db, "PlaceLists", existingDoc.id), {
        restaurantId: updatedIds,
      });

      return true;
    }
  } catch (error) {
    console.error("Failed to add restaurant to PlaceList:", error);
  }
  return false;
}

export async function removeRestaurantFromPlaceList(
  userId: string,
  restaurantId: string
): Promise<boolean> {
  try {
    const q = query(
      collection(db, "PlaceList"),
      where("creatorId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      const existingData = existingDoc.data() as PlaceList;
      const updatedIds = existingData.restaurantId.filter(
        (id) => id !== restaurantId
      );

      await updateDoc(doc(db, "PlaceList", existingDoc.id), {
        restaurantId: updatedIds,
      });

      return true;
    }
  } catch (error) {
    console.error("Failed to remove restaurant from PlaceList:", error);
  }
  return false;
}

export async function isRestaurantBookmarked(
  userId: string,
  restaurantId: string
): Promise<boolean> {
  const list = await getUserPlaceList(userId);
  return list?.restaurantId.includes(restaurantId) || false;
}
