/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Schedule } from '../types';
import { CalendarRange, Plus, Edit2, Trash2, Milestone, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function ScheduleManager() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { schedules, addSchedule, updateSchedule, deleteSchedule, cardColor, fgColor, accentColor } = context;

  // Form States
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const clearForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate(new Date().toISOString().slice(0, 10));
    setDescription('');
    setError('');
  };

  const handleStartEdit = (s: Schedule) => {
    setIsEditing(true);
    setEditingId(s.id);
    setTitle(s.title);
    setStartDate(s.startDate);
    setEndDate(s.endDate);
    setDescription(s.description || '');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Check date bounds
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot fall after the end date.');
      return;
    }

    setError('');
    if (isEditing && editingId) {
      updateSchedule(editingId, {
        title,
        startDate,
        endDate,
        description,
      });
    } else {
      addSchedule({
        title,
        startDate,
        endDate,
        description,
      });
    }

    clearForm();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-serif font-bold tracking-tight text-white">Active Milestones & Schedules</h2>
        <p className="text-sm opacity-80 mt-1">Establish overarching sprints, projects, or multi-day schedules alongside your daily tasks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Schedule Entries list */}
        <div className="lg:col-span-2 space-y-4">
          {schedules.length === 0 ? (
            <div 
              className="rounded-2xl border border-slate-700/30 p-12 text-center"
              style={{ backgroundColor: cardColor, color: fgColor }}
            >
              <p className="opacity-70 text-sm">No overarching milestones recorded.</p>
              <p className="opacity-50 text-xs mt-1">Use the entry form to map out sprints or event periods.</p>
            </div>
          ) : (
            schedules.map((s) => (
              <div 
                key={s.id}
                className="rounded-xl border border-slate-700/30 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition duration-200 hover:border-slate-600/40"
                style={{ backgroundColor: cardColor }}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400 shrink-0">
                    <Milestone className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-base tracking-tight" style={{ color: fgColor }}>
                      {s.title}
                    </h4>
                    {s.description && (
                      <p className="text-xs opacity-75 max-w-md">{s.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-3xs font-mono opacity-60 pt-1">
                      <CalendarRange className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{s.startDate}</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{s.endDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-700/30">
                  <button
                    onClick={() => handleStartEdit(s)}
                    className="p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-700/60 text-slate-300 transition"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteSchedule(s.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right 1 Column: Create/Edit form */}
        <div>
          <form 
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-700/30 p-6 space-y-4"
            style={{ backgroundColor: cardColor, color: fgColor }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
              <h3 className="font-serif font-bold text-base flex items-center gap-2 text-white">
                <Sparkles className="h-4.5 w-4.5 text-[#d4af37]" />
                {isEditing ? 'Modify Sprint Arc' : 'Register Sprint Arc'}
              </h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="text-4xs font-black uppercase text-amber-400 tracking-wider hover:underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-2.5 text-xs text-red-400 border border-red-500/20 animate-pulse">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3.5">
              <div>
                <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q4 Website Development"
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
                  style={{ color: fgColor }}
                />
              </div>

              <div>
                <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">Scope / Details</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Involves database migrations, API proxies, and client-side design polish."
                  rows={4}
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500 resize-none"
                  style={{ color: fgColor }}
                />
              </div>

              <div>
                <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">Initiation Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  style={{ color: fgColor }}
                />
              </div>

              <div>
                <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">Completion Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  style={{ color: fgColor }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl py-3 text-xs font-bold text-white transition hover:brightness-110 active:scale-98 shadow-md"
              style={{ backgroundColor: accentColor }}
            >
              {isEditing ? 'Save Milestone' : 'Record Milestone'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
