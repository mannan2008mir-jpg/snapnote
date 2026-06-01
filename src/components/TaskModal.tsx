import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clipboard, AlertCircle } from 'lucide-react';
import { Task, Priority } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'type'>) => void;
  currentTask?: Task | null;
  theme: 'dark' | 'light';
}

export default function TaskModal({ isOpen, onClose, onSave, currentTask, theme }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('2026-06-01');
  const [errors, setErrors] = useState<{ title?: string }>({});

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description);
      setPriority(currentTask.priority);
      setDueDate(currentTask.dueDate);
    } else {
      // Default reset
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('2026-06-01');
    }
    setErrors({});
  }, [currentTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors({ title: 'Task title is required.' });
      return;
    }
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
    });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={handleBackdropClick}
          className="fixed inset-0 z-150 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full max-w-lg rounded-3xl p-6 border relative shadow-2xl overflow-hidden ${
              theme === 'dark' 
                ? 'glass-panel border-white/10' 
                : 'glass-light border-purple-300'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Clipboard className="w-5 h-5 text-purple-400" />
                <h2 className={`text-xl font-bold font-display ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>
                  {currentTask ? 'Edit Task' : 'Add New Task'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({});
                  }}
                  placeholder="What needs to be done?"
                  maxLength={50}
                  className={`w-full px-4 py-3 rounded-2xl bg-white/5 border text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-400/20 transition-all ${
                    errors.title ? 'border-rose-500/50 focus:border-rose-400' : 'border-white/10 focus:border-purple-400/70'
                  } ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}
                />
                {errors.title && (
                  <span className="text-xs text-rose-400 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.title}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional notes or subtasks..."
                  rows={3}
                  className={`w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm focus:outline-hidden focus:border-purple-400/70 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none ${
                    theme === 'dark' ? 'text-white' : 'text-zinc-800'
                  }`}
                />
              </div>

              {/* Priority Selector Grid */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Priority level
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                    const colorStyles = {
                      low: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20',
                      medium: 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20',
                      high: 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                    };
                    const selectedStyles = {
                      low: 'bg-emerald-500/30 border-emerald-400 ring-2 ring-emerald-500/20',
                      medium: 'bg-amber-500/30 border-amber-400 ring-2 ring-amber-500/20',
                      high: 'bg-rose-500/30 border-rose-400 ring-2 ring-rose-500/20'
                    };

                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-2 rounded-xl border text-xs capitalize font-semibold transition-all cursor-pointer ${
                          priority === p ? selectedStyles[p] : colorStyles[p]
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Due Date Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm focus:outline-hidden focus:border-purple-400/70 focus:ring-2 focus:ring-purple-400/20 transition-all ${
                    theme === 'dark' ? 'text-white [color-scheme:dark]' : 'text-zinc-800'
                  }`}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 py-3 rounded-2xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    theme === 'dark' 
                      ? 'border-white/10 hover:bg-white/5 text-zinc-300' 
                      : 'border-purple-200 hover:bg-purple-50 text-zinc-600'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/10 cursor-pointer active:scale-98 transition-all"
                >
                  {currentTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
