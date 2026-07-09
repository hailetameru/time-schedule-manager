/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import TaskManager from './components/TaskManager';
import ScheduleManager from './components/ScheduleManager';
import CalendarView from './components/CalendarView';
import ReportsView from './components/ReportsView';
import ProfileView from './components/ProfileView';
import NotificationHub from './components/NotificationHub';
import { 
  Clock, 
  CheckSquare, 
  CalendarRange, 
  Calendar, 
  BarChart3, 
  UserRound, 
  LogOut, 
  Sparkles,
  Award
} from 'lucide-react';

function WorkspaceLayout() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { user, logout, bgColor, fgColor, cardColor, accentColor } = context;
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div 
      className="min-h-screen transition-all duration-300 flex flex-col"
      style={{ backgroundColor: bgColor, color: fgColor }}
    >
      {/* Background and audio alerts hub */}
      <NotificationHub />

      {/* Top Header */}
      <header 
        className="border-b border-slate-700/30 shrink-0 sticky top-0 z-40 backdrop-blur-md"
        style={{ backgroundColor: `${cardColor}ea` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: accentColor }}>
              ⏳
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm tracking-tight sm:text-lg text-white">Time & Schedule Manager</h1>
              <p className="text-4xs uppercase tracking-widest font-black opacity-50 text-[#d4af37]">Workspace Sandbox</p>
            </div>
          </div>

          {/* User Profile Info & Log out */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-xs font-bold">{user.fullName}</span>
              <span className="text-4xs font-mono opacity-50">{user.email}</span>
            </div>
            <img 
              src={user.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} 
              alt="User profile" 
              className="h-9.5 w-9.5 rounded-full object-cover border border-slate-700"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={logout}
              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 transition"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation and Main Content wrapper */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col md:flex-row gap-8">
        
        {/* Navigation Rail Sidebar */}
        <nav className="md:w-64 shrink-0 space-y-2">
          <div className="text-4xs uppercase tracking-widest font-bold opacity-45 px-3.5 mb-2">Navigation Channels</div>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'text-white' : 'opacity-70 hover:opacity-100'}`}
            style={{ backgroundColor: activeTab === 'dashboard' ? accentColor : 'transparent' }}
          >
            <Clock className="h-4.5 w-4.5" /> Dashboard
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all ${activeTab === 'tasks' ? 'text-white' : 'opacity-70 hover:opacity-100'}`}
            style={{ backgroundColor: activeTab === 'tasks' ? accentColor : 'transparent' }}
          >
            <CheckSquare className="h-4.5 w-4.5" /> Tasks & Alarms
          </button>

          <button
            onClick={() => setActiveTab('schedules')}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all ${activeTab === 'schedules' ? 'text-white' : 'opacity-70 hover:opacity-100'}`}
            style={{ backgroundColor: activeTab === 'schedules' ? accentColor : 'transparent' }}
          >
            <CalendarRange className="h-4.5 w-4.5" /> Sprint Milestones
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all ${activeTab === 'calendar' ? 'text-white' : 'opacity-70 hover:opacity-100'}`}
            style={{ backgroundColor: activeTab === 'calendar' ? accentColor : 'transparent' }}
          >
            <Calendar className="h-4.5 w-4.5" /> Interactive Calendar
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all ${activeTab === 'reports' ? 'text-white' : 'opacity-70 hover:opacity-100'}`}
            style={{ backgroundColor: activeTab === 'reports' ? accentColor : 'transparent' }}
          >
            <BarChart3 className="h-4.5 w-4.5" /> Productivity Reports
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all ${activeTab === 'profile' ? 'text-white' : 'opacity-70 hover:opacity-100'}`}
            style={{ backgroundColor: activeTab === 'profile' ? accentColor : 'transparent' }}
          >
            <UserRound className="h-4.5 w-4.5" /> Themes & Profile
          </button>

          {/* Mini Quick Metrics Sidebar card */}
          <div 
            className="hidden md:block rounded-2xl border border-slate-700/30 p-4 mt-6 space-y-2.5"
            style={{ backgroundColor: cardColor }}
          >
            <h4 className="text-3xs uppercase tracking-wider font-bold opacity-60 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-amber-400" /> Active System Status
            </h4>
            <div className="flex justify-between items-center text-3xs font-mono opacity-80">
              <span>Database Engine:</span>
              <span className="text-emerald-400">LocalStorage Connected</span>
            </div>
            <div className="flex justify-between items-center text-3xs font-mono opacity-80">
              <span>Alarm Synthesizer:</span>
              <span className="text-emerald-400">AudioContext Online</span>
            </div>
          </div>
        </nav>

        {/* Main View Port content with motion graphics transitions */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
              {activeTab === 'tasks' && <TaskManager />}
              {activeTab === 'schedules' && <ScheduleManager />}
              {activeTab === 'calendar' && <CalendarView />}
              {activeTab === 'reports' && <ReportsView />}
              {activeTab === 'profile' && <ProfileView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Page Footer */}
      <footer className="border-t border-slate-700/20 py-4 text-center text-4xs font-mono opacity-40 shrink-0">
        Time & Schedule Management Web Application • Powered by Antigravity React Build System
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <WorkspaceLayout />
    </AppProvider>
  );
}
