import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, AlertCircle } from 'lucide-react';
import { Note } from '../types';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: Omit<Note, 'id' | 'createdAt' | 'type'>) => void;
  currentNote?: Note | null;
  theme: 'dark' | 'light';
}

const COLOR_TEMPLATES = [
  { id: 'purple', name: 'Violet Glow', classes: 'from-pink-500/20 to-purple-500/20 border-purple-500/30' },
  { id: 'amber', name: 'Sol Amber', classes: 'from-amber-500/20 to-yellow-500/20 border-yellow-500/30' },
  { id: 'emerald', name: 'Zen Emerald', classes: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30' },
  { id: 'rose', name: 'Lustre Rose', classes: 'from-pink-500/25 to-rose-450/20 border-rose-400/30' },
];

export default function NoteModal({ isOpen, onClose, onSave, currentNote, theme }: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_TEMPLATES[0].classes);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setSelectedColor(currentNote.color);
    } else {
      setTitle('');
      setContent('');
      setSelectedColor(COLOR_TEMPLATES[0].classes);
    }
    setErrors({});
  }, [currentNote, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; content?: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!content.trim()) newErrors.content = 'Content is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      color: selectedColor,
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
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h2 className={`text-xl font-bold font-display ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>
                  {currentNote ? 'Edit Note' : 'Capture Quick Note'}
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
                  Note Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                  }}
                  placeholder="Summarize your thought..."
                  maxLength={40}
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
                  Content / Insights *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
                  }}
                  placeholder="Capture ideas, research logs, or snippets..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-2xl bg-white/5 border text-sm focus:outline-hidden focus:ring-2 focus:ring-purple-400/20 transition-all resize-none ${
                    errors.content ? 'border-rose-500/50 focus:border-rose-400' : 'border-white/10 focus:border-purple-400/70'
                  } ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}
                />
                {errors.content && (
                  <span className="text-xs text-rose-400 font-medium mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.content}
                  </span>
                )}
              </div>

              {/* Pad Color Template Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Fluid Glass Backing
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {COLOR_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setSelectedColor(tpl.classes)}
                      className={`relative overflow-hidden py-3 text-2xs md:text-xs text-zinc-200 capitalize rounded-xl transition-all border cursor-pointer bg-linear-to-br ${tpl.classes} ${
                        selectedColor === tpl.classes
                          ? 'ring-2 ring-purple-400 scale-102 border-white/40'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {tpl.name}
                    </button>
                  ))}
                </div>
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
                  {currentNote ? 'Update Note' : 'Pin Note'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
