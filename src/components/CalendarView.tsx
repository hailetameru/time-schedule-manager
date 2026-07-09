/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus, Sparkles } from 'lucide-react';

type CalendarMode = 'month' | 'week' | 'day';

export default function CalendarView() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { tasks, schedules, categories, cardColor, fgColor, accentColor, addTask } = context;

  // View States
  const [mode, setMode] = useState<CalendarMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());

  // Quick Task form inside selected day panel
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCat, setQuickCat] = useState(categories[0]?.id || '1');

  // Calendar helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get start/end details of the month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrev = () => {
    if (mode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (mode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (mode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (mode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  // Convert Date object to YYYY-MM-DD
  const formatDateStr = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Get tasks scheduled for a specific date
  const getTasksForDate = (dateStr: string) => {
    return tasks.filter((t) => t.date === dateStr);
  };

  // Check if a multi-day schedule spans a specific date
  const getSchedulesForDate = (dateStr: string) => {
    const target = new Date(dateStr);
    return schedules.filter((s) => {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);
      return target >= start && target <= end;
    });
  };

  // Submit quick task on selected day
  const handleAddQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !quickTitle.trim()) return;

    addTask({
      title: quickTitle.trim(),
      description: 'Created quickly via Calendar view',
      categoryId: quickCat,
      date: formatDateStr(selectedDay),
      startTime: '10:00',
      endTime: '11:00',
      priority: 'medium',
      status: 'pending',
    });

    setQuickTitle('');
  };

  // Month rendering details
  const getMonthDays = () => {
    const arr = [];
    // Pad empty spaces before first of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      arr.push(null);
    }
    // Add real dates
    for (let i = 1; i <= daysInMonth; i++) {
      arr.push(new Date(year, month, i));
    }
    return arr;
  };

  // Week rendering details
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Go to Sunday
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const monthDays = getMonthDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const selectedDayStr = selectedDay ? formatDateStr(selectedDay) : '';
  const selectedTasks = selectedDay ? getTasksForDate(selectedDayStr) : [];
  const selectedSchedules = selectedDay ? getSchedulesForDate(selectedDayStr) : [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-white">Interactive Calendar</h2>
          <p className="text-sm opacity-80 mt-1">Navigate across Month grids, Week planners, and Day agendas to map out goals.</p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900/60 p-1 border border-slate-700/35 shrink-0 self-start">
          {(['month', 'week', 'day'] as CalendarMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${mode === m ? 'text-white' : 'opacity-60 hover:opacity-100'}`}
              style={{ backgroundColor: mode === m ? accentColor : 'transparent' }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid split: Calendar Display Left, Details Panel Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calendar core (Col span 2) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Header controls */}
          <div 
            className="rounded-2xl border border-slate-700/30 px-5 py-4 flex items-center justify-between"
            style={{ backgroundColor: cardColor, color: fgColor }}
          >
            <h3 className="font-bold text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-400" />
              {mode === 'month' && `${monthNames[month]} ${year}`}
              {mode === 'week' && `Week of ${weekDays[0].toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${year}`}
              {mode === 'day' && currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setCurrentDate(new Date()); setSelectedDay(new Date()); }}
                className="px-2.5 py-1.5 text-3xs font-black uppercase tracking-wider bg-slate-800/60 hover:bg-slate-700/80 rounded-lg transition"
              >
                Today
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Calendar Body Rendering */}
          <div 
            className="rounded-2xl border border-slate-700/30 p-4"
            style={{ backgroundColor: cardColor, color: fgColor }}
          >
            {/* MONTH VIEW */}
            {mode === 'month' && (
              <div className="space-y-2">
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1.5 text-center text-4xs font-bold uppercase tracking-widest opacity-60 pb-2 border-b border-slate-700/35">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                {/* Grid days */}
                <div className="grid grid-cols-7 gap-1.5 min-h-[300px]">
                  {monthDays.map((day, idx) => {
                    if (!day) {
                      return <div key={`empty-${idx}`} className="rounded-lg bg-slate-900/10 opacity-20" />;
                    }

                    const dateStr = formatDateStr(day);
                    const dayTasks = getTasksForDate(dateStr);
                    const daySchedules = getSchedulesForDate(dateStr);
                    const isToday = formatDateStr(new Date()) === dateStr;
                    const isSelected = selectedDay && formatDateStr(selectedDay) === dateStr;

                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDay(day)}
                        className={`rounded-lg p-1.5 min-h-[60px] text-left flex flex-col justify-between transition-all outline-none border ${isSelected ? 'border-blue-500 scale-102 shadow-[0_0_12px_rgba(59,130,246,0.2)] bg-blue-500/10' : isToday ? 'border-amber-500/50 bg-amber-500/5' : 'border-slate-800/40 hover:border-slate-700/40 bg-slate-900/15'}`}
                      >
                        <span className={`text-2xs font-bold ${isToday ? 'text-amber-400 font-black' : ''}`}>
                          {day.getDate()}
                        </span>

                        {/* Badges */}
                        <div className="space-y-0.5 w-full mt-1.5">
                          {daySchedules.slice(0, 1).map((s) => (
                            <div 
                              key={s.id} 
                              className="text-4xs truncate px-1 rounded-sm bg-indigo-500 text-white font-medium"
                            >
                              📁 {s.title}
                            </div>
                          ))}
                          {dayTasks.slice(0, 2).map((t) => {
                            const cat = categories.find((c) => c.id === t.categoryId);
                            return (
                              <div 
                                key={t.id} 
                                className="text-4xs truncate px-1 rounded-sm text-white font-medium flex items-center gap-0.5"
                                style={{ backgroundColor: cat?.color || '#3b82f6' }}
                              >
                                {t.status === 'completed' ? '✓' : '•'} {t.title}
                              </div>
                            );
                          })}
                          {(dayTasks.length > 2 || daySchedules.length > 1) && (
                            <div className="text-4xs text-center font-bold opacity-50">+ more</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WEEK VIEW */}
            {mode === 'week' && (
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-3">
                  {weekDays.map((day) => {
                    const dateStr = formatDateStr(day);
                    const dayTasks = getTasksForDate(dateStr);
                    const daySchedules = getSchedulesForDate(dateStr);
                    const isToday = formatDateStr(new Date()) === dateStr;

                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDay(day)}
                        className={`rounded-xl p-3 min-h-[180px] text-left flex flex-col justify-between border transition ${isToday ? 'border-amber-500/60 bg-amber-500/5' : 'border-slate-800/50 bg-slate-900/15'}`}
                      >
                        <div>
                          <p className="text-4xs uppercase tracking-wider font-bold opacity-55">
                            {day.toLocaleDateString(undefined, { weekday: 'short' })}
                          </p>
                          <p className={`text-base font-black ${isToday ? 'text-amber-400' : ''}`}>
                            {day.getDate()}
                          </p>
                        </div>

                        {/* Weekday cards stack */}
                        <div className="space-y-1 w-full mt-3 overflow-hidden">
                          {daySchedules.map((s) => (
                            <div key={s.id} className="text-4xs truncate px-1.5 py-0.5 rounded-sm bg-indigo-500 text-white font-bold">
                              {s.title}
                            </div>
                          ))}
                          {dayTasks.map((t) => {
                            const cat = categories.find((c) => c.id === t.categoryId);
                            return (
                              <div 
                                key={t.id} 
                                className="text-4xs truncate px-1.5 py-0.5 rounded-sm text-white font-semibold"
                                style={{ backgroundColor: cat?.color || '#475569' }}
                              >
                                {t.startTime} {t.title}
                              </div>
                            );
                          })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DAY VIEW */}
            {mode === 'day' && (
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                {/* Hourly grid from 07:00 to 20:00 */}
                {Array.from({ length: 14 }).map((_, i) => {
                  const hour = 7 + i;
                  const hourStr = `${String(hour).padStart(2, '0')}:00`;
                  const dateStr = formatDateStr(currentDate);
                  
                  // Filter tasks starting in this exact hour bracket
                  const hourTasks = tasks.filter((t) => {
                    if (t.date !== dateStr) return false;
                    const startH = parseInt(t.startTime.split(':')[0]);
                    return startH === hour;
                  });

                  return (
                    <div key={hourStr} className="flex gap-4 items-center py-2.5 border-b border-slate-700/30 last:border-0">
                      <div className="w-16 text-xs font-mono opacity-60 text-right">{hourStr}</div>
                      
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {hourTasks.length === 0 ? (
                          <div className="text-3xs opacity-30 italic py-1">Available time block</div>
                        ) : (
                          hourTasks.map((t) => {
                            const cat = categories.find((c) => c.id === t.categoryId);
                            return (
                              <div 
                                key={t.id}
                                className="rounded-lg px-2.5 py-1 text-xs font-bold text-white shadow-sm flex items-center justify-between"
                                style={{ backgroundColor: cat?.color || '#3b82f6' }}
                              >
                                <span>{t.title}</span>
                                <span className="text-4xs opacity-80 font-mono font-normal">
                                  {t.startTime} - {t.endTime}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected Day Agenda panel */}
        <div>
          <div 
            className="rounded-2xl border border-slate-700/30 p-6 space-y-6"
            style={{ backgroundColor: cardColor, color: fgColor }}
          >
            <div>
              <h3 className="font-serif font-bold text-base flex items-center gap-1.5 text-white">
                <Sparkles className="h-4.5 w-4.5 text-[#d4af37]" /> Day's Agenda Detail
              </h3>
              <p className="text-3xs font-mono opacity-60 mt-1">
                Selected: {selectedDay?.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>

            {/* List agenda */}
            <div className="space-y-4">
              <div>
                <h4 className="text-4xs font-black uppercase tracking-wider opacity-60 mb-2">Sprints & Programs</h4>
                {selectedSchedules.length === 0 ? (
                  <p className="text-3xs opacity-40 italic">No overarching sprints span this date.</p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedSchedules.map((s) => (
                      <div key={s.id} className="text-xs bg-indigo-500/10 border border-indigo-500/25 p-2 rounded-lg text-indigo-300 font-semibold">
                        📁 {s.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-4xs font-black uppercase tracking-wider opacity-60 mb-2">Focus Task list</h4>
                {selectedTasks.length === 0 ? (
                  <p className="text-3xs opacity-40 italic">No daily task targets configured for this date.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedTasks.map((t) => {
                      const cat = categories.find((c) => c.id === t.categoryId);
                      return (
                        <div 
                          key={t.id} 
                          className="flex items-center justify-between bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat?.color || '#cbd5e1' }} />
                            <span className={`text-xs font-bold ${t.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                              {t.title}
                            </span>
                          </div>
                          <span className="text-4xs font-mono opacity-60 shrink-0">{t.startTime}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Quick inject form */}
            {selectedDay && (
              <form onSubmit={handleAddQuickTask} className="pt-4 border-t border-slate-700/40 space-y-3">
                <h4 className="text-4xs font-black uppercase tracking-wider opacity-60">Instantly Add Task for this Day</h4>
                
                <input
                  type="text"
                  required
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="e.g. Wrap up project code review"
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-3.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  style={{ color: fgColor }}
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={quickCat}
                    onChange={(e) => setQuickCat(e.target.value)}
                    className="rounded-xl bg-slate-900/50 border border-slate-700 px-2 py-1.5 text-3xs focus:outline-none"
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
                    className="rounded-xl py-1.5 text-3xs font-black uppercase tracking-wider text-white transition hover:brightness-110"
                    style={{ backgroundColor: accentColor }}
                  >
                    Quick Add
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
