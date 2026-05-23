import React, { useState } from 'react';
import { Folder, Trash2, Plus, Sliders, Info, ShieldAlert } from 'lucide-react';
import { FolderInstance, AppInstance, AppMetadata, LauncherConfig } from '../types';

interface FolderDialogProps {
  folder: FolderInstance;
  onUpdateFolder: (updated: FolderInstance) => void;
  onClose: () => void;
  config: LauncherConfig;
  allApps: AppMetadata[];
}

export default function FolderDialog({
  folder,
  onUpdateFolder,
  onClose,
  config,
  allApps
}: FolderDialogProps) {
  const [editingName, setEditingName] = useState(folder.name);
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg'>(folder.visualSize || 'md');
  const [selectedCapacity, setSelectedCapacity] = useState<number>(folder.maxCapacity || 8);
  const [selectedColor, setSelectedColor] = useState<string>(folder.color || 'bg-blue-600/30');

  // Find app metadata
  const nestedAppsMetadata = folder.apps.map(appInstance => {
    return {
      instanceId: appInstance.id,
      metadata: allApps.find(a => a.id === appInstance.metadataId)
    };
  }).filter(item => item.metadata !== undefined) as Array<{ instanceId: string; metadata: AppMetadata }>;

  // Apps that are not in this folder already
  const externalAvailableApps = allApps.filter(app => {
    const isAlreadyIn = folder.apps.some(a => a.metadataId === app.id);
    if (isAlreadyIn) return false;
    if (app.isHidden) return config.showHidden;
    if (app.category === 'developer') return config.enableDevOptions;
    return true;
  });

  const handleSaveNameChange = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFolder({
      ...folder,
      name: editingName
    });
  };

  const handleNameBlur = () => {
    onUpdateFolder({
      ...folder,
      name: editingName || 'Unnamed Folder'
    });
  };

  const updateVisualSize = (newSize: 'sm' | 'md' | 'lg') => {
    setSelectedSize(newSize);
    onUpdateFolder({
      ...folder,
      visualSize: newSize
    });
  };

  const updateCapacity = (newCap: number) => {
    setSelectedCapacity(newCap);
    // If current apps length is greater than capacity, we slice or warn
    const correctApps = folder.apps.slice(0, newCap);
    onUpdateFolder({
      ...folder,
      maxCapacity: newCap,
      apps: correctApps
    });
  };

  const updateFolderColor = (colClass: string) => {
    setSelectedColor(colClass);
    onUpdateFolder({
      ...folder,
      color: colClass
    });
  };

  const removeNestedApp = (instanceId: string) => {
    const nextApps = folder.apps.filter(app => app.id !== instanceId);
    onUpdateFolder({
      ...folder,
      apps: nextApps
    });
  };

  const addAppToFolder = (metadataId: string) => {
    if (folder.apps.length >= selectedCapacity) {
      alert(`Limit reached! Folder is configured to hold a maximum of ${selectedCapacity} items.`);
      return;
    }

    const newInstance: AppInstance = {
      id: `nested_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      metadataId,
      type: 'app',
      position: { x: 0, y: 0, gridRow: 0, gridCol: 0 },
      isFreeFloating: false,
      sizeMultiplier: 1.0
    };

    onUpdateFolder({
      ...folder,
      apps: [...folder.apps, newInstance]
    });
  };

  const colorOptions = [
    { name: 'TouchWiz Blue', value: 'bg-blue-600/35 border-blue-500/40 text-blue-300' },
    { name: 'Gold Satin', value: 'bg-yellow-600/35 border-yellow-500/40 text-yellow-300' },
    { name: 'Prism Green', value: 'bg-emerald-600/35 border-emerald-500/40 text-emerald-300' },
    { name: 'Pearly Grey', value: 'bg-slate-700/40 border-slate-600/55 text-slate-300' },
    { name: 'Aura Violet', value: 'bg-purple-600/35 border-purple-500/40 text-purple-300' },
    { name: 'Crimson Edge', value: 'bg-red-600/35 border-red-500/40 text-red-300' }
  ];

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 text-slate-100 shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200"
      >
        {/* Header Name Input */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-3">
          <div className="flex-1 mr-3">
            <form onSubmit={handleSaveNameChange} className="w-full">
              <input
                id="folder_name_editor"
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleNameBlur}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-base font-bold text-sky-400 focus:outline-none focus:border-sky-500 w-full"
                placeholder="Enter folder title..."
              />
            </form>
            <span className="text-[10px] text-slate-400 mt-1 block">Rename & customize folder options.</span>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Done
          </button>
        </div>

        {/* Folder Capacity and Sizing Config Row */}
        <div className="grid grid-cols-2 gap-3 text-left">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Visual Scale size</label>
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              {(['sm', 'md', 'lg'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => updateVisualSize(size)}
                  className={`flex-1 text-[10px] py-1 font-bold rounded cursor-pointer transition ${selectedSize === size ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">
              Cap content limit (<span className="text-sky-400 font-bold">{selectedCapacity}</span>)
            </label>
            <input
              id="folder_capacity_range"
              type="range"
              min="2"
              max="24"
              value={selectedCapacity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateCapacity(val);
              }}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-500 mt-2.5"
            />
            <span className="text-[9px] text-slate-500 block mt-1">Allow 2 to 24 apps</span>
          </div>
        </div>

        {/* Color Dot choices */}
        <div className="text-left">
          <label className="text-[11px] text-slate-400 block mb-1.5">Folder theme accent style</label>
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((opt, oIdx) => (
              <button
                key={oIdx}
                title={opt.name}
                onClick={() => updateFolderColor(opt.value)}
                className={`w-6 h-6 rounded-full cursor-pointer transition border ${selectedColor === opt.value ? 'ring-2 ring-sky-400 scale-110 shadow-lg' : 'opacity-80 hover:opacity-100 hover:scale-105'} ${opt.value.split(' ')[0]} ${opt.value.split(' ')[1]}`}
              />
            ))}
          </div>
        </div>

        {/* Scrollable list of contained applications */}
        <div className="text-left flex-1 border border-slate-800 rounded-xl p-3 bg-slate-950/40 flex flex-col min-h-[140px] max-h-[180px] overflow-hidden">
          <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2 shrink-0">
            <span>Contained Apps list ({nestedAppsMetadata.length} / {selectedCapacity})</span>
            {nestedAppsMetadata.length >= selectedCapacity && (
              <span className="text-red-400 text-[9px] font-medium flex items-center gap-1">
                <ShieldAlert size={10} /> Full
              </span>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {nestedAppsMetadata.length === 0 ? (
              <div className="text-center py-6 text-slate-500 font-medium text-xs">
                No nested items yet. Add apps below!
              </div>
            ) : (
              nestedAppsMetadata.map(item => (
                <div 
                  key={item.instanceId} 
                  className="flex justify-between items-center bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs"
                >
                  <span className="text-slate-200 font-medium truncate">{item.metadata.name}</span>
                  <button
                    onClick={() => removeNestedApp(item.instanceId)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/40 p-1 rounded font-bold cursor-pointer"
                    title="Remove from folder"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Option to ADD applications */}
        <div className="text-left">
          <label className="text-[11px] text-slate-400 block mb-1.5">Add apps into folder slots</label>
          {externalAvailableApps.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic">No available metadata to add.</p>
          ) : (
            <div className="flex gap-2.5 max-w-full overflow-x-auto scrollbar-thin py-1">
              {externalAvailableApps.map(optApp => (
                <button
                  key={optApp.id}
                  onClick={() => addAppToFolder(optApp.id)}
                  disabled={folder.apps.length >= selectedCapacity}
                  className={`shrink-0 px-2.5 py-1 bg-slate-800 hover:bg-sky-900 border border-slate-700 hover:border-sky-700 rounded-md text-[10px] font-bold text-slate-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  + {optApp.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
