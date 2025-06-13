import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";

export interface ReviewLikeData {
  reviewId: string;
  userId: string;
}

// Add/remove like from a review
export async function toggleReviewLike(
  reviewId: string,
  userId: string
): Promise<{ success: boolean; isLiked: boolean; newLikeCount: number }> {
  try {
    const reviewRef = doc(db, "Review", reviewId);
    const reviewDoc = await getDoc(reviewRef);

    if (!reviewDoc.exists()) {
      return { success: false, isLiked: false, newLikeCount: 0 };
    }

    const reviewData = reviewDoc.data();
    const likedBy = reviewData.likedBy || [];
    const currentLikes = reviewData.likes || 0;
    const isCurrentlyLiked = likedBy.includes(userId);

    if (isCurrentlyLiked) {
      // Remove like
      await updateDoc(reviewRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId),
      });
      return { success: true, isLiked: false, newLikeCount: currentLikes - 1 };
    } else {
      // Add like
      await updateDoc(reviewRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId),
      });
      return { success: true, isLiked: true, newLikeCount: currentLikes + 1 };
    }
  } catch (error) {
    console.error("Error toggling review like:", error);
    return { success: false, isLiked: false, newLikeCount: 0 };
  }
}

// Check if user has liked a review
export async function checkUserLikedReview(
  reviewId: string,
  userId: string
): Promise<boolean> {
  try {
    const reviewRef = doc(db, "Review", reviewId);
    const reviewDoc = await getDoc(reviewRef);

    if (!reviewDoc.exists()) {
      return false;
    }

    const reviewData = reviewDoc.data();
    const likedBy = reviewData.likedBy || [];
    return likedBy.includes(userId);
  } catch (error) {
    console.error("Error checking if user liked review:", error);
    return false;
  }
}
