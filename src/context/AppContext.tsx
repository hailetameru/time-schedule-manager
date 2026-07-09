/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Task, Schedule, Category, Reminder } from '../types';
import { DEFAULT_CATEGORIES, getInitialTasks, getInitialSchedules, getInitialReminders } from '../lib/mockData';

interface AppContextType {
  user: User | null;
  tasks: Task[];
  schedules: Schedule[];
  categories: Category[];
  reminders: Reminder[];
  bgColor: string;
  fgColor: string;
  cardColor: string;
  accentColor: string;
  login: (email: string, nameForDemo?: string) => boolean;
  register: (fullName: string, email: string) => boolean;
  logout: () => void;
  updateProfile: (fullName: string, email: string, img?: string) => void;
  setThemeColors: (bg: string, fg: string, card: string, accent: string) => void;
  resetThemeColors: () => void;
  addTask: (task: Omit<Task, 'id' | 'userId'>) => Task;
  updateTask: (id: string, updated: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addSchedule: (schedule: Omit<Schedule, 'id' | 'userId'>) => Schedule;
  updateSchedule: (id: string, updated: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  addReminder: (taskId: string, reminderTime: string, notificationType: 'alarm' | 'toast' | 'both', message: string) => void;
  deleteReminder: (id: string) => void;
  markReminderTriggered: (id: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Authentication State
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('tsm_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Categories State
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('tsm_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tsm_tasks');
    return saved ? JSON.parse(saved) : getInitialTasks();
  });

  // Schedules State
  const [schedules, setSchedules] = useState<Schedule[]>(() => {
    const saved = localStorage.getItem('tsm_schedules');
    return saved ? JSON.parse(saved) : getInitialSchedules();
  });

  // Reminders State
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('tsm_reminders');
    return saved ? JSON.parse(saved) : getInitialReminders();
  });

  // Theme Settings (Custom Dynamic Background and Foreground)
  const [bgColor, setBgColor] = useState<string>(() => {
    return localStorage.getItem('tsm_bgColor') || '#0a0b0d'; // Sophisticated Dark Bg
  });
  const [fgColor, setFgColor] = useState<string>(() => {
    return localStorage.getItem('tsm_fgColor') || '#f3f4f6'; // Sophisticated Dark Fg
  });
  const [cardColor, setCardColor] = useState<string>(() => {
    return localStorage.getItem('tsm_cardColor') || '#14161c'; // Sophisticated Dark Card
  });
  const [accentColor, setAccentColor] = useState<string>(() => {
    return localStorage.getItem('tsm_accentColor') || '#d4af37'; // Sophisticated Dark Accent
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('tsm_user', user ? JSON.stringify(user) : '');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tsm_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('tsm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('tsm_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('tsm_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Handle Logins
  const login = (email: string, nameForDemo?: string): boolean => {
    const defaultUser: User = {
      userId: 'u-1',
      fullName: nameForDemo || 'Demo User',
      email: email,
      createdAt: new Date().toISOString(),
    };
    setUser(defaultUser);
    return true;
  };

  const register = (fullName: string, email: string): boolean => {
    const newUser: User = {
      userId: `u-${Date.now()}`,
      fullName,
      email,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (fullName: string, email: string, img?: string) => {
    if (user) {
      setUser({
        ...user,
        fullName,
        email,
        profileImage: img || user.profileImage,
      });
    }
  };

  // Theme modifiers
  const setThemeColors = (bg: string, fg: string, card: string, accent: string) => {
    setBgColor(bg);
    setFgColor(fg);
    setCardColor(card);
    setAccentColor(accent);
    localStorage.setItem('tsm_bgColor', bg);
    localStorage.setItem('tsm_fgColor', fg);
    localStorage.setItem('tsm_cardColor', card);
    localStorage.setItem('tsm_accentColor', accent);
  };

  const resetThemeColors = () => {
    setThemeColors('#0a0b0d', '#f3f4f6', '#14161c', '#d4af37');
  };

  // Task Handlers
  const addTask = (taskData: Omit<Task, 'id' | 'userId'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
      userId: user?.userId || 'u-1',
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (id: string, updated: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    // Clear associated reminders
    setReminders((prev) => prev.filter((r) => r.taskId !== id));
  };

  // Schedule Handlers
  const addSchedule = (schedData: Omit<Schedule, 'id' | 'userId'>): Schedule => {
    const newSched: Schedule = {
      ...schedData,
      id: `s-${Date.now()}`,
      userId: user?.userId || 'u-1',
    };
    setSchedules((prev) => [newSched, ...prev]);
    return newSched;
  };

  const updateSchedule = (id: string, updated: Partial<Schedule>) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const deleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  // Category Handlers
  const addCategory = (name: string, color: string) => {
    const newCat: Category = {
      id: `c-${Date.now()}`,
      name,
      color,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Reminder Handlers
  const addReminder = (taskId: string, reminderTime: string, notificationType: 'alarm' | 'toast' | 'both', message: string) => {
    const newReminder: Reminder = {
      id: `r-${Date.now()}`,
      taskId,
      reminderTime,
      notificationType,
      triggered: false,
      message,
    };
    setReminders((prev) => [...prev, newReminder]);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const markReminderTriggered = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, triggered: true } : r))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        tasks,
        schedules,
        categories,
        reminders,
        bgColor,
        fgColor,
        cardColor,
        accentColor,
        login,
        register,
        logout,
        updateProfile,
        setThemeColors,
        resetThemeColors,
        addTask,
        updateTask,
        deleteTask,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        addCategory,
        deleteCategory,
        addReminder,
        deleteReminder,
        markReminderTriggered,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
