import React, { useState, useEffect, useRef } from 'react';
import { ShieldExclamationIcon } from './icons';

const Emergency: React.FC = () => {
    const [mode, setMode] = useState<'idle' | 'confirm' | 'active'>('idle');
    const [countdown, setCountdown] = useState(5);
    const [location, setLocation] = useState<string | null>(null);
    const countdownInterval = useRef<number | null>(null);

    useEffect(() => {
        if (mode === 'active' && countdown > 0) {
            countdownInterval.current = window.setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            if(countdownInterval.current) clearInterval(countdownInterval.current);
            // In a real app, this is where the alert would be sent.
        }
        
        return () => {
            if(countdownInterval.current) clearInterval(countdownInterval.current);
        };
    }, [mode, countdown]);

    const handleActivate = () => {
        setMode('active');
        setCountdown(5);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation(`Lat: ${position.coords.latitude.toFixed(4)}, Lon: ${position.coords.longitude.toFixed(4)}`);
            },
            () => {
                setLocation('Could not determine location. Alert will be sent without it.');
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };
    
    const handleCancel = () => {
        setMode('idle');
        setCountdown(5);
        setLocation(null);
        if(countdownInterval.current) clearInterval(countdownInterval.current);
    };

    if (mode === 'active') {
        return (
            <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-center p-4">
                <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: "url('https://picsum.photos/seed/map/1200/800')"}}></div>
                <div className="relative z-10">
                    <div className="w-48 h-48 border-4 border-red-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <ShieldExclamationIcon className="w-24 h-24 text-red-500" />
                    </div>
                    {countdown > 0 ? (
                        <>
                            <h2 className="text-4xl font-extrabold text-white mb-2">ALERTING AUTHORITIES IN...</h2>
                            <p className="text-8xl font-mono font-bold text-red-500 mb-4">{countdown}</p>
                            <p className="text-slate-300 mb-8">{location || 'Getting your location...'}</p>
                            <button onClick={handleCancel} className="bg-slate-200 hover:bg-white text-slate-800 font-bold py-4 px-12 rounded-lg transition-colors text-xl">
                                CANCEL
                            </button>
                        </>
                    ) : (
                         <>
                            <h2 className="text-4xl font-extrabold text-white mb-2">ALERT SENT</h2>
                            <p className="text-slate-300 mb-4">Your location has been shared with the nearest emergency services.</p>
                            <p className="text-slate-400">Stay where you are if it is safe. Help is on the way.</p>
                         </>
                    )}
                </div>
            </div>
        );
    }
    
    if (mode === 'confirm') {
        return (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-red-500/50">
                    <ShieldExclamationIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">Confirm Emergency Alert</h2>
                    <p className="text-slate-400 mb-8">This will attempt to contact the nearest emergency services and share your location. Use this feature only if you are in danger.</p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={() => setMode('idle')} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleActivate} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                            Activate
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full container mx-auto p-4 sm:p-8 flex flex-col items-center justify-center text-center">
            <div className="max-w-2xl">
                <ShieldExclamationIcon className="w-24 h-24 text-red-400 mx-auto mb-6" />
                <h2 className="text-4xl font-bold text-white mb-4">Emergency Alert System</h2>
                <p className="text-slate-400 mb-8 text-lg">
                    If you are in danger or need immediate assistance, press the button below. This feature is designed to connect you with local emergency services. Please use it responsibly.
                </p>
                <button onClick={() => setMode('confirm')} className="bg-red-600 hover:bg-red-700 text-white font-extrabold py-6 px-16 rounded-full transition-all duration-300 text-2xl shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/40 transform hover:scale-105">
                    ACTIVATE ALERT
                </button>
                <p className="text-xs text-slate-500 mt-8">
                    Disclaimer: This is a simulated feature. In a real emergency, please contact your local authorities directly.
                </p>
            </div>
        </div>
    );
};

export default Emergency;