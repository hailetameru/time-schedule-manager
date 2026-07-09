/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  userId: string;
  fullName: string;
  email: string;
  profileImage?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind class or hex color
}

export interface Task {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
}

export interface Schedule {
  id: string;
  userId: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  description?: string;
}

export interface Reminder {
  id: string;
  taskId: string;
  reminderTime: string; // YYYY-MM-DDTHH:MM
  notificationType: 'alarm' | 'toast' | 'both';
  triggered: boolean;
  message?: string;
}

export interface ThemeSettings {
  backgroundColor: string; // e.g. "#0f172a" (slate-900)
  foregroundColor: string; // e.g. "#ffffff" (white)
  cardBackgroundColor: string; // e.g. "#1e293b" (slate-800)
  textColor: string; // e.g. "#e2e8f0" (slate-200)
  accentColor: string; // e.g. "#3b82f6" (blue-500)
}
