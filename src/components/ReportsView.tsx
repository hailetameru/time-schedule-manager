/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { BarChart3, PieChart, TrendingUp, CheckCircle, Clock, CalendarDays, Award } from 'lucide-react';

export default function ReportsView() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { tasks, categories, cardColor, fgColor, accentColor } = context;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedCount = completedTasks.length;
  const pendingCount = pendingTasks.length;

  const overallScore = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Calculate dynamic weekly completion metrics
  // Group tasks by their weekday (Sun - Sat) to plot on our bar chart
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const taskCountByDay = daysOfWeek.map((dayName, idx) => {
    const matchedTasks = tasks.filter((t) => {
      const taskDate = new Date(t.date);
      return taskDate.getDay() === idx;
    });
    const completed = matchedTasks.filter((t) => t.status === 'completed').length;
    return {
      day: dayName,
      total: matchedTasks.length,
      completed,
    };
  });

  // Calculate working hours dynamically based on tasks!
  // E.g., start time "09:00" and end time "11:30" is 2.5 hours
  let totalWorkingHours = 0;
  tasks.forEach((t) => {
    try {
      const [startH, startM] = t.startTime.split(':').map(Number);
      const [endH, endM] = t.endTime.split(':').map(Number);
      if (!isNaN(startH) && !isNaN(endH)) {
        const startDecimal = startH + startM / 60;
        const endDecimal = endH + endM / 60;
        const duration = endDecimal - startDecimal;
        if (duration > 0) {
          totalWorkingHours += duration;
        }
      }
    } catch (e) {
      // safe fallback
    }
  });

  // Round working hours
  const formattedHours = totalWorkingHours.toFixed(1);

  // Group task counts by Category
  const categoryStats = categories.map((cat) => {
    const catTasks = tasks.filter((t) => t.categoryId === cat.id);
    const completed = catTasks.filter((t) => t.status === 'completed').length;
    return {
      name: cat.name,
      color: cat.color,
      count: catTasks.length,
      completed,
    };
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-serif font-bold tracking-tight text-white">Performance Analytics</h2>
        <p className="text-sm opacity-80 mt-1">Audit task ratios, review weekly metrics, and measure cumulative calendar hours.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="rounded-2xl border border-slate-700/30 p-5 flex items-center gap-4"
          style={{ backgroundColor: cardColor, color: fgColor }}
        >
          <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-3xs uppercase tracking-wider font-bold opacity-60">Completion Weight</span>
            <div className="text-2xl font-black mt-0.5">{completedCount} of {totalTasks} Goals</div>
            <p className="text-4xs opacity-50">Pending: {pendingCount} tasks</p>
          </div>
        </div>

        <div 
          className="rounded-2xl border border-slate-700/30 p-5 flex items-center gap-4"
          style={{ backgroundColor: cardColor, color: fgColor }}
        >
          <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
            <Clock className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <span className="text-3xs uppercase tracking-wider font-bold opacity-60">Total Working Hours</span>
            <div className="text-2xl font-black mt-0.5">{formattedHours} hours</div>
            <p className="text-4xs opacity-50">Derived from start/end times</p>
          </div>
        </div>

        <div 
          className="rounded-2xl border border-slate-700/30 p-5 flex items-center gap-4"
          style={{ backgroundColor: cardColor, color: fgColor }}
        >
          <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-3xs uppercase tracking-wider font-bold opacity-60">Success Trend Index</span>
            <div className="text-2xl font-black mt-0.5">{overallScore}% Ratio</div>
            <p className="text-4xs opacity-50">Active efficiency curve</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Weekly Productivity Bar Chart */}
        <div 
          className="rounded-2xl border border-slate-700/30 p-6 space-y-4"
          style={{ backgroundColor: cardColor, color: fgColor }}
        >
          <h3 className="text-base font-bold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" /> Weekly Completion Spread
          </h3>
          <p className="text-2xs opacity-70">
            Number of completed vs total tasks plotted across the week matrix.
          </p>

          {/* SVG Bar Chart */}
          <div className="pt-4">
            <div className="h-56 flex items-end justify-between gap-2.5 border-b border-slate-700/40 pb-2">
              {taskCountByDay.map((data, idx) => {
                // Heights logic
                const max = Math.max(...taskCountByDay.map(d => d.total), 1);
                const totalHeightPct = (data.total / max) * 100;
                const completedHeightPct = (data.completed / max) * 100;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-help">
                    <div className="relative w-full h-40 flex flex-col justify-end bg-slate-900/35 rounded-md overflow-hidden">
                      {/* Total Task Bar */}
                      <div 
                        className="absolute bottom-0 inset-x-0 bg-slate-700/50 rounded-md transition-all duration-1000"
                        style={{ height: `${totalHeightPct}%` }}
                      />
                      {/* Completed Task Bar */}
                      <div 
                        className="absolute bottom-0 inset-x-0 bg-indigo-500 rounded-md transition-all duration-1000 z-10"
                        style={{ height: `${completedHeightPct}%` }}
                      />

                      {/* Tooltip on hover */}
                      <div className="absolute opacity-0 group-hover:opacity-100 -top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-white rounded px-1.5 py-0.5 text-4xs font-bold transition z-20 whitespace-nowrap">
                        {data.completed}/{data.total} Done
                      </div>
                    </div>
                    <span className="text-3xs font-semibold opacity-70">{data.day}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-4 text-3xs font-bold uppercase tracking-wider pt-3">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-indigo-500" /> Completed</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-slate-700" /> Total Scheduled</span>
            </div>
          </div>
        </div>

        {/* Category breakdown stats list */}
        <div 
          className="rounded-2xl border border-slate-700/30 p-6 space-y-4"
          style={{ backgroundColor: cardColor, color: fgColor }}
        >
          <h3 className="text-base font-bold flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-400" /> Task Category Distribution
          </h3>
          <p className="text-2xs opacity-70">
            Efficiency breakdown indexed by category scopes.
          </p>

          <div className="space-y-4 pt-2">
            {categoryStats.map((stat) => {
              const pct = stat.count > 0 ? Math.round((stat.completed / stat.count) * 100) : 0;
              return (
                <div key={stat.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-2 font-bold">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: stat.color }} />
                      {stat.name}
                    </span>
                    <span className="opacity-75 text-3xs font-mono">
                      {stat.completed} / {stat.count} done ({pct}%)
                    </span>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="h-2 rounded-full bg-slate-950/40 border border-slate-800/80 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: stat.count > 0 ? `${(stat.count / Math.max(...categoryStats.map(s => s.count), 1)) * 100}%` : '0%',
                        backgroundColor: stat.color 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Insights */}
      <div 
        className="rounded-2xl border border-slate-700/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ backgroundColor: cardColor, color: fgColor }}
      >
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <h4 className="font-bold text-base">Efficiency Advisory Report</h4>
            <p className="text-xs opacity-80 mt-0.5">
              Your overall time-slice completion sits at <span className="font-bold text-emerald-400">{overallScore}%</span>. Aim to prioritize high priority tasks first thing to optimize your curve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
