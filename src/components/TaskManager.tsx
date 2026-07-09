/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Task, Category } from '../types';
import { Plus, Search, Edit3, Trash2, Calendar, Clock, AlertTriangle, Check, ShieldAlert, Sparkles, BellRing } from 'lucide-react';

export default function TaskManager() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { 
    tasks, 
    categories, 
    reminders,
    addTask, 
    updateTask, 
    deleteTask, 
    addReminder,
    deleteReminder,
    cardColor, 
    fgColor, 
    accentColor 
  } = context;

  // Search and Filter States
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form States (for Create / Edit Mode)
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '1');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'pending' | 'completed'>('pending');

  // Reminder / Alarm States
  const [setAlarm, setSetAlarm] = useState(false);
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmMessage, setAlarmMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'alarm' | 'toast' | 'both'>('both');

  // Clear Form Helper
  const clearForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCategoryId(categories[0]?.id || '1');
    setDate(new Date().toISOString().slice(0, 10));
    setStartTime('09:00');
    setEndTime('10:00');
    setPriority('medium');
    setStatus('pending');
    setSetAlarm(false);
    setAlarmTime('');
    setAlarmMessage('');
    setNotificationType('both');
  };

  // Start Edit Mode helper
  const handleStartEdit = (t: Task) => {
    setIsEditing(true);
    setEditingId(t.id);
    setTitle(t.title);
    setDescription(t.description);
    setCategoryId(t.categoryId);
    setDate(t.date);
    setStartTime(t.startTime);
    setEndTime(t.endTime);
    setPriority(t.priority);
    setStatus(t.status);

    // Look if any reminder exists for this task
    const taskReminder = reminders.find((r) => r.taskId === t.id);
    if (taskReminder) {
      setSetAlarm(true);
      setAlarmTime(taskReminder.reminderTime);
      setAlarmMessage(taskReminder.message || '');
      setNotificationType(taskReminder.notificationType);
    } else {
      setSetAlarm(false);
      setAlarmTime('');
      setAlarmMessage('');
      setNotificationType('both');
    }
  };

  // Form Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && editingId) {
      // Edit mode
      updateTask(editingId, {
        title,
        description,
        categoryId,
        date,
        startTime,
        endTime,
        priority,
        status,
      });

      // Update or Add reminder
      const existingReminder = reminders.find((r) => r.taskId === editingId);
      if (existingReminder) {
        deleteReminder(existingReminder.id);
      }

      if (setAlarm && alarmTime) {
        addReminder(
          editingId,
          alarmTime,
          notificationType,
          alarmMessage || `Reminder: ${title}`
        );
      }
    } else {
      // Create mode
      const createdTask = addTask({
        title,
        description,
        categoryId,
        date,
        startTime,
        endTime,
        priority,
        status,
      });

      // Set associated alarm if toggled
      if (setAlarm && alarmTime) {
        addReminder(
          createdTask.id,
          alarmTime,
          notificationType,
          alarmMessage || `Reminder: ${title}`
        );
      }
    }

    clearForm();
  };

  // Filter Tasks Array
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || t.categoryId === filterCategory;
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-serif font-bold tracking-tight text-white">Task & Reminder Hub</h2>
        <p className="text-sm opacity-80 mt-1">Manage single-day task goals, configure audio synthesis alarms, and view category tags.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Task List & Search Filters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter Bar */}
          <div 
            className="rounded-2xl border border-slate-700/30 p-4 space-y-3"
            style={{ backgroundColor: cardColor, color: fgColor }}
          >
            {/* Search Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search task names or logs..."
                className="w-full rounded-xl bg-slate-900/50 border border-slate-700 pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-500"
                style={{ color: fgColor }}
              />
            </div>

            {/* Dropdown filters */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-60">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full rounded-lg bg-slate-900/40 border border-slate-700/80 px-2 py-1.5 text-3xs font-medium focus:outline-none focus:border-blue-500"
                  style={{ color: fgColor }}
                >
                  <option value="all" style={{ backgroundColor: cardColor }}>All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} style={{ backgroundColor: cardColor }}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-60">Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full rounded-lg bg-slate-900/40 border border-slate-700/80 px-2 py-1.5 text-3xs font-medium focus:outline-none focus:border-blue-500"
                  style={{ color: fgColor }}
                >
                  <option value="all" style={{ backgroundColor: cardColor }}>All Priorities</option>
                  <option value="high" style={{ backgroundColor: cardColor }}>High</option>
                  <option value="medium" style={{ backgroundColor: cardColor }}>Medium</option>
                  <option value="low" style={{ backgroundColor: cardColor }}>Low</option>
                </select>
              </div>

              <div>
                <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-60">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full rounded-lg bg-slate-900/40 border border-slate-700/80 px-2 py-1.5 text-3xs font-medium focus:outline-none focus:border-blue-500"
                  style={{ color: fgColor }}
                >
                  <option value="all" style={{ backgroundColor: cardColor }}>All Statuses</option>
                  <option value="pending" style={{ backgroundColor: cardColor }}>Pending</option>
                  <option value="completed" style={{ backgroundColor: cardColor }}>Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Task Entries list */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div 
                className="rounded-2xl border border-slate-700/30 p-12 text-center"
                style={{ backgroundColor: cardColor, color: fgColor }}
              >
                <p className="opacity-70 text-sm">No tasks matched your exact filters.</p>
                <p className="opacity-50 text-xs mt-1">Try resetting search filters or add a new goal.</p>
              </div>
            ) : (
              filteredTasks.map((t) => {
                const cat = categories.find((c) => c.id === t.categoryId);
                const isCompleted = t.status === 'completed';
                const hasReminder = reminders.find((r) => r.taskId === t.id);

                return (
                  <div 
                    key={t.id}
                    className={`rounded-xl border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition duration-200 ${isCompleted ? 'bg-slate-900/30 border-slate-800/60 opacity-60' : 'border-slate-700/30 hover:border-slate-600/40'}`}
                    style={{ backgroundColor: cardColor }}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Check toggle */}
                      <button 
                        onClick={() => updateTask(t.id, { status: isCompleted ? 'pending' : 'completed' })}
                        className={`mt-1 focus:outline-none transition ${isCompleted ? 'text-emerald-500 hover:text-emerald-600 scale-110' : 'text-slate-400 hover:text-blue-500'}`}
                      >
                        {isCompleted ? (
                          <div className="rounded-full bg-emerald-500/10 p-0.5"><Check className="h-4.5 w-4.5" /></div>
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-slate-500" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`font-bold text-sm leading-snug ${isCompleted ? 'line-through text-slate-500' : ''}`} style={{ color: fgColor }}>
                            {t.title}
                          </h4>
                          <span 
                            className="text-4xs font-bold px-1.5 py-0.5 rounded text-white shrink-0"
                            style={{ backgroundColor: cat?.color || '#94a3b8' }}
                          >
                            {cat?.name || 'Category'}
                          </span>
                        </div>
                        <p className="text-xs opacity-75 line-clamp-2 max-w-md">{t.description}</p>
                        
                        {/* Time Metadata */}
                        <div className="flex items-center gap-3 text-3xs font-mono opacity-60 flex-wrap pt-1">
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {t.date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t.startTime} - {t.endTime}</span>
                          {hasReminder && (
                            <span className="flex items-center gap-1 text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded">
                              <BellRing className="h-3 w-3" /> Alarm Armed: {hasReminder.reminderTime.replace('T', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-700/30">
                      {/* Priority Tag */}
                      <span className={`text-4xs font-black uppercase px-2 py-0.5 rounded ${t.priority === 'high' ? 'bg-red-500/15 text-red-400' : t.priority === 'medium' ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-500/15 text-slate-400'}`}>
                        {t.priority}
                      </span>

                      {/* Actions */}
                      <button
                        onClick={() => handleStartEdit(t)}
                        className="p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-700/60 text-slate-300 transition"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right 1 Column: Create or Edit Form */}
        <div>
          <form 
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-700/30 p-6 space-y-4"
            style={{ backgroundColor: cardColor, color: fgColor }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
              <h3 className="font-serif font-bold text-base flex items-center gap-2 text-white">
                <Sparkles className="h-4.5 w-4.5 text-[#d4af37]" />
                {isEditing ? 'Edit Existing Goal' : 'Add New Task Goal'}
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

            {/* Inputs */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deliver Product Deck"
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
                  style={{ color: fgColor }}
                />
              </div>

              <div>
                <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">Description / Logs</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Outline deployment architecture in pages 4-5."
                  rows={3}
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500 resize-none"
                  style={{ color: fgColor }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-2 py-2 text-xs focus:outline-none focus:border-blue-500"
                    style={{ color: fgColor }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} style={{ backgroundColor: cardColor }}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-2 py-2 text-xs focus:outline-none focus:border-blue-500"
                    style={{ color: fgColor }}
                  >
                    <option value="high" style={{ backgroundColor: cardColor }}>High</option>
                    <option value="medium" style={{ backgroundColor: cardColor }}>Medium</option>
                    <option value="low" style={{ backgroundColor: cardColor }}>Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">Target Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  style={{ color: fgColor }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">Start Time</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    style={{ color: fgColor }}
                  />
                </div>

                <div>
                  <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">End Time</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    style={{ color: fgColor }}
                  />
                </div>
              </div>

              {/* Status Selector in Edit Mode */}
              {isEditing && (
                <div>
                  <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">Goal Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-900/50 border border-slate-700 px-2 py-2 text-xs focus:outline-none focus:border-blue-500"
                    style={{ color: fgColor }}
                  >
                    <option value="pending" style={{ backgroundColor: cardColor }}>Pending</option>
                    <option value="completed" style={{ backgroundColor: cardColor }}>Completed</option>
                  </select>
                </div>
              )}

              {/* Reminder Toggle */}
              <div className="pt-2 border-t border-slate-700/40 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={setAlarm}
                    onChange={(e) => setSetAlarm(e.target.checked)}
                    className="rounded text-blue-500 bg-slate-900 border-slate-700 h-4 w-4"
                  />
                  <span className="text-xs font-bold flex items-center gap-1">
                    <BellRing className="h-4 w-4 text-amber-400" /> Configure Reminder Alarm
                  </span>
                </label>

                {setAlarm && (
                  <div className="space-y-3.5 bg-slate-900/40 p-3 rounded-xl border border-slate-700/30 animate-fade-in">
                    <div>
                      <label className="block text-5xs uppercase tracking-wider font-bold mb-1 opacity-70">Trigger Alarm Time</label>
                      <input
                        type="datetime-local"
                        required={setAlarm}
                        value={alarmTime}
                        onChange={(e) => setAlarmTime(e.target.value)}
                        className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                        style={{ color: fgColor }}
                      />
                    </div>

                    <div>
                      <label className="block text-5xs uppercase tracking-wider font-bold mb-1 opacity-70">Alarm Message Text</label>
                      <input
                        type="text"
                        value={alarmMessage}
                        onChange={(e) => setAlarmMessage(e.target.value)}
                        placeholder="e.g. Focus check! Open demo slide now"
                        className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                        style={{ color: fgColor }}
                      />
                    </div>

                    <div>
                      <label className="block text-5xs uppercase tracking-wider font-bold mb-1 opacity-70">Delivery Channel</label>
                      <select
                        value={notificationType}
                        onChange={(e) => setNotificationType(e.target.value as any)}
                        className="w-full rounded-lg bg-slate-950/60 border border-slate-800 px-2.5 py-1.5 text-3xs font-medium focus:outline-none focus:border-blue-500"
                        style={{ color: fgColor }}
                      >
                        <option value="both" style={{ backgroundColor: cardColor }}>Synthesized Sound + Toast Modal</option>
                        <option value="alarm" style={{ backgroundColor: cardColor }}>Synthesized Sound Only</option>
                        <option value="toast" style={{ backgroundColor: cardColor }}>Silent Toast Banner Only</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl py-3 text-xs font-bold text-white transition hover:brightness-110 active:scale-98 shadow-md"
              style={{ backgroundColor: accentColor }}
            >
              {isEditing ? 'Save Goal Modifications' : 'Create Task Goal'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
