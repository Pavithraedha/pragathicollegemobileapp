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
  isMobileDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAudit,
  onOpenNotifications,
  onNavigateTab,
  isMobileDeviceFrame,
  onToggleDeviceFrame,
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Brand Zone: Pragathi Junior College and Logo */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white p-0.5 shadow-sm border border-white/50 flex items-center justify-center shrink-0">
            <PragathiLogo size={36} className="w-full h-full" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black tracking-tight text-white leading-tight">
              PRAGATHI JUNIOR COLLEGE
            </h1>
            <span className="text-[10px] text-blue-200 font-medium tracking-wide block leading-none">
              PRAGATHI Jr. DEGREE &amp; PG COLLEGE
            </span>
          </div>
        </div>

        {/* Role Portal Indicator Badge (Shows ONLY the logged-in role - no switcher buttons) */}
        <div className="flex items-center">
          {currentRole === 'parent' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/90 dark:bg-blue-600 border border-blue-400/50 text-white shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">Parent</span>
            </div>
          )}

          {currentRole === 'student' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/90 dark:bg-emerald-600 border border-emerald-400/50 text-white shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">Student</span>
            </div>
          )}

          {currentRole === 'teacher' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/90 dark:bg-purple-600 border border-purple-400/50 text-white shadow-xs">
              <span className="w-2 h-2 rounded-full bg-purple-300 animate-pulse shrink-0" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">Teacher</span>
            </div>
          )}
        </div>

        {/* Right utility actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            type="button"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-blue-400/30 cursor-pointer"
          >
            {darkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] font-medium hidden xs:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-200" />
                <span className="text-[11px] font-medium hidden xs:inline">Dark</span>
              </>
            )}
          </button>

          {/* Frame View Toggle (Mobile Smartphone Frame vs Wide Responsive Canvas) */}
          <button
            onClick={onToggleDeviceFrame}
            title={isMobileDeviceFrame ? "Switch to Wide Responsive Canvas" : "Switch to Mobile Phone Frame"}
            className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-blue-400/20 cursor-pointer"
          >
            {isMobileDeviceFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="text-[11px]">Wide</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="text-[11px]">Frame</span>
              </>
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            title="Announcements & Alerts"
            className="relative p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* System Audit Log */}
          <button
            onClick={onOpenAudit}
            title="System Audit Log"
            className="hidden sm:flex p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (confirm('Reset demo attendance, syllabus, grades, and payments to default?')) {
                resetToDemoDefaults();
              }
            }}
            title="Reset Demo Data"
            className="hidden sm:flex p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Sign Out / Switch Account"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 text-xs text-red-200 hover:text-white bg-red-600/30 hover:bg-red-600/50 rounded-lg transition-colors border border-red-400/40 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium hidden sm:inline">Logout</span>
          </button>

          {/* Active User Avatar */}
          <div className="flex items-center pl-1 border-l border-blue-400/30">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white/60 shadow-xs"
              title={`${currentUser.name} (${currentRole})`}
            />
          </div>
        </div>
      </div>

      {/* Sub-bar for Parents: Child Switcher Banner */}
      {currentRole === 'parent' && (
        <div className="bg-[#1b437e] dark:bg-[#11294d] px-3 sm:px-6 py-2 border-t border-blue-500/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
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
          <div className="max-w-7xl mx-auto flex items-center justify-between">
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
