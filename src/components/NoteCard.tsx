import { motion } from 'motion/react';
import { Trash2, Edit3, Sparkles } from 'lucide-react';
import { Note } from '../types';

interface NoteCardProps {
  key?: string;
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  theme: 'dark' | 'light';
}

export default function NoteCard({ note, onEdit, onDelete, theme }: NoteCardProps) {
  const formattedDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recent';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className={`relative rounded-3xl p-5 border flex flex-col justify-between h-full group bg-linear-to-br ${note.color} transition-all`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <h3 className={`text-base font-bold font-display truncate ${
            theme === 'dark' ? 'text-white' : 'text-zinc-800'
          }`}>
            {note.title}
          </h3>
          <Sparkles className="w-3.5 h-3.5 opacity-40 shrink-0" />
        </div>

        <p className={`text-xs sm:text-sm font-sans whitespace-pre-wrap leading-relaxed break-words ${
          theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'
        }`}>
          {note.content}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-wider text-zinc-400">
          {formattedDate(note.createdAt)}
        </span>

        {/* Note Action Buttons */}
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            title="Edit Note"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-purple-400 hover:bg-white/5 transition-all cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            title="Delete Note"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
