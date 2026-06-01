import { motion } from 'motion/react';
import { ClipboardList, CheckCircle, Clock, Percent, Award, Sparkles } from 'lucide-react';

interface DashboardProps {
  total: number;
  completed: number;
  pending: number;
  userName: string;
  userAvatar: string;
  theme: 'dark' | 'light';
}

export default function Dashboard({ total, completed, pending, userName, userAvatar, theme }: DashboardProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // SVG parameters for progress ring
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Adaptive display texts based on performance
  const getMotivationalMessage = () => {
    if (total === 0) return "Create your first task to plan your day!";
    if (percentage === 100) return "Masterful! Creative energy fully realized.";
    if (percentage >= 75) return "Spectacular pace! You’re crushing it today.";
    if (percentage >= 50) return "Excellent progress. Keep pushing through!";
    if (percentage > 0) return "Off to a strong start, one block at a time.";
    return "Ready to kick off? Let’s check off that first goal.";
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Profile-Level Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-bounce duration-1000">{userAvatar}</span>
            <h1 className={`text-2xl sm:text-3xl font-extrabold font-display tracking-tight leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-zinc-800'
            }`}>
              Welcome back, {userName}!
            </h1>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm font-sans mt-1">
            Today is Monday, June 1, 2026. {getMotivationalMessage()}
          </p>
        </div>

        {/* Premium Achievement Badge */}
        {percentage >= 50 && total > 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${
              percentage === 100 
                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' 
                : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{percentage === 100 ? 'Peak Creator status' : 'Flow state in progress'}</span>
          </motion.div>
        )}
      </div>

      {/* Grid containing Dashboard Metrics - Bento-styled */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tasks Card */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all ${
          theme === 'dark' ? 'glass-panel hover:border-white/10' : 'glass-light hover:border-purple-200'
        }`}>
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shadow-xs">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Total Goals</span>
            <span className={`text-xl font-bold font-display ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>
              {total}
            </span>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all ${
          theme === 'dark' ? 'glass-panel hover:border-white/10' : 'glass-light hover:border-indigo-200'
        }`}>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-xs">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Completed</span>
            <span className={`text-xl font-bold font-display ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>
              {completed}
            </span>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all ${
          theme === 'dark' ? 'glass-panel hover:border-white/10' : 'glass-light hover:border-amber-200'
        }`}>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">In Progress</span>
            <span className={`text-xl font-bold font-display ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>
              {pending}
            </span>
          </div>
        </div>

        {/* Productivity Circle SVG Stats Card */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
          theme === 'dark' ? 'glass-panel hover:border-white/10' : 'glass-light hover:border-yellow-200'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 shadow-xs">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">Workspace Velocity</span>
              <span className={`text-xl font-bold font-display ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>
                {percentage}%
              </span>
            </div>
          </div>

          {/* Interactive Progress Ring */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background Circle */}
              <circle
                cx="24"
                cy="24"
                r={radius}
                className="stroke-zinc-800/10"
                strokeWidth="4"
                fill="transparent"
              />
              {/* Foreground Progress Circle */}
              <motion.circle
                cx="24"
                cy="24"
                r={radius}
                stroke={theme === 'dark' ? '#CA72FF' : '#a855f7'}
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-center select-none font-sans">
              {percentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
