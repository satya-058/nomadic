import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_HOTELS } from '../constants';
import type { Hotel, Room } from '../types';
import { StarIcon } from './icons';
import HotelDetailView from './HotelDetailView';
import BookingConfirmationPopup from './BookingConfirmationPopup';

// Helper to calculate distance
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 0.5 - Math.cos(dLat)/2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos(dLon))/2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

const calculateAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0;
    return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
};

interface HotelWithDistance extends Hotel {
    distance: number | null;
}

const HotelCard: React.FC<{ hotel: HotelWithDistance; onSelect: () => void }> = ({ hotel, onSelect }) => {
    const avgRating = calculateAverageRating(hotel.reviews);
    return (
        <div onClick={onSelect} className="bg-slate-800 rounded-xl shadow-lg hover:shadow-fuchsia-500/20 transform hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row overflow-hidden cursor-pointer">
            <img src={hotel.images[0]} alt={hotel.name} className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
            <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-white mb-1">{hotel.name}</h3>
                        <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <StarIcon key={index} className={`w-5 h-5 ${index < Math.round(avgRating) ? 'text-amber-400' : 'text-slate-600'}`} />
                            ))}
                        </div>
                    </div>
                    <p className="font-bold text-lg text-fuchsia-400 mb-2">{`$${hotel.pricePerNight}/night`}</p>
                    {hotel.distance !== null && (
                        <p className="text-slate-400 text-sm mb-4">{`${hotel.distance.toFixed(1)} km away`}</p>
                    )}
                </div>
                <button className="w-full md:w-auto self-end mt-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
}

const Hotels: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState('All');
    const [ratingFilter, setRatingFilter] = useState(0);
    const [distanceFilter, setDistanceFilter] = useState(20);
    const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
    const [locationStatus, setLocationStatus] = useState('Fetching location...');
    
    const [hotels, setHotels] = useState<Hotel[]>(MOCK_HOTELS);
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const [bookingStatus, setBookingStatus] = useState<'success' | 'failure' | null>(null);


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => { setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocationStatus(''); },
            () => { setLocationStatus("Could not determine location."); setUserLocation(null); }
        );
    }, []);
    
    const filteredAndSortedHotels = useMemo((): HotelWithDistance[] => {
        const filtered = hotels.filter(hotel => {
            const avgRating = calculateAverageRating(hotel.reviews);
            const searchMatch = !searchTerm || hotel.name.toLowerCase().includes(searchTerm.toLowerCase());
            const priceMatch = priceFilter === 'All' || (priceFilter === '$' && hotel.pricePerNight < 150) || (priceFilter === '$$' && hotel.pricePerNight >= 150 && hotel.pricePerNight < 300) || (priceFilter === '$$$' && hotel.pricePerNight >= 300);
            const ratingMatch = ratingFilter === 0 || avgRating >= ratingFilter;
            return searchMatch && priceMatch && ratingMatch;
        });

        if (userLocation) {
            const withDistance = filtered.map(hotel => ({
                ...hotel,
                distance: getDistance(userLocation.lat, userLocation.lng, hotel.coordinates.lat, hotel.coordinates.lng)
            })).filter(hotel => hotel.distance <= distanceFilter);

            return withDistance.sort((a, b) => a.distance - b.distance);
        }
        
        return filtered.map(hotel => ({...hotel, distance: null}));
    }, [searchTerm, priceFilter, ratingFilter, distanceFilter, userLocation, hotels]);

    const handleBooking = (hotelId: number, roomType: Room['type'], bookingInfo: any) => {
        // Simulate a 20% chance of booking failure (e.g., room just became unavailable)
        if (Math.random() < 0.2) {
            const hotel = hotels.find(h => h.id === hotelId);
            setBookingDetails({ ...bookingInfo, hotelName: hotel?.name });
            setBookingStatus('failure');
        } else {
            // Booking Succeeded
            setHotels(prevHotels => 
                prevHotels.map(h => {
                    if (h.id === hotelId) {
                        return {
                            ...h,
                            rooms: h.rooms.map(r => 
                                r.type === roomType && r.availability > 0
                                    ? { ...r, availability: r.availability - 1 }
                                    : r
                            )
                        };
                    }
                    return h;
                })
            );
            const hotel = hotels.find(h => h.id === hotelId);
            const room = hotel?.rooms.find(r => r.type === roomType);
            setBookingDetails({ ...bookingInfo, hotelName: hotel?.name, roomPrice: room?.price });
            setBookingStatus('success');
        }
    };
    
    if (selectedHotel) {
        // Find the most up-to-date hotel data from state
        const currentHotelData = hotels.find(h => h.id === selectedHotel.id)!;
        return <HotelDetailView 
                    hotel={currentHotelData} 
                    onBack={() => setSelectedHotel(null)}
                    onBookNow={handleBooking}
               />
    }

    if (bookingDetails && bookingStatus) {
        return <BookingConfirmationPopup 
                    bookingDetails={bookingDetails}
                    status={bookingStatus}
                    onClose={() => {
                        setBookingDetails(null);
                        setBookingStatus(null);
                    }}
               />
    }

    return (
        <div className="h-full p-4 sm:p-8 flex flex-col">
            <div className="bg-slate-800/50 rounded-xl p-6 mb-8 text-center shadow-md">
                <h2 className="text-3xl font-bold text-white mb-2">Find Your Perfect Stay</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Search and filter nearby hotels to find the best place for your adventure.</p>
            </div>
            
             <div className="flex flex-col gap-4">
                <div className="bg-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
                    <input type="text" placeholder="Search by hotel name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full md:flex-1 bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-fuchsia-500 focus:border-fuchsia-500"/>
                    <select value={priceFilter} onChange={e => setPriceFilter(e.target.value)} className="w-full md:w-auto bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-fuchsia-500">
                        <option value="All">All Prices</option>
                        <option value="$">$ (&lt;150)</option>
                        <option value="$$">$$ (150-300)</option>
                        <option value="$$$">$$$ (&gt;300)</option>
                    </select>
                     <select value={ratingFilter} onChange={e => setRatingFilter(Number(e.target.value))} className="w-full md:w-auto bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-fuchsia-500">
                        <option value={0}>All Ratings</option>
                        <option value={5}>5 Stars</option>
                        <option value={4}>4+ Stars</option>
                        <option value={3}>3+ Stars</option>
                    </select>
                    <div className="w-full md:w-48 text-sm">
                        <label htmlFor="distance-filter" className="text-slate-300">{`Distance: ${distanceFilter} km`}</label>
                        <input id="distance-filter" type="range" min="1" max="20" value={distanceFilter} onChange={e => setDistanceFilter(Number(e.target.value))} className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer" disabled={!userLocation}/>
                    </div>
                </div>

                <div className="flex-grow space-y-6">
                    {locationStatus && <p className="text-center text-slate-400">{locationStatus}</p>}
                    {filteredAndSortedHotels.length > 0 ? (
                        filteredAndSortedHotels.map(hotel => <HotelCard key={hotel.id} hotel={hotel} onSelect={() => setSelectedHotel(hotel)} />)
                    ) : (
                        <p className="text-center text-slate-400 py-10">No hotels match your criteria.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Hotels;