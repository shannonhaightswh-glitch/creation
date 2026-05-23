import React, { useState } from 'react';
import { 
  User, Palette, Sparkles, Volume2, Mic, Send, RefreshCw, 
  Settings as GearIcon, Check, Play, Info, Eye
} from 'lucide-react';
import CompanionMascot from './CompanionMascot';

interface CompanionStudioProps {
  companionConfig: any;
  setCompanionConfig: (config: any) => void;
  onClose?: () => void;
}

// Preset selections supporting classic and new anime styles
const HAIR_STYLES = [
  { id: 'bob', label: 'Cute Bob' },
  { id: 'rei-shaggy', label: 'Rei Shag' },
  { id: 'asuka-twins', label: 'Asuka Twins' },
  { id: 'spiky', label: 'Anime Spikes' },
  { id: 'pony', label: 'Neat Pony' },
  { id: 'long', label: 'Flowing Long' }
];

const HAIR_COLORS = [
  { value: '#f97316', name: 'Asuka Orange' },
  { value: '#93c5fd', name: 'Rei Blue' },
  { value: '#0f172a', name: 'Obsidian Black' },
  { value: '#06b6d4', name: 'Cyber Cyan' },
  { value: '#ec4899', name: 'Sunset Pink' },
  { value: '#eab308', name: 'Aura Blonde' },
  { value: '#b45309', name: 'Caramel Brown' }
];

const EYE_COLORS = [
  { value: '#0284c7', name: 'Aqua Blue' },
  { value: '#dc2626', name: 'Ruby Crimson' },
  { value: '#10b981', name: 'Emerald Green' },
  { value: '#eab308', name: 'Amber Gold' },
  { value: '#8b5cf6', name: 'Cyber Violet' }
];

const OUTFITS = [
  { id: 'plugsuit-red', label: 'Plugsuit 02' },
  { id: 'plugsuit-white', label: 'Plugsuit 00' },
  { id: 'school-uniform', label: 'Tokyo-3 Sailor' },
  { id: 'hoodie', label: 'Cozy Hoodie' },
  { id: 'suit', label: 'Smart Suit' },
  { id: 'scifi', label: 'Spacial Plating' },
  { id: 'casual', label: 'Classic Tee' }
];

const OUTFIT_COLORS = [
  { value: '#10b981', name: 'Emerald' },
  { value: '#ef4444', name: 'Coral Red' },
  { value: '#2563eb', name: 'Ocean Blue' },
  { value: '#7c3aed', name: 'Cyber Violet' },
  { value: '#f59e0b', name: 'Goldenrod' }
];

const ACCESSORIES = [
  { id: 'none', label: 'No Extra' },
  { id: 'a10-clips', label: 'A10 Nerve clip' },
  { id: 'spen', label: 'S-Pen Stylus' },
  { id: 'glasses', label: 'Glasses' },
  { id: 'headphones', label: 'Headphones' },
  { id: 'halo', label: 'Halo Crown' }
];

const EMOTIONS = [
  { id: 'smiling', label: 'Smiling' },
  { id: 'thinking', label: 'Concentrating' },
  { id: 'wink', label: 'Playful Wink' }
];

