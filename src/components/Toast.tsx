import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { Toast as ToastType } from '../types';

interface ToastProps {
  key?: string;
  toast: ToastType;
  onClose: (id: string) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-500/20 bg-emerald-500/5',
    info: 'border-blue-500/20 bg-blue-500/5',
    warning: 'border-amber-500/20 bg-amber-500/5',
    error: 'border-rose-500/20 bg-rose-500/5',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel border ${borderColors[toast.type]} shadow-xl max-w-sm w-[90vw] pointer-events-auto`}
    >
      {icons[toast.type]}
      <p className="text-xs sm:text-sm text-zinc-100 font-sans font-medium flex-1 line-clamp-2">
        {toast.message}
      </p>
      <button
        onClick={() => onClose(toast.id)}
        className="p-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

interface ToastListProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export function ToastList({ toasts, onRemove }: ToastListProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-100 flex flex-col gap-2 pointer-events-none items-center">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}
