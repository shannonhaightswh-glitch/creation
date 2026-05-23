import React, { useState, useRef, useEffect } from 'react';
import { Folder, Pin, Trash2, Edit, Move, Sun, ExternalLink, Moon } from 'lucide-react';
import { LauncherItem, LauncherConfig, AppMetadata, FolderInstance } from '../types';

interface LauncherViewProps {
  config: LauncherConfig;
  items: LauncherItem[];
  setItems: React.Dispatch<React.SetStateAction<LauncherItem[]>>;
  allApps: AppMetadata[];
  onLaunchApp: (appId: string) => void;
  onOpenFolderSettings: (folder: FolderInstance) => void;
  isEditMode: boolean;
  setIsEditMode: (active: boolean) => void;
}

export default function LauncherView({
  config,
  items,
  setItems,
  allApps,
  onLaunchApp,
  onOpenFolderSettings,
  isEditMode,
  setIsEditMode
}: LauncherViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragItem, setDragItem] = useState<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  // Quick context selection state
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Handles adding folders or custom shortcuts dynamically from contextual menus
  const handleAddNewFolder = () => {
    const defaultPosition = getFirstEmptyGrid();
    const newFolder: FolderInstance = {
      id: `folder_${Date.now()}`,
      type: 'folder',
      name: 'New Folder',
      color: 'bg-indigo-600/35 border-indigo-500/40 text-indigo-300',
      apps: [],
      position: defaultPosition,
      isFreeFloating: false,
      sizeMultiplier: 1.0,
      visualSize: 'md',
      maxCapacity: 8
    };

    setItems(prev => [...prev, newFolder]);
    onOpenFolderSettings(newFolder);
  };

  const handleCreateFreefloatApp = (metadataId: string) => {
    const newApp: LauncherItem = {
      id: `app_${Date.now()}`,
      metadataId,
      type: 'app',
      position: { x: 30 + Math.random() * 20, y: 40 + Math.random() * 20, gridRow: 1, gridCol: 1 },
      isFreeFloating: true,
      sizeMultiplier: 1.2
    };
    setItems(prev => [...prev, newApp]);
  };

  const getFirstEmptyGrid = () => {
    for (let r = 2; r <= config.gridRows; r++) {
      for (let c = 1; c <= config.gridCols; c++) {
        const occupied = items.some(item => !item.isFreeFloating && item.position.gridRow === r && item.position.gridCol === c);
        if (!occupied) return { x: 0, y: 0, gridRow: r, gridCol: c };
      }
    }
    return { x: 0, y: 0, gridRow: 3, gridCol: 1 };
  };

  // Drag listeners
  const onMouseDown = (e: React.MouseEvent, item: LauncherItem) => {
    if (!isEditMode) return;
    e.preventDefault();
    
    const pageX = e.pageX;
    const pageY = e.pageY;

    setDragItem({
      id: item.id,
      startX: pageX,
      startY: pageY,
      origX: item.isFreeFloating ? item.position.x : 0,
      origY: item.isFreeFloating ? item.position.y : 0
    });
  };

  const onTouchStart = (e: React.TouchEvent, item: LauncherItem) => {
    if (!isEditMode) return;
    const touch = e.touches[0];
    
    setDragItem({
      id: item.id,
      startX: touch.pageX,
      startY: touch.pageY,
      origX: item.isFreeFloating ? item.position.x : 0,
      origY: item.isFreeFloating ? item.position.y : 0
    });
  };

  useEffect(() => {
    const handleMove = (pageX: number, pageY: number) => {
      if (!dragItem || !containerRef.current) return;

      const containerBounds = containerRef.current.getBoundingClientRect();
      const currentItem = items.find(i => i.id === dragItem.id);
      if (!currentItem) return;

      if (currentItem.isFreeFloating) {
        // Absolute free-floating dragging logic using container percentage limits
        const deltaX = pageX - dragItem.startX;
        const deltaY = pageY - dragItem.startY;
        
        const deltaXPct = (deltaX / containerBounds.width) * 100;
        const deltaYPct = (deltaY / containerBounds.height) * 100;

        let newX = dragItem.origX + deltaXPct;
        let newY = dragItem.origY + deltaYPct;

        // CLAMP boundaries
        newX = Math.max(2, Math.min(newX, 90));
        newY = Math.max(2, Math.min(newY, 90));

        setItems(prev => prev.map(item => {
          if (item.id === dragItem.id) {
            return {
              ...item,
              position: { ...item.position, x: newX, y: newY }
            };
          }
          return item;
        }));
      } else {
        // Grid placement preview overlay logic could trigger. We snap on mouse up / touch end.
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!dragItem || !containerRef.current) return;
      
      const currentItem = items.find(i => i.id === dragItem.id);
      if (currentItem && !currentItem.isFreeFloating) {
        // Calculate snap grid rows/cols based on mouse drop coordinates
        const containerBounds = containerRef.current.getBoundingClientRect();
        const dropX = e.pageX - containerBounds.left;
        const dropY = e.pageY - containerBounds.top;

        const cellWidth = containerBounds.width / config.gridCols;
        const cellHeight = containerBounds.height / config.gridRows;

        let targetCol = Math.ceil(dropX / cellWidth);
        let targetRow = Math.ceil(dropY / cellHeight);

        // Clamp row and columns
        targetCol = Math.max(1, Math.min(targetCol, config.gridCols));
        targetRow = Math.max(1, Math.min(targetRow, config.gridRows));

        // Check occupancy
        const isOccupied = items.some(item => 
          item.id !== dragItem.id && 
          !item.isFreeFloating && 
          item.position.gridRow === targetRow && 
          item.position.gridCol === targetCol
        );

        if (!isOccupied) {
          setItems(prev => prev.map(item => {
            if (item.id === dragItem.id) {
              return {
                ...item,
                position: { ...item.position, gridRow: targetRow, gridCol: targetCol }
              };
            }
            return item;
          }));
        }
      }
      setDragItem(null);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (dragItem) {
        const touch = e.touches[0];
        handleMove(touch.pageX, touch.pageY);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (dragItem) {
        handleMove(e.pageX, e.pageY);
      }
    };

    if (dragItem) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp as any);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp as any);
    };
  }, [dragItem, items, config, setItems]);

  // Command button triggers
  const toggleItemFloating = (itemId: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const nextFloating = !item.isFreeFloating;
        return {
          ...item,
          isFreeFloating: nextFloating,
          position: nextFloating 
            ? { x: 35, y: 50, gridRow: 1, gridCol: 1 } // Put floating item near center
            : getFirstEmptyGrid()
        };
      }
      return item;
    }));
  };

  const scaleItemMultiplier = (itemId: string, direction: 'up' | 'down') => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const currentScale = item.sizeMultiplier || 1.0;
        const nextScale = direction === 'up' ? Math.min(currentScale + 0.15, 1.6) : Math.max(currentScale - 0.15, 0.7);
        return {
          ...item,
          sizeMultiplier: parseFloat(nextScale.toFixed(2))
        };
      }
      return item;
    }));
  };

  const deleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItemId(null);
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative w-full h-full select-none overflow-hidden"
    >
      {/* Grid lines display for visual placement help during edit mode */}
      {isEditMode && (
        <div className="absolute inset-0 grid pointer-events-none opacity-15 border border-white/20"
          style={{
            gridTemplateColumns: `repeat(${config.gridCols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${config.gridRows}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: config.gridCols * config.gridRows }).map((_, idx) => (
            <div key={idx} className="border-r border-b border-white/20 flex items-center justify-center">
              <span className="text-[7px] text-white/50">{idx + 1}</span>
            </div>
          ))}
        </div>
      )}

      {/* Floating control toolbar when launcher edit is locked or active */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-30 max-w-[95%] overflow-x-auto scrollbar-none shadow-lg">
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`px-3 py-1 rounded-full text-[10px] font-extrabold cursor-pointer transition flex items-center gap-1.5 ${isEditMode ? 'bg-amber-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300 hover:text-white'}`}
        >
          {isEditMode ? 'Lock Edits (Save)' : '✏️ Long-Press/Unlock'}
        </button>
        {isEditMode && (
          <>
            <button
              onClick={handleAddNewFolder}
              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-full text-[10px] font-bold cursor-pointer"
            >
              + Folder
            </button>
            <div className="h-4 w-[1px] bg-white/20" />
            <span className="text-[9px] text-slate-400">Hold / Drag item to reposition</span>
          </>
        )}
      </div>

      {/* RENDER ALL HOME WORKSPACE ITEMS (Grid-aligned + Free floating) */}
      <div className="w-full h-full relative">
        {items.map((item) => {
          let itemMetadata: AppMetadata | null = null;
          let isFolder = item.type === 'folder';

          if (!isFolder) {
            itemMetadata = allApps.find(a => a.id === (item as any).metadataId) || null;
            if (!itemMetadata) return null;
          }

          const hasCustomSelection = selectedItemId === item.id;
          const folderInst = item as FolderInstance;

          // Compute absolute visual coordinates based on state type
          const placementStyle: React.CSSProperties = item.isFreeFloating 
            ? {
                position: 'absolute',
                left: `${item.position.x}%`,
                top: `${item.position.y}%`,
                transform: `translate(-50%, -50%) scale(${item.sizeMultiplier || 1.0})`,
                zIndex: hasCustomSelection ? 40 : 20,
                cursor: isEditMode ? 'grab' : 'pointer'
              }
            : {
                position: 'absolute',
                left: `${((item.position.gridCol - 1) / config.gridCols) * 100}%`,
                top: `${((item.position.gridRow - 1) / config.gridRows) * 100}%`,
                width: `${100 / config.gridCols}%`,
                height: `${100 / config.gridRows}%`,
                padding: '4px',
                zIndex: hasCustomSelection ? 40 : 10,
                transform: `scale(${item.sizeMultiplier || 1.0})`,
                cursor: isEditMode ? 'grab' : 'pointer'
              };

          return (
            <div
              key={item.id}
              style={placementStyle}
              onMouseDown={(e) => onMouseDown(e, item)}
              onTouchStart={(e) => onTouchStart(e, item)}
              className="transition-shadow duration-200"
            >
              {/* Launcher Visual Core Frame */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEditMode) {
                    setSelectedItemId(hasCustomSelection ? null : item.id);
                  } else {
                    if (isFolder) {
                      onOpenFolderSettings(folderInst);
                    } else if (itemMetadata) {
                      onLaunchApp(itemMetadata.id);
                    }
                  }
                }}
                className={`w-full h-full flex flex-col items-center justify-center rounded-xl p-1 relative transition-all duration-300 ${
                  isEditMode ? 'hover:bg-white/10' : 'hover:scale-102 hover:bg-black/15'
                } ${hasCustomSelection ? 'bg-sky-500/25 border-2 border-sky-400 shadow-2xl' : ''}`}
              >
                {/* Floating flag visual badge indicator */}
                {item.isFreeFloating && (
                  <span className="absolute top-0.5 right-0.5 bg-yellow-500 text-slate-900 border border-yellow-300 text-[7px] font-bold px-1 rounded scale-85 animate-bounce">
                    Float
                  </span>
                )}

                {/* --- GRAPHICS LOGIC: S-Pen folder vs standard application icon --- */}
                {isFolder ? (
                  /* Folder component renderer */
                  <div className={`flex flex-col items-center justify-center`}>
                    <div className={`rounded-2xl border flex flex-wrap items-center justify-center p-1.5 gap-0.5 shadow-md transition-all ${
                      folderInst.visualSize === 'lg' ? 'w-16 h-16' : 
                      folderInst.visualSize === 'sm' ? 'w-10 h-10' : 'w-13 h-13'
                    } ${folderInst.color || 'bg-blue-600/30'}`}>
                      {folderInst.apps.slice(0, 4).map((innerVal, dotIdx) => {
                        const meta = allApps.find(a => a.id === innerVal.metadataId);
                        return (
                          <div key={dotIdx} className="w-3.5 h-3.5 bg-slate-100/30 rounded-full flex items-center justify-center text-[5px] font-bold">
                            {meta?.name ? meta.name[0] : '•'}
                          </div>
                        );
                      })}
                      {folderInst.apps.length === 0 && (
                        <Folder size={16} className="text-white/40" />
                      )}
                    </div>
                    <span 
                      style={{ fontSize: `${config.iconSize * 0.2}px` }}
                      className="text-[10px] font-semibold text-white drop-shadow-md truncate max-w-full text-center mt-1.5"
                    >
                      {folderInst.name}
                    </span>
                    <span className="text-[7px] text-white/50">{folderInst.apps.length} slots used</span>
                  </div>
                ) : (
                  /* Standard app component renderer */
                  <div className="flex flex-col items-center justify-center">
                    {/* Circle icon with background accent */}
                    <div 
                      style={{ width: `${config.iconSize}px`, height: `${config.iconSize}px` }}
                      className={`rounded-full flex items-center justify-center shadow-lg border border-white/10 ${
                        itemMetadata?.isHidden ? 'bg-purple-950/70 text-purple-300 border-purple-500/30' :
                        itemMetadata?.isSetting ? 'bg-amber-950/70 text-amber-300 border-amber-500/30' :
                        'bg-slate-900/40 text-slate-100'
                      }`}
                    >
                      {/* Generates a stylized text letter avatar since we don't have visual image files */}
                      <span className="text-lg font-extrabold uppercase font-mono tracking-tight drop-shadow-sm text-center">
                        {itemMetadata?.name[0]}
                      </span>
                    </div>

                    <span 
                      style={{ fontSize: `${config.iconSize * 0.2}px` }}
                      className="text-[10px] font-semibold text-white drop-shadow-md truncate max-w-full text-center mt-1"
                    >
                      {itemMetadata?.name}
                    </span>
                  </div>
                )}

                {/* Multi selection contextual control popup inside editing canvas */}
                {hasCustomSelection && (
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute -top-16 bg-slate-950 border border-sky-400 p-1.5 rounded-xl shadow-2xl flex items-center gap-1 z-50 text-[10px] text-slate-100 animate-in fade-in duration-100 scale-95"
                  >
                    {/* Free float snap toggle */}
                    <button
                      onClick={() => toggleItemFloating(item.id)}
                      className="p-1 hover:bg-white/10 rounded text-amber-400 hover:text-white"
                      title={item.isFreeFloating ? 'Lock back to normal grid cell' : 'Enable Free-Float pixel placement'}
                    >
                      <Move size={12} />
                    </button>

                    {/* Scale tools */}
                    <button
                      onClick={() => scaleItemMultiplier(item.id, 'up')}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
                      title="Enlarge icon scale size"
                    >
                      +Size
                    </button>
                    <button
                      onClick={() => scaleItemMultiplier(item.id, 'down')}
                      className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
                      title="Reduce icon scale size"
                    >
                      -Size
                    </button>

                    {/* Folder properties helper */}
                    {isFolder && (
                      <button
                        onClick={() => {
                          onOpenFolderSettings(folderInst);
                          setSelectedItemId(null);
                        }}
                        className="px-1 py-0.5 bg-blue-600 rounded text-white"
                      >
                        Adjust
                      </button>
                    )}

                    {/* Trash shortcut */}
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1 hover:bg-red-950 rounded text-red-400"
                      title="Delete workspace shortcut"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Workspace Right-Click trigger helper background (when user clicks empty space in edit mode) */}
      <div 
        className="absolute inset-0 z-0"
        onClick={() => {
          setSelectedItemId(null);
        }}
      />
    </div>
  );
}
