import React, { useState } from 'react';
import { StarIcon } from './icons';

interface StarRatingInputProps {
    rating: number;
    onRatingChange: (rating: number) => void;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    type="button"
                    key={star}
                    onClick={() => onRatingChange(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 bg-transparent border-none cursor-pointer"
                    aria-label={`Rate ${star} stars`}
                >
                    <StarIcon
                        className={`w-8 h-8 transition-colors ${
                            (hoverRating || rating) >= star
                                ? 'text-amber-400'
                                : 'text-slate-600 hover:text-slate-500'
                        }`}
                    />
                </button>
            ))}
        </div>
    );
};

export default StarRatingInput;