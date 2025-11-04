import React from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon } from './icons';

interface BookingConfirmationPopupProps {
    bookingDetails: {
        hotelName: string;
        roomType?: string;
        checkIn?: string;
        checkOut?: string;
        guests?: number;
        roomPrice?: number;
    };
    status: 'success' | 'failure';
    onClose: () => void;
}

const BookingConfirmationPopup: React.FC<BookingConfirmationPopupProps> = ({ bookingDetails, status, onClose }) => {
    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (status === 'failure') {
        return (
            <div className="fixed inset-0 bg-black/60 z-[1002] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; } } .animate-fadeIn { animation: fadeIn 0.3s ease-out; }`}</style>
                <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md text-center shadow-2xl border border-slate-700">
                    <ExclamationTriangleIcon className="w-20 h-20 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Booking Failed!</h2>
                    <p className="text-slate-400 mb-6">Your booking could not be confirmed and has not been booked. The room may have become unavailable.</p>
                    <button 
                        onClick={onClose} 
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-[1002] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
             <style>{`@keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; } } .animate-fadeIn { animation: fadeIn 0.3s ease-out; }`}</style>
            <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-md text-center shadow-2xl border border-slate-700">
                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                
                <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                <p className="text-slate-400 mb-6">Your request has been sent successfully.</p>
                
                <div className="text-left bg-slate-900/50 p-4 rounded-lg space-y-2 text-sm mb-6">
                    <div className="flex justify-between"><span className="text-slate-400">Hotel:</span> <span className="font-semibold">{bookingDetails.hotelName}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Room:</span> <span className="font-semibold">{bookingDetails.roomType} (${bookingDetails.roomPrice})</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Check-in:</span> <span className="font-semibold">{formatDate(bookingDetails.checkIn!)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Check-out:</span> <span className="font-semibold">{formatDate(bookingDetails.checkOut!)}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Guests:</span> <span className="font-semibold">{bookingDetails.guests}</span></div>
                </div>

                <button 
                    onClick={onClose} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                    Done
                </button>
            </div>
        </div>
    );
};

export default BookingConfirmationPopup;