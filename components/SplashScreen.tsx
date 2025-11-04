import React from 'react';

const SplashScreen: React.FC = () => {
    // Using a high-quality image that closely matches the user's request.
    const imageUrl = 'https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg'; 

    return (
        // Reverted to `fixed` to cover the full viewport for a desktop/laptop view.
        <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-[999] animate-fadeOut">
            <style>
                {`
                    @keyframes fadeOut {
                        0% { opacity: 1; }
                        80% { opacity: 1; } /* Hold the splash screen for 2.4s */
                        100% { opacity: 0; } /* Fade out over 0.6s */
                    }
                    .animate-fadeOut {
                        animation: fadeOut 3s forwards;
                    }
                `}
            </style>
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                {/* Dark overlay for better text contrast */}
                <div className="absolute inset-0 bg-black/50"></div>
            </div>
            
            <div className="relative z-10 text-center text-white p-8">
                <div className="font-extrabold uppercase tracking-tight text-white" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
                    <h1 className="text-5xl sm:text-7xl">
                        Travel Alone?
                    </h1>
                    <h2 className="text-5xl sm:text-7xl mt-2">
                        Not Anymore!
                    </h2>
                </div>
                <p className="mt-6 text-xl sm:text-2xl font-light tracking-wider" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}>
                    Connect. Explore. Experience.
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;