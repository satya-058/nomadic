import React, { useState, useMemo } from 'react';
import type { TravelerProfile, ConnectionRequest } from '../types';
import { MOCK_TRAVELER_PROFILES } from '../constants';
import { MapPinIcon, CalendarIcon } from './icons';
import ConnectModal from './ConnectModal';
import SuccessPopup from './SuccessPopup';

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const BuddyCard: React.FC<{ profile: TravelerProfile; onConnect: (profile: TravelerProfile) => void; }> = ({ profile, onConnect }) => {
    return (
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-teal-500/20 transform hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="flex items-center mb-4">
                <img className="w-16 h-16 rounded-full border-4 border-slate-700" src={profile.profilePicUrl} alt={profile.name} />
                <div className="ml-4">
                    <h3 className="text-xl font-bold text-white">{profile.name}, {profile.age}</h3>
                    <p className="text-slate-400 text-sm">{profile.home}</p>
                </div>
            </div>
            
            <div className="space-y-3 text-sm my-4">
                <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 text-teal-400 mr-3" />
                    <span className="text-slate-300">Destination: <span className="font-semibold text-white">{profile.destination}</span></span>
                </div>
                <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 text-teal-400 mr-3" />
                    <span className="text-slate-300">Dates: <span className="font-semibold text-white">{formatDate(profile.travelDates.start)} - {formatDate(profile.travelDates.end)}</span></span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {profile.interests.map(interest => (
                    <span key={interest} className="bg-teal-500/10 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full">{interest}</span>
                ))}
            </div>
            <button 
                onClick={() => onConnect(profile)}
                className="mt-auto w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
                Connect
            </button>
        </div>
    );
}

const FindBuddies: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('All');
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
    const [selectedBuddy, setSelectedBuddy] = useState<TravelerProfile | null>(null);

    const filteredProfiles = useMemo(() => {
        return MOCK_TRAVELER_PROFILES.filter(profile => {
            const genderMatch = genderFilter === 'All' || profile.gender === genderFilter;

            const searchMatch = !searchTerm || (
                profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                profile.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                profile.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            
            return genderMatch && searchMatch;
        });
    }, [searchTerm, genderFilter]);

    const handleConnectClick = (profile: TravelerProfile) => {
        setSelectedBuddy(profile);
        setIsConnectModalOpen(true);
    };

    const handleSendRequest = (request: Omit<ConnectionRequest, 'buddyId'>) => {
        if (!selectedBuddy) return;
        const fullRequest: ConnectionRequest = { ...request, buddyId: selectedBuddy.id };
        console.log("Connection Request Sent:", fullRequest); // Simulate backend save
        setIsConnectModalOpen(false);
        setSelectedBuddy(null);
        setIsSuccessPopupOpen(true);
    };


    return (
        <div className="container mx-auto p-4 sm:p-8">
            <div className="bg-slate-800/50 rounded-xl p-6 mb-8 text-center shadow-md">
                <h2 className="text-3xl font-bold text-white mb-2">Find Your Travel Tribe</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Connect with fellow solo travelers who share your passions and destinations.</p>
            </div>
            
            <div className="mb-8 p-4 bg-slate-800 rounded-xl flex flex-col sm:flex-row gap-4 items-center">
                <input 
                    type="text"
                    placeholder="Search by name, destination, or interest..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:flex-grow bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500 transition placeholder-slate-400"
                />
                 <div className="w-full sm:w-auto">
                    <label htmlFor="gender" className="sr-only">Filter by gender</label>
                    <select 
                        id="gender"
                        value={genderFilter}
                        onChange={(e) => setGenderFilter(e.target.value)}
                        className="w-full sm:w-48 bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500 transition"
                    >
                        <option value="All">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProfiles.map(profile => <BuddyCard key={profile.id} profile={profile} onConnect={handleConnectClick} />)}
            </div>

            {filteredProfiles.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-slate-400 text-lg">No travelers found matching your search.</p>
                </div>
            )}

            {isConnectModalOpen && selectedBuddy && (
                <ConnectModal 
                    buddy={selectedBuddy}
                    onClose={() => setIsConnectModalOpen(false)}
                    onSubmit={handleSendRequest}
                />
            )}

            {isSuccessPopupOpen && (
                <SuccessPopup onClose={() => setIsSuccessPopupOpen(false)} />
            )}
        </div>
    );
};

export default FindBuddies;
