import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ClipboardList } from 'lucide-react';
import { DEFAULT_AVATARS } from '../data';

interface SplashOnboardingProps {
  onComplete: (name: string, avatar: string) => void;
  existingUser: { name: string; avatar: string; completed: boolean } | null;
}

export default function SplashOnboarding({ onComplete, existingUser }: SplashOnboardingProps) {
  const [step, setStep] = useState<'splash' | 'onboard'>('splash');
  const [userName, setUserName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('⚡');
  const [error, setError] = useState('');

  useEffect(() => {
    // If user already exists, show splash momentarily then automatically complete
    if (existingUser && existingUser.completed) {
      const timer = setTimeout(() => {
        onComplete(existingUser.name, existingUser.avatar);
      }, 1800);
      return () => clearTimeout(timer);
    } else {
      // If no user exists, show splash for 1.5 seconds then transit to onboard
      const timer = setTimeout(() => {
        setStep('onboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [existingUser, onComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setError('Please type your nickname to begin!');
      return;
    }
    setError('');
    onComplete(userName.trim(), selectedAvatar);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <motion.div
            key="splash"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center flex flex-col items-center"
          >
            {/* Logo/Icon inside interactive bubble */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 4, -4, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 rounded-3xl bg-linear-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/20 mb-6 border border-white/20 relative"
            >
              <div className="absolute inset-0.5 rounded-[22px] bg-white/10 backdrop-blur-xs"></div>
              <ClipboardList className="w-12 h-12 text-white relative z-10" />
            </motion.div>

            {/* Glowing Text */}
            <motion.h1 
              initial={{ letterSpacing: '0.1em', opacity: 0 }}
              animate={{ letterSpacing: '0.02em', opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl font-extrabold font-display text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-yellow-300 drop-shadow-md"
            >
              SnapNote
            </motion.h1>
            
            <p className="text-zinc-400 mt-2 font-sans font-normal tracking-wide text-sm max-w-xs sm:max-w-md">
              Where mind strikes insight & projects find flow.
            </p>

            {/* Micro loading pill / indicator */}
            <div className="mt-8 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
              <span>Loading workspace...</span>
            </div>
          </motion.div>
        )}

        {step === 'onboard' && (
          <motion.div
            key="onboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Ambient blur circle */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-yellow-400/5 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-semibold rounded-full border border-purple-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Onboarding Setup</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Personalize SnapNote
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xs">
                Tell us your name and customize your avatar emoji to design your local workspace.
              </p>

              <form onSubmit={handleSubmit} className="w-full mt-6 space-y-5 text-left">
                {/* Name Input */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-2">
                    Nickname / Display Name
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="e.g., Alex"
                    maxLength={15}
                    className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-hidden focus:border-purple-400/70 focus:ring-2 focus:ring-purple-400/20 transition-all font-sans text-sm"
                  />
                  {error && (
                    <span className="text-rose-400 text-xs mt-1 block font-medium">
                      {error}
                    </span>
                  )}
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-2">
                    Select Avatar Emoji
                  </label>
                  <div className="grid grid-cols-5 gap-2.5">
                    {DEFAULT_AVATARS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedAvatar(emoji)}
                        className={`text-xl p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                          selectedAvatar === emoji
                            ? 'bg-purple-500/20 border-purple-400 scale-110 shadow-lg'
                            : 'bg-white/5 border-transparent hover:bg-white/10'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Enter Workspace Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-xl shadow-purple-500/10 cursor-pointer hover:neon-glow transition-all active:scale-98"
                >
                  Enter Workspace
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
