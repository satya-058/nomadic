import React, { useState } from 'react';
import type { Hotel, Room } from '../types';

interface BookingModalProps {
    hotel: Hotel;
    onClose: () => void;
    onSubmit: (bookingDetails: {
        roomType: Room['type'];
        guests: number;
        checkIn: string;
        checkOut: string;
    }) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ hotel, onClose, onSubmit }) => {
    const today = new Date().toISOString().split('T')[0];
    const [roomType, setRoomType] = useState<Room['type']>(hotel.rooms.find(r => r.availability > 0)?.type || 'Single');
    const [guests, setGuests] = useState(1);
    const [checkIn, setCheckIn] = useState(today);
    const [checkOut, setCheckOut] = useState(today);

    const availableRooms = hotel.rooms.filter(r => r.availability > 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ roomType, guests, checkIn, checkOut });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[1001] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-slate-700 animate-fadeIn">
                 <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; } } .animate-fadeIn { animation: fadeIn 0.3s ease-out; }`}</style>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Book Your Stay at {hotel.name}</h2>
                    <p className="text-slate-400 mt-2 text-sm">Confirm your details to complete the reservation.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="roomType" className="block text-sm font-medium text-slate-300 mb-1">Room Type</label>
                        <select 
                            id="roomType" 
                            value={roomType} 
                            onChange={(e) => setRoomType(e.target.value as Room['type'])} 
                            required 
                            className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-fuchsia-500"
                        >
                            {availableRooms.map(room => (
                                <option key={room.type} value={room.type}>{`${room.type} - $${room.price}/night`}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="guests" className="block text-sm font-medium text-slate-300 mb-1">Guests</label>
                        <input id="guests" type="number" value={guests} onChange={e => setGuests(Number(e.target.value))} min="1" max="4" required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-fuchsia-500" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="checkIn" className="block text-sm font-medium text-slate-300 mb-1">Check-in</label>
                            <input id="checkIn" type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} min={today} required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-fuchsia-500" />
                        </div>
                        <div>
                            <label htmlFor="checkOut" className="block text-sm font-medium text-slate-300 mb-1">Check-out</label>
                            <input id="checkOut" type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} min={checkIn} required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-fuchsia-500" />
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 rounded-lg transition-colors">Confirm Booking</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;