'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { DEV_TOOLS, ToolDefinition } from '@/types/tools';
import { DEV_REFERENCES, ReferenceItem } from '@/types/references';
import { Icon } from './Icon';
import {
  Search,
  X,
  CornerDownLeft,
  Copy,
  Check,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
}

type PaletteMode = 'all' | 'tools' | 'references';

type ToolPaletteItem = {
  type: 'tool';
  data: ToolDefinition;
  score: number;
};

type ReferencePaletteItem = {
  type: 'reference';
  data: ReferenceItem;
  score: number;
};

type UnifiedPaletteItem = ToolPaletteItem | ReferencePaletteItem;

export function CommandPalette({ isOpen, onClose, onSelectTool }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<PaletteMode>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [recentIds, setRecentIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('devshack_recent_searches');
        if (saved) return JSON.parse(saved);
      } catch {
        // Ignore
      }
    }
    return ['json-formatter', 'jwt-decoder', 'curl-post-json', 'ref-sha256'];
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // Focus on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const saveRecent = useCallback((id: string) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((item) => item !== id)].slice(0, 8);
      try {
        localStorage.setItem('devshack_recent_searches', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  // Search and score filtering
  const filteredItems = useMemo<UnifiedPaletteItem[]>(() => {
    const q = query.trim().toLowerCase();

    const toolItems: ToolPaletteItem[] = (mode === 'all' || mode === 'tools' ? DEV_TOOLS : []).map((t) => {
      let score = 0;
      if (!q) {
        score = t.popular ? 50 : 20;
        if (recentIds.includes(t.id)) score += 100;
        return { type: 'tool' as const, data: t, score };
      }

      if (t.id.toLowerCase() === q) score += 200;
      if (t.title.toLowerCase().startsWith(q)) score += 150;
      if (t.title.toLowerCase().includes(q)) score += 100;
      if (t.shortName.toLowerCase().includes(q)) score += 90;
      if (t.category.toLowerCase().includes(q)) score += 60;
      if (t.keywords.some((k) => k.toLowerCase() === q)) score += 120;
      if (t.keywords.some((k) => k.toLowerCase().includes(q))) score += 70;
      if (t.description.toLowerCase().includes(q)) score += 40;

      return { type: 'tool' as const, data: t, score };
    }).filter((item) => !q || item.score > 0);

    const referenceItems: ReferencePaletteItem[] = (mode === 'all' || mode === 'references' ? DEV_REFERENCES : []).map((r) => {
      let score = 0;
      if (!q) {
        score = 10;
        if (recentIds.includes(r.id)) score += 100;
        return { type: 'reference' as const, data: r, score };
      }

      if (r.id.toLowerCase() === q) score += 200;
      if (r.title.toLowerCase().startsWith(q)) score += 150;
      if (r.title.toLowerCase().includes(q)) score += 100;
      if (r.category.toLowerCase().includes(q)) score += 60;
      if (r.keywords.some((k) => k.toLowerCase() === q)) score += 130;
      if (r.keywords.some((k) => k.toLowerCase().includes(q))) score += 75;
      if (r.content.toLowerCase().includes(q)) score += 45;
      if (r.description.toLowerCase().includes(q)) score += 35;

      return { type: 'reference' as const, data: r, score };
    }).filter((item) => !q || item.score > 0);

    return [...toolItems, ...referenceItems].sort((a, b) => b.score - a.score);
  }, [query, mode, recentIds]);

  const activeIndex = Math.min(selectedIndex, Math.max(0, filteredItems.length - 1));

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSelectedIndex(0);
  };

  const handleModeChange = (newMode: PaletteMode) => {
    setMode(newMode);
    setSelectedIndex(0);
  };

  // Copy to clipboard helper
  const handleCopySnippet = useCallback(async (item: ReferenceItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(item.content);
      }
      setCopiedId(item.id);
      saveRecent(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  }, [saveRecent]);

  const handleSelectItem = useCallback((item: UnifiedPaletteItem) => {
    if (item.type === 'tool') {
      saveRecent(item.data.id);
      onSelectTool(item.data.id);
      onClose();
    } else if (item.type === 'reference') {
      if (item.data.actionToolId) {
        saveRecent(item.data.id);
        onSelectTool(item.data.actionToolId);
        onClose();
      } else {
        handleCopySnippet(item.data);
      }
    }
  }, [saveRecent, onSelectTool, onClose, handleCopySnippet]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setMode((prev) => {
          if (prev === 'all') return 'tools';
          if (prev === 'tools') return 'references';
          return 'all';
        });
        setSelectedIndex(0);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const active = filteredItems[activeIndex];
        if (active) {
          handleSelectItem(active);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, activeIndex, onClose, handleSelectItem]);

  // Scroll active item into view
  useEffect(() => {
    if (listContainerRef.current) {
      const activeEl = listContainerRef.current.querySelector(
        `[data-palette-index="${activeIndex}"]`
      ) as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  if (!isOpen) return null;

  return (
    <div
      id="command-palette-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4"
      onClick={onClose}
    >
      <div
        id="command-palette-modal"
        className="w-full max-w-2xl bg-[#0E0E10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 bg-[#161618]">
          <Search className="w-4 h-4 text-blue-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            id="command-palette-input"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Type a tool or reference (e.g., jwt, sha256, cron, json, curl, ports, 401)..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              type="button"
              id="clear-command-query-btn"
              onClick={() => handleQueryChange('')}
              className="text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-black/40 border border-white/10 rounded text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Scope Tabs */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#111112] text-xs">
          <div className="flex items-center gap-1">
            <button
              type="button"
              id="palette-tab-all"
              onClick={() => handleModeChange('all')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer',
                mode === 'all'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              )}
            >
              All ({DEV_TOOLS.length + DEV_REFERENCES.length})
            </button>
            <button
              type="button"
              id="palette-tab-tools"
              onClick={() => handleModeChange('tools')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                mode === 'tools'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              )}
            >
              <Code2 className="w-3 h-3" />
              <span>Tools ({DEV_TOOLS.length})</span>
            </button>
            <button
              type="button"
              id="palette-tab-references"
              onClick={() => handleModeChange('references')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5',
                mode === 'references'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              )}
            >
              <BookOpen className="w-3 h-3" />
              <span>References ({DEV_REFERENCES.length})</span>
            </button>
          </div>

          <div className="text-[11px] text-zinc-500 hidden sm:flex items-center gap-1">
            <span>Press</span>
            <kbd className="px-1 py-0.5 rounded bg-black/40 border border-white/10 font-mono text-[10px]">
              Tab
            </kbd>
            <span>to cycle</span>
          </div>
        </div>

        {/* Results List */}
        <div
          ref={listContainerRef}
          className="overflow-y-auto p-2 space-y-1.5 flex-1 scrollbar-hide max-h-[480px]"
        >
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 text-xs flex flex-col items-center justify-center gap-2">
              <Search className="w-6 h-6 text-zinc-600 mb-1" />
              <p>No developer tools or references matching &quot;{query}&quot;</p>
              <p className="text-[11px] text-zinc-600">
                Try searching for keywords like <code className="text-zinc-400">curl</code>,{' '}
                <code className="text-zinc-400">sha256</code>, <code className="text-zinc-400">jwt</code>,{' '}
                <code className="text-zinc-400">cron</code>, or <code className="text-zinc-400">json</code>.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === activeIndex;

              if (item.type === 'tool') {
                const tool = item.data;
                return (
                  <div
                    key={`tool-${tool.id}`}
                    data-palette-index={idx}
                    id={`palette-item-${tool.id}`}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => handleSelectItem(item)}
                    className={cn(
                      'flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all border',
                      isSelected
                        ? 'bg-blue-600/10 text-white border-blue-500/30 shadow-xs'
                        : 'text-zinc-300 hover:bg-white/5 border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors',
                          isSelected
                            ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                            : 'bg-white/5 text-zinc-400 border-white/10'
                        )}
                      >
                        <Icon name={tool.iconName} size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-zinc-100 truncate">
                            {tool.title}
                          </span>
                          {tool.popular && (
                            <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              hot
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                        {tool.category}
                      </span>
                      {isSelected ? (
                        <div className="flex items-center gap-1 text-blue-400 text-xs font-medium pl-1">
                          <span>Open</span>
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
                      )}
                    </div>
                  </div>
                );
              }

              // Reference Item
              const ref = item.data;
              const isCopied = copiedId === ref.id;

              return (
                <div
                  key={`ref-${ref.id}`}
                  data-palette-index={idx}
                  id={`palette-ref-${ref.id}`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => handleSelectItem(item)}
                  className={cn(
                    'flex flex-col p-3 rounded-xl cursor-pointer transition-all border space-y-2',
                    isSelected
                      ? 'bg-blue-600/10 text-white border-blue-500/30 shadow-xs'
                      : 'text-zinc-300 hover:bg-white/5 border-transparent'
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          'w-7 h-7 rounded flex items-center justify-center shrink-0 border text-[11px] font-mono font-bold',
                          isSelected
                            ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                            : 'bg-white/5 text-zinc-400 border-white/10'
                        )}
                      >
                        {ref.category === 'curl' ? '$' : ref.category === 'http' ? '2xx' : '#'}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-zinc-100 truncate block">
                          {ref.title}
                        </span>
                        <span className="text-[11px] text-zinc-400 truncate block">
                          {ref.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">
                        {ref.categoryLabel}
                      </span>
                      {ref.actionToolId ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (ref.actionToolId) {
                              onSelectTool(ref.actionToolId);
                              onClose();
                            }
                          }}
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 cursor-pointer"
                        >
                          <span>{ref.actionToolLabel || 'Open Tool'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleCopySnippet(ref, e)}
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Monospace Code Preview Box */}
                  <div className="font-mono text-[11px] text-zinc-300 bg-black/40 p-2.5 rounded-lg border border-white/5 overflow-x-auto whitespace-pre leading-relaxed select-text">
                    {ref.content}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-[#161618] border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded bg-black/40 border border-white/10 font-mono text-[10px]">↑↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded bg-black/40 border border-white/10 font-mono text-[10px]">↵</kbd>
              <span>Select / Copy</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 rounded bg-black/40 border border-white/10 font-mono text-[10px]">Tab</kbd>
              <span>Switch Mode</span>
            </span>
          </div>
          <span className="font-mono text-[10px] text-zinc-500">
            DevShack OS v1.0.4
          </span>
        </div>
      </div>
    </div>
  );
}
