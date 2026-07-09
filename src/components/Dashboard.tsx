/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { CheckCircle2, Circle, Clock, Flame, CalendarRange, Plus, AlertCircle, Sparkles } from 'lucide-react';

export default function Dashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const context = useContext(AppContext);
  if (!context) return null;

  const { tasks, schedules, categories, addTask, updateTask, cardColor, fgColor, accentColor } = context;
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState(categories[0]?.id || '1');

  // Filter Tasks
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter((t) => t.date === todayStr);
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  // Productivity Score Calculation
  const totalCount = tasks.length;
  const completedCount = completedTasks.length;
  const productivityScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Handle Quick Task Insertion
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    addTask({
      title: quickTitle.trim(),
      description: 'Quickly created from Dashboard',
      categoryId: quickCategory,
      date: todayStr,
      startTime: '12:00',
      endTime: '13:00',
      priority: 'medium',
      status: 'pending',
    });

    setQuickTitle('');
  };

  // Helper for priority tag style
  const getPriorityBadge = (p: string) => {
    const base = 'text-3xs font-black uppercase tracking-widest px-2 py-0.5 rounded';
    if (p === 'high') return `${base} bg-red-500/15 text-red-400 border border-red-500/20`;
    if (p === 'medium') return `${base} bg-amber-500/15 text-amber-400 border border-amber-500/20`;
    return `${base} bg-slate-500/15 text-slate-400 border border-slate-500/20`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-white">Workspace Overview</h2>
          <p className="text-sm opacity-80 mt-1">Here is a summary of today's focus metrics and scheduled tasks.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono opacity-85 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-amber-500/10">
          <Clock className="h-4 w-4 text-[#d4af37]" />
          <span>Local System Time: {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI: Pending */}
        <div 
          className="rounded-2xl border border-slate-700/30 p-5 flex items-center justify-between"
          style={{ backgroundColor: cardColor, color: fgColor }}
        >
          <div>
            <span className="text-2xs uppercase tracking-wider font-bold opacity-60">Pending Goals</span>
            <div className="text-3xl font-black mt-1">{pendingTasks.length}</div>
            <p className="text-3xs opacity-50 mt-1">Awaiting attention</p>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
            <Circle className="h-6 w-6" />
          </div>
        </div>

        {/* KPI: Completed */}
        <div 
          className="rounded-2xl border border-slate-700/30 p-5 flex items-center justify-between"
          style={{ backgroundColor: cardColor, color: fgColor }}
        >
          <div>
            <span className="text-2xs uppercase tracking-wider font-bold opacity-60">Completed Goals</span>
            <div className="text-3xl font-black mt-1">{completedTasks.length}</div>
            <p className="text-3xs opacity-50 mt-1">Archived in database</p>
          </div>
          <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* KPI: Active Schedules */}
        <div 
          className="rounded-2xl border border-slate-700/30 p-5 flex items-center justify-between"
          style={{ backgroundColor: cardColor, color: fgColor }}
        >
          <div>
            <span className="text-2xs uppercase tracking-wider font-bold opacity-60">Active Milestones</span>
            <div className="text-3xl font-black mt-1">{schedules.length}</div>
            <p className="text-3xs opacity-50 mt-1">Multi-day sprint arcs</p>
          </div>
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
            <CalendarRange className="h-6 w-6" />
          </div>
        </div>

        {/* KPI: Productivity Meter */}
        <div 
          className="rounded-2xl border border-slate-700/30 p-5 flex items-center justify-between"
          style={{ backgroundColor: cardColor, color: fgColor }}
        >
          <div>
            <span className="text-2xs uppercase tracking-wider font-bold opacity-60">Efficiency Score</span>
            <div className="text-3xl font-black mt-1 text-emerald-400">{productivityScore}%</div>
            <p className="text-3xs opacity-50 mt-1">Total completion weight</p>
          </div>
          <div className="rounded-xl bg-red-500/10 p-3 text-red-400">
            <Flame className="h-6 w-6 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content Layout splits into Today's Focus and Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Today's Focus Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            className="rounded-2xl border border-slate-700/30 p-6 space-y-4"
            style={{ backgroundColor: cardColor, color: fgColor }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
              <h3 className="text-lg font-serif font-bold flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-[#d4af37]" /> Today's Focus Agenda
              </h3>
              <span className="text-3xs font-bold uppercase bg-blue-500/10 text-blue-400 px-2 py-1 rounded">
                {todayTasks.length} Task(s)
              </span>
            </div>

            {todayTasks.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="opacity-65 text-sm">Your schedule for today is completely clear!</p>
                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs font-bold text-blue-400 hover:underline"
                >
                  Go add task entries +
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-700/30 space-y-3.5 pt-2">
                {todayTasks.map((t) => {
                  const cat = categories.find((c) => c.id === t.categoryId);
                  const isCompleted = t.status === 'completed';

                  return (
                    <div 
                      key={t.id} 
                      className="flex items-start justify-between pt-3.5 first:pt-0 gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <button 
                          onClick={() => updateTask(t.id, { status: isCompleted ? 'pending' : 'completed' })}
                          className={`mt-1 focus:outline-none transition-all duration-300 ${isCompleted ? 'text-emerald-500 hover:text-emerald-600 scale-110' : 'text-slate-400 hover:text-blue-500'}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </button>
                        <div>
                          <h4 className={`font-bold text-sm ${isCompleted ? 'line-through opacity-50' : ''}`}>
                            {t.title}
                          </h4>
                          <p className="text-xs opacity-70 mt-0.5 line-clamp-1">{t.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span 
                              className="text-3xs font-semibold px-1.5 py-0.5 rounded-sm flex items-center gap-1 text-white"
                              style={{ backgroundColor: cat?.color || '#cbd5e1' }}
                            >
                              {cat?.name || 'Unassigned'}
                            </span>
                            <span className="text-3xs font-mono opacity-60">
                              {t.startTime} - {t.endTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1.5">
                        {getPriorityBadge(t.priority)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Productivity progress widget */}
          <div 
            className="rounded-2xl border border-slate-700/30 p-6 space-y-4"
            style={{ backgroundColor: cardColor, color: fgColor }}
          >
            <h3 className="font-serif font-bold text-base text-white">Workspace Milestone Progress</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs opacity-80 mb-1">
                  <span>Task Completion Ratio</span>
                  <span className="font-bold">{completedCount} of {totalCount} goals</span>
                </div>
                <div className="h-3 rounded-full bg-slate-900/40 border border-slate-800 overflow-hidden p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000"
                    style={{ width: `${productivityScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Quick Actions & Productivity Dial */}
        <div className="space-y-6">
          {/* Quick Task Creation Card */}
          <div 
            className="rounded-2xl border border-slate-700/30 p-6 space-y-4"
            style={{ backgroundColor: cardColor, color: fgColor }}
          >
            <h3 className="text-base font-serif font-bold flex items-center gap-2 text-white">
              <Plus className="h-5 w-5 text-[#d4af37]" /> Fast Task Addition
            </h3>
            <p className="text-2xs opacity-70">
              Instantly inject a standard task into your agenda for today.
            </p>

            <form onSubmit={handleQuickAdd} className="space-y-3 pt-1">
              <div>
                <input
                  type="text"
                  placeholder="e.g. Read draft proposal"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
                  style={{ color: fgColor }}
                  maxLength={50}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={quickCategory}
                  onChange={(e) => setQuickCategory(e.target.value)}
                  className="rounded-xl bg-slate-900/50 border border-slate-700 px-2 py-2 text-2xs focus:outline-none focus:border-blue-500"
                  style={{ color: fgColor }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} style={{ backgroundColor: cardColor }}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="rounded-xl font-bold text-2xs text-white transition hover:brightness-110 active:scale-98"
                  style={{ backgroundColor: accentColor }}
                >
                  Quick Add
                </button>
              </div>
            </form>
          </div>

          {/* Quick Tips or Advice */}
          <div 
            className="rounded-2xl border border-slate-700/30 p-6 space-y-3"
            style={{ backgroundColor: cardColor, color: fgColor }}
          >
            <h4 className="font-bold text-xs uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" /> Productivity Tip
            </h4>
            <p className="text-xs opacity-80 leading-relaxed">
              Plan tasks around chronological priority block times. Start with high impact goals in the morning, and leave meetings/maintenance for late afternoons. Keep your synthesizers primed for prompt sound alarms!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
