import React, { useState } from 'react';
import { Smartphone, RotateCcw, PenTool, Clipboard, Edit, Layers, ChevronRight, Zap } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  fullscreen: boolean;
  deviceColor: string;
  setDeviceColor: (color: string) => void;
  deviceModel: 'note5' | 'note10';
  setDeviceModel: (model: 'note5' | 'note10') => void;
  onHomeClick: () => void;
  onBackClick: () => void;
  onRecentClick: () => void;
  sPenActive: boolean;
  setSPenActive: (active: boolean) => void;
  onLaunchApp: (appId: string) => void;
  gestureNavigation?: boolean;
}

export default function DeviceFrame({
  children,
  fullscreen,
  deviceColor,
  setDeviceColor,
  deviceModel,
  setDeviceModel,
  onHomeClick,
  onBackClick,
  onRecentClick,
  sPenActive,
  setSPenActive,
  onLaunchApp,
  gestureNavigation = false
}: DeviceFrameProps) {
  const [sPenAction, setSPenAction] = useState<string | null>(null);

  const colors = deviceModel === 'note10' ? [
    { id: 'auraglow', name: 'Aura Glow Reflection', border: 'border-zinc-500/80 bg-gradient-to-tr from-cyan-400 via-pink-400 via-purple-300 to-indigo-500', glossy: 'bg-white/10' },
    { id: 'black', name: 'Aura Black Matte', border: 'border-zinc-900 bg-zinc-950', glossy: 'bg-zinc-700' },
    { id: 'blue', name: 'Aura Midnight Blue', border: 'border-blue-900 bg-blue-950', glossy: 'bg-blue-800' },
    { id: 'silver', name: 'Aura Chrome Silver', border: 'border-zinc-300 bg-zinc-200', glossy: 'bg-zinc-100' }
  ] : [
    { id: 'slate', name: 'Sapphire Slate', border: 'border-slate-800 bg-slate-900', glossy: 'bg-slate-700/60' },
    { id: 'gold', name: 'Lux Gold', border: 'border-yellow-800 bg-yellow-950/90', glossy: 'bg-yellow-600/40' },
    { id: 'silver', name: 'Titanium Silver', border: 'border-slate-400 bg-slate-200', glossy: 'bg-slate-300' },
    { id: 'black', name: 'Obsidian Black', border: 'border-zinc-900 bg-zinc-950', glossy: 'bg-zinc-700' }
  ];

  const currentTheme = colors.find(c => c.id === deviceColor) || colors[0];

  const triggerAirCommandAction = (actionId: string, appId?: string) => {
    setSPenAction(actionId);
    if (appId) {
      onLaunchApp(appId);
    }
    setTimeout(() => {
      setSPenAction(null);
      setSPenActive(false);
    }, 1800);
  };

  // Render pure screen canvas without borders of the simulated note frame when fullscreen is active
  if (fullscreen) {
    return (
      <div className="w-full h-full relative bg-slate-950 flex flex-col justify-between">
        {/* Workspace body */}
        <div className="flex-1 w-full h-full relative overflow-hidden">
          {children}
        </div>

        {/* Small floating quick S-Pen stylus simulation */}
        <div className="absolute bottom-16 right-4 z-50">
          <button
            onClick={() => setSPenActive(!sPenActive)}
            className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all border border-sky-400/30 ${
              sPenActive ? 'bg-sky-500 text-white shadow-lg scale-110' : 'bg-slate-900/95 text-sky-400 hover:scale-105'
            }`}
            title="Toggle Samsung S-Pen Stylus state"
          >
            <PenTool size={16} />
          </button>

          {/* Inline float AIR COMMANDS radial-styled menu */}
          {sPenActive && (
            <div className="absolute bottom-12 right-0 bg-slate-950/95 backdrop-blur-md rounded-xl border border-sky-500/30 p-2.5 w-52 text-left shadow-2xl animate-in zoom-in-75 duration-150 text-slate-200">
              <div className="text-[10px] uppercase font-bold tracking-widest text-sky-400 border-b border-white/5 pb-1 mb-2">
                S Pen Air Command
              </div>
              <div className="space-y-1 text-xs">
                <button 
                  onClick={() => triggerAirCommandAction('memo', 's-note')}
                  className="w-full p-1.5 hover:bg-sky-500/10 rounded flex items-center gap-2 cursor-pointer transition"
                >
                  <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white">✏️</span> Action Memo
                </button>
                <button 
                  onClick={() => triggerAirCommandAction('select')}
                  className="w-full p-1.5 hover:bg-sky-500/10 rounded flex items-center gap-2 cursor-pointer transition"
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-white">✂️</span> Smart Select
                </button>
                <button 
                  onClick={() => triggerAirCommandAction('write')}
                  className="w-full p-1.5 hover:bg-sky-500/10 rounded flex items-center gap-2 cursor-pointer transition"
                >
                  <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white">🎨</span> Screen Write
                </button>
                <button 
                  onClick={() => triggerAirCommandAction('sketch', 'sketchbook')}
                  className="w-full p-1.5 hover:bg-sky-500/10 rounded flex items-center gap-2 cursor-pointer transition"
                >
                  <span className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center text-[10px] text-white">🖌️</span> Pen.Up Sketch
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row items-center justify-center gap-6 py-4 px-2 w-full max-w-5xl mx-auto h-auto min-h-screen">
      
      {/* Device Config Controller Bar to the left on desktop desktop screens */}
      <div className="w-full xl:w-52 max-w-sm shrink-0 bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col gap-4 text-left shadow-xl animate-in slide-in-from-left duration-200">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
            <Smartphone size={14} className="text-sky-400" /> Device Model
          </h2>
          <p className="text-[10px] text-slate-400">
            {deviceModel === 'note10' ? 'SM-N975 Galaxy Note 10+' : 'SM-N920 Note 5+ Chassis'}
          </p>
        </div>

        {/* Device Model Switcher Selection Buttons */}
        <div>
          <span className="text-[11px] text-slate-400 block mb-1.5">Simulate Chassis Generation:</span>
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-lg border border-slate-850">
            <button
              onClick={() => {
                setDeviceModel('note5');
              }}
              className={`py-1 text-[10px] font-bold text-center rounded transition cursor-pointer ${
                deviceModel === 'note5' 
                  ? 'bg-sky-600 text-white shadow font-extrabold' 
                  : 'text-slate-400 hover:text-slate-200 bg-transparent'
              }`}
            >
              Note 5
            </button>
            <button
              onClick={() => {
                setDeviceModel('note10');
              }}
              className={`py-1 text-[10px] font-bold text-center rounded transition cursor-pointer ${
                deviceModel === 'note10' 
                  ? 'bg-sky-600 text-white shadow font-extrabold' 
                  : 'text-slate-400 hover:text-slate-200 bg-transparent'
              }`}
            >
              Note 10+
            </button>
          </div>
        </div>

        {/* Chassis Color Picker */}
        <div>
          <span className="text-[11px] text-slate-400 block mb-1.5">Chassis Titanium Paint:</span>
          <div className="grid grid-cols-2 gap-2">
            {colors.map((c) => (
              <button
                key={c.id}
                onClick={() => setDeviceColor(c.id)}
                className={`py-1.5 rounded-lg border text-[10px] font-semibold text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  deviceColor === c.id 
                    ? 'border-sky-400 bg-sky-950/40 text-white font-bold' 
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className={`w-3 h-3 rounded-full border border-black/20 ${
                  c.id === 'auraglow' 
                    ? 'bg-gradient-to-tr from-cyan-400 via-pink-300 to-indigo-400' 
                    : c.id === 'gold' 
                      ? 'bg-yellow-600' 
                      : c.id === 'silver' 
                        ? 'bg-slate-300' 
                        : c.id === 'black' 
                          ? 'bg-zinc-800' 
                          : c.id === 'blue' 
                            ? 'bg-indigo-950' 
                            : 'bg-slate-705'
                }`} />
                <span>{c.name.split(' ').slice(-1)[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ejected spring launcher feedback helper card */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
          <span className="text-[10px] text-slate-400 block">Spring ejected Note Stylus:</span>
          <button
            onClick={() => setSPenActive(!sPenActive)}
            className={`w-full py-1.5 rounded text-[11px] font-bold cursor-pointer transition flex items-center justify-center gap-1.5 ${
              sPenActive ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <PenTool size={11} className={sPenActive ? 'animate-pulse' : ''} />
            {sPenActive ? 'Stylus: Actively Drawn' : 'Stylus: Click/Eject'}
          </button>
        </div>

        {/* Simulated Touch Screen controls */}
        <div className="text-[9px] text-slate-500 border-t border-slate-800 pt-2 space-y-1">
          {deviceModel === 'note10' ? (
            <>
              <p>• In-Screen Punch Hole: Center camera eye.</p>
              <p>• Soft Keys Bar: Navigation keys inside bottom glass.</p>
              <p>• 12GB RAM LPDDR4x: Performance stats active.</p>
            </>
          ) : (
            <>
              <p>• Recent Apps: Toggle Settings control panel.</p>
              <p>• Home Key: Exit apps instantly.</p>
              <p>• Back Key: Quit folders and overlays.</p>
            </>
          )}
        </div>
      </div>

      {/* Actual Galaxy note physical chassis simulator container frame */}
      <div 
        className={`w-full max-w-[370px] aspect-[9/18.5] ${currentTheme.border} ${
          deviceModel === 'note10' ? 'border-[8px] rounded-[44px]' : 'border-[13px] rounded-[38px]'
        } shadow-2xl relative flex flex-col justify-between overflow-hidden p-1 transition-all duration-305`}
        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)' }}
      >
        {/* PHYSICAL STATUS HARDWARE TOP BAR GRID - Only show for legacy Note 5 physical frame */}
        {deviceModel === 'note5' && (
          <div className="w-full h-8 shrink-0 relative flex items-center justify-center bg-transparent mt-1 select-none">
            {/* Proximity dot */}
            <div className="absolute left-1/4 w-1.5 h-1.5 bg-sky-950 border border-slate-800 rounded-full" />
            
            {/* Top speaker grid */}
            <div className="w-16 h-1 border border-black bg-zinc-600/70 rounded-full" />
            
            {/* Classic galaxy branding */}
            <span className="absolute text-[8px] font-bold text-zinc-400 tracking-widest mt-4 uppercase">
              SAMSUNG
            </span>

            {/* HD Camera eye */}
            <div className="absolute right-1/4 w-3.5 h-3.5 bg-zinc-950 border-2 border-zinc-900 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-sky-900 rounded-full" />
            </div>
          </div>
        )}

        {/* GLASS HIGHLIGHT GLOSSY CHROME ACCENTS */}
        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10" />

        {/* THE SIMULATED AMOLED SCREEN VIEWPORT */}
        <div className={`flex-1 w-full bg-slate-950 ${
          deviceModel === 'note10' ? 'rounded-[34px] mt-1 mb-1' : 'rounded-[22px]'
        } overflow-hidden relative flex flex-col`}>
          {/* Note 10 center punch-hole overlay selfie camera */}
          {deviceModel === 'note10' && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black border-2 border-zinc-900/80 z-50 flex items-center justify-center shadow">
              <div className="w-1.5 h-1.5 bg-sky-950/80 rounded-full" />
            </div>
          )}

          {children}

          {/* S-Pen Status Air Command floating screen HUD Overlay */}
          {sPenActive && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-[270px] bg-slate-900/95 border border-sky-500/40 rounded-2xl p-4 text-slate-100 shadow-2xl animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400 flex items-center gap-1.5">
                    <PenTool size={11} className="text-sky-400 rotate-45" /> Air Command Menu
                  </span>
                  <button 
                    onClick={() => setSPenActive(false)} 
                    className="text-slate-500 hover:text-white text-[10px] font-bold"
                  >
                    ✕ CLOSE
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-left">
                  <button
                    onClick={() => triggerAirCommandAction('memo', 's-note')}
                    className="w-full p-2 hover:bg-sky-500/10 rounded-lg flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <span className="text-sm bg-blue-600 p-1 rounded-md text-white">✏️</span>
                    <div>
                      <span className="font-semibold block">Action Memo</span>
                      <span className="text-[9px] text-slate-400">Quick scribble S-Pen note</span>
                    </div>
                  </button>

                  <button
                    onClick={() => triggerAirCommandAction('select')}
                    className="w-full p-2 hover:bg-sky-500/10 rounded-lg flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <span className="text-sm bg-emerald-600 p-1 rounded-md text-white">✂️</span>
                    <div>
                      <span className="font-semibold block">Smart Select</span>
                      <span className="text-[9px] text-slate-400">Cropping coordinates free-style</span>
                    </div>
                  </button>

                  <button
                    onClick={() => triggerAirCommandAction('write')}
                    className="w-full p-2 hover:bg-sky-500/10 rounded-lg flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <span className="text-sm bg-red-600 p-1 rounded-md text-white">🎨</span>
                    <div>
                      <span className="font-semibold block">Screen Write</span>
                      <span className="text-[9px] text-slate-400">Take screenshot & write on top</span>
                    </div>
                  </button>

                  <button
                    onClick={() => triggerAirCommandAction('sketch', 'sketchbook')}
                    className="w-full p-2 hover:bg-sky-500/10 rounded-lg flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <span className="text-sm bg-yellow-600 p-1 rounded-md text-white">🖌️</span>
                    <div>
                      <span className="font-semibold block">Pen-Up Canvas</span>
                      <span className="text-[9px] text-slate-400">Unlock fully loaded drawing space</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Ejected Air command prompt animation box */}
          {sPenAction && (
            <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
              <Zap size={28} className="text-yellow-400 animate-bounce mb-2" />
              <div className="text-xs font-mono text-center text-yellow-300 font-semibold uppercase tracking-wider">
                S-Pen Air Action Selected
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Launching workspace simulator: "{sPenAction}"
              </div>
            </div>
          )}

          {/* Soft Navigation keys inside display on modern Note 10+ */}
          {deviceModel === 'note10' && (
            gestureNavigation ? (
              <div className="w-full h-4 shrink-0 bg-transparent flex items-center justify-center pointer-events-none select-none z-35 pb-1">
                <div className="w-24 h-1 bg-white/40 rounded-full" />
              </div>
            ) : (
              <div className="w-full h-9 shrink-0 bg-zinc-950/80 backdrop-blur-sm border-t border-white/5 flex items-center justify-around text-zinc-400 select-none z-35 pb-1">
                <button 
                  onClick={onRecentClick} 
                  className="hover:text-white transition cursor-pointer p-1.5 active:scale-90 active:text-sky-400 flex items-center justify-center"
                  title="Software Recent Apps Switcher"
                >
                  <div className="w-3.5 h-3.5 border border-current rounded-[2px]" />
                </button>
                
                <button 
                  onClick={onHomeClick} 
                  className="hover:text-white transition cursor-pointer p-1.5 active:scale-95 active:text-sky-400 flex items-center justify-center"
                  title="Software Home Button"
                >
                  <div className="w-4.5 h-4.5 border-1.5 border-current rounded-full" />
                </button>
                
                <button 
                  onClick={onBackClick} 
                  className="hover:text-white transition cursor-pointer p-1.5 active:scale-90 active:text-sky-400 flex items-center justify-center"
                  title="Software Back Button"
                >
                  <ChevronRight size={14} className="rotate-180" />
                </button>
              </div>
            )
          )}
        </div>

        {/* PHYSICAL STATUS BOTTOM CAPACITIVE KEY GRID - Show for physical Note 5 only */}
        {deviceModel === 'note5' && (
          <div className={`w-full h-11 shrink-0 bg-transparent flex items-center justify-between px-10 relative select-none mt-1 transition-all duration-300 ${gestureNavigation ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
            {/* Capacitive Recent Apps button key */}
            <button
              onClick={gestureNavigation ? undefined : onRecentClick}
              className={`text-zinc-500 hover:text-white transition cursor-pointer p-2 flex flex-col items-center justify-center gap-0.5 active:scale-95 active:text-sky-400 ${gestureNavigation ? 'opacity-40 cursor-default' : ''}`}
              title={gestureNavigation ? 'Gesture Control Mode Override Active' : 'Capacitive Recent Apps Switcher Key'}
            >
              <Layers size={14} />
            </button>

            {/* Physical Home button frame */}
            <button
              onClick={gestureNavigation ? undefined : onHomeClick}
              className={`w-24 h-5.5 border-1.5 border-zinc-600/70 bg-zinc-800/80 rounded-full hover:bg-zinc-700/85 transition cursor-pointer shadow-lg active:scale-97 active:border-sky-400 flex items-center justify-center relative ${gestureNavigation ? 'opacity-40 cursor-default' : ''}`}
              title={gestureNavigation ? 'Gesture Control Mode Override Active' : 'Physical Home / Fingerprint Scanner Button'}
            >
              {/* Matte inside dot */}
              <div className="w-[90%] h-[80%] border border-zinc-700/30 rounded-full" />
            </button>

            {/* Capacitive back button key */}
            <button
              onClick={gestureNavigation ? undefined : onBackClick}
              className={`text-zinc-500 hover:text-white transition cursor-pointer p-2 flex items-center justify-center active:scale-95 active:text-sky-400 ${gestureNavigation ? 'opacity-40 cursor-default' : ''}`}
              title={gestureNavigation ? 'Gesture Control Mode Override Active' : 'Capacitive Back key'}
            >
              <ChevronRight size={14} className="rotate-180" />
            </button>
          </div>
        )}

        {/* Small Note Stylus slot eject visual helper at bottom of bezel */}
        <div className="absolute bottom-1 right-8 w-6 h-1 border border-zinc-700/50 rounded bg-zinc-900/90 text-[5px] text-center text-zinc-500">
          S-Pen
        </div>
      </div>
    </div>
  );
}
