import React from 'react';
import {
  Home,
  CalendarCheck,
  GraduationCap,
  CreditCard,
  User,
  BookOpen,
  Clock,
  Award,
  Users,
  CheckSquare
} from 'lucide-react';
import { UserRole } from '../../types';

interface BottomNavProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ role, activeTab, onTabChange }) => {
  // Navigation tabs defined per role
  const parentTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'fees', label: 'Fees', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const studentTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'timetable', label: 'Timetable', icon: Clock },
    { id: 'performance', label: 'Performance', icon: Award },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const teacherTabs = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'classes', label: 'Classes', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const tabs = role === 'parent' ? parentTabs : role === 'student' ? studentTabs : teacherTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'scale-110 bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
