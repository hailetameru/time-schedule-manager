/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Calendar, Clock, CheckSquare, BarChart3, ShieldAlert, Award, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { login, register, cardColor, fgColor, accentColor } = context;
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }
    if (isRegister && !fullName) {
      setError('Please fill in your full name.');
      return;
    }

    setError('');
    if (isRegister) {
      register(fullName, email);
    } else {
      login(email, email.split('@')[0]);
    }
  };

  const handleDemoLogin = () => {
    login('demo@example.com', 'Demo User');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Intro Hero Section */}
      <div className="max-w-4xl mx-auto text-center mt-6">
        <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-[#d4af37] mb-6">
          <Award className="h-4 w-4" /> Comprehensive Time & Schedule Management
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-none mb-6 text-white">
          Take Absolute Control <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
            Of Your Time & Focus
          </span>
        </h1>
        <p className="text-lg opacity-80 max-w-2xl mx-auto font-medium">
          Organize work milestones, plan calendars, configure sound reminders, and trace progress curves inside a highly personalized environment.
        </p>
      </div>

      {/* Main Container */}
      <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Features Bullet List */}
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <CheckSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Task Priority Management</h3>
              <p className="text-sm opacity-75 mt-1">Assign strict tags, priority tiers, and category flags to organize complex work lists.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Multi-Format Calendars</h3>
              <p className="text-sm opacity-75 mt-1">Dynamically swap viewports across Day, Week, and Month matrix displays.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Real-Time Synthesizer Alarms</h3>
              <p className="text-sm opacity-75 mt-1">Configure audio triggers and screen alerts so deadlines never slip past unnoticed.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Productivity Metrics</h3>
              <p className="text-sm opacity-75 mt-1">Track pending ratios, completed ratios, and trend vectors with modern SVG charts.</p>
            </div>
          </div>
        </div>

        {/* Authentication Card */}
        <div 
          className="rounded-2xl border border-amber-500/10 p-6 sm:p-8 shadow-2xl shadow-black"
          style={{ backgroundColor: cardColor, color: fgColor }}
        >
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
              {isRegister ? 'Create your profile' : 'Sign in to workspace'}
            </h2>
            <p className="text-xs opacity-70 mt-1">
              {isRegister ? 'Set up an offline-safe local profile.' : 'Access your saved calendars and schedules.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-80">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alexis Smith"
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700/80 px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37]"
                  style={{ color: fgColor }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-80">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alexis@example.com"
                className="w-full rounded-xl bg-slate-900/50 border border-slate-700/80 px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37]"
                style={{ color: fgColor }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 opacity-80">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-900/50 border border-slate-700/80 px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37]"
                style={{ color: fgColor }}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl py-3 text-sm font-bold text-white transition-all shadow-md active:scale-98"
              style={{ backgroundColor: accentColor }}
            >
              {isRegister ? 'Complete Registration' : 'Enter Workspace'}
            </button>
          </form>

          {/* Toggle and Fast-Demo buttons */}
          <div className="mt-6 pt-6 border-t border-slate-700/40 text-center space-y-4">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs font-semibold hover:underline opacity-80"
            >
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-700/40"></div>
              <span className="flex-shrink mx-4 text-3xs uppercase tracking-widest font-bold opacity-40">OR EXPLORE</span>
              <div className="flex-grow border-t border-slate-700/40"></div>
            </div>

            <button
              onClick={handleDemoLogin}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-700/40 hover:bg-slate-700/70 py-2.5 text-xs font-bold transition"
            >
              Launch Live Demo Sandbox <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-3xs font-mono opacity-40 mt-12">
        Time & Schedule Manager • Local Secure Client Session Storage Active
      </div>
    </div>
  );
}
