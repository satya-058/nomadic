import React, { useState } from 'react';
import { CompassIcon, LockClosedIcon } from './icons';
import type { UserAccount } from '../types';

interface SecurityCheckScreenProps {
  userAccount: UserAccount;
  onSuccess: () => void;
  onNavigateToRecovery: () => void;
}

const SecurityCheckScreen: React.FC<SecurityCheckScreenProps> = ({ userAccount, onSuccess, onNavigateToRecovery }) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (answer.trim().toLowerCase() === userAccount.securityAnswer.toLowerCase()) {
      onSuccess();
    } else {
      setError('Incorrect answer. Please try again.');
      setIsShaking(true);
      setAnswer('');
      setTimeout(() => setIsShaking(false), 500); // Duration of the shake animation
    }
  };

  return (
    <div className="min-h-full bg-slate-900 flex items-center justify-center p-4">
        <style>{`
            @keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }
            .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        `}</style>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <CompassIcon className="w-12 h-12 text-sky-400 mx-auto" />
            <h1 className="text-3xl font-bold text-white mt-4">Security Check</h1>
            <p className="text-slate-400 mt-2">{`Welcome back, ${userAccount.fullName.split(' ')[0]}!`}</p>
        </div>

        <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl ${isShaking ? 'animate-shake' : ''}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="security-question" className="block text-sm font-medium text-slate-300 mb-2">Security Question</label>
              <p id="security-question" className="w-full bg-slate-900 text-slate-300 border border-slate-700 rounded-lg p-3 min-h-[48px] flex items-center">{userAccount.securityQuestion}</p>
            </div>
            
            <div>
              <label htmlFor="security-answer" className="block text-sm font-medium text-slate-300 mb-2">Your Answer</label>
               <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-slate-500" />
                </span>
                <input 
                  id="security-answer" 
                  name="security-answer"
                  type="password" 
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  required 
                  placeholder="Your secret answer"
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <div className="pt-2">
                <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300">
                    Submit
                </button>
            </div>
          </form>
          
           <div className="text-center mt-4">
              <button onClick={onNavigateToRecovery} className="text-sm text-slate-500 hover:text-slate-300 transition-colors bg-transparent border-none p-0 cursor-pointer">
                Forgot Answer?
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityCheckScreen;