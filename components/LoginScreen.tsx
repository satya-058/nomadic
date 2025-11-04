import React, { useState } from 'react';
import { CompassIcon, MailIcon, LockClosedIcon } from './icons';
import { UserAccount } from '../types';

interface LoginScreenProps {
  userAccount: UserAccount | null;
  onLoginSuccess: () => void;
  onNavigateToSignUp: () => void;
  onNavigateToRecovery: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ userAccount, onLoginSuccess, onNavigateToSignUp, onNavigateToRecovery }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<React.ReactNode>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userAccount) {
      setError(
        <>
          No account found on this device. Please{' '}
          <button type="button" onClick={onNavigateToSignUp} className="font-medium text-sky-400 hover:text-sky-300 underline">
            Sign Up
          </button>
          .
        </>
      );
      return;
    }
    
    const emailOrPhoneMatches = email.toLowerCase() === userAccount.email.toLowerCase() || email === userAccount.phone;

    if (!emailOrPhoneMatches) {
        setError(
          <>
            No account found with this email/phone.{' '}
            <button type="button" onClick={onNavigateToSignUp} className="font-medium text-sky-400 hover:text-sky-300 underline">
              Create one?
            </button>
          </>
        );
        return;
    }
    
    if (password !== userAccount.password) {
        setError('Incorrect password. Please try again.');
        return;
    }

    onLoginSuccess();
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
            <h1 className="text-3xl font-bold text-white mt-4">Welcome Back</h1>
            <p className="text-slate-400 mt-2">Log in to continue your journey.</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">Email or Phone</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <MailIcon className="h-5 w-5 text-slate-500" />
                </span>
                <input 
                  id="email" 
                  name="email"
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  placeholder="you@example.com"
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">Password</label>
               <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-slate-500" />
                </span>
                <input 
                  id="password" 
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>
            </div>
            
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div className="pt-2">
                <button 
                    type="submit" 
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 transform hover:scale-105"
                >
                    Log In
                </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <button onClick={onNavigateToSignUp} className="font-medium text-sky-500 hover:text-sky-400 transition-colors bg-transparent border-none p-0">
                Sign Up
              </button>
            </p>
             <p className="text-sm text-slate-500 mt-2">
              <button onClick={onNavigateToRecovery} className="hover:text-slate-300 transition-colors bg-transparent border-none p-0 cursor-pointer">
                Forgot Password?
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;