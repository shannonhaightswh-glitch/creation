import React, { useState } from 'react';
import { Sliders, Plus, Trash2, ArrowRight, AppWindow, Move } from 'lucide-react';
import { AppMetadata, LauncherConfig } from '../types';

interface SidebarPanelProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  config: LauncherConfig;
  updateConfig: (updater: (prev: LauncherConfig) => LauncherConfig) => void;
  onLaunchApp: (appId: string) => void;
  allApps: AppMetadata[];
}

export default function SidebarPanel({
  isOpen,
  setIsOpen,
  config,
  updateConfig,
  onLaunchApp,
  allApps
}: SidebarPanelProps) {
  const [isEditing, setIsEditing] = useState(false);

  const activeSidebarApps = allApps.filter(app => {
    // Ensure shown in config list, plus filters based on Dev Options / Hidden Apps config
    const isDocked = config.sidebarApps.includes(app.id);
    if (!isDocked) return false;
    if (app.isHidden) return config.showHidden;
    if (app.category === 'developer') return config.enableDevOptions;
    return true;
  });

  const availableAppsToDock = allApps.filter(app => {
    // Not already in sidebar
    if (config.sidebarApps.includes(app.id)) return false;
    if (app.isHidden) return config.showHidden;
    if (app.category === 'developer') return config.enableDevOptions;
    return true;
  });

  const dockApp = (appId: string) => {
    updateConfig(prev => {
      if (prev.sidebarApps.includes(appId)) return prev;
      return {
        ...prev,
        sidebarApps: [...prev.sidebarApps, appId]
      };
    });
  };

  const undockApp = (appId: string) => {
    updateConfig(prev => ({
      ...prev,
      sidebarApps: prev.sidebarApps.filter(id => id !== appId)
    }));
  };

  return (
    <div className="absolute right-0 top-1/4 h-[55%] z-50 flex items-center">
      {/* S-Pen / Drawer pullout physical trigger tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-5 h-16 bg-white/10 hover:bg-white/20 border-y border-l border-white/20 backdrop-blur-md rounded-l-md flex flex-col items-center justify-center text-slate-300 hover:text-white transition shadow-lg cursor-pointer group"
        title="Slide out Note 5 Edge Screen Panel"
      >
        <div className="w-1 h-3 bg-white/40 group-hover:bg-sky-400 rounded-full mb-0.5" />
        <span className="text-[7px] font-bold tracking-widest text-slate-400 [writing-mode:vertical-lr] uppercase">
          EDGE
        </span>
      </button>

      {/* S-Pen Sliding Panel body */}
      {isOpen && (
        <div className="w-72 h-full bg-slate-950/95 backdrop-blur-xl border-l border-white/15 animate-in slide-in-from-right duration-350 flex flex-col shadow-2xl relative">
          
          {/* Header */}
          <div className="p-3 border-b border-white/10 flex justify-between items-center bg-slate-900/60">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                <Sliders size={12} className="text-sky-400 animate-pulse" /> Note 5 Edge Panel
              </h3>
              <p className="text-[10px] text-slate-400">Quick launch favorite docks & system nodes</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white text-xs px-1 hover:bg-white/10 rounded font-bold cursor-pointer"
            >
              &rarr;
            </button>
          </div>

          {/* Quick info banner */}
          <div className="px-3 py-1 bg-sky-950/30 border-b border-sky-500/10 text-[9px] text-sky-400 flex items-center gap-1">
            <AppWindow size={10} />
            <span>Click any app to launch. Press <b>Edit</b> to change docked apps.</span>
          </div>

          {/* Core Apps List inside the Edge screen */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {!isEditing ? (
              activeSidebarApps.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs flex flex-col items-center justify-center gap-1.5">
                  <Plus size={20} className="text-slate-600" />
                  <span>No apps docked in Edge drawer.</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[10px] font-bold cursor-pointer"
                  >
                    Configure Edge Docks
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {activeSidebarApps.map(app => (
                    <button
                      key={app.id}
                      onClick={() => {
                        onLaunchApp(app.id);
                        setIsOpen(false);
                      }}
                      className="bg-slate-900/50 hover:bg-slate-800/80 border border-white/5 hover:border-slate-700 p-2.5 rounded-lg flex flex-col items-center justify-center text-center group cursor-pointer transition-all duration-200"
                    >
                      <span className="text-2xl text-slate-300 group-hover:scale-110 group-hover:text-sky-400 transition-transform">
                        •
                      </span>
                      <span className="text-[10px] text-slate-200 truncate w-full font-medium mt-1">
                        {app.name}
                      </span>
                    </button>
                  ))}
                </div>
              )
            ) : (
              /* Dock Application editor list */
              <div className="space-y-3">
                {/* Active Dock list */}
                <div>
                  <h4 className="text-[10px] uppercase text-sky-400 font-bold mb-1.5">Active Docks ({activeSidebarApps.length})</h4>
                  {activeSidebarApps.length === 0 ? (
                    <p className="text-[10px] text-slate-600 italic">No apps selected.</p>
                  ) : (
                    <div className="space-y-1">
                      {activeSidebarApps.map(app => (
                        <div key={app.id} className="flex justify-between items-center text-xs p-1.5 bg-slate-900 rounded border border-white/5">
                          <span className="text-slate-200 font-medium truncate">{app.name}</span>
                          <button
                            onClick={() => undockApp(app.id)}
                            className="text-red-400 hover:text-red-300 p-1 hover:bg-red-950/40 rounded cursor-pointer"
                            title="Remove app from sidebar"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available for docking */}
                <div className="pt-2 border-t border-white/5">
                  <h4 className="text-[10px] uppercase text-slate-400 font-bold mb-1.5">Available to Dock ({availableAppsToDock.length})</h4>
                  {availableAppsToDock.length === 0 ? (
                    <p className="text-[10px] text-slate-500 italic">No more apps to match.</p>
                  ) : (
                    <div className="space-y-1 max-h-[160px] overflow-y-auto pr-1">
                      {availableAppsToDock.map(app => (
                        <div key={app.id} className="flex justify-between items-center text-xs p-1.5 bg-slate-900 hover:bg-slate-800 rounded">
                          <span className="text-slate-300 truncate">{app.name}</span>
                          <button
                            onClick={() => dockApp(app.id)}
                            className="text-emerald-400 hover:text-white p-1 hover:bg-emerald-950/50 rounded font-bold cursor-pointer"
                            title="Add app to sidebar"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          <div className="p-3 border-t border-white/10 flex justify-end items-center gap-2 bg-slate-900/60">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[11px] font-bold cursor-pointer"
            >
              {isEditing ? 'Done Editing' : 'Edit Edge Apps'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
