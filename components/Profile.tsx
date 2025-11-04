import React, { useState, useEffect } from 'react';
import type { UserProfile } from '../types';

interface ProfileProps {
    userProfile: UserProfile;
    onProfileSave: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ userProfile, onProfileSave }) => {
    const [profile, setProfile] = useState<UserProfile>(userProfile);
    const [saved, setSaved] = useState(false);

    // Sync state if the prop changes
    useEffect(() => {
        setProfile(userProfile);
    }, [userProfile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: name === 'age' ? (value === '' ? '' : parseInt(value, 10)) : value,
        }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prevProfile => ({
                    ...prevProfile,
                    profilePicUrl: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onProfileSave(profile);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="container mx-auto p-4 sm:p-8">
            <div className="bg-slate-800/50 rounded-xl p-6 mb-8 text-center shadow-md">
                <h2 className="text-3xl font-bold text-white mb-2">Your Traveler Profile</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Keep your information up to date to get the best matches and recommendations.</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 md:p-8 max-w-4xl mx-auto shadow-lg">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 flex flex-col items-center text-center">
                        <img 
                            src={profile.profilePicUrl} 
                            alt="Profile Picture" 
                            className="w-40 h-40 rounded-full mb-4 border-4 border-slate-600 object-cover"
                        />
                         <label htmlFor="profilePicInput" className="cursor-pointer text-sm bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 px-4 rounded-lg transition-colors">
                            Change Picture
                        </label>
                        <input
                            id="profilePicInput"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                    
                    <div className="md:col-span-2 space-y-6">
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                            <input 
                                id="name"
                                name="name" 
                                type="text" 
                                placeholder="e.g., Alex Doe"
                                value={profile.name}
                                onChange={handleInputChange}
                                required 
                                className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-sky-500 focus:border-sky-500 transition" 
                            />
                        </div>
                         <div>
                            <label htmlFor="age" className="block text-sm font-medium text-slate-300 mb-2">Age</label>
                            <input 
                                id="age"
                                name="age" 
                                type="number" 
                                min="18"
                                placeholder="e.g., 28" 
                                value={profile.age}
                                onChange={handleInputChange}
                                required 
                                className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-sky-500 focus:border-sky-500 transition" 
                            />
                        </div>
                        <div>
                            <label htmlFor="home" className="block text-sm font-medium text-slate-300 mb-2">Home City</label>
                            <input 
                                id="home"
                                name="home" 
                                type="text" 
                                placeholder="e.g., Vancouver, CA" 
                                value={profile.home}
                                onChange={handleInputChange}
                                required 
                                className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-sky-500 focus:border-sky-500 transition" 
                            />
                        </div>
                        <div>
                            <label htmlFor="interests" className="block text-sm font-medium text-slate-300 mb-2">Interests</label>
                            <input 
                                id="interests"
                                name="interests" 
                                type="text" 
                                placeholder="e.g., Hiking, Photography, History"
                                value={profile.interests}
                                onChange={handleInputChange}
                                required 
                                className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-sky-500 focus:border-sky-500 transition" 
                            />
                            <p className="text-xs text-slate-500 mt-1">Separate interests with a comma.</p>
                        </div>

                        <div className="flex items-center gap-4 pt-2">
                            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors duration-300">
                                Save Profile
                            </button>
                            {saved && <span className="text-green-400 text-sm animate-pulse">Saved!</span>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;