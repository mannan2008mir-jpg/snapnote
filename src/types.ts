export type Priority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  type: 'task';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string; // Hex color or Tailwind glass color class
  createdAt: string;
  type: 'note';
}

export interface UserProfile {
  name: string;
  onboardingCompleted: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
