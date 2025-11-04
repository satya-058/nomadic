
import React from 'react';
import { CheckCircleIcon } from './icons';

interface SuccessPopupProps {
    onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 z-[1002] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl border border-slate-700 animate-fadeIn">
                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.9); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                `}</style>
                
                <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
                
                <h2 className="text-2xl font-bold text-white mb-2">Request Sent Successfully!</h2>
                <p className="text-slate-400 mb-6">Your travel request has been sent. You'll be notified when they respond.</p>
                
                <button 
                    onClick={onClose} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SuccessPopup;
