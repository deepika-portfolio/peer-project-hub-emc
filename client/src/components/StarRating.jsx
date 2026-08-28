import React, { useState } from "react";

// Interactive star rating input (used when submitting a rating/review)
const StarRating = ({ value = 0, onChange, readOnly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          disabled={readOnly}
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          className={`text-xl ${readOnly ? "cursor-default" : "cursor-pointer"}`}
        >
          {(hover || value) >= star ? "⭐" : "☆"}
        </button>
      ))}
    </div>
  );
};

export default StarRating;
