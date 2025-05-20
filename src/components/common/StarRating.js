"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import PropTypes from "prop-types";
import clsx from "clsx";

export default function StarRating({
  rating = 0,
  onChange = null,
  size = 24,
  readonly = false,
  className = "",
}) {
  const [hovered, setHovered] = useState(null);

  const displayRating = hovered ?? rating;

  return (
    <div className={clsx("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;
        return (
          <button
            key={star}
            type="button"
            className="group"
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(null)}
            disabled={readonly}
            aria-label={`Rate ${star} star`}
          >
            <Star
              size={size}
              strokeWidth={1.5}
              className={clsx(
                "transition duration-150",
                isFilled ? "fill-yellow-400 text-yellow-500" : "text-gray-400"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}

StarRating.propTypes = {
  rating: PropTypes.number,
  onChange: PropTypes.func,
  size: PropTypes.number,
  readonly: PropTypes.bool,
  className: PropTypes.string,
};
