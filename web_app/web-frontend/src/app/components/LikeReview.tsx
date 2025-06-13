"use client";

import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { Heart } from "lucide-react";
import { toggleReviewLike, checkUserLikedReview } from "../services/like";
import { useAuth } from "../utils/AuthContext"; // Adjust import path as needed

interface LikeButtonProps {
  reviewId: string;
  initialLikes: number;
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  reviewId,
  initialLikes,
  className = "flex items-center space-x-1 text-gray-400 text-xs select-none",
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);
  const { user: authUser } = useAuth(); // Adjust based on your auth implementation

  // Check if user has already liked this review
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!authUser?.uid) return;

      try {
        const liked = await checkUserLikedReview(reviewId, authUser.uid);
        setIsLiked(liked);
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkLikeStatus();
  }, [reviewId, authUser?.uid]);

  const handleLikeToggle = async () => {
    if (!authUser?.uid || isLoading) return;

    setIsLoading(true);

    // Optimistic update
    const newIsLiked = !isLiked;
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1;

    setIsLiked(newIsLiked);
    setLikeCount(newLikeCount);

    try {
      const result = await toggleReviewLike(reviewId, authUser.uid);

      if (result.success) {
        // Update with actual values from server
        setIsLiked(result.isLiked);
        setLikeCount(result.newLikeCount);
      } else {
        // Revert optimistic update on failure
        setIsLiked(!newIsLiked);
        setLikeCount(likeCount);
        console.error("Failed to toggle like");
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(!newIsLiked);
      setLikeCount(likeCount);
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if user is not authenticated
  if (!authUser?.uid) {
    return (
      <div className={className}>
        <FaHeart />
        <span>{likeCount}</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={`${className} ${
        isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
      } transition-colors duration-200 cursor-pointer disabled:opacity-50`}
    >
      {isLiked ? (
        <Heart className="w-3 h-3 fill-current" />
      ) : (
        <FaHeart className="w-3 h-3" />
      )}
      <span>{likeCount}</span>
    </button>
  );
};

export default LikeButton;
