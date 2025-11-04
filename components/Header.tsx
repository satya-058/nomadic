import React from 'react';
import { View } from '../types';
import { CompassIcon, UsersIcon, SparklesIcon, ShieldExclamationIcon, MapIcon, BuildingOfficeIcon } from './icons';
import type { UserProfile } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  userProfile: UserProfile;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  isEmergency?: boolean;
}> = ({ icon, label, isActive, onClick, isEmergency = false }) => {
  const baseClasses = "flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 cursor-pointer";
  const activeClasses = isEmergency ? "bg-red-600 hover:bg-red-700 text-white" : "bg-sky-500 text-white";
  const inactiveClasses = isEmergency ? "bg-red-800/50 hover:bg-red-600/80 text-red-300" : "bg-slate-700/50 hover:bg-slate-600/80 text-slate-300";

  return (
    <button 
      onClick={onClick} 
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      aria-label={label}
      title={label} // Tooltip for UX
    >
      {icon}
    </button>
  );
};


const ProfileNavItem: React.FC<{
    profilePicUrl: string;
    isActive: boolean;
    onClick: () => void;
    label: string;
}> = ({ profilePicUrl, isActive, onClick, label }) => {
    return (
        <button 
            onClick={onClick} 
            className={`w-14 h-14 rounded-full transition-all duration-200 cursor-pointer focus:outline-none ring-offset-4 ring-offset-slate-900 ${isActive ? 'ring-2 ring-sky-500' : 'hover:ring-2 hover:ring-slate-500'}`}
            aria-label={label}
            title={label}
        >
            <img src={profilePicUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ currentView, setView, userProfile }) => {
  return (
    <aside className="w-24 bg-slate-900 flex flex-col items-center py-6 shadow-2xl z-50">
      {/* Logo */}
      <div className="mb-10">
        <CompassIcon className="w-10 h-10 text-sky-400" />
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col items-center gap-6">
        <NavItem
          icon={<CompassIcon className="w-7 h-7" />}
          label="Dashboard"
          isActive={currentView === View.DASHBOARD}
          onClick={() => setView(View.DASHBOARD)}
        />
        <NavItem
          icon={<UsersIcon className="w-7 h-7" />}
          label="Buddies"
          isActive={currentView === View.BUDDIES}
          onClick={() => setView(View.BUDDIES)}
        />
        <NavItem
          icon={<SparklesIcon className="w-7 h-7" />}
          label="Discover"
          isActive={currentView === View.DISCOVER}
          onClick={() => setView(View.DISCOVER)}
        />
        <NavItem
          icon={<MapIcon className="w-7 h-7" />}
          label="Maps"
          isActive={currentView === View.MAPS}
          onClick={() => setView(View.MAPS)}
        />
        <NavItem
          icon={<BuildingOfficeIcon className="w-7 h-7" />}
          label="Hotels"
          isActive={currentView === View.HOTELS}
          onClick={() => setView(View.HOTELS)}
        />
        <ProfileNavItem
            profilePicUrl={userProfile.profilePicUrl}
            isActive={currentView === View.PROFILE}
            onClick={() => setView(View.PROFILE)}
            label="Profile"
        />
      </nav>

      {/* Emergency Button at the bottom */}
      <div className="mt-auto">
        <NavItem
          icon={<ShieldExclamationIcon className="w-7 h-7" />}
          label="Emergency"
          isActive={currentView === View.EMERGENCY}
          onClick={() => setView(View.EMERGENCY)}
          isEmergency
        />
      </div>
    </aside>
  );
};

export default Header;