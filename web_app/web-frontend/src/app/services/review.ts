import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  description: string;
  likes: number;
  ambianceRating: number;
  foodRating: number;
  serviceRating: number;
  averageRating: number;
  photoUrls: string[];
  videoUrl: string;
  createdAt: Date;
}

export async function getReviewsByRestaurantId(
  restaurantId: string
): Promise<Review[]> {
  try {
    const q = query(
      collection(db, "Review"),
      where("restaurantId", "==", restaurantId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Review[];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export async function getReviewsByUserId(userId: string): Promise<Review[]> {
  try {
    const q = query(collection(db, "Review"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
    })) as Review[];
  } catch (error) {
    console.error("Error fetching reviews by user ID:", error);
    return [];
  }
}
export async function getReviewById(reviewId: string): Promise<Review | null> {
  try {
    const docRef = doc(db, "Review", reviewId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
      } as Review;
    } else {
      console.warn("No review found with ID:", reviewId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching review by ID:", error);
    return null;
  }
}
