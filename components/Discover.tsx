import React, { useState } from 'react';
import { MOCK_OFFBEAT_LOCATIONS } from '../constants';
import type { OffbeatLocation, Review } from '../types';
import { StarIcon } from './icons';
import GemDetailView from './GemDetailView';

const calculateAverageRating = (reviews: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
};

const Rating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
            <StarIcon key={index} className={`w-5 h-5 ${index < Math.round(rating) ? 'text-amber-400' : 'text-slate-600'}`} />
        ))}
        {rating > 0 && <span className="ml-2 text-sm text-slate-300 font-bold">{rating.toFixed(1)}</span>}
    </div>
);


const OffbeatLocationCard: React.FC<{ location: OffbeatLocation; onSelect: () => void; }> = ({ location, onSelect }) => {
    const avgRating = calculateAverageRating(location.reviews);
    return (
        <div onClick={onSelect} className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            <img className="w-full h-56 object-cover" src={location.imageUrl} alt={location.name} />
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-white truncate">{location.name}</h3>
                    <Rating rating={avgRating} />
                </div>
                <p className="text-slate-400 mb-4">{location.location}</p>
                <p className="text-slate-300 h-12 overflow-hidden text-ellipsis">{location.description}</p>
            </div>
        </div>
    );
};

const Discover: React.FC = () => {
    const [locations, setLocations] = useState<OffbeatLocation[]>(MOCK_OFFBEAT_LOCATIONS);
    const [selectedGem, setSelectedGem] = useState<OffbeatLocation | null>(null);

    const handleAddReview = (gemId: number, newReview: { rating: number; comment: string }) => {
        const fullReview: Review = {
            ...newReview,
            id: Date.now(),
            date: new Date().toISOString(),
            username: 'You', // Placeholder for current user
        };
        
        const newLocations = locations.map(loc => {
            if (loc.id === gemId) {
                const updatedLoc = {
                    ...loc,
                    reviews: [fullReview, ...loc.reviews], // Add new review to the top
                };
                 // Update the selectedGem state if it's currently being viewed
                if (selectedGem && selectedGem.id === gemId) {
                    setSelectedGem(updatedLoc);
                }
                return updatedLoc;
            }
            return loc;
        });
        setLocations(newLocations);
    };

    if (selectedGem) {
        return (
            <GemDetailView
                gem={selectedGem}
                onBack={() => setSelectedGem(null)}
                onAddReview={handleAddReview}
            />
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-8">
            <div className="bg-slate-800/50 rounded-xl p-6 mb-8 text-center shadow-md">
                <h2 className="text-3xl font-bold text-white mb-2">Discover Hidden Gems</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Explore off-the-beaten-path locations, rated and reviewed by travelers like you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {locations.map(location => (
                    <OffbeatLocationCard 
                        key={location.id} 
                        location={location} 
                        onSelect={() => setSelectedGem(location)} 
                    />
                ))}
            </div>
        </div>
    );
};

export default Discover;