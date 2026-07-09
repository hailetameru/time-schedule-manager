/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Category, Task, Schedule, Reminder } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Work', color: '#3b82f6' }, // Blue
  { id: '2', name: 'Study', color: '#6366f1' }, // Indigo
  { id: '3', name: 'Meeting', color: '#ef4444' }, // Red
  { id: '4', name: 'Exercise', color: '#10b981' }, // Emerald
  { id: '5', name: 'Shopping', color: '#f59e0b' }, // Amber
  { id: '6', name: 'Personal', color: '#8b5cf6' }, // Purple
];

const getTodayDateStr = (offsetDays = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getInitialTasks = (): Task[] => [
  {
    id: 't-1',
    userId: 'u-1',
    categoryId: '4', // Exercise
    title: 'Morning Yoga & Cardio',
    description: 'Start the day with 30 mins yoga followed by light jog.',
    date: getTodayDateStr(0),
    startTime: '07:30',
    endTime: '08:15',
    priority: 'medium',
    status: 'completed',
  },
  {
    id: 't-2',
    userId: 'u-1',
    categoryId: '1', // Work
    title: 'Team Standup & Scrum Board review',
    description: 'Sync with product owners and developers regarding release sprint.',
    date: getTodayDateStr(0),
    startTime: '10:00',
    endTime: '10:30',
    priority: 'high',
    status: 'pending',
  },
  {
    id: 't-3',
    userId: 'u-1',
    categoryId: '3', // Meeting
    title: 'Client Demo: Time Management app',
    description: 'Demonstrate custom background/foreground color features, sound alarms and notification capabilities.',
    date: getTodayDateStr(0),
    startTime: '14:00',
    endTime: '15:00',
    priority: 'high',
    status: 'pending',
  },
  {
    id: 't-4',
    userId: 'u-1',
    categoryId: '2', // Study
    title: 'Learn Web Audio API & Audio Contexts',
    description: 'Read md docs on synthesizing sound waves dynamically to create browser-native alarm clocks.',
    date: getTodayDateStr(0),
    startTime: '16:30',
    endTime: '17:30',
    priority: 'medium',
    status: 'pending',
  },
  {
    id: 't-5',
    userId: 'u-1',
    categoryId: '6', // Personal
    title: 'Pick up anniversary present & flowers',
    description: 'Call florist to confirm order before driving over.',
    date: getTodayDateStr(1), // Tomorrow
    startTime: '18:00',
    endTime: '18:45',
    priority: 'high',
    status: 'pending',
  },
  {
    id: 't-6',
    userId: 'u-1',
    categoryId: '5', // Shopping
    title: 'Weekly grocery replenishments',
    description: 'Organic milk, apples, kale, chicken breast, and whole wheat sourdough.',
    date: getTodayDateStr(1), // Tomorrow
    startTime: '12:00',
    endTime: '13:00',
    priority: 'low',
    status: 'pending',
  },
];

export const getInitialSchedules = (): Schedule[] => [
  {
    id: 's-1',
    userId: 'u-1',
    title: 'Q3 Goal Planning Sprint',
    startDate: getTodayDateStr(-1),
    endDate: getTodayDateStr(1),
    description: 'Draft OKRs and high-level milestones for next quarter.',
  },
  {
    id: 's-2',
    userId: 'u-1',
    title: 'Interactive Frontend Hackathon',
    startDate: getTodayDateStr(2),
    endDate: getTodayDateStr(4),
    description: 'Team competition to build stunning reactive dashboards.',
  }
];

export const getInitialReminders = (): Reminder[] => {
  // Set a default reminder for Task 3 to trigger slightly later or configure relative to now
  const now = new Date();
  const future = new Date(now.getTime() + 5 * 60 * 1000); // 5 mins from now
  const yyyy = future.getFullYear();
  const mm = String(future.getMonth() + 1).padStart(2, '0');
  const dd = String(future.getDate()).padStart(2, '0');
  const hh = String(future.getHours()).padStart(2, '0');
  const min = String(future.getMinutes()).padStart(2, '0');

  return [
    {
      id: 'r-1',
      taskId: 't-3',
      reminderTime: `${yyyy}-${mm}-${dd}T${hh}:${min}`,
      notificationType: 'both',
      triggered: false,
      message: 'Attention! client demo is about to start! Get screen sharing ready.'
    }
  ];
};
