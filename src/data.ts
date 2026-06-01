import { Task, Note } from './types';

// Let's generate a dynamic past date and some future dates for pristine default tasks
const today = new Date();
const formatDateOffset = (offsetDays: number) => {
  const d = new Date();
  d.setDate(today.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Design SnapNote Brand Assets',
    description: 'Sketch out liquid glass logos and choose high contrast color palettes for neon highlights.',
    priority: 'high',
    dueDate: formatDateOffset(1),
    completed: true,
    createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'task',
  },
  {
    id: 'task-2',
    title: 'Review Project Launch Metrics',
    description: 'Check active retention data, page load times, and optimize animation rendering profiles.',
    priority: 'medium',
    dueDate: formatDateOffset(0), // Today
    completed: false,
    createdAt: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    type: 'task',
  },
  {
    id: 'task-3',
    title: 'Research Tailwind v4 Utilities',
    description: 'Explore CSS-based theme changes, new responsive containers, and grid layouts.',
    priority: 'low',
    dueDate: formatDateOffset(3),
    completed: false,
    createdAt: today.toISOString(),
    type: 'task',
  },
  {
    id: 'task-4',
    title: 'Launch Feedback Survey',
    description: 'Distribute qualitative survey to top early adopters to discover friction points.',
    priority: 'high',
    dueDate: formatDateOffset(2),
    completed: false,
    createdAt: today.toISOString(),
    type: 'task',
  },
  {
    id: 'task-5',
    title: 'Set Up Local Storage Sync',
    description: 'Write robust fallback engines that capture incremental edits to prevent work loss.',
    priority: 'medium',
    dueDate: formatDateOffset(-1), // Yesterday
    completed: true,
    createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'task',
  }
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: '🚀 Vision & Values',
    content: 'Create tools that combine ultimate performance with highly kinetic and sensory user experiences. Liquid glass, smooth frames, fast interactions.',
    color: 'from-pink-500/20 to-purple-500/20 border-purple-500/30',
    createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'note',
  },
  {
    id: 'note-2',
    title: '💡 Idea: Kinetic Audio Feedback',
    content: 'Consider adding low-frequency click sounds to completed checkboxes. Gives a satisfying dopamine spike on completion!',
    color: 'from-amber-500/20 to-yellow-500/20 border-yellow-500/30',
    createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'note',
  },
  {
    id: 'note-3',
    title: '🔑 Dev Quick Commands',
    content: 'npm run dev\nnpm run build\nnpm run lint\nAlways check console for frame-rate optimizations.',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    createdAt: today.toISOString(),
    type: 'note',
  }
];

export const DEFAULT_AVATARS = [
  '⚡', '✨', '🏆', '💎', '🚀', '🔥', '🎨', '🎯', '🥑', '👾'
];
