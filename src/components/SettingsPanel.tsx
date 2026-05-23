import React, { useState } from 'react';
import { Sliders, Sun, Shield, Lock, Eye, EyeOff, Layout, RefreshCw, Smartphone, Monitor } from 'lucide-react';
import { LauncherConfig } from '../types';
import { WALLPAPERS } from '../data';

interface SettingsPanelProps {
  config: LauncherConfig;
  updateConfig: (updater: (prev: LauncherConfig) => LauncherConfig) => void;
  onReset: () => void;
}

export default function SettingsPanel({
  config,
  updateConfig,
  onReset
}: SettingsPanelProps) {
  const [copiedEnv, setCopiedEnv] = useState(false);

  // Quick preset sizes
  const handleGridPreset = (cols: number, rows: number) => {
    updateConfig(prev => ({ ...prev, gridCols: cols, gridRows: rows }));
  };

  const handleWallpaperChange = (style: string) => {
    updateConfig(prev => ({ ...prev, currentWallpaper: style }));
  };

  const paletteColors = [
    { name: 'Crystal White', hex: '#ffffff' },
    { name: 'Samsung Blue', hex: '#3b82f6' },
    { name: 'Developer Green', hex: '#22c55e' },
    { name: 'Amber Gold', hex: '#f59e0b' },
    { name: 'Hot Crimson', hex: '#ef4444' },
    { name: 'Aura Glow Violet', hex: '#a855f7' }
  ];

  return (
    <div className="w-full text-slate-100 flex flex-col gap-6 max-h-[85vh] overflow-y-auto pr-1 pb-4 text-left">
      <div>
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Sliders className="text-blue-400" size={18} /> Standard & Dev Customization
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Simulate official Note 5+ TouchWiz customization triggers.
        </p>
      </div>

      {/* Grid Settings Section */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Layout size={14} className="text-blue-400" /> Grid Layout Setup
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Columns (<span className="text-blue-400 font-bold">{config.gridCols}</span>) - range 5 to 12
            </label>
            <input
              id="grid_cols_range"
              type="range"
              min="5"
              max="12"
              value={config.gridCols}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateConfig(prev => ({ ...prev, gridCols: val }));
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Rows (<span className="text-blue-400 font-bold">{config.gridRows}</span>) - range 6 to 13
            </label>
            <input
              id="grid_rows_range"
              type="range"
              min="6"
              max="13"
              value={config.gridRows}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateConfig(prev => ({ ...prev, gridRows: val }));
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        {/* Quick presets */}
        <div>
          <span className="text-[10px] text-slate-500 block mb-1.5">Note 5 Core Presets:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleGridPreset(5, 6)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 rounded cursor-pointer"
            >
              5 × 6 (Stock Note)
            </button>
            <button
              onClick={() => handleGridPreset(8, 9)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 rounded cursor-pointer"
            >
              8 × 9 (Dense Power)
            </button>
            <button
              onClick={() => handleGridPreset(10, 11)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 rounded cursor-pointer"
            >
              10 × 11 (Ultra Dense)
            </button>
            <button
              onClick={() => handleGridPreset(12, 13)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300 rounded cursor-pointer"
            >
              12 × 13 (Maximum Grid)
            </button>
          </div>
        </div>
      </div>

      {/* Visual Sizing */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Sun size={14} className="text-amber-400" /> Icon Graphics scale
        </h3>

        <div>
          <label className="text-[11px] text-slate-400 block mb-1.5">
            Launcher Icon Size (<span className="text-amber-400 font-bold">{config.iconSize} px</span>)
          </label>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-500">32px</span>
            <input
              id="icon_scale_range"
              type="range"
              min="32"
              max="72"
              value={config.iconSize}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateConfig(prev => ({ ...prev, iconSize: val }));
              }}
              className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-[10px] text-slate-500">72px</span>
          </div>
        </div>
      </div>

      {/* Search Widget Text Color & Transparency */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Layout size={14} className="text-emerald-400" /> Widget Customizing Options
        </h3>

        {/* Floating switches indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1.5">
              Custom Lettering/Text Color
            </label>
            <div className="flex flex-wrap gap-2">
              {paletteColors.map((col, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => updateConfig(prev => ({ ...prev, searchTextColor: col.hex }))}
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 border-2 ${config.searchTextColor === col.hex ? 'border-sky-400 scale-125 shadow-lg' : 'border-slate-950 hover:scale-110'}`}
                />
              ))}
            </div>
            <div className="mt-2 text-[10px] text-slate-400">
              Selected: <span className="font-semibold" style={{ color: config.searchTextColor }}>{config.searchTextColor}</span>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Search Widget Transparency (<span className="text-emerald-400 font-bold">{config.searchTransparency}%</span>)
            </label>
            <input
              id="transparency_range"
              type="range"
              min="0"
              max="100"
              value={config.searchTransparency}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateConfig(prev => ({ ...prev, searchTransparency: val }));
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              {config.searchTransparency === 100 ? 'Fully See-through glass' : config.searchTransparency === 0 ? 'Fully Solid Slate background' : 'Semi Transparent blend'}
            </span>
          </div>
        </div>
      </div>

      {/* Developer Toggles & Hidden Items */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Shield size={14} className="text-purple-400" /> Advanced Options & Storage access
        </h3>

        <div className="space-y-3">
          {/* Dev Options Toggle */}
          <div className="flex items-center justify-between p-2 bg-slate-950/40 rounded border border-slate-800/80">
            <div>
              <span className="text-xs font-semibold block text-slate-200">Enable Developer Options settings</span>
              <span className="text-[10px] text-slate-500">Unlocks CPU rendering overlays, hardware mock-ups, and transition controls.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="dev_toggle"
                type="checkbox"
                checked={config.enableDevOptions}
                onChange={(e) => {
                  const check = e.target.checked;
                  updateConfig(prev => ({ ...prev, enableDevOptions: check }));
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 peer-checked:after:bg-white" />
            </label>
          </div>

          {/* Hidden Apps / Secret Files Toggle */}
          <div className="flex items-center justify-between p-2 bg-slate-950/40 rounded border border-slate-800/80">
            <div>
              <span className="text-xs font-semibold block text-slate-200 flex items-center gap-1">
                Display Hidden Apps & System Files {config.showHidden ? <Lock size={12} className="text-purple-400" /> : <EyeOff size={12} className="text-slate-500" />}
              </span>
              <span className="text-[10px] text-slate-500">Search and reveal protected vault files, secure superuser files.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="hidden_toggle"
                type="checkbox"
                checked={config.showHidden}
                onChange={(e) => {
                  const check = e.target.checked;
                  updateConfig(prev => ({ ...prev, showHidden: check }));
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white" />
            </label>
          </div>

          {/* Gesture Navigation Toggle */}
          <div className="flex items-center justify-between p-2 bg-slate-950/40 rounded border border-slate-800/80">
            <div>
              <span className="text-xs font-semibold block text-slate-200 flex items-center gap-1">
                Gesture Navigation System
              </span>
              <span className="text-[10px] text-slate-500">Hide bottom hardware bezel key bar. Enables screen-bottom swipable control pill and left/right swipe-to-back triggers.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="gesture_nav_toggle"
                type="checkbox"
                checked={!!config.gestureNavigation}
                onChange={(e) => {
                  const check = e.target.checked;
                  updateConfig(prev => ({ ...prev, gestureNavigation: check }));
                }}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-600 peer-checked:after:bg-white" />
            </label>
          </div>
        </div>
      </div>

      {/* AMOLED Core Wallpaper selects */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5ClassName">
          Select Live Wallpaper
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {WALLPAPERS.map((wall) => (
            <button
              key={wall.id}
              onClick={() => handleWallpaperChange(wall.style)}
              style={{ background: wall.style.includes('gradient') ? wall.style : undefined, backgroundColor: !wall.style.includes('gradient') ? wall.style : undefined }}
              className={`h-11 rounded-lg text-[11px] font-semibold flex items-center justify-center text-center p-2 cursor-pointer border-2 transition-all duration-300 ${
                config.currentWallpaper === wall.style 
                  ? 'border-sky-400 font-bold scale-102 text-white shadow-xl' 
                  : 'border-slate-800 text-slate-300 hover:border-slate-600'
              }`}
            >
              <span className="bg-black/60 px-1.5 py-0.5 rounded text-[9px] truncate max-w-full">{wall.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen view Switcher & Layout Reset */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold block text-slate-300">Device Simulator Layout Frame</span>
          <span className="text-[10px] text-slate-500">Toggle simulated Galaxy frame for ultra responsive fullscreen canvas!</span>
        </div>
        <button
          onClick={() => updateConfig(prev => ({ ...prev, fullscreen: !prev.fullscreen }))}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 rounded text-xs font-semibold cursor-pointer flex items-center gap-1.5"
        >
          {config.fullscreen ? (
            <>
              <Smartphone size={14} className="text-blue-400" /> Frame Mode
            </>
          ) : (
            <>
              <Monitor size={14} className="text-purple-400" /> Fullscreen Mode
            </>
          )}
        </button>
      </div>

      {/* Safety Actions */}
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="flex-1 py-2.5 bg-red-950/40 hover:bg-red-950/80 border border-red-500/30 font-semibold rounded text-red-400 hover:text-white transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} /> Factory Settings Reset
        </button>
      </div>
    </div>
  );
}
