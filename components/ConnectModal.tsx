
import React, { useState } from 'react';
import type { TravelerProfile, ConnectionRequest } from '../types';

interface ConnectModalProps {
    buddy: TravelerProfile;
    onClose: () => void;
    onSubmit: (request: Omit<ConnectionRequest, 'buddyId'>) => void;
}

const ConnectModal: React.FC<ConnectModalProps> = ({ buddy, onClose, onSubmit }) => {
    const today = new Date().toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const request: Omit<ConnectionRequest, 'buddyId'> = {
            destination: formData.get('destination') as string,
            startDate: formData.get('startDate') as string,
            endDate: formData.get('endDate') as string,
            travelStyle: formData.get('travelStyle') as string,
            budget: Number(formData.get('budget')),
            message: formData.get('message') as string,
        };
        onSubmit(request);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[1001] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-slate-700 animate-fadeIn">
                 <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                `}</style>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Send a Request to {buddy.name}</h2>
                    <p className="text-slate-400 mt-2 text-sm">Share your trip details to see if you're a good match!</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="destination" className="block text-sm font-medium text-slate-300 mb-1">Destination</label>
                        <input id="destination" name="destination" type="text" defaultValue={buddy.destination} required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-slate-300 mb-1">Start Date</label>
                            <input id="startDate" name="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} min={today} required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-500" />
                        </div>
                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-slate-300 mb-1">End Date</label>
                            <input id="endDate" name="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} min={startDate} required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-500" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="travelStyle" className="block text-sm font-medium text-slate-300 mb-1">Travel Style</label>
                            <select id="travelStyle" name="travelStyle" required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-500">
                                <option>Backpacking</option>
                                <option>Luxury</option>
                                <option>Relaxed</option>
                                <option>Adventurous</option>
                                <option>Cultural</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-slate-300 mb-1">Budget (USD)</label>
                            <input id="budget" name="budget" type="number" placeholder="e.g., 1500" required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                        <textarea id="message" name="message" rows={3} placeholder={`Hi ${buddy.name}, I saw you're planning a trip to ${buddy.destination}...`} required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-500"></textarea>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition-colors">Send Request</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConnectModal;
