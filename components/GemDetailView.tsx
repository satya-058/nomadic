import React, { useState } from 'react';
import type { OffbeatLocation, Review } from '../types';
import { ArrowLeftIcon, StarIcon } from './icons';
import StarRatingInput from './StarRatingInput';

// Helper to calculate average rating
const calculateAverageRating = (reviews: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
};

// Helper to format date
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// A small component for displaying a star rating (not for input)
const StarRatingDisplay: React.FC<{ rating: number; reviewCount?: number }> = ({ rating, reviewCount }) => (
    <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
            <StarIcon key={index} className={`w-5 h-5 ${index < Math.round(rating) ? 'text-amber-400' : 'text-slate-600'}`} />
        ))}
        {reviewCount !== undefined && (
            <span className="ml-2 text-sm text-slate-400">{`(${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})`}</span>
        )}
    </div>
);


interface GemDetailViewProps {
    gem: OffbeatLocation;
    onBack: () => void;
    onAddReview: (gemId: number, newReview: { rating: number; comment: string }) => void;
}

const GemDetailView: React.FC<GemDetailViewProps> = ({ gem, onBack, onAddReview }) => {
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');

    const averageRating = calculateAverageRating(gem.reviews);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRating > 0 && newComment.trim() !== '') {
            onAddReview(gem.id, { rating: newRating, comment: newComment });
            setNewRating(0);
            setNewComment('');
        }
    };

    // Sort reviews by date, newest first
    const sortedReviews = [...gem.reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="container mx-auto p-4 sm:p-8 animate-fadeIn">
            <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }`}</style>
            
            <button onClick={onBack} className="flex items-center gap-2 text-sky-400 hover:text-sky-300 mb-6 transition-colors">
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Discover
            </button>
            
            <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <img src={gem.imageUrl} alt={gem.name} className="w-full h-64 md:h-96 object-cover" />
                
                <div className="p-6 md:p-10">
                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-white">{gem.name}</h1>
                            <p className="text-slate-400 mt-1">{gem.location}</p>
                        </div>
                        <div className="flex flex-col items-start md:items-end mt-4 md:mt-0">
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold text-amber-400">{averageRating.toFixed(1)}</span>
                                <StarRatingDisplay rating={averageRating} reviewCount={gem.reviews.length} />
                            </div>
                            <p className="text-sm text-slate-500 mt-1">Best Season: {gem.bestSeason}</p>
                        </div>
                    </div>

                    <p className="text-slate-300 max-w-3xl mb-10">{gem.description}</p>
                    
                    {/* Reviews Section */}
                    <div className="border-t border-slate-700 pt-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
                        
                        {/* Add Review Form */}
                        <div className="bg-slate-900/50 p-6 rounded-xl mb-8">
                            <h3 className="text-xl font-semibold text-white mb-4">Add Your Review</h3>
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Rating</label>
                                    <StarRatingInput rating={newRating} onRatingChange={setNewRating} />
                                </div>
                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-slate-300 mb-2">Your Comment</label>
                                    <textarea
                                        id="comment"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        rows={4}
                                        placeholder="Share your experience..."
                                        required
                                        className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                                <button type="submit" disabled={newRating === 0 || !newComment.trim()} className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                    Submit Review
                                </button>
                            </form>
                        </div>

                        {/* Existing Reviews List */}
                        <div className="space-y-6">
                            {sortedReviews.length > 0 ? (
                                sortedReviews.map(review => (
                                    <div key={review.id} className="border-b border-slate-700 pb-6 last:border-b-0">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="font-semibold text-white">{review.username}</p>
                                            <p className="text-sm text-slate-500">{formatDate(review.date)}</p>
                                        </div>
                                        <StarRatingDisplay rating={review.rating} />
                                        <p className="text-slate-300 mt-3">{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-center py-8">Be the first to review this location!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GemDetailView;