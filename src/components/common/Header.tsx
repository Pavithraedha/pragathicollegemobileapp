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
  Moon
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { UserRole } from '../../types';
import { PragathiLogo } from './PragathiLogo';

interface HeaderProps {
  onOpenAudit: () => void;
  onOpenNotifications: () => void;
  onNavigateTab: (tab: string) => void;
  isMobileDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAudit,
  onOpenNotifications,
  onNavigateTab,
  isMobileDeviceFrame,
  onToggleDeviceFrame,
}) => {
  const {
    currentUser,
    currentRole,
    switchRole,
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
      {/* Top primary row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-white p-0.5 shadow-sm border border-white/40 flex items-center justify-center shrink-0">
            <PragathiLogo size={34} className="w-full h-full" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-extrabold tracking-tight text-white leading-tight">
              PRAGATHI JUNIOR COLLEGE
            </h1>
            <span className="text-[10px] text-blue-200 font-medium tracking-wide block leading-none">
              PRAGATHI Jr. DEGREE &amp; PG COLLEGE
            </span>
          </div>
        </div>

        {/* Role Switcher (Parent | Student | Teacher) */}
        <div className="flex items-center gap-1 bg-[#0c2340]/80 dark:bg-slate-900/90 p-1 rounded-xl border border-blue-500/30 text-xs">
          {(['parent', 'student', 'teacher'] as UserRole[]).map((role) => {
            const isActive = currentRole === role;
            const label = role === 'parent' ? 'Parent' : role === 'student' ? 'Student' : 'Teacher';
            return (
              <button
                key={role}
                onClick={() => {
                  switchRole(role);
                  onNavigateTab('home');
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-blue-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Right utility actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-blue-400/20"
          >
            {darkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px] hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-200" />
                <span className="text-[11px] hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Frame View Toggle (Mobile Smartphone Frame vs Wide Responsive) */}
          <button
            onClick={onToggleDeviceFrame}
            title={isMobileDeviceFrame ? "Switch to Wide Responsive Canvas" : "Switch to Mobile Phone Frame"}
            className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-blue-400/20"
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

          {/* System Audit Log */}
          <button
            onClick={onOpenAudit}
            title="System Audit Log"
            className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (confirm('Reset all demo attendance, syllabus, grades, and payments to default?')) {
                resetToDemoDefaults();
              }
            }}
            title="Reset Demo Data"
            className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Active User Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-blue-400/30">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-blue-400/50"
            />
          </div>
        </div>
      </div>

      {/* Sub-bar for Parents: Child Switcher Banner */}
      {currentRole === 'parent' && (
        <div className="bg-[#1b437e] px-4 sm:px-6 py-2 border-t border-blue-500/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-200 font-medium">Active Child:</span>
              <div className="relative">
                <button
                  onClick={() => setIsChildDropdownOpen(!isChildDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-semibold border border-white/20 transition-colors"
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
                        className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs ${
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
        <div className="bg-[#1b437e] px-4 sm:px-6 py-1.5 border-t border-blue-500/20 text-xs text-blue-100">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-blue-300" />
              <span>Assigned as: <strong className="text-white">Class Teacher (10-A) & HOD Mathematics</strong></span>
            </div>
            <div className="text-[11px] text-blue-200">
              Live Classroom Portal · Session 2026-27
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
