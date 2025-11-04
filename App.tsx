import React, { useState, useEffect } from 'react';
import { View, UserAccount, UserProfile } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FindBuddies from './components/FindBuddies';
import Discover from './components/Discover';
import Emergency from './components/Emergency';
import Profile from './components/Profile';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import SecurityCheckScreen from './components/SecurityCheckScreen';
import RecoverAccountScreen from './components/RecoverAccountScreen';
import Maps from './components/Maps';
import Hotels from './components/Hotels';

type AppState = 'SPLASH' | 'AUTH' | 'SECURITY_CHECK' | 'RECOVERY' | 'LOGGED_IN';
type AuthView = 'LOGIN' | 'SIGNUP';

const USER_ACCOUNT_STORAGE_KEY = 'soloSafeUserAccount';
const USER_PROFILE_STORAGE_KEY = 'soloSafeUserProfile';


const defaultProfile: UserProfile = {
    name: '',
    age: '',
    home: '',
    interests: '',
    profilePicUrl: 'https://picsum.photos/seed/defaultuser/200/200',
};


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('SPLASH');
  const [authView, setAuthView] = useState<AuthView>('LOGIN');
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This effect runs only once to initialize the app state
    try {
      const storedAccount = localStorage.getItem(USER_ACCOUNT_STORAGE_KEY);
      if (storedAccount) {
        const parsedAccount = JSON.parse(storedAccount);
        setUserAccount(parsedAccount);
        defaultProfile.name = parsedAccount.fullName;
      }
       const storedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      } else if (storedAccount) {
        setUserProfile(prev => ({...prev, name: JSON.parse(storedAccount).fullName}))
      }

      setAppState('SPLASH');

    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      setAppState('AUTH'); // Fallback to auth if something goes wrong
    } finally {
        setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (appState !== 'SPLASH') return; // Only run the timer if we are in splash state

    const splashTimer = setTimeout(() => {
        const storedAccount = localStorage.getItem(USER_ACCOUNT_STORAGE_KEY);
        if (storedAccount) {
            setAppState('SECURITY_CHECK');
        } else {
            setAppState('AUTH');
        }
    }, 3000);

    return () => clearTimeout(splashTimer);
  }, [appState]);

  const handleSignUpSuccess = (account: UserAccount) => {
    try {
      localStorage.setItem(USER_ACCOUNT_STORAGE_KEY, JSON.stringify(account));
      setUserAccount(account);
      const newProfile = { ...defaultProfile, name: account.fullName };
      localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      setUserProfile(newProfile);
      setAppState('LOGGED_IN');
    } catch (error) {
      console.error("Failed to save user account to localStorage", error);
    }
  };

  const handleProfileSave = (newProfile: UserProfile) => {
    try {
        localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
        setUserProfile(newProfile);
    } catch (error) {
        console.error("Failed to save profile to localStorage", error);
    }
  };


  const handleLoginSuccess = () => {
    setAppState('LOGGED_IN');
  };

  const handleNavigateToRecovery = () => {
    setAppState('RECOVERY');
  };

  const handleRecoverySuccess = () => {
    setAppState('LOGGED_IN');
  };
  
  const handleBackToAuth = () => {
      setAuthView('LOGIN'); 
      setAppState('AUTH');
  }

  const renderContent = () => {
    if (!isInitialized) {
        return <SplashScreen />; // Show splash while initializing
    }

    switch (appState) {
      case 'SPLASH':
        return <SplashScreen />;
      
      case 'AUTH':
        return authView === 'LOGIN' ? (
          <LoginScreen 
            userAccount={userAccount}
            onLoginSuccess={handleLoginSuccess} 
            onNavigateToSignUp={() => setAuthView('SIGNUP')} 
            onNavigateToRecovery={handleNavigateToRecovery}
          />
        ) : (
          <SignUpScreen 
            onSignUpSuccess={handleSignUpSuccess} 
            onNavigateToLogin={() => setAuthView('LOGIN')} 
          />
        );

      case 'SECURITY_CHECK':
        return <SecurityCheckScreen 
            userAccount={userAccount!} 
            onSuccess={handleLoginSuccess}
            onNavigateToRecovery={handleNavigateToRecovery}
        />;

      case 'RECOVERY':
        return <RecoverAccountScreen 
            userAccount={userAccount!}
            onSuccess={handleRecoverySuccess}
            onBack={handleBackToAuth}
        />

      case 'LOGGED_IN':
        return (
          <div className="flex h-screen bg-slate-950 text-white animate-fadeIn">
             <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-fadeIn {
                animation: fadeIn 0.5s ease-in-out;
              }
            `}</style>
            <Header currentView={currentView} setView={setCurrentView} userProfile={userProfile} />
            <main className="flex-1 overflow-y-auto">
              {
                {
                  [View.DASHBOARD]: <Dashboard />,
                  [View.BUDDIES]: <FindBuddies />,
                  [View.DISCOVER]: <Discover />,
                  [View.MAPS]: <Maps />,
                  [View.HOTELS]: <Hotels />,
                  [View.PROFILE]: <Profile userProfile={userProfile} onProfileSave={handleProfileSave} />,
                  [View.EMERGENCY]: <Emergency />,
                }[currentView]
              }
            </main>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="h-full w-full">{renderContent()}</div>;
};

export default App;