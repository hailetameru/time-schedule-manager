/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  User, 
  Palette, 
  Save, 
  Key, 
  UserRound, 
  Upload, 
  Sparkles, 
  RefreshCw, 
  HelpCircle, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProfileView() {
  const context = useContext(AppContext);
  if (!context) return null;

  const { 
    user, 
    updateProfile, 
    bgColor, 
    fgColor, 
    cardColor, 
    accentColor, 
    setThemeColors, 
    resetThemeColors 
  } = context;

  // Profile Form States
  const [name, setName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [picOption, setPicOption] = useState(user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');
  const [customUrl, setCustomUrl] = useState('');
  const [pass, setPass] = useState('••••••••');
  const [showSaveMsg, setShowSaveMsg] = useState(false);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState('');

  // Custom Color States (Linked directly to theme customizer)
  const [tempBg, setTempBg] = useState(bgColor);
  const [tempFg, setTempFg] = useState(fgColor);
  const [tempCard, setTempCard] = useState(cardColor);
  const [tempAccent, setTempAccent] = useState(accentColor);

  // Profile Images Presets
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, email, picOption);
    setShowSaveMsg(true);
    setTimeout(() => {
      setShowSaveMsg(false);
    }, 3000);
  };

  const handleApplyTheme = () => {
    setThemeColors(tempBg, tempFg, tempCard, tempAccent);
  };

  // File Processing
  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFileError('Please select a valid image file (JPEG, PNG, etc.)');
      return;
    }
    if (file.size > 1 * 1024 * 1024) { // 1MB max for localStorage safe storage
      setFileError('Image too large. Please select a photo under 1MB.');
      return;
    }
    setFileError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPicOption(e.target.result as string);
        setCustomUrl(''); // Reset custom URL field if file uploaded
      }
    };
    reader.onerror = () => {
      setFileError('Error reading profile picture.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleCustomUrlApply = () => {
    if (customUrl.trim() && (customUrl.startsWith('http://') || customUrl.startsWith('https://') || customUrl.startsWith('data:'))) {
      setPicOption(customUrl.trim());
      setFileError('');
    } else {
      setFileError('Please enter a valid image URL starting with http://, https://, or data:');
    }
  };

  // Presets mapping
  const applyPreset = (presetName: string) => {
    if (presetName === 'sophisticated') {
      setTempBg('#0a0b0d');
      setTempFg('#f3f4f6');
      setTempCard('#14161c');
      setTempAccent('#d4af37');
      setThemeColors('#0a0b0d', '#f3f4f6', '#14161c', '#d4af37');
    } else if (presetName === 'slate') {
      setTempBg('#0f172a');
      setTempFg('#f8fafc');
      setTempCard('#1e293b');
      setTempAccent('#3b82f6');
      setThemeColors('#0f172a', '#f8fafc', '#1e293b', '#3b82f6');
    } else if (presetName === 'midnight') {
      setTempBg('#020617');
      setTempFg('#e0f2fe');
      setTempCard('#0f172a');
      setTempAccent('#a855f7');
      setThemeColors('#020617', '#e0f2fe', '#0f172a', '#a855f7');
    } else if (presetName === 'emerald') {
      setTempBg('#022c22');
      setTempFg('#f0fdf4');
      setTempCard('#064e3b');
      setTempAccent('#10b981');
      setThemeColors('#022c22', '#f0fdf4', '#064e3b', '#10b981');
    } else if (presetName === 'sand') {
      setTempBg('#fafaf9');
      setTempFg('#1c1917');
      setTempCard('#f5f5f4');
      setTempAccent('#f59e0b');
      setThemeColors('#fafaf9', '#1c1917', '#f5f5f4', '#f59e0b');
    } else if (presetName === 'lavender') {
      setTempBg('#1e1b4b');
      setTempFg('#e0e7ff');
      setTempCard('#312e81');
      setTempAccent('#ec4899');
      setThemeColors('#1e1b4b', '#e0e7ff', '#312e81', '#ec4899');
    }
  };

  // Motion Graphics Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Title */}
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-serif font-bold tracking-tight text-white flex items-center gap-2.5 animate-pulse-subtle">
          Profile & Environment <Sparkles className="h-6 w-6 text-[#d4af37]" />
        </h2>
        <p className="text-sm opacity-80 mt-1">Configure profile details, upload your custom photo, and customize your theme colors dynamically.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Card: Edit Profile */}
        <motion.div 
          variants={itemVariants}
          className="rounded-2xl border border-slate-700/30 p-6 space-y-6"
          style={{ backgroundColor: cardColor, color: fgColor }}
        >
          <div>
            <h3 className="font-serif font-bold text-lg flex items-center gap-2 text-white">
              <UserRound className="h-5 w-5 text-[#d4af37]" /> Account Settings
            </h3>
            <p className="text-xs opacity-70 mt-1">Update registration profiles and upload custom user photos.</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            
            {/* Avatar Select and Upload */}
            <div className="space-y-4">
              <label className="block text-4xs uppercase tracking-wider font-bold opacity-70">User Profile Photo</label>
              
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-900/30 border border-slate-700/20">
                <div className="relative group shrink-0">
                  <motion.img 
                    src={picOption} 
                    alt="Avatar Preset" 
                    className="h-20 w-20 rounded-full object-cover border-2 shadow-lg"
                    style={{ borderColor: accentColor }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="flex-1 w-full space-y-3">
                  <div className="text-xs opacity-80">
                    <span className="font-bold text-white block mb-1">Pick a preset or select custom avatar:</span>
                    <div className="flex gap-2 flex-wrap">
                      {avatarPresets.map((preset, idx) => (
                        <motion.button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setPicOption(preset);
                            setCustomUrl('');
                            setFileError('');
                          }}
                          className={`h-9 w-9 rounded-full overflow-hidden border-2 transition ${picOption === preset ? 'border-[#d4af37]' : 'border-transparent'}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img src={preset} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Drag & Drop Zone */}
              <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-[#d4af37] bg-amber-500/10 scale-[1.02]' 
                    : 'border-slate-700/50 hover:border-slate-500/80 bg-slate-900/10'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <Upload className="h-8 w-8 mx-auto mb-2 opacity-60 text-[#d4af37]" />
                <p className="text-xs font-bold text-white">Drag & drop your profile photo here</p>
                <p className="text-3xs opacity-60 mt-1">PNG, JPG or WEBP (Max 1MB for optimized local syncing)</p>
              </motion.div>

              {/* Enter Custom URL */}
              <div className="space-y-1.5">
                <label className="block text-4xs uppercase tracking-wider font-bold opacity-60">Or use web image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/your-image.jpg"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 rounded-xl bg-slate-900/50 border border-slate-700/80 px-3.5 py-1.5 text-xs focus:outline-none focus:border-[#d4af37]"
                    style={{ color: fgColor }}
                  />
                  <button
                    type="button"
                    onClick={handleCustomUrlApply}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700/60 transition"
                  >
                    Apply URL
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {fileError && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-1.5 text-2xs text-amber-400 font-bold"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>{fileError}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Inputs */}
            <div className="space-y-3 pt-2 border-t border-slate-700/30">
              <div>
                <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700/80 px-3.5 py-2 text-xs focus:outline-none focus:border-[#d4af37]"
                  style={{ color: fgColor }}
                />
              </div>

              <div>
                <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700/80 px-3.5 py-2 text-xs focus:outline-none focus:border-[#d4af37]"
                  style={{ color: fgColor }}
                />
              </div>

              <div>
                <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">Change Password</label>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/50 border border-slate-700/80 px-3.5 py-2 text-xs focus:outline-none focus:border-[#d4af37]"
                  style={{ color: fgColor }}
                />
              </div>
            </div>

            <AnimatePresence>
              {showSaveMsg && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 py-1"
                >
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span>Account settings & profile photo updated successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-md cursor-pointer"
              style={{ backgroundColor: accentColor }}
              whileHover={{ scale: 1.01, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.99 }}
            >
              <Save className="h-4 w-4" /> Save Account Settings
            </motion.button>
          </form>
        </motion.div>

        {/* Right Card: Theme Color customization */}
        <motion.div 
          variants={itemVariants}
          className="rounded-2xl border border-slate-700/30 p-6 space-y-6"
          style={{ backgroundColor: cardColor, color: fgColor }}
        >
          <div>
            <h3 className="font-serif font-bold text-lg flex items-center gap-2 text-white">
              <Palette className="h-5 w-5 text-[#d4af37]" /> Dynamic Theme Customizer
            </h3>
            <p className="text-xs opacity-70 mt-1">
              Select a preset or fine-tune background & text color codes to your exact eye preferences.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <h4 className="text-4xs uppercase tracking-wider font-bold opacity-75">Theme Presets</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'sophisticated', label: 'Sophisticated', dot: '#d4af37', bg: '#14161c', border: 'border-amber-500/30', text: 'text-amber-100' },
                { id: 'slate', label: 'Slate Slate', dot: '#3b82f6', bg: 'bg-slate-900', border: 'border-slate-700', text: 'text-slate-100' },
                { id: 'midnight', label: 'Cosmos Violet', dot: '#a855f7', bg: 'bg-black', border: 'border-slate-700', text: 'text-indigo-200' },
                { id: 'emerald', label: 'Green Grove', dot: '#10b981', bg: 'bg-emerald-950', border: 'border-slate-700', text: 'text-emerald-100' },
                { id: 'sand', label: 'Sandy Light', dot: '#f59e0b', bg: 'bg-stone-100', border: 'border-slate-200', text: 'text-stone-900' },
                { id: 'lavender', label: 'Lavender Velvet', dot: '#ec4899', bg: 'bg-indigo-950', border: 'border-indigo-900', text: 'text-indigo-100' }
              ].map((preset) => (
                <motion.button 
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className={`rounded-xl border ${preset.border} px-2.5 py-2 text-2xs font-bold ${preset.bg} text-left flex items-center justify-center gap-1.5 cursor-pointer`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="h-3.5 w-3.5 rounded-full border shrink-0" style={{ backgroundColor: preset.dot }} /> 
                  <span className={`truncate ${preset.text}`}>{preset.label}</span>
                </motion.button>
              ))}

              <motion.button 
                onClick={resetThemeColors}
                className="rounded-xl border border-slate-700 px-2.5 py-2 text-2xs font-bold text-slate-300 flex items-center justify-center gap-1 cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <RefreshCw className="h-3.5 w-3.5" /> Restore
              </motion.button>
            </div>
          </div>

          {/* Color pickers */}
          <div className="space-y-4 pt-2 border-t border-slate-700/40">
            <h4 className="text-4xs uppercase tracking-wider font-bold opacity-75">Interactive Fine-Tuner</h4>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Background', value: tempBg, setter: setTempBg },
                { label: 'Foreground Text', value: tempFg, setter: setTempFg },
                { label: 'Card Background', value: tempCard, setter: setTempCard },
                { label: 'Accent Details', value: tempAccent, setter: setTempAccent }
              ].map((picker, idx) => (
                <div key={idx}>
                  <label className="block text-4xs uppercase tracking-wider font-bold mb-1 opacity-70">{picker.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={picker.value}
                      onChange={(e) => picker.setter(e.target.value)}
                      className="h-9 w-9 rounded-md border border-slate-700 bg-transparent cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      value={picker.value}
                      onChange={(e) => picker.setter(e.target.value)}
                      className="flex-1 rounded-xl bg-slate-900/50 border border-slate-700 px-2 py-1.5 text-2xs font-mono min-w-0"
                      style={{ color: fgColor }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              onClick={handleApplyTheme}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-md cursor-pointer"
              style={{ backgroundColor: accentColor }}
              whileHover={{ scale: 1.01, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.99 }}
            >
              <Palette className="h-4 w-4" /> Apply Custom Theme Colors
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
