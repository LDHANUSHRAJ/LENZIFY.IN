"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  productId: string;
  userId?: string;
  onSubmit?: () => void;
}

export default function ReviewForm({ productId, userId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please log in to submit a review.");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    if (!review.trim() || review.trim().length < 10) {
      toast.error("Please write at least 10 characters in your review.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    const { error } = await supabase.from("reviews").insert({
      user_id: userId,
      product_id: productId,
      rating,
      review: review.trim(),
      status: "pending", // Awaits admin approval
    });

    setSubmitting(false);

    if (error) {
      toast.error("Failed to submit review. Please try again.");
      return;
    }

    toast.success("Review submitted! It will appear after moderation.");
    setSubmitted(true);
    setRating(0);
    setReview("");
    onSubmit?.();
  };

  if (submitted) {
    return (
      <div className="p-8 bg-emerald-50 border border-emerald-100 text-center space-y-3">
        <p className="text-sm font-bold text-emerald-600">Thank you for your review!</p>
        <p className="text-xs text-emerald-500">It will be visible after our team reviews it.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-white border border-brand-navy/5">
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-brand-navy">
          Write a Review
        </h3>

        {/* Star Rating */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-125"
            >
              <Star
                size={24}
                className={cn(
                  "transition-colors",
                  (hoverRating || rating) >= star
                    ? "fill-secondary text-secondary"
                    : "text-brand-navy/15"
                )}
              />
            </button>
          ))}
          <span className="text-xs text-brand-navy/40 font-bold uppercase ml-2 self-center">
            {rating > 0 ? `${rating}/5` : "Select rating"}
          </span>
        </div>
      </div>

      {/* Review Text */}
      <div className="space-y-3">
        <label className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40">
          Your Experience
        </label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          placeholder="Share your experience with this product..."
          className="w-full bg-transparent border border-brand-navy/10 py-4 px-4 text-sm text-brand-navy outline-none focus:border-secondary transition-all resize-none rounded-sm"
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !userId}
        className="px-8 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-secondary hover:text-brand-navy transition-all disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>

      {!userId && (
        <p className="text-xs text-brand-navy/40 italic">
          You need to be logged in to write a review.
        </p>
      )}
    </form>
  );
}
