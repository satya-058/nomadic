import React, { useState, useCallback } from 'react';
import type { Destination } from '../types';
import { getTravelRecommendations } from '../services/geminiService';

const TravelCard: React.FC<{ destination: Destination }> = ({ destination }) => {
    return (
        <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-sky-500/20 transform hover:-translate-y-1 transition-all duration-300">
            <img className="w-full h-48 object-cover" src={destination.image} alt={destination.name} />
            <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{destination.name}</h3>
                <p className="text-slate-400 mb-4">{destination.description}</p>
                <div className="mb-4">
                    <h4 className="font-semibold text-sky-400 mb-2">Key Attractions:</h4>
                    <ul className="list-disc list-inside text-slate-300 space-y-1">
                        {destination.attractions.map((attr, index) => <li key={index}>{attr}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-amber-400 mb-2">Safety Tip:</h4>
                    <p className="text-slate-300 bg-amber-500/10 p-3 rounded-lg">{destination.safetyTips}</p>
                </div>
            </div>
        </div>
    );
};

const LoadingSkeleton: React.FC = () => (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
        <div className="w-full h-48 bg-slate-700"></div>
        <div className="p-6">
            <div className="h-8 bg-slate-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6 mb-6"></div>
            <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const [season, setSeason] = useState('Summer');
    const [interest, setInterest] = useState('Adventure');
    const [recommendations, setRecommendations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);
        setRecommendations([]);
        try {
            const results = await getTravelRecommendations(season, interest);
            if (results.length === 0) {
              setError("Couldn't generate recommendations. Please try a different combination.");
            }
            setRecommendations(results);
        } catch (err) {
            setError("An error occurred. Please try again later.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [season, interest]);

    const seasons = ['Winter', 'Spring', 'Summer', 'Autumn'];
    const interests = ['Adventure', 'Relaxation', 'Culture', 'Food', 'History'];

    return (
        <div className="container mx-auto p-4 sm:p-8">
            <div className="bg-slate-800/50 rounded-xl p-6 mb-8 text-center shadow-md">
                <h2 className="text-3xl font-bold text-white mb-2">Plan Your Next Solo Adventure</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Select a season and your primary interest, and let our AI craft the perfect journey for you.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-6 bg-slate-800 rounded-xl items-center justify-center shadow-lg">
                <div className="w-full sm:w-1/3">
                    <label htmlFor="season" className="block text-sm font-medium text-slate-300 mb-2">Season</label>
                    <select id="season" value={season} onChange={(e) => setSeason(e.target.value)} className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-sky-500 focus:border-sky-500 transition">
                        {seasons.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="w-full sm:w-1/3">
                    <label htmlFor="interest" className="block text-sm font-medium text-slate-300 mb-2">Interest</label>
                    <select id="interest" value={interest} onChange={(e) => setInterest(e.target.value)} className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-sky-500 focus:border-sky-500 transition">
                        {interests.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                </div>
                <div className="w-full sm:w-auto pt-0 sm:pt-7">
                    <button onClick={handleGenerate} disabled={loading} className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 disabled:bg-sky-800 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
                        {loading ? 'Generating...' : 'Generate Ideas'}
                    </button>
                </div>
            </div>

            {error && <div className="text-center text-red-400 bg-red-500/10 p-4 rounded-lg">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {loading && Array.from({ length: 4 }).map((_, i) => <LoadingSkeleton key={i} />)}
                {!loading && recommendations.map(dest => <TravelCard key={dest.name} destination={dest} />)}
            </div>
        </div>
    );
};

export default Dashboard;