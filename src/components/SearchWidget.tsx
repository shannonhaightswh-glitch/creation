import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Folder, Settings, Terminal, Download, ShieldCheck, Cpu } from 'lucide-react';
import { LauncherConfig, AppMetadata, TorrentResult } from '../types';
import { APP_METADATA_LIST, MOCK_TORRENTS } from '../data';

interface SearchWidgetProps {
  config: LauncherConfig;
  updateConfig: (updater: (prev: LauncherConfig) => LauncherConfig) => void;
  onLaunchApp: (appId: string) => void;
  allApps: AppMetadata[];
}

export default function SearchWidget({
  config,
  updateConfig,
  onLaunchApp,
  allApps
}: SearchWidgetProps) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [engineDropdown, setEngineDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<AppMetadata[]>([]);
  const [activeTab, setActiveTab] = useState<'apps' | 'settings' | 'hidden'>('apps');

  // Torrent specific states
  const [torrentQuery, setTorrentQuery] = useState('');
  const [torrentResults, setTorrentResults] = useState<TorrentResult[]>([]);
  const [downloadingTorrents, setDownloadingTorrents] = useState<{ [key: string]: number }>({});
  const [downloadedMagnet, setDownloadedMagnet] = useState<string | null>(null);

  // Termux specific states
  const [termuxHistory, setTermuxHistory] = useState<Array<{ cmd: string; out: string; isError?: boolean }>>([
    { cmd: 'system_init', out: 'Galaxy Note 5+ Termux Simulator v4.12\nType "help" for a list of awesome diagnostic commands!' }
  ]);
  const [termuxInput, setTermuxInput] = useState('');
  const termuxEndRef = useRef<HTMLDivElement>(null);
  const [matrixActive, setMatrixActive] = useState(false);
  const [matrixLines, setMatrixLines] = useState<string[]>([]);

  // Execute terminal text scrolling
  useEffect(() => {
    if (termuxEndRef.current) {
      termuxEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [termuxHistory]);

  // Handle live launcher search filter
  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = allApps.filter(app => {
      // Basic text matches
      const nameMatch = app.name.toLowerCase().includes(lowerQuery);
      const descMatch = app.description?.toLowerCase().includes(lowerQuery) || false;
      const categoryMatch = app.category.toLowerCase().includes(lowerQuery);

      if (!nameMatch && !descMatch && !categoryMatch) return false;

      // Filter based on configurations
      if (app.isHidden) {
        return config.showHidden;
      }
      if (app.category === 'developer') {
        return config.enableDevOptions;
      }
      return true;
    });

    setSearchResults(filtered);
  }, [query, allApps, config.showHidden, config.enableDevOptions]);

  // Manage Matrix animation values
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (matrixActive) {
      interval = setInterval(() => {
        const bin = Array.from({ length: 15 }, () => 
          Math.random() > 0.3 ? Math.floor(Math.random() * 2).toString() : ' '
        ).join('  ');
        setMatrixLines(prev => [bin, ...prev.slice(0, 12)]);
      }, 150);
    } else {
      setMatrixLines([]);
    }
    return () => clearInterval(interval);
  }, [matrixActive]);

  // Torrent search execution
  const handleTorrentSearch = (val: string) => {
    setTorrentQuery(val);
    if (!val) {
      setTorrentResults([]);
      return;
    }
    const lowerVal = val.toLowerCase();
    const results = MOCK_TORRENTS.filter(t => 
      t.title.toLowerCase().includes(lowerVal) && 
      (config.searchEngine === 'torrent' ? true : t.source.toLowerCase() === config.searchEngine)
    );
    setTorrentResults(results);
  };

  // Start simulated torrent download
  const downloadTorrent = (item: TorrentResult) => {
    if (downloadingTorrents[item.title] !== undefined) return;
    
    setDownloadingTorrents(prev => ({ ...prev, [item.title]: 0 }));
    
    const interval = setInterval(() => {
      setDownloadingTorrents(prev => {
        const current = prev[item.title];
        if (current >= 100) {
          clearInterval(interval);
          setDownloadedMagnet(item.title);
          setTimeout(() => setDownloadedMagnet(null), 4000);
          return prev;
        }
        return { ...prev, [item.title]: current + Math.floor(Math.random() * 15) + 5 };
      });
    }, 400);
  };

  // Termux Command Parser
  const runCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    const parts = lower.split(' ');
    const baseCmd = parts[0];
    let output = '';
    let isError = false;

    switch (baseCmd) {
      case 'help':
        output = `Available commands in Note 5+ Space:
• help        - Show this list of tools
• ls          - List standard android user nodes
• clear       - Wipe terminal shell cache
• neofetch    - Print Galaxy Note 5+ System stats and design specs
• root        - Bypass Knox security block & unlock SU mode
• matrix      - Fire up matrix cyber digital rain display
• date        - Print current simulated system hardware timestamp
• search <q>  - Perform quick shell-assisted index locate
• ping <host> - Simulated hardware telemetry handshake`;
        break;

      case 'ls':
        output = `drwxrwx---  system  cache   /cache
drwxr-x---  root    root    /data
-rw-r-----  shell   shell   bitcoin_wallet.dat (hidden)
-rwxr-x---  superuser dev    root_exploit_n5.sh (hidden)
drwxr-xr-x  sdcard  sdcard  /sdcard
drwxr-xr-x  root    root    /system`;
        break;

      case 'clear':
        setTermuxHistory([]);
        setTermuxInput('');
        return;

      case 'neofetch':
        const isNote10 = config.deviceModel === 'note10';
        output = `               .,-:;//;:=,
          . :H##X@###D#H#X#M#H##a-
        .p##P"               "PL#g#
       :H##                     H#H#
      P##P                       HH#P
     p##P      ${isNote10 ? 'SAMSUNG NOTE 10+' : 'SAMSUNG NOTE 5+ '}   HH#P
    p##P       DEVICE LAUNCHER   HH#P
    ###         SIMULATION       ###H
    ###                          ###H
    HH#P                         P##P
     HH#p                       p##P
      H#H#                     ##H#
       HH##g.               .g###P
        "P##H#g.          .h##H"
           "H##X#####M###H##H"

OS: ${isNote10 ? 'Android Pie/10 (One UI 2.1)' : 'Android Marshmallow 6.0.1 (Legacy) + UI Refit'}
Kernel: ${isNote10 ? '4.14.117-exynos9825-2026' : '3.10.61exynos-Note5-2026'}
CPU: ${isNote10 ? 'Exynos 9825 Octa Core (7nm)' : 'Exynos 7420 Octa (14nm)'}
Memory: ${isNote10 ? '12 GB LPDDR4x Dual Channel' : '4 GB LPDDR4 Dual Channel'}
Storage: ${isNote10 ? '256 GB UFS 3.0 High-Speed' : '64 GB UFS 2.0'}
Developer Mode: ${config.enableDevOptions ? 'ENABLED (ADB Active)' : 'DISABLED'}
Root Status: ${config.showHidden ? 'ROOTED (SuperUser Activated)' : 'LOCKED (Knox Secured)'}
Grid Matrix Layout: ${config.gridCols}x${config.gridRows}
Icon Target scale: ${config.iconSize}px`;
        break;

      case 'root':
        if (config.showHidden && config.enableDevOptions) {
          output = 'System is already fully rooted! Knox binary flag: 0x1 (Voided).\nAccessing SuperUser shell context...';
        } else {
          updateConfig(prev => ({ ...prev, showHidden: true, enableDevOptions: true }));
          output = '[*] Sending Odin partition patch...\n[*] Loading galaxy bootstrap kernel...\n[*] KNX trigger voided! Root successfully mounted.\n[!] SYSTEM SECURE CHECK BYPASSED.\nType "ls" to view system secrets now!';
        }
        break;

      case 'matrix':
        setMatrixActive(!matrixActive);
        output = matrixActive ? 'Matrix code stream terminated.' : 'Cyber rain sequence initiated... Look at the widget background!';
        break;

      case 'date':
        output = `System Time: ${new Date().toISOString()}`;
        break;

      case 'ping':
        const host = parts[1] || 'google.com';
        output = `PING ${host} (142.250.72.46) 56(84) bytes of data.
64 bytes from ${host}: icmp_seq=1 ttl=54 time=12.4 ms
64 bytes from ${host}: icmp_seq=2 ttl=54 time=10.9 ms
64 bytes from ${host}: icmp_seq=3 ttl=54 time=13.1 ms
--- ${host} ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2004ms
rtt min/avg/max/mdev = 10.9/12.1/13.1/0.92 ms`;
        break;

      case 'search':
        const q = parts.slice(1).join(' ');
        if (!q) {
          output = 'Usage: search <keywords_such_as_settings_or_hidden_files>';
          isError = true;
        } else {
          const lq = q.toLowerCase();
          const found = allApps.filter(app => 
            app.name.toLowerCase().includes(lq) || 
            app.description?.toLowerCase().includes(lq)
          );
          if (found.length === 0) {
            output = `No files or items matching "${q}" discovered.`;
          } else {
            output = `Discovered ${found.length} active node entries:\n` + 
              found.map(f => `  • [${f.category.toUpperCase()}] ${f.name} - ${f.description || ''}`).join('\n');
          }
        }
        break;

      default:
        output = `sh: command not found: ${baseCmd}\nType "help" to learn available operations.`;
        isError = true;
    }

    setTermuxHistory(prev => [...prev, { cmd: cmdStr, out: output, isError }]);
    setTermuxInput('');
  };

  const currentConfigColor = config.searchTextColor || '#ffffff';
  const customOpacity = (100 - config.searchTransparency) / 100;

  return (
    <div className="w-full relative px-4 py-2 z-40 transition-all duration-300">
      {/* Dropdown Options Selector bar (atop search bar) */}
      <div className="flex justify-start items-center gap-1 mb-1 bg-black/40 backdrop-blur-md rounded-lg p-1 text-[11px] font-medium border border-white/10 w-fit max-w-full overflow-x-auto scrollbar-none shadow-lg">
        <button
          onClick={() => updateConfig(prev => ({ ...prev, searchEngine: 'google' }))}
          className={`px-2 py-1 rounded transition-colors duration-200 cursor-pointer flex items-center gap-1 ${config.searchEngine === 'google' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
        >
          <Globe size={11} /> Google
        </button>
        <button
          onClick={() => updateConfig(prev => ({ ...prev, searchEngine: 'duckduckgo' }))}
          className={`px-2 py-1 rounded transition-colors duration-200 cursor-pointer flex items-center gap-1 ${config.searchEngine === 'duckduckgo' ? 'bg-orange-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
        >
          <Globe size={11} /> DuckDuckGo
        </button>
        <button
          onClick={() => updateConfig(prev => ({ ...prev, searchEngine: 'torrent' }))}
          className={`px-2 py-1 rounded transition-colors duration-200 cursor-pointer flex items-center gap-1 ${config.searchEngine === 'torrent' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
        >
          <Download size={11} /> Torrents
        </button>
        <button
          onClick={() => updateConfig(prev => ({ ...prev, searchEngine: 'termux' }))}
          className={`px-2 py-1 rounded transition-colors duration-200 cursor-pointer flex items-center gap-1 ${config.searchEngine === 'termux' ? 'bg-zinc-700 text-green-400 font-semibold border border-green-500/30' : 'text-slate-300 hover:text-white'}`}
        >
          <Terminal size={11} /> Termux
        </button>
      </div>

      {/* Main Transparent customizable Search Bar */}
      <div 
        style={{ 
          backgroundColor: `rgba(15, 23, 42, ${customOpacity * 0.85})`,
          borderColor: `rgba(255, 255, 255, ${customOpacity * 0.2})` 
        }}
        className="flex items-center gap-2 rounded-xl px-3 py-2.5 border backdrop-blur-md transition-all duration-300 shadow-xl"
      >
        <span className="shrink-0">
          {config.searchEngine === 'termux' ? (
            <Terminal size={18} className="text-green-400 animate-pulse" />
          ) : config.searchEngine === 'torrent' ? (
            <Download size={18} className="text-emerald-400" />
          ) : (
            <Search size={18} style={{ color: currentConfigColor }} />
          )}
        </span>

        {config.searchEngine !== 'termux' ? (
          <input
            id="search_box_input"
            type="text"
            placeholder={
              config.searchEngine === 'google' ? 'Search Google...' :
              config.searchEngine === 'duckduckgo' ? 'Search DuckDuckGo...' :
              'Search torrents (thepiratebay.org, knaben)...'
            }
            value={config.searchEngine === 'torrent' ? torrentQuery : query}
            onChange={(e) => {
              if (config.searchEngine === 'torrent') {
                handleTorrentSearch(e.target.value);
              } else {
                setQuery(e.target.value);
              }
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            style={{ color: currentConfigColor }}
            className="w-full bg-transparent border-none text-sm focus:outline-none placeholder-slate-400 font-medium"
          />
        ) : (
          <div className="flex-1 overflow-hidden" onClick={() => setShowDropdown(true)}>
            <div className="text-xs font-mono text-green-400/90 truncate flex items-center gap-1 cursor-pointer">
              <span>termux-cli:</span>
              <span className="text-white bg-green-950/50 px-1.5 py-0.5 rounded text-[10px] border border-green-500/20 font-semibold animate-pulse">Touch to open Console</span>
            </div>
          </div>
        )}

        {/* Clear/Action Button */}
        {(query || torrentQuery) && (
          <button 
            id="clear_search_btn"
            onClick={() => {
              setQuery('');
              setTorrentQuery('');
              setTorrentResults([]);
              setShowDropdown(false);
            }} 
            className="text-slate-400 hover:text-white text-xs px-1 hover:bg-white/10 rounded cursor-pointer font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Floating Interactive Results Portal Window */}
      {showDropdown && (
        <div 
          id="search_results_portal"
          className="absolute left-4 right-4 mt-2 bg-slate-900/95 backdrop-blur-lg border border-slate-700/60 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 max-h-[350px] overflow-y-auto"
        >
          {/* Header Row depending on Engine */}
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">
              {config.searchEngine === 'google' && 'Google Instant Assistant'}
              {config.searchEngine === 'duckduckgo' && 'DuckDuckGo Duck-Finder'}
              {config.searchEngine === 'torrent' && 'Peer-to-Peer Index Search'}
              {config.searchEngine === 'termux' && 'Active Termux Sandbox'}
            </span>
            <button 
              onClick={() => setShowDropdown(false)} 
              className="text-slate-500 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800 text-[10px] cursor-pointer"
            >
              Hide Results
            </button>
          </div>

          {/* Engine Content Shells */}
          {config.searchEngine === 'google' || config.searchEngine === 'duckduckgo' ? (
            <div>
              {/* App, Settings, Hidden Switcher tabs */}
              <div className="flex gap-2 mb-2 border-b border-slate-800 pb-1.5">
                <button
                  onClick={() => setActiveTab('apps')}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer ${activeTab === 'apps' ? 'bg-blue-600/30 text-blue-400' : 'text-slate-400'}`}
                >
                  Apps ({allApps.filter(a => !a.isSetting && !a.isHidden).length})
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer ${activeTab === 'settings' ? 'bg-amber-600/30 text-amber-400' : 'text-slate-400'}`}
                >
                  Settings & Dev ({allApps.filter(a => a.isSetting && (a.category !== 'developer' || config.enableDevOptions)).length})
                </button>
                {config.showHidden && (
                  <button
                    onClick={() => setActiveTab('hidden')}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded cursor-pointer ${activeTab === 'hidden' ? 'bg-purple-600/30 text-purple-400' : 'text-slate-400'}`}
                  >
                    Hidden Assets ({allApps.filter(a => a.isHidden).length})
                  </button>
                )}
              </div>

              {query ? (
                /* Text filtered launcher matches */
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">Launcher Database Search Matches:</p>
                  {searchResults.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      No indexes found for "{query}". Try "S Pen", "developer", or hidden files.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {searchResults.map(app => (
                        <div
                          key={app.id}
                          onClick={() => {
                            onLaunchApp(app.id);
                            setShowDropdown(false);
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg cursor-pointer group transition-all text-left"
                        >
                          <div className={`p-1.5 rounded-md ${
                            app.isHidden ? 'bg-purple-950 text-purple-400 border border-purple-500/35' :
                            app.isSetting ? 'bg-amber-950 text-amber-400 border border-amber-500/25' :
                            'bg-slate-800 text-slate-200'
                          }`}>
                            <Globe size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 flex items-center gap-1.5">
                              {app.name}
                              {app.isHidden && <span className="text-[9px] bg-purple-500/25 text-purple-300 font-bold px-1 rounded">Hidden</span>}
                              {app.category === 'developer' && <span className="text-[9px] bg-red-500/25 text-red-300 font-bold px-1 rounded">Dev</span>}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">{app.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Simulated web search fallback link */}
                  <div className="mt-3 pt-2 border-t border-slate-800 text-center">
                    <a
                      href={config.searchEngine === 'google' ? `https://www.google.com/search?q=${encodeURIComponent(query)}` : `https://duckduckgo.com/?q=${encodeURIComponent(query)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline flex items-center justify-center gap-1"
                    >
                      Search external web for "{query}" &rarr;
                    </a>
                  </div>
                </div>
              ) : (
                /* Browsing tabs when user has not typed keywords */
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">Browse Quick Settings and Applications:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-[180px] overflow-y-auto">
                    {allApps
                      .filter(app => {
                        if (activeTab === 'apps') return !app.isSetting && !app.isHidden;
                        if (activeTab === 'settings') return app.isSetting && (app.category !== 'developer' || config.enableDevOptions);
                        if (activeTab === 'hidden') return app.isHidden;
                        return false;
                      })
                      .map(app => (
                        <button
                          key={app.id}
                          onClick={() => {
                            onLaunchApp(app.id);
                            setShowDropdown(false);
                          }}
                          className="flex items-center gap-2 p-1.5 hover:bg-slate-800 rounded text-left truncate transition-colors cursor-pointer group"
                        >
                          <span className={`text-xs ${
                            app.isHidden ? 'text-purple-400' :
                            app.isSetting ? 'text-amber-400' :
                            'text-slate-300 group-hover:text-white'
                          }`}>•</span>
                          <span className="text-xs text-slate-300 truncate font-medium group-hover:text-sky-400">{app.name}</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : config.searchEngine === 'torrent' ? (
            /* Torrent searching logic */
            <div>
              <div className="flex gap-2 mb-2 items-center text-[10px] text-slate-400">
                <span className="bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">TORRENTS AVAILABLE</span>
                <span>Ready to peer link via high speed Note 5 magnet trackers</span>
              </div>

              {downloadedMagnet && (
                <div className="mb-2 p-2 bg-emerald-950/40 border border-emerald-500/30 rounded text-xs text-emerald-300 flex items-center gap-2 animate-bounce">
                  <ShieldCheck size={14} className="shrink-0 text-emerald-400" />
                  <div>
                    <span className="font-bold">Downloaded:</span> "{downloadedMagnet}" has completed! Simulated install active.
                  </div>
                </div>
              )}

              <input
                id="torrent_sub_search"
                type="text"
                placeholder="Type query to filter TPB & Knaben..."
                value={torrentQuery}
                onChange={(e) => handleTorrentSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 outline-none mb-3 placeholder-slate-500 focus:border-emerald-500"
              />

              {torrentResults.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  {torrentQuery ? 'No matched torrent packages found.' : 'Type package keywords to fetch pirate indicators (e.g., rom, superuser, termux)'}
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                  {torrentResults.map((item, idx) => {
                    const progress = downloadingTorrents[item.title];
                    const isDownloading = progress !== undefined && progress < 100;
                    const isFinished = progress >= 100;

                    return (
                      <div key={idx} className="bg-slate-950 p-2 rounded border border-slate-800/85 hover:border-slate-700 transition flex justify-between items-center gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
                            <span className={`text-[9px] px-1 rounded font-bold ${item.source === 'ThePirateBay' ? 'bg-orange-600/30 text-orange-400 border border-orange-500/20' : 'bg-pink-600/30 text-pink-400 border border-pink-500/20'}`}>
                              {item.source}
                            </span>
                            <span className="truncate">{item.title}</span>
                          </div>
                          <div className="flex gap-3 text-[10px] text-slate-400 mt-1">
                            <span>Size: {item.size}</span>
                            <span className="text-green-400 font-medium">S: {item.seeds}</span>
                            <span className="text-red-400 font-medium">L: {item.leeches}</span>
                          </div>
                          {progress !== undefined && (
                            <div className="w-full bg-slate-900 rounded-full h-1 mt-1.5 overflow-hidden">
                              <div style={{ width: `${Math.min(progress, 100)}%` }} className="bg-emerald-500 h-full transition-all duration-300" />
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => downloadTorrent(item)}
                          disabled={isFinished || isDownloading}
                          className={`shrink-0 px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition flex items-center gap-1 ${
                            isFinished ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' :
                            isDownloading ? 'bg-slate-800 text-slate-400 animate-pulse' :
                            'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          {isFinished ? 'Seeding' : isDownloading ? `${progress}%` : 'Magnet'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Termux CLI execution window on home screen */
            <div className="font-mono text-left relative overflow-hidden bg-slate-950/95 rounded-lg border border-slate-800 p-2">
              {/* Matrix code drop background overlay */}
              {matrixActive && (
                <div className="absolute inset-0 pointer-events-none opacity-20 font-mono text-[9px] text-green-500 overflow-hidden leading-none z-0 select-none">
                  {matrixLines.map((line, lIdx) => (
                    <div key={lIdx} className="whitespace-pre">{line}</div>
                  ))}
                </div>
              )}

              <div className="relative z-10">
                <div className="h-[140px] overflow-y-auto pr-1 text-[11px] font-mono leading-relaxed space-y-1">
                  {termuxHistory.map((item, index) => (
                    <div key={index} className="border-b border-white/5 pb-1">
                      {item.cmd !== 'system_init' && (
                        <div className="text-slate-400 flex items-center gap-1">
                          <span className="text-green-500 font-bold">$</span> <span>{item.cmd}</span>
                        </div>
                      )}
                      <pre className={`whitespace-pre-wrap ${item.isError ? 'text-red-400' : 'text-slate-200'}`}>
                        {item.out}
                      </pre>
                    </div>
                  ))}
                  <div ref={termuxEndRef} />
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-slate-800 flex items-center gap-1">
                  <span className="text-green-500 font-mono text-xs font-bold">$</span>
                  <input
                    id="termux_sub_input"
                    type="text"
                    value={termuxInput}
                    onChange={(e) => setTermuxInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        runCommand(termuxInput);
                      }
                    }}
                    placeholder="Enter Termux command (help, ls, neofetch)..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-xs text-green-400 font-mono outline-none placeholder-slate-600 focus:border-green-500"
                  />
                  <button
                    onClick={() => runCommand(termuxInput)}
                    className="bg-green-600/20 hover:bg-green-600/40 text-green-400 border border-green-500/30 px-2 py-0.5 rounded text-[10px] font-bold font-mono cursor-pointer"
                  >
                    RUN
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
