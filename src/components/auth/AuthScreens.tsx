import React, { useState } from 'react';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sun,
  Moon,
  Loader2
} from 'lucide-react';
import { useCampus } from '../../context/CampusContext';
import { UserRole } from '../../types';
import { PragathiLogo } from '../common/PragathiLogo';

interface AuthScreensProps {
  onLoginSuccess: () => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({ onLoginSuccess }) => {
  const { switchRole, darkMode, toggleDarkMode } = useCampus();

  const [step, setStep] = useState<'login' | 'forgot'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('parent');
  const [emailOrPhone, setEmailOrPhone] = useState('arvind.sharma@pragathi.edu');
  const [password, setPassword] = useState('••••••••');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roleCredentials = {
    parent: {
      email: 'arvind.sharma@pragathi.edu',
      label: 'Parent',
      description: 'Monitor attendance, academic marks, fee payments & timetables',
    },
    student: {
      email: 'rohan.sharma@pragathi.edu',
      label: 'Student',
      description: 'Access syllabus, lecture notes, assignments & exam results',
    },
    teacher: {
      email: 'r.verma@pragathi.edu',
      label: 'Teacher',
      description: 'Manage classroom attendance, update syllabus & publish marks',
    },
  };

  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    setEmailOrPhone(roleCredentials[role].email);
    setError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or admission number');
      return;
    }
    setError('');
    setIsLoading(true);

    // Direct authentic login with quick visual feedback
    setTimeout(() => {
      setIsLoading(false);
      switchRole(selectedRole);
      onLoginSuccess();
    }, 450);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 sm:p-6 transition-colors ${
      darkMode ? 'bg-[#0B132B] text-slate-100' : 'bg-[#F5F7FB] text-slate-900'
    }`}>
      {/* Top Bar with Brand Badge & Dark/Light Mode Toggle */}
      <div className="w-full max-w-md mx-auto pt-2 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Official Campus Portal</span>
        </div>

        {/* Dark / Light mode toggle */}
        <button
          onClick={toggleDarkMode}
          type="button"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          {darkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Dark</span>
            </>
          )}
        </button>
      </div>

      {/* Main Sign In Card */}
      <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4">
        {/* Top Header with Pragathi Junior College Name and Official Logo */}
        <div className="relative bg-gradient-to-r from-[#163B70] via-[#1a498b] to-[#2563EB] p-6 text-white text-center overflow-hidden">
          <div className="absolute inset-0 bg-blue-950/20 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Official Pragathi Logo Emblem */}
            <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg border-2 border-white/90 flex items-center justify-center mb-3">
              <PragathiLogo size={58} className="w-full h-full" />
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              PRAGATHI JUNIOR COLLEGE
            </h1>
            <p className="text-xs text-blue-200 font-semibold tracking-wide mt-1">
              PRAGATHI Jr. DEGREE &amp; PG COLLEGE
            </p>
            <p className="text-[11px] text-blue-100/80 mt-1">
              Student, Parent &amp; Faculty Digital Campus
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {step === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="text-center pb-1">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Sign In
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select your role to access your campus account
                </p>
              </div>

              {/* Role Selection Tabs */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Login as
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                  {(['parent', 'student', 'teacher'] as UserRole[]).map((role) => {
                    const isActive = selectedRole === role;
                    const label = role === 'parent' ? 'Parent' : role === 'student' ? 'Student' : 'Teacher';
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => handleRoleTabChange(role)}
                        className={`py-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 text-center">
                  {roleCredentials[selectedRole].description}
                </p>
              </div>

              {/* Email / ID Input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {selectedRole === 'student' ? 'Admission No or Email' : 'Registered Email or Mobile'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Enter email or ID"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 font-medium"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-600 font-mono"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 p-2 rounded-lg border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setStep('forgot')}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Clean Primary Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Password Recovery
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Enter your registered admission ID or mobile number to receive reset instructions.
                </p>
              </div>

              <input
                type="text"
                defaultValue={emailOrPhone}
                placeholder="Enter registered email or mobile"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              />

              <button
                type="button"
                onClick={() => {
                  alert('Reset link sent to registered email.');
                  setStep('login');
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Send Reset Instructions
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 py-2">
        PRAGATHI Jr. DEGREE &amp; PG COLLEGE · Digital Campus System
      </div>
    </div>
  );
};
