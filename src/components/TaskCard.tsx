import { motion } from 'motion/react';
import { Calendar, Trash2, Edit3, CheckCircle2, Circle, AlertCircle as AlertIcon } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  key?: string;
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  theme: 'dark' | 'light';
}

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete, theme }: TaskCardProps) {
  // Determine due date status
  const todayStr = '2026-06-01'; // Matches current system metadata anchor
  const isOverdue = !task.completed && task.dueDate < todayStr;
  const isDueToday = !task.completed && task.dueDate === todayStr;

  const priorityColors = {
    high: {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      text: 'text-rose-400',
    },
    medium: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      text: 'text-amber-400',
    },
    low: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      text: 'text-emerald-400',
    }
  };

  const formattedDate = (dateStr: string) => {
    if (!dateStr) return 'No due date';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = parts[0];
    const month = months[parseInt(parts[1], 10) - 1];
    const day = parseInt(parts[2], 10);
    return `${month} ${day}, ${year}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className={`relative rounded-2xl p-5 border transition-all ${
        theme === 'dark' 
          ? 'glass-panel hover:border-white/15' 
          : 'glass-light hover:border-purple-300'
      } ${task.completed ? 'opacity-70' : ''}`}
    >
      {/* Decorative colored glow bar based on priority */}
      <div className={`absolute top-4 left-0 w-1 h-12 rounded-r-full ${
        task.completed 
          ? 'bg-zinc-500/40' 
          : task.priority === 'high' 
            ? 'bg-rose-500' 
            : task.priority === 'medium' 
              ? 'bg-amber-500' 
              : 'bg-emerald-500'
      }`} />

      <div className="flex items-start gap-4">
        {/* Status Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className="mt-1 flex-shrink-0 cursor-pointer text-zinc-400 hover:text-purple-400 transition-colors focus:outline-hidden"
        >
          {task.completed ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
            >
              <CheckCircle2 className="w-5.5 h-5.5 text-purple-400 fill-purple-400/10" />
            </motion.div>
          ) : (
            <Circle className="w-5.5 h-5.5 text-zinc-400 hover:text-purple-400 transition-colors" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            {/* Priority Badge */}
            <span className={`text-[10px] font-bold font-sans uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityColors[task.priority].badge}`}>
              {task.priority} Priority
            </span>

            {/* Overdue Indicator */}
            {isOverdue && (
              <span className="flex items-center gap-1 text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider">
                <AlertIcon className="w-3 h-3" />
                Overdue
              </span>
            )}

            {/* Due Today Indicator */}
            {isDueToday && (
              <span className="flex items-center gap-1 text-[10px] bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full font-sans font-bold uppercase tracking-wider">
                🎁 Due Today
              </span>
            )}
          </div>

          <h3 className={`text-base font-semibold font-display truncate leading-tight ${
            task.completed 
              ? 'line-through text-zinc-500' 
              : theme === 'dark' ? 'text-white' : 'text-zinc-800'
          }`}>
            {task.title}
          </h3>

          <p className={`mt-1 text-xs font-sans line-clamp-2 leading-relaxed ${
            task.completed 
              ? 'text-zinc-500' 
              : theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            {task.description || 'No description provided.'}
          </p>

          {/* Due date display */}
          <div className="mt-3.5 flex items-center gap-1.5 text-xs font-sans text-zinc-500">
            <Calendar className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-400' : isDueToday ? 'text-yellow-400' : 'text-zinc-400'}`} />
            <span className={`${isOverdue ? 'text-rose-400/90 font-medium' : isDueToday ? 'text-yellow-400 font-medium' : ''}`}>
              {formattedDate(task.dueDate)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 ml-2">
          <button
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="p-2 rounded-xl text-zinc-400 hover:text-purple-400 hover:bg-purple-500/10 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            title="Delete Task"
            className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
