import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Search, Sun, Moon, Sparkles, ClipboardList, BookOpen,
  LogOut, Clipboard, CheckSquare, Settings, Check, BellRing
} from 'lucide-react';

import { Task, Note, UserProfile, Toast as ToastType } from './types';
import { INITIAL_TASKS, INITIAL_NOTES } from './data';
import SplashOnboarding from './components/SplashOnboarding';
import { ToastList } from './components/Toast';
import TaskCard from './components/TaskCard';
import NoteCard from './components/NoteCard';
import Dashboard from './components/Dashboard';
import TaskModal from './components/TaskModal';
import NoteModal from './components/NoteModal';

export default function App() {
  // --- Persistent States ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [appReady, setAppReady] = useState(false);

  // --- UI Filter States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [currentSection, setCurrentSection] = useState<'tasks' | 'notes'>('tasks');

  // --- Modal States ---
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [currentEditTask, setCurrentEditTask] = useState<Task | null>(null);
  const [currentEditNote, setCurrentEditNote] = useState<Note | null>(null);

  // --- Toasts ---
  const [toasts, setToasts] = useState<ToastType[]>([]);

  // Add Toast Notification Helper
  const addToast = (message: string, type: ToastType['type'] = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Initialization & LocalStorage Loader ---
  useEffect(() => {
    try {
      // 1. Load Profile
      const storedProfile = localStorage.getItem('snapnote_profile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      }

      // 2. Load Tasks
      const storedTasks = localStorage.getItem('snapnote_tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks(INITIAL_TASKS);
        localStorage.setItem('snapnote_tasks', JSON.stringify(INITIAL_TASKS));
      }

      // 3. Load Notes
      const storedNotes = localStorage.getItem('snapnote_notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        setNotes(INITIAL_NOTES);
        localStorage.setItem('snapnote_notes', JSON.stringify(INITIAL_NOTES));
      }

      // 4. Load Theme
      const storedTheme = localStorage.getItem('snapnote_theme') as 'dark' | 'light';
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        // Default to dark for premium look
        setTheme('dark');
      }

      setAppReady(true);
    } catch {
      // Fallback
      setTasks(INITIAL_TASKS);
      setNotes(INITIAL_NOTES);
      setTheme('dark');
      setAppReady(true);
    }
  }, []);

  // Sync state helpers
  const saveTasksToLocalStorage = (updatedTasks: Task[]) => {
    try {
      localStorage.setItem('snapnote_tasks', JSON.stringify(updatedTasks));
    } catch (e) {
      console.error('Failed to persist tasks', e);
    }
  };

  const saveNotesToLocalStorage = (updatedNotes: Note[]) => {
    try {
      localStorage.setItem('snapnote_notes', JSON.stringify(updatedNotes));
    } catch (e) {
      console.error('Failed to persist notes', e);
    }
  };

  // --- Onboarding Completion Handler ---
  const handleOnboardingComplete = (name: string, avatar: string) => {
    const profile = { name, avatar, onboardingCompleted: true };
    setUserProfile(profile);
    localStorage.setItem('snapnote_profile', JSON.stringify(profile));
    addToast(`Welcome to SnapNote, ${name}! Start planning standard days.`, 'success');
  };

  // --- Clear Profile / Reset All (Logout Option) ---
  const handleResetProfile = () => {
    if (window.confirm('Do you want to reset your local SnapNote profile or clear tasks? All local data will be archived.')) {
      localStorage.removeItem('snapnote_profile');
      localStorage.removeItem('snapnote_tasks');
      localStorage.removeItem('snapnote_notes');
      setUserProfile(null);
      setTasks(INITIAL_TASKS);
      setNotes(INITIAL_NOTES);
      addToast('Profile and workspace reset to factory configuration.', 'info');
    }
  };

  // --- Theme Toggler ---
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('snapnote_theme', newTheme);
    addToast(`Theme toggled to ${newTheme} mode.`, 'info');
  };

  // --- Task CRUD Modifiers ---
  const handleToggleTaskComplete = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextStatus = !t.completed;
        if (nextStatus) {
          addToast(`Goal complete: "${t.title}" (+20% velocity)`, 'success');
        } else {
          addToast(`Task marked as in progress.`, 'info');
        }
        return { ...t, completed: nextStatus };
      }
      return t;
    });
    setTasks(updated);
    saveTasksToLocalStorage(updated);
  };

  const handleCreateOrUpdateTask = (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'type'>) => {
    if (currentEditTask) {
      // Editing
      const updated = tasks.map((t) => {
        if (t.id === currentEditTask.id) {
          return { ...t, ...taskData };
        }
        return t;
      });
      setTasks(updated);
      saveTasksToLocalStorage(updated);
      addToast(`Task "${taskData.title}" updated successfully.`);
      setCurrentEditTask(null);
    } else {
      // Creating
      const newTask: Task = {
        id: `task-${Math.random().toString(36).substr(2, 9)}`,
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        type: 'task',
      };
      const updated = [newTask, ...tasks];
      setTasks(updated);
      saveTasksToLocalStorage(updated);
      addToast(`Task "${taskData.title}" captured!`);
    }
  };

  const handleDeleteTask = (id: string) => {
    const original = tasks.find((t) => t.id === id);
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    saveTasksToLocalStorage(updated);
    addToast(`Task "${original?.title || 'Goal'}" deleted.`, 'warning');
  };

  const handleEditTaskTrigger = (task: Task) => {
    setCurrentEditTask(task);
    setIsTaskModalOpen(true);
  };

  // --- Note CRUD Modifiers ---
  const handleCreateOrUpdateNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'type'>) => {
    if (currentEditNote) {
      // Editing
      const updated = notes.map((n) => {
        if (n.id === currentEditNote.id) {
          return { ...n, ...noteData };
        }
        return n;
      });
      setNotes(updated);
      saveNotesToLocalStorage(updated);
      addToast(`Note "${noteData.title}" saved.`);
      setCurrentEditNote(null);
    } else {
      // Creating
      const newNote: Note = {
        id: `note-${Math.random().toString(36).substr(2, 9)}`,
        ...noteData,
        createdAt: new Date().toISOString(),
        type: 'note',
      };
      const updated = [newNote, ...notes];
      setNotes(updated);
      saveNotesToLocalStorage(updated);
      addToast(`Pinned to thoughts: "${noteData.title}"`);
    }
  };

  const handleDeleteNote = (id: string) => {
    const original = notes.find((n) => n.id === id);
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveNotesToLocalStorage(updated);
    addToast(`Note "${original?.title || 'Idea'}" deleted.`, 'warning');
  };

  const handleEditNoteTrigger = (note: Note) => {
    setCurrentEditNote(note);
    setIsNoteModalOpen(true);
  };

  // --- Filtered Task & Note Selectors ---
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // 1. Search Query
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Status Type
      const matchStatus = filterType === 'all' 
        ? true 
        : filterType === 'completed' 
          ? t.completed 
          : !t.completed;

      // 3. Priority Level
      const matchPriority = priorityFilter === 'all'
        ? true
        : t.priority === priorityFilter;

      return matchSearch && matchStatus && matchPriority;
    });
  }, [tasks, searchQuery, filterType, priorityFilter]);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      return n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             n.content.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [notes, searchQuery]);

  // --- Statistics Computing ---
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  // --- Fallback Waiter ---
  if (!appReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"></div>
          <span className="text-xs text-zinc-500 font-mono">Calibrating glass frames...</span>
        </div>
      </div>
    );
  }

  // --- Splash Screen & Onboarding Routing ---
  if (!userProfile) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 text-white relative transition-all duration-300 liquid-mesh-dark">
        <SplashOnboarding onComplete={handleOnboardingComplete} existingUser={null} />
      </div>
    );
  }

  // --- App Content Render ---
  return (
    <div className={`min-h-screen relative transition-colors duration-300 overflow-x-hidden ${
      theme === 'dark' ? 'dark bg-[#0c0a10] text-white liquid-mesh-dark' : 'bg-zinc-50 text-zinc-900 liquid-mesh-light'
    }`}>
      {/* Immersive UI Gradient Glow layers */}
      <div className="absolute inset-x-0 top-0 h-[500px] pointer-events-none bg-radial from-purple-500/10 via-transparent to-transparent -z-10" />
      <div className="absolute inset-x-0 bottom-0 h-[500px] pointer-events-none bg-radial from-yellow-500/5 via-transparent to-transparent -z-10" />

      {/* Toast Alert Render Overlay */}
      <ToastList toasts={toasts} onRemove={removeToast} />

      {/* Main Responsive Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-6 relative z-10">
        
        {/* Top Header Section */}
        <header className="flex items-center justify-between pb-5 border-b border-white/5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-[#CA72FF] to-indigo-600 flex items-center justify-center neon-purple-glow border border-white/25">
              <Clipboard className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#CA72FF] font-display">
                Local Workspace
              </span>
              <h2 className={`text-xl font-extrabold pb-0.5 tracking-tight font-display leading-none ${
                theme === 'dark' ? 'text-white' : 'text-zinc-800'
              }`}>
                SnapNote
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Toggle for Dark/Light Mode */}
            <button
              onClick={toggleTheme}
              title={`Toggle to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/5 hover:bg-white/10 text-yellow-400'
                  : 'bg-white border-zinc-200 shadow-md hover:bg-zinc-50 text-zinc-700'
              }`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
            </button>

            {/* Logout/Reset Profile Button */}
            <button
              onClick={handleResetProfile}
              title="Reset SnapNote Profile"
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer hover:text-rose-400 ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/5 hover:bg-zinc-900 text-zinc-400'
                  : 'bg-white border-zinc-200 shadow-sm hover:bg-rose-50 text-zinc-600'
              }`}
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </header>

        {/* Bento Dashboard Statistics Section */}
        <section className="mb-8">
          <Dashboard
            total={stats.total}
            completed={stats.completed}
            pending={stats.pending}
            userName={userProfile.name}
            userAvatar={userProfile.avatar}
            theme={theme}
          />
        </section>

        {/* Dashboard Grid and Filter Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Sidebar controllers and fast tools (Desktop Only sidebar panels) */}
          <div className="lg:col-span-3 space-y-4">
            <div className={`p-4 rounded-3xl border ${
              theme === 'dark' ? 'glass-panel' : 'glass-light shadow-md'
            }`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3.5 px-1 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Focus Hub</span>
              </h3>

              {/* Tab Toggles: Tasks vs Notes */}
              <div className="space-y-1.5">
                <button
                  onClick={() => setCurrentSection('tasks')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    currentSection === 'tasks'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : 'border border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className="w-4.5 h-4.5" />
                    <span>My Tasks</span>
                  </div>
                  <span className="text-2xs bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/10 font-bold">
                    {tasks.length}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentSection('notes')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    currentSection === 'notes'
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      : 'border border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4.5 h-4.5" />
                    <span>Quick Notes</span>
                  </div>
                  <span className="text-2xs bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/10 font-bold">
                    {notes.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Action Block */}
            <div className={`p-4 rounded-3xl border hidden lg:block ${
              theme === 'dark' ? 'glass-panel' : 'glass-light shadow-md'
            }`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 px-1">
                Workspace Guide
              </h3>
              <p className="text-zinc-400 text-xs leading-relaxed px-1">
                All data is synchronized automatically with your secure localized browser sandboxed space ({userProfile.name} Mode). Avoid clearing caches to prevent loss of plans!
              </p>
            </div>
          </div>

          {/* MAIN CONTAINER: Task lists, Note grids, filters */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Search/Filter Controls Container */}
            <div className={`p-4 rounded-3xl border flex flex-col md:flex-row gap-4 items-center justify-between ${
              theme === 'dark' ? 'glass-panel' : 'glass-light shadow-md'
            }`}>
              {/* Search Element */}
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${currentSection}...`}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs focus:outline-hidden focus:border-purple-400/70 focus:ring-2 focus:ring-purple-400/10 transition-all ${
                    theme === 'dark' ? 'text-white' : 'text-zinc-800'
                  }`}
                />
              </div>

              {/* Dynamic Filter Section */}
              {currentSection === 'tasks' && (
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  {/* Status Filters Pill Toggle */}
                  <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/5">
                    {(['all', 'pending', 'completed'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1.5 rounded-xl text-2xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          filterType === type
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/10'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {/* Priority Filter Pill Selection */}
                  <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/5">
                    {(['all', 'high', 'medium', 'low'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setPriorityFilter(type)}
                        className={`px-3 py-1.5 rounded-xl text-2xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          priorityFilter === type
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/10'
                            : 'text-zinc-400 hover:text-red-300'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Tabs (For Mobile/Tablet Only selectors) */}
            <div className="flex lg:hidden gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
              <button
                onClick={() => setCurrentSection('tasks')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
                  currentSection === 'tasks'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Tasks ({tasks.length})
              </button>
              <button
                onClick={() => setCurrentSection('notes')}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
                  currentSection === 'notes'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Notes ({notes.length})
              </button>
            </div>

            {/* Dynamic Content Display List/Grid with Smooth Animation */}
            <AnimatePresence mode="wait">
              {currentSection === 'tasks' ? (
                <motion.div
                  key="tasks-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Task Count Details */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-mono text-zinc-400">
                      Showing {filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'}
                    </span>
                    
                    <button
                      onClick={() => {
                        setCurrentEditTask(null);
                        setIsTaskModalOpen(true);
                      }}
                      className="hidden sm:flex items-center gap-1.5 px-4 block py-1.5 rounded-full bg-purple-500 hover:bg-purple-400 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Task Goal</span>
                    </button>
                  </div>

                  {filteredTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggleComplete={handleToggleTaskComplete}
                          onEdit={handleEditTaskTrigger}
                          onDelete={handleDeleteTask}
                          theme={theme}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Beautiful Empty State */
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`py-12 px-6 rounded-3xl border text-center flex flex-col items-center justify-center ${
                        theme === 'dark' ? 'glass-panel' : 'glass-light shadow-md'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-zinc-800/10 border border-zinc-800/15 flex items-center justify-center mb-4 text-purple-400 text-2xl">
                        🎯
                      </div>
                      <h4 className={`text-base font-bold font-display ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>
                        All Cleared!
                      </h4>
                      <p className="text-zinc-400 text-xs max-w-xs mt-1">
                        There are no tasks that match your search filters. Take a clean deep breath or create one.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilterType('all');
                          setPriorityFilter('all');
                        }}
                        className="mt-4 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-2xs font-bold uppercase tracking-wider text-purple-400 cursor-pointer"
                      >
                        Reset Filters
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="notes-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-mono text-zinc-400">
                      Showing {filteredNotes.length} pinned idea{filteredNotes.length === 1 ? '' : 's'}
                    </span>

                    <button
                      onClick={() => {
                        setCurrentEditNote(null);
                        setIsNoteModalOpen(true);
                      }}
                      className="hidden sm:flex items-center gap-1.5 px-4 block py-1.5 rounded-full bg-purple-500 hover:bg-purple-400 text-white font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Pin Note</span>
                    </button>
                  </div>

                  {filteredNotes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {filteredNotes.map((note) => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          onEdit={handleEditNoteTrigger}
                          onDelete={handleDeleteNote}
                          theme={theme}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Beautiful Empty Notes State */
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`py-12 px-6 rounded-3xl border text-center flex flex-col items-center justify-center ${
                        theme === 'dark' ? 'glass-panel' : 'glass-light shadow-md'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-zinc-800/10 border border-zinc-800/15 flex items-center justify-center mb-4 text-purple-400 text-2xl">
                        💡
                      </div>
                      <h4 className={`text-base font-bold font-display ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>
                        No Thoughts Pinned
                      </h4>
                      <p className="text-zinc-400 text-xs max-w-xs mt-1">
                        Take snapshot ideas before they strike elsewhere! Create notes to document values.
                      </p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="mt-4 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-2xs font-bold uppercase tracking-wider text-purple-400 cursor-pointer"
                      >
                        Reset Search
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Floating Add Button for Mobile Quick entry */}
      <motion.button
        onClick={() => {
          if (currentSection === 'tasks') {
            setCurrentEditTask(null);
            setIsTaskModalOpen(true);
          } else {
            setCurrentEditNote(null);
            setIsNoteModalOpen(true);
          }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-100 w-14 h-14 rounded-full bg-linear-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-xl hover:neon-glow cursor-pointer"
      >
        <Plus className="w-7 h-7" />
      </motion.button>

      {/* Main Form Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setCurrentEditTask(null);
        }}
        onSave={handleCreateOrUpdateTask}
        currentTask={currentEditTask}
        theme={theme}
      />

      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setCurrentEditNote(null);
        }}
        onSave={handleCreateOrUpdateNote}
        currentNote={currentEditNote}
        theme={theme}
      />
    </div>
  );
}
