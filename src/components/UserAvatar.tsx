import React from 'react';
import { ShieldCheck, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ size = 'md', showName = false }) => {
  const { currentStudent, setAccountSlideOverOpen, setAuthModalOpen, language } = useApp();

  // Compute initials (e.g., "Ramesh Soren" -> "RS", "Sunita" -> "SU")
  const getInitials = (name: string): string => {
    if (!name) return 'ST';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = currentStudent ? getInitials(currentStudent.name) : 'ST';

  const handleClick = () => {
    if (currentStudent) {
      setAccountSlideOverOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-8.5 h-8.5 text-xs',
    lg: 'w-11 h-11 text-sm',
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Open Account Management slide-over menu"
      className="group relative flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-100/90 transition-all duration-200 cursor-pointer active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50"
      title={currentStudent ? `Account Management: ${currentStudent.name}` : 'Login to Account'}
    >
      {/* Avatar Circle with Initials & Amber Glow */}
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 text-white flex items-center justify-center font-extrabold tracking-wider shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200 border-2 border-white ring-1 ring-amber-400/40`}
        >
          {currentStudent ? initials : <User className="w-4 h-4 text-white" />}
        </div>

        {/* Verified Active Session Indicator */}
        {currentStudent && (
          <span
            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white"
            title="Aadhaar & DigiLocker Verified Session"
          >
            <ShieldCheck className="w-2.5 h-2.5 stroke-[3]" />
          </span>
        )}
      </div>

      {/* Optional Name & Category details for wider viewports */}
      {showName && currentStudent && (
        <div className="hidden xl:block text-left pr-1">
          <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-tight truncate max-w-[120px]">
            {language === 'hi' && currentStudent.nameHi ? currentStudent.nameHi : currentStudent.name}
          </div>
          <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
            {currentStudent.subTribe} ST · {currentStudent.district}
          </div>
        </div>
      )}
    </div>
  );
};
