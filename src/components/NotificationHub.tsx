/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { playAlarmSound, stopAlarmSound } from '../lib/alarmHelper';
import { Bell, BellRing, Volume2, VolumeX, AlertTriangle, Clock } from 'lucide-react';

interface ActiveAlarm {
  reminderId: string;
  taskId: string;
  taskTitle: string;
  message: string;
  time: string;
}

export default function NotificationHub() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { reminders, tasks, markReminderTriggered, addReminder, cardColor, fgColor, accentColor } = context;
  const [activeAlarm, setActiveAlarm] = useState<ActiveAlarm | null>(null);
  const [toastNotification, setToastNotification] = useState<{ id: string; message: string; title: string } | null>(null);

  useEffect(() => {
    // Check reminders every second
    const interval = setInterval(() => {
      const now = new Date();
      const nowStr = now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"

      reminders.forEach((r) => {
        if (!r.triggered) {
          const reminderDate = new Date(r.reminderTime);
          
          // Trigger if current time is equal to or past the reminder time
          if (now >= reminderDate) {
            const task = tasks.find((t) => t.id === r.taskId);
            const title = task ? task.title : 'Scheduled Task';
            const message = r.message || 'Time to complete your scheduled task!';

            // Mark triggered immediately in context to prevent double fire
            markReminderTriggered(r.id);

            if (r.notificationType === 'alarm' || r.notificationType === 'both') {
              setActiveAlarm({
                reminderId: r.id,
                taskId: r.taskId,
                taskTitle: title,
                message: message,
                time: r.reminderTime,
              });
              // Sound the physical synthesized alarm
              playAlarmSound();
            }

            if (r.notificationType === 'toast' || r.notificationType === 'both') {
              setToastNotification({
                id: r.id,
                title: title,
                message: message,
              });
              // Auto hide toast after 8 seconds
              setTimeout(() => {
                setToastNotification(null);
              }, 8000);
            }
          }
        }
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [reminders, tasks, markReminderTriggered]);

  const handleDismiss = () => {
    stopAlarmSound();
    setActiveAlarm(null);
  };

  const handleSnooze = () => {
    if (!activeAlarm) return;
    
    stopAlarmSound();
    
    // Schedule a new reminder for 5 minutes in the future
    const now = new Date();
    const snoozeTime = new Date(now.getTime() + 5 * 60 * 1000);
    const yyyy = snoozeTime.getFullYear();
    const mm = String(snoozeTime.getMonth() + 1).padStart(2, '0');
    const dd = String(snoozeTime.getDate()).padStart(2, '0');
    const hh = String(snoozeTime.getHours()).padStart(2, '0');
    const min = String(snoozeTime.getMinutes()).padStart(2, '0');

    addReminder(
      activeAlarm.taskId,
      `${yyyy}-${mm}-${dd}T${hh}:${min}`,
      'both',
      `Snoozed: ${activeAlarm.message}`
    );

    setActiveAlarm(null);
  };

  return (
    <>
      {/* Toast Notification Container */}
      {toastNotification && (
        <div 
          id="toast-notification-banner"
          className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-4 rounded-xl border border-blue-500/30 p-4 shadow-2xl backdrop-blur-md animate-bounce"
          style={{ backgroundColor: cardColor, color: fgColor }}
        >
          <div className="rounded-full bg-blue-500/20 p-2 text-blue-400">
            <BellRing className="h-6 w-6 animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Reminder: {toastNotification.title}</h4>
            <p className="mt-1 text-xs opacity-80">{toastNotification.message}</p>
          </div>
          <button 
            onClick={() => setToastNotification(null)}
            className="text-xs font-semibold opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Full-Screen Interactive Alarm Overlay */}
      {activeAlarm && (
        <div 
          id="alarm-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <div 
            className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 border-red-500/50 p-6 text-center shadow-[0_0_50px_rgba(239,68,68,0.3)] animate-pulse"
            style={{ backgroundColor: cardColor, color: fgColor }}
          >
            {/* Header Red Indicator Bar */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />

            <div className="mt-4 flex justify-center">
              <div className="rounded-full bg-red-500/20 p-4 text-red-500 animate-bounce">
                <Bell className="h-12 w-12" />
              </div>
            </div>

            <h2 className="mt-4 text-2xl font-black tracking-tight text-red-500">
              ALARM TRIGGERED!
            </h2>

            <div className="mt-6 space-y-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                <AlertTriangle className="h-3 w-3" /> Due Now
              </span>
              <h3 className="text-xl font-bold">{activeAlarm.taskTitle}</h3>
              <p className="text-sm font-medium opacity-85 px-4">
                "{activeAlarm.message}"
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                onClick={handleSnooze}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-700/60 py-3 text-sm font-bold transition hover:bg-slate-700 hover:scale-102"
              >
                <Clock className="h-4 w-4" /> Snooze 5m
              </button>
              
              <button
                onClick={handleDismiss}
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700 hover:scale-102"
              >
                <VolumeX className="h-4 w-4" /> Dismiss Alarm
              </button>
            </div>

            <p className="mt-6 text-2xs font-mono opacity-50">
              Triggered at: {new Date(activeAlarm.time).toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
