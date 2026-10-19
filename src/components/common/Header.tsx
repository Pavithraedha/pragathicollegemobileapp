import React, { useState } from 'react';
import {
  Bell,
  Shield,
  RotateCcw,
  Users,
  ChevronDown,
  Check,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  LogOut,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { PragathiLogo } from './PragathiLogo';

interface HeaderProps {
  onOpenAudit: () => void;
  onOpenNotifications: () => void;
  onNavigateTab: (tab: string) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAudit,
  onOpenNotifications,
  onNavigateTab,
  onLogout,
}) => {
  const {
    currentUser,
    currentRole,
    selectedChildId,
    switchChild,
    students,
    notifications,
    resetToDemoDefaults,
    darkMode,
    toggleDarkMode,
  } = useCampus();

  const [isChildDropdownOpen, setIsChildDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read && (n.role === currentRole || !n.role)).length;

  // Linked children for parent
  const linkedChildren = students.filter((s) => s.parentId === 'user-parent-1');
  const currentChild = students.find((s) => s.id === selectedChildId) || linkedChildren[0];

  return (
    <header className="sticky top-0 z-30 bg-[#163B70] dark:bg-[#0c1e3a] text-white shadow-md border-b border-blue-900/50 dark:border-slate-800 transition-colors">
      {/* Top primary bar */}
      <div className="max-w-md mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-1.5 w-full">
        {/* Brand Zone: Logo Crest + Active Role Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-white p-0.5 shadow-sm border border-white/50 flex items-center justify-center shrink-0">
            <PragathiLogo size={28} className="w-full h-full" />
          </div>

          {/* Role Portal Indicator Badge */}
          {currentRole === 'parent' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/90 dark:bg-blue-600 border border-blue-400/50 text-white shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-xs font-bold tracking-wide">Parent</span>
            </div>
          )}

          {currentRole === 'student' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600/90 dark:bg-emerald-600 border border-emerald-400/50 text-white shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse shrink-0" />
              <span className="text-xs font-bold tracking-wide">Student</span>
            </div>
          )}

          {currentRole === 'teacher' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-600/90 dark:bg-purple-600 border border-purple-400/50 text-white shadow-xs">
              <span className="w-2 h-2 rounded-full bg-purple-300 animate-pulse shrink-0" />
              <span className="text-xs font-bold tracking-wide">Teacher</span>
            </div>
          )}
        </div>

        {/* Right Utility Actions (Light/Dark, Notifications, Logout, Profile) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            type="button"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
            className="p-2 text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-xl transition-all border border-blue-300/30 shadow-2xs cursor-pointer flex items-center justify-center"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-blue-200" />
            )}
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            title="Announcements & Alerts"
            aria-label="Notifications"
            className="relative p-2 text-blue-100 hover:text-white bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-xl transition-all border border-blue-300/30 shadow-2xs cursor-pointer flex items-center justify-center"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#163B70] shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Logout / Switch Account"
            aria-label="Logout"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-100 hover:text-white bg-rose-600/70 hover:bg-rose-600 active:bg-rose-700 rounded-xl transition-all border border-rose-400/40 shadow-2xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden xs:inline">Logout</span>
          </button>

          {/* Active User Avatar */}
          <button
            onClick={() => onNavigateTab('profile')}
            className="p-0.5 rounded-full border-2 border-white/60 hover:border-white transition-all cursor-pointer shrink-0"
            title={`${currentUser.name} (${currentRole}) - View Profile`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Sub-bar for Parents: Child Switcher Banner */}
      {currentRole === 'parent' && (
        <div className="bg-[#1b437e] dark:bg-[#11294d] px-3 sm:px-6 py-2 border-t border-blue-500/20">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-200 font-medium">Ward:</span>
              <div className="relative">
                <button
                  onClick={() => setIsChildDropdownOpen(!isChildDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
                >
                  <img
                    src={currentChild.avatar}
                    alt={currentChild.fullName}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>{currentChild.fullName}</span>
                  <span className="text-blue-200 font-normal text-[11px]">
                    (Grade {currentChild.grade}-{currentChild.section})
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-300" />
                </button>

                {isChildDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-64 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-40">
                    <div className="px-3 py-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Select Linked Ward
                    </div>
                    {linkedChildren.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => {
                          switchChild(child.id);
                          setIsChildDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs cursor-pointer ${
                          child.id === selectedChildId
                            ? 'bg-blue-50/70 dark:bg-blue-950/60 font-semibold text-blue-700 dark:text-blue-300'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={child.avatar}
                            alt={child.fullName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div>{child.fullName}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                              Grade {child.grade}-{child.section} · Roll #{child.rollNo}
                            </div>
                          </div>
                        </div>
                        {child.id === selectedChildId && (
                          <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs text-blue-100">
              <span>Adm No: <strong className="font-mono text-white">{currentChild.admissionNo}</strong></span>
              <span>·</span>
              <span>Academic Year: <strong className="text-white">{currentChild.academicYear}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-bar for Teachers: Assigned Class Info */}
      {currentRole === 'teacher' && (
        <div className="bg-[#1b437e] dark:bg-[#11294d] px-3 sm:px-6 py-1.5 border-t border-blue-500/20 text-xs text-blue-100">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-blue-300" />
              <span>Faculty: <strong className="text-white">Class Teacher (10-A) & HOD Mathematics</strong></span>
            </div>
            <div className="text-[11px] text-blue-200">
              Session 2026-27
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