export default function CompanionStudio({
  companionConfig,
  setCompanionConfig,
  onClose
}: CompanionStudioProps) {
  const [activeTab, setActiveTab] = useState<'customize' | 'chat' | 'voice'>('customize');
  const [inputText, setInputText] = useState('');
  const [chatLog, setChatLog] = useState<any[]>([
    { role: 'assistant', content: `Hello! I'm ${companionConfig.name || 'Aero'}, your companion. Customize my look, or talk to me! I can speak aloud too!` }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [localMouthActive, setLocalMouthActive] = useState(false);
  const [currentSpeechBubble, setCurrentSpeechBubble] = useState<string>(
    `Hello! I'm ${companionConfig.name || 'Aero'}. Design my hair, outfit, accessories, and speak with me!`
  );

  // Set the voice profile on pitch/rate changes
  const updateProp = (field: string, value: any) => {
    setCompanionConfig((prev: any) => ({ ...prev, [field]: value }));
  };

  // Speaks words via Web Speech synthesis while synchronizing mouth movement
  const speakTextAloud = (text: string) => {
    if (!companionConfig.enableTts) {
      // If voice TTS is off, simulate visual talking coordinates via timer countdown
      setLocalMouthActive(true);
      const estDuration = Math.min(5000, text.split(' ').length * 350 + 600);
      setTimeout(() => {
        setLocalMouthActive(false);
      }, estDuration);
      return;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancel previous utterances to avoid speech overlaps
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Attempt to customize pitch and rate
      utterance.pitch = companionConfig.voicePitch || 1.1;
      utterance.rate = companionConfig.voiceRate || 1.0;

      utterance.onstart = () => {
        setLocalMouthActive(true);
      };
      utterance.onend = () => {
        setLocalMouthActive(false);
      };
      utterance.onerror = () => {
        setLocalMouthActive(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback for sandboxed frames where speech synthesis might be disabled
      setLocalMouthActive(true);
      setTimeout(() => setLocalMouthActive(false), 2000);
    }
  };

  // Send message to Express backend Gemini AI Endpoint
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isAiTyping) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    // Add user message to history
    const updatedHistory = [...chatLog, { role: 'user', content: userMessage }];
    setChatLog(updatedHistory);
    setIsAiTyping(true);
    setCurrentSpeechBubble("hmmm let me think...");
    updateProp('emotion', 'thinking');

    try {
      const response = await fetch('/api/companion/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory,
          companionName: companionConfig.name,
          companionTraits: `Hair style: ${companionConfig.hairStyle}, color: ${companionConfig.hairColor}, eye color: ${companionConfig.eyeColor || '#0284c7'}. Outfit type: ${companionConfig.outfit}, color: ${companionConfig.outfitColor}. Accessory: ${companionConfig.accessory}.`
        })
      });

      const data = await response.json();
      const aiReply = data.reply || "I am glad to chat with you!";
      
      setChatLog(prev => [...prev, { role: 'assistant', content: aiReply }]);
      setCurrentSpeechBubble(aiReply);
      updateProp('emotion', 'smiling');
      setIsAiTyping(false);
      
      // Speak the AI words aloud
      speakTextAloud(aiReply);
    } catch (err) {
      console.error(err);
      const offlineReply = "I'm offline but I still think your digital S-Pen looks spectacular! Tell me more.";
      setChatLog(prev => [...prev, { role: 'assistant', content: offlineReply }]);
      setCurrentSpeechBubble(offlineReply);
      setIsAiTyping(false);
      speakTextAloud(offlineReply);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 text-left bg-slate-950 p-2 text-slate-100 rounded-xl">
      
      {/* Top Banner visual summary */}
      <div className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
        <div className="relative">
          <CompanionMascot 
            hairStyle={companionConfig.hairStyle}
            hairColor={companionConfig.hairColor}
            outfit={companionConfig.outfit}
            outfitColor={companionConfig.outfitColor}
            accessory={companionConfig.accessory}
            emotion={companionConfig.emotion}
            isSpeaking={localMouthActive}
            eyeColor={companionConfig.eyeColor}
            size={70}
          />
          {localMouthActive && (
            <span className="absolute bottom-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={companionConfig.name || ''} 
              onChange={(e) => updateProp('name', e.target.value.substring(0,18))}
              placeholder="Give me a name!"
              className="bg-slate-950 border border-slate-800 text-xs font-bold text-sky-400 p-1 px-2 rounded w-32 focus:border-sky-500 outline-none"
              title="Click to rename your companion"
            />
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase tracking-wider">A.I. Companion</span>
          </div>

          {/* Interactive Speech Bubble Dialogue popup */}
          <div className="relative mt-2 p-1.5 px-2 bg-slate-950 border border-slate-800 rounded-lg text-[10px] leading-relaxed text-slate-200">
            <div className="absolute left-3 -top-1.5 w-2 h-2 bg-slate-950 border-t border-l border-slate-800 transform rotate-45" />
            <p className="line-clamp-2 italic">
              "{currentSpeechBubble}"
            </p>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-850 text-[10.5px] font-bold shrink-0">
        <button
          onClick={() => setActiveTab('customize')}
          className={`flex-1 py-1.5 border-b-2 transition ${activeTab === 'customize' ? 'border-sky-400 text-white font-extrabold bg-slate-900/40' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          🎨 Appearance
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-1.5 border-b-2 transition ${activeTab === 'chat' ? 'border-sky-400 text-white font-extrabold bg-slate-900/40' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          💬 Chat (Gemini)
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 py-1.5 border-b-2 transition ${activeTab === 'voice' ? 'border-sky-400 text-white font-extrabold bg-slate-900/40' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          🔊 Speech Engine
        </button>
      </div>

      {/* Tab bodies */}
      <div className="flex-1 overflow-y-auto space-y-2.5 p-1 scrollbar-none max-h-[290px]">
        
        {/* TAB 1: CUSTOMIZE STYLE */}
        {activeTab === 'customize' && (
          <div className="space-y-3 pb-4">

            {/* INTUITION ANIME PRESETS */}
            <div className="space-y-2 p-2 bg-slate-950 border border-slate-850 rounded-xl">
              <label className="text-[10.5px] font-extrabold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Sparkles size={11} className="text-yellow-400 animate-pulse" /> Anime Character Templates
              </label>
              
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    setCompanionConfig({
                      name: 'Asuka',
                      hairStyle: 'asuka-twins',
                      hairColor: '#f97316',
                      outfit: 'plugsuit-red',
                      outfitColor: '#dc2626',
                      accessory: 'a10-clips',
                      emotion: 'smiling',
                      enableTts: companionConfig.enableTts,
                      voicePitch: 1.35,
                      voiceRate: 1.1,
                      showOnDesktop: true,
                      eyeColor: '#0284c7'
                    });
                    const speak = "Are you an idiot? Move out of my way!";
                    setCurrentSpeechBubble(speak);
                    speakTextAloud(speak);
                  }}
                  className={`p-2 rounded-lg border text-left flex flex-col justify-between transition cursor-pointer relative overflow-hidden h-20 ${companionConfig.hairStyle === 'asuka-twins' ? 'bg-red-950/40 border-red-500 text-white' : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'}`}
                  title="Configure Asuka Langley Soryu"
                >
                  <div>
                    <span className="text-[10px] font-bold text-red-400 block">Asuka Langley</span>
                    <span className="text-[8px] text-slate-400 line-clamp-2 leading-snug">Twin orange tails, Red Plugsuit 02, A10 clips, crystal blue eyes.</span>
                  </div>
                  <span className="absolute bottom-1 right-2 text-[11px] opacity-80">🔥</span>
                </button>

                <button
                  onClick={() => {
                    setCompanionConfig({
                      name: 'Rei',
                      hairStyle: 'rei-shaggy',
                      hairColor: '#93c5fd',
                      outfit: 'plugsuit-white',
                      outfitColor: '#ffffff',
                      accessory: 'a10-clips',
                      emotion: 'thinking',
                      enableTts: companionConfig.enableTts,
                      voicePitch: 0.82,
                      voiceRate: 0.95,
                      showOnDesktop: true,
                      eyeColor: '#dc2626'
                    });
                    const speak = "If I die... I can be replaced. But I will pilot to protect you.";
                    setCurrentSpeechBubble(speak);
                    speakTextAloud(speak);
                  }}
                  className={`p-2 rounded-lg border text-left flex flex-col justify-between transition cursor-pointer relative overflow-hidden h-20 ${companionConfig.hairStyle === 'rei-shaggy' ? 'bg-sky-950/40 border-sky-400 text-white' : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'}`}
                  title="Configure Rei Ayanami"
                >
                  <div>
                    <span className="text-[10px] font-bold text-sky-400 block">Rei Ayanami</span>
                    <span className="text-[8px] text-slate-400 line-clamp-2 leading-snug">Shaggy light blue bob, White Plugsuit 00, A10 clips, scarlet eyes.</span>
                  </div>
                  <span className="absolute bottom-1 right-2 text-[11px] opacity-80">❄️</span>
                </button>
              </div>
            </div>

            {/* Hair style and color selectors */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                Hair Configuration
              </label>
              <div className="grid grid-cols-3 gap-1">
                {HAIR_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => updateProp('hairStyle', style.id)}
                    className={`py-1 text-[9px] font-semibold rounded cursor-pointer transition capitalize ${companionConfig.hairStyle === style.id ? 'bg-sky-600 text-white' : 'bg-slate-900 hover:bg-slate-800'}`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>

              {/* Hair color chips */}
              <div className="flex gap-2.5 items-center p-1.5 bg-slate-900/40 rounded border border-slate-850">
                <span className="text-[9px] text-slate-500 font-mono">Dye Color:</span>
                <div className="flex gap-2 flex-wrap">
                  {HAIR_COLORS.map(color => (
                    <button
                      key={color.value}
                      onClick={() => updateProp('hairColor', color.value)}
                      style={{ backgroundColor: color.value }}
                      className={`w-4 h-4 rounded-full border border-black cursor-pointer transition ${companionConfig.hairColor === color.value ? 'ring-2 ring-sky-400' : ''}`}
                      title={color.name}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={companionConfig.hairColor} 
                    onChange={(e) => updateProp('hairColor', e.target.value)}
                    className="w-4 h-4 rounded cursor-pointer bg-transparent border-0 p-0" 
                    title="Choose customized hair color"
                  />
                </div>
              </div>
            </div>

            {/* Custom Eye Colors Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                Eye Gaze Iris Color
              </label>
              <div className="flex gap-2.5 items-center p-1.5 bg-slate-900/40 rounded border border-slate-850">
                <span className="text-[9px] text-slate-500 font-mono">Iris:</span>
                <div className="flex gap-2">
                  {EYE_COLORS.map(color => (
                    <button
                      key={color.value}
                      onClick={() => updateProp('eyeColor', color.value)}
                      style={{ backgroundColor: color.value }}
                      className={`w-4 h-4 rounded-full border border-black cursor-pointer transition ${(companionConfig.eyeColor || '#0284c7') === color.value ? 'ring-2 ring-sky-400' : ''}`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Outfit design choices */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Outfit Selection
              </label>
              <div className="grid grid-cols-3 gap-1">
                {OUTFITS.map(out => (
                  <button
                    key={out.id}
                    onClick={() => updateProp('outfit', out.id)}
                    className={`py-1 text-[9px] font-semibold rounded cursor-pointer transition capitalize ${companionConfig.outfit === out.id ? 'bg-sky-600 text-white' : 'bg-slate-900 hover:bg-slate-800'}`}
                  >
                    {out.label}
                  </button>
                ))}
              </div>

              {/* Outfit color palette */}
              <div className="flex gap-2.5 items-center p-1.5 bg-slate-900/40 rounded border border-slate-850">
                <span className="text-[9px] text-slate-500 font-mono">Fabric:</span>
                <div className="flex gap-2">
                  {OUTFIT_COLORS.map(color => (
                    <button
                      key={color.value}
                      onClick={() => updateProp('outfitColor', color.value)}
                      style={{ backgroundColor: color.value }}
                      className={`w-4 h-4 rounded-full border border-black cursor-pointer transition ${companionConfig.outfitColor === color.value ? 'ring-2 ring-sky-400' : ''}`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Accessory Extras */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Aura Accessories Extra
              </label>
              <div className="grid grid-cols-3 gap-1">
                {ACCESSORIES.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => updateProp('accessory', acc.id)}
                    className={`py-1 text-[9px] font-semibold rounded cursor-pointer transition capitalize ${companionConfig.accessory === acc.id ? 'bg-sky-600 text-white' : 'bg-slate-900 hover:bg-slate-800'}`}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Face emotion mood setters */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Default Face Mood
              </label>
              <div className="grid grid-cols-3 gap-1">
                {EMOTIONS.map(emo => (
                  <button
                    key={emo.id}
                    onClick={() => updateProp('emotion', emo.id)}
                    className={`py-1 text-[9px] font-semibold rounded cursor-pointer transition capitalize ${companionConfig.emotion === emo.id ? 'bg-sky-600 text-white' : 'bg-slate-900 hover:bg-slate-800'}`}
                  >
                    {emo.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-1.5 text-center">
              <button
                onClick={() => speakTextAloud(`Your design style looks awesome on me!`)}
                className="w-full flex items-center justify-center gap-1 py-1.5 bg-slate-900 hover:bg-slate-850 rounded border border-slate-800 text-[10.5px] text-slate-300 transition cursor-pointer"
              >
                <Play size={11} className="text-sky-400" /> Preview Speech Sync
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CHAT WITH THE COMPANION */}
        {activeTab === 'chat' && (
          <div className="space-y-2 flex flex-col h-[270px]">
            {/* Direct logger */}
            <div className="flex-1 bg-slate-950 border border-slate-850 rounded-xl p-2 overflow-y-auto space-y-2 text-[10px] scrollbar-none h-[180px] leading-relaxed">
              {chatLog.map((message, mIdx) => (
                <div 
                  key={mIdx} 
                  className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[8.5px] text-slate-500 mb-0.5 font-bold font-mono uppercase">
                    <span>{message.role === 'user' ? 'Me' : (companionConfig.name || 'Aero')}</span>
                  </div>
                  <div className={`p-1.5 px-2.5 rounded-xl max-w-[85%] border ${
                    message.role === 'user' 
                      ? 'bg-sky-600/20 border-sky-500/30 text-sky-200 rounded-tr-none' 
                      : 'bg-slate-900 border-slate-850 text-slate-100 rounded-tl-none'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex items-center gap-1 text-[9px] text-slate-500 italic">
                  <RefreshCw size={10} className="animate-spin text-sky-400" /> {companionConfig.name || 'Aero'} is thinking of a reply...
                </div>
              )}
            </div>

            {/* Input tray */}
            <form onSubmit={handleSendMessage} className="flex gap-1.5 shrink-0 mt-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Ask ${companionConfig.name || 'Aero'} anything...`}
                disabled={isAiTyping}
                className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 px-2.5 text-[10.5px] outline-none placeholder-slate-500 text-sky-300 focus:border-sky-500 disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={isAiTyping || !inputText.trim()}
                className="px-3 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold transition flex items-center justify-center cursor-pointer disabled:opacity-40"
              >
                <Send size={11} />
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: SPEECH SYNTHESIS ENGINE */}
        {activeTab === 'voice' && (
          <div className="space-y-3.5 p-1 bg-slate-900/20 rounded border border-slate-850">
            {/* System enable Voice synthesis */}
            <div className="flex items-center justify-between p-1">
              <div>
                <span className="text-[10px] font-bold block text-slate-200">Speech Generation (TTS)</span>
                <span className="text-[8.5px] text-slate-500">Read words aloud via Web Speech API.</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!companionConfig.enableTts}
                  onChange={(e) => updateProp('enableTts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-sky-600" />
              </label>
            </div>

            {/* Speech pitch rating */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>Vocal Tone / Pitch</span>
                <span className="text-sky-400 font-mono font-bold">x{companionConfig.voicePitch || 1.1}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={companionConfig.voicePitch || 1.1}
                onChange={(e) => updateProp('voicePitch', parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-[7.5px] text-slate-600">
                <span>Deeper / Cool</span>
                <span>Cute / Energetic</span>
              </div>
            </div>

            {/* Speaking voice rate speed */}
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>Speaking Rate Speed</span>
                <span className="text-yellow-500 font-mono font-bold">x{companionConfig.voiceRate || 1.0}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.1"
                value={companionConfig.voiceRate || 1.0}
                onChange={(e) => updateProp('voiceRate', parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-950 rounded cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-[7.5px] text-slate-600">
                <span>Slow / Deliberate</span>
                <span>Rapid / Quick</span>
              </div>
            </div>

            <div className="p-2 bg-slate-950/60 rounded border border-slate-850 text-[9px] text-slate-500 space-y-1">
              <span className="font-semibold text-slate-400 block flex items-center gap-1"><Info size={10} className="text-sky-400" /> Sync Details:</span>
              <p>When the companion responds, the vector avatar's mouth coordinates are dynamically synchronized. If Speech is disabled, talking coordinates are visually timed to typing speeds.</p>
            </div>
          </div>
        )}
      </div>

      {onClose && (
        <button 
          onClick={onClose}
          className="w-full text-center py-1.5 bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-400 hover:text-white transition rounded font-extrabold cursor-pointer border-t border-slate-850 uppercase tracking-widest mt-auto shrink-0"
        >
          Minimise Companion Studio
        </button>
      )}
    </div>
  );
}
