import React, { useState, useRef } from 'react';
import { CompassIcon, IdentificationIcon } from './icons';
import { UserAccount } from '../types';

interface RecoverAccountScreenProps {
    userAccount: UserAccount;
    onSuccess: () => void;
    onBack: () => void;
}

const RecoverAccountScreen: React.FC<RecoverAccountScreenProps> = ({ userAccount, onSuccess, onBack }) => {
    const [aadhaar, setAadhaar] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [step, setStep] = useState(1); // 1 for Aadhaar, 2 for OTP
    const [error, setError] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


    const handleAadhaarSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (aadhaar === userAccount.aadhaarLast4) {
            setStep(2); // Move to OTP step
        } else {
            setError("Aadhaar last 4 digits do not match our records.");
        }
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/[^0-9]/.test(value)) return; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if a digit is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const enteredOtp = otp.join('');
        if (enteredOtp.length === 6) {
            // In a real app, you'd verify the OTP with a backend service.
            // For this simulation, we'll assume it's correct and log the user in.
            onSuccess();
        } else {
            setError("Please enter the full 6-digit OTP.");
        }
    };


    return (
        <div className="min-h-full bg-slate-900 flex items-center justify-center p-4 animate-fadeIn">
             <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-in-out;
                }
            `}</style>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <CompassIcon className="w-12 h-12 text-sky-400 mx-auto" />
                    <h1 className="text-3xl font-bold text-white mt-4">Account Recovery</h1>
                    <p className="text-slate-400 mt-2">
                        {step === 1 ? 'Verify your identity to proceed.' : 'Enter the OTP sent to your registered number.'}
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
                    {step === 1 ? (
                        <form onSubmit={handleAadhaarSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="aadhaar" className="block text-sm font-medium text-slate-300 mb-2">Last 4 Digits of Aadhaar</label>
                                <div className="relative">
                                    <IdentificationIcon className="h-5 w-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        id="aadhaar"
                                        type="tel"
                                        value={aadhaar}
                                        onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                                        maxLength={4}
                                        required
                                        className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 pl-10 font-mono tracking-widest focus:ring-2 focus:ring-sky-500"
                                        placeholder="1234"
                                    />
                                </div>
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg">Send OTP</button>
                        </form>
                    ) : (
                        <form onSubmit={handleOtpSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2 text-center">Enter 6-Digit OTP</label>
                                <div className="flex justify-center gap-2">
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            value={data}
                                            onChange={(e) => handleOtpChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            maxLength={1}
                                            ref={el => { inputRefs.current[index] = el; }}
                                            className="w-12 h-14 bg-slate-700 text-white text-2xl text-center border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500"
                                        />
                                    ))}
                                </div>
                            </div>
                             {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg">Verify & Log In</button>
                        </form>
                    )}

                     <div className="text-center mt-6">
                        <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecoverAccountScreen;