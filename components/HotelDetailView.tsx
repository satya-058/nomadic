import React, { useState } from 'react';
import type { Hotel, Review, Room } from '../types';
import { ArrowLeftIcon, StarIcon, WifiIcon, SunIcon, BuildingLibraryIcon } from './icons';
import BookingModal from './BookingModal';

const amenityIcons: { [key: string]: React.ReactNode } = {
    'WiFi': <WifiIcon className="w-5 h-5 text-sky-400" />,
    'Pool': <SunIcon className="w-5 h-5 text-amber-400" />,
    'Gym': <BuildingLibraryIcon className="w-5 h-5 text-fuchsia-400" />,
};

const calculateAverageRating = (reviews: Review[]) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
};

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

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

interface HotelDetailViewProps {
    hotel: Hotel;
    onBack: () => void;
    onBookNow: (hotelId: number, roomType: Room['type'], bookingInfo: any) => void;
}

const HotelDetailView: React.FC<HotelDetailViewProps> = ({ hotel, onBack, onBookNow }) => {
    const [mainImage, setMainImage] = useState(hotel.images[0]);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    
    const averageRating = calculateAverageRating(hotel.reviews);
    const isFullyBooked = hotel.rooms.every(room => room.availability === 0);
    const sortedReviews = [...hotel.reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleBookingSubmit = (bookingInfo: any) => {
        onBookNow(hotel.id, bookingInfo.roomType, bookingInfo);
        setIsBookingModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4 sm:p-8 animate-fadeIn">
            <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }`}</style>
            
            <button onClick={onBack} className="flex items-center gap-2 text-sky-400 hover:text-sky-300 mb-6 transition-colors">
                <ArrowLeftIcon className="w-5 h-5" />
                Back to Hotels
            </button>

            <div className="bg-slate-800 rounded-2xl shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-5">
                    <div className="lg:col-span-3 p-4">
                        <img src={mainImage} alt={hotel.name} className="w-full h-96 object-cover rounded-xl" />
                        <div className="flex gap-2 mt-2">
                            {hotel.images.map((img, idx) => (
                                <img 
                                    key={idx} 
                                    src={img} 
                                    alt={`Thumbnail ${idx+1}`} 
                                    onClick={() => setMainImage(img)}
                                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-fuchsia-500' : 'border-transparent hover:border-slate-500'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-2 p-6 flex flex-col justify-between">
                         <div>
                            <h1 className="text-4xl font-extrabold text-white">{hotel.name}</h1>
                            <p className="text-slate-400 mt-1">{hotel.address}</p>
                            <div className="flex items-center gap-2 my-4">
                                <span className="text-2xl font-bold text-amber-400">{averageRating.toFixed(1)}</span>
                                <StarRatingDisplay rating={averageRating} reviewCount={hotel.reviews.length} />
                            </div>
                            <div className="flex gap-4 my-4">
                                {hotel.amenities.map(amenity => (
                                    <div key={amenity} className="flex items-center gap-2 bg-slate-700/50 px-3 py-1 rounded-full text-sm">
                                        {amenityIcons[amenity]}
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-slate-400 text-sm">starting from</p>
                            <p className="text-4xl font-bold text-fuchsia-400">${hotel.pricePerNight}<span className="text-lg font-normal text-slate-400">/night</span></p>
                         </div>
                    </div>
                </div>

                <div className="p-6 md:p-10 border-t border-slate-700">
                    <h2 className="text-2xl font-bold text-white mb-6">Room Availability</h2>
                    <div className="space-y-4 mb-8">
                        {hotel.rooms.map(room => (
                            <div key={room.type} className="bg-slate-900/50 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg text-white">{room.type} Room</p>
                                    <p className="text-fuchsia-400 font-semibold">${room.price}/night</p>
                                </div>
                                <p className={`text-sm font-semibold px-3 py-1 rounded-full ${room.availability > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {room.availability > 0 ? `${room.availability} available` : 'Sold Out'}
                                </p>
                            </div>
                        ))}
                    </div>
                    {isFullyBooked ? (
                         <div className="text-center p-4 bg-red-900/50 rounded-lg">
                            <p className="text-red-300 font-semibold mb-2">No rooms available for this hotel.</p>
                            <button onClick={onBack} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg">Explore Similar Hotels</button>
                         </div>
                    ) : (
                         <button onClick={() => setIsBookingModalOpen(true)} className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-4 rounded-lg transition-colors text-lg">
                            Book Now
                         </button>
                    )}
                </div>

                 <div className="p-6 md:p-10 border-t border-slate-700">
                     <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
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
                                <p className="text-slate-400 text-center py-8">Be the first to review this hotel!</p>
                            )}
                        </div>
                 </div>
            </div>
            {isBookingModalOpen && (
                <BookingModal 
                    hotel={hotel} 
                    onClose={() => setIsBookingModalOpen(false)}
                    onSubmit={handleBookingSubmit}
                />
            )}
        </div>
    );
};

export default HotelDetailView;