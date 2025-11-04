import React, { useState } from 'react';
import { DangerZone } from '../types';

interface ReportDangerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (report: Omit<DangerZone, 'id' | 'coordinates' | 'radius'>) => void;
}

const ReportDangerModal: React.FC<ReportDangerModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [level, setLevel] = useState<DangerZone['level']>('Low');
    const [description, setDescription] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            level,
            description,
            type: 'User Report' // All user-submitted reports are of this type
        });
        // Reset form
        setLevel('Low');
        setDescription('');
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[1001] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-700 animate-fadeIn">
                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                `}</style>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Report an Unsafe Spot</h2>
                    <p className="text-slate-400 mt-2 text-sm">Your report helps keep other travelers safe. Location is based on your current position.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Danger Level</label>
                        <div className="flex justify-between gap-2">
                            {(['Low', 'Medium', 'High'] as const).map((l) => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => setLevel(l)}
                                    className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
                                        level === l
                                        ? l === 'Low' ? 'bg-yellow-500 text-black'
                                        : l === 'Medium' ? 'bg-orange-500 text-white'
                                        : 'bg-red-600 text-white'
                                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                    }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={3}
                            placeholder="e.g., Poor lighting, feels unsafe, etc."
                            className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg transition-colors">
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportDangerModal;