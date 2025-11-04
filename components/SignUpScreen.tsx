import React, { useState } from 'react';
import { CompassIcon, UserIcon, MailIcon, PhoneIcon, LockClosedIcon, IdentificationIcon, QuestionMarkCircleIcon } from './icons';
import { UserAccount } from '../types';

const SignUpScreen: React.FC<{
  onSignUpSuccess: (account: UserAccount) => void;
  onNavigateToLogin: () => void;
}> = ({ onSignUpSuccess, onNavigateToLogin }) => {
  const [error, setError] = useState('');

  const securityQuestions = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What was the name of your elementary school?",
    "In what city were you born?",
    "What is your favorite book?",
  ];

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const aadhaar = formData.get('aadhaar') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const securityQuestion = formData.get('securityQuestion') as string;
    const securityAnswer = formData.get('securityAnswer') as string;

    const aadhaarDigits = aadhaar.replace(/\s/g, '');

    if (password !== confirmPassword) {
        setError("Passwords do not match. Please try again.");
        return;
    }

    if (aadhaarDigits.length !== 12) {
        setError("Please enter a valid 12-digit Aadhaar number.");
        return;
    }

    const newAccount: UserAccount = {
        fullName,
        email,
        phone,
        password,
        aadhaarLast4: aadhaarDigits.slice(-4),
        securityQuestion,
        securityAnswer,
    };

    onSignUpSuccess(newAccount);
  };

  return (
    <div className="min-h-full bg-slate-900 flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
       <style>{`
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
            .animate-fadeIn {
                animation: fadeIn 0.5s ease-in-out;
            }
        `}</style>
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <CompassIcon className="w-12 h-12 text-sky-400 mx-auto" />
          <h1 className="text-3xl font-bold text-white mt-4">Create Your Account</h1>
          <p className="text-slate-400 mt-2">Join the SoloSafe community.</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                        <UserIcon className="h-5 w-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input name="fullName" type="text" placeholder="Alex Doe" required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-sky-500" />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <div className="relative">
                        <MailIcon className="h-5 w-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input name="email" type="email" placeholder="you@example.com" required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-sky-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                    <div className="relative">
                        <PhoneIcon className="h-5 w-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input name="phone" type="tel" placeholder="+91 12345 67890" required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-sky-500" />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Aadhaar (Last 4 digits stored)</label>
                    <div className="relative">
                        <IdentificationIcon className="h-5 w-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            name="aadhaar"
                            type="tel" 
                            placeholder="1234 5678 9012" 
                            maxLength={14} 
                            required 
                            className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-sky-500 font-mono" 
                            onChange={(e) => {
                                const digitsOnly = e.target.value.replace(/\D/g, '');
                                e.target.value = digitsOnly.slice(0, 12).match(/.{1,4}/g)?.join(' ') || '';
                            }}
                        />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                    <div className="relative">
                        <LockClosedIcon className="h-5 w-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input name="password" type="password" placeholder="••••••••" required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-sky-500" />
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
                    <div className="relative">
                        <LockClosedIcon className="h-5 w-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input name="confirmPassword" type="password" placeholder="••••••••" required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-sky-500" />
                    </div>
                </div>
            </div>

            <div className="pt-2 border-t border-slate-700/50">
                <label className="block text-sm font-medium text-slate-300 mb-1">Security Question</label>
                <div className="relative">
                    <QuestionMarkCircleIcon className="h-5 w-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                     <select name="securityQuestion" required className="w-full appearance-none bg-slate-700 text-white border-slate-600 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-sky-500">
                        {securityQuestions.map(q => <option key={q} value={q}>{q}</option>)}
                     </select>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Your Answer</label>
                <div className="relative">
                    <LockClosedIcon className="h-5 w-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input name="securityAnswer" type="text" placeholder="Your secret answer" required className="w-full bg-slate-700 text-white border-slate-600 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-sky-500" />
                </div>
            </div>

            {error && (
                <p className="text-red-500 text-sm text-center pt-2">{error}</p>
            )}
            
            <div className="pt-4">
              <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition-colors transform hover:scale-105">
                Create Account
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <button onClick={onNavigateToLogin} className="font-medium text-sky-500 hover:text-sky-400 bg-transparent border-none p-0">
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;