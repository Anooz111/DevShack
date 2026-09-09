'use client';

import React from 'react';
import { DEV_TOOLS, CATEGORIES, ToolCategory, ToolDefinition } from '@/types/tools';
import { Icon } from './ui/Icon';
import {
  Search,
  Star,
  LayoutGrid,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';


interface SidebarProps {
  activeToolId: string | null;
  activeCategory: ToolCategory;
  favorites: string[];
  onSelectTool: (toolId: string | null) => void;
  onSelectCategory: (cat: ToolCategory) => void;
  onOpenCommandPalette: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeToolId,
  activeCategory,
  favorites,
  onSelectTool,
  onSelectCategory,
  onOpenCommandPalette,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  const favoriteTools = DEV_TOOLS.filter((t) => favorites.includes(t.id));

  const filteredTools =
    activeCategory === 'all'
      ? DEV_TOOLS
      : DEV_TOOLS.filter((t) => t.category === activeCategory);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpenMobile && (
        <div
          id="mobile-sidebar-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        id="devshack-sidebar"
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-[#0E0E10] border-r border-white/5 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-14 px-5 border-b border-white/5 flex items-center justify-between shrink-0">
          <div
            onClick={() => {
              onSelectTool(null);
              onCloseMobile();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white text-base shadow-sm group-hover:bg-blue-500 transition-colors">
              D
            </div>
            <div className="flex items-baseline">
              <span className="text-lg font-semibold tracking-tight text-white">DevShack</span>
              <span className="text-blue-500 font-extrabold text-xl ml-0.5">.</span>
            </div>
          </div>
          <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10 text-[10px] font-mono text-zinc-400">
            v1.0.4
          </span>
        </div>

        {/* Quick Search Bar Trigger */}
        <div className="p-3 border-b border-white/5">
          <button
            type="button"
            id="sidebar-search-trigger"
            onClick={onOpenCommandPalette}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#161618] hover:bg-[#1c1c1f] border border-white/10 hover:border-blue-500/50 text-zinc-400 hover:text-zinc-200 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-zinc-400">Search tools...</span>
            </div>
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-black/40 border border-white/10 rounded text-zinc-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Navigation Categories & List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-hide">
          {/* Main Dashboard Link */}
          <div>
            <button
              type="button"
              id="sidebar-nav-all-tools"
              onClick={() => {
                onSelectTool(null);
                onCloseMobile();
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                activeToolId === null
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              )}
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-4 h-4 text-blue-400" />
                <span>All Tools</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-zinc-500 border border-white/10">
                {DEV_TOOLS.length}
              </span>
            </button>
          </div>

          {/* Pinned Favorites Section */}
          {favoriteTools.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold px-3 mb-2 flex items-center gap-1.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Favorites</span>
              </p>
              <div className="space-y-0.5">
                {favoriteTools.map((tool) => {
                  const isActive = activeToolId === tool.id;
                  return (
                    <button
                      key={`fav-${tool.id}`}
                      type="button"
                      id={`sidebar-fav-${tool.id}`}
                      onClick={() => {
                        onSelectTool(tool.id);
                        onCloseMobile();
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer',
                        isActive
                          ? 'bg-blue-600/10 text-blue-400 font-medium border border-blue-600/20'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon name={tool.iconName} size={13} className="text-amber-400 shrink-0" />
                        <span className="truncate">{tool.shortName}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-zinc-600" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category Filter Section */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold px-3 mb-2">
              Categories
            </p>
            <div className="flex flex-wrap gap-1 px-1 mb-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  id={`cat-filter-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={cn(
                    'px-2 py-1 rounded text-xs transition-colors cursor-pointer font-medium',
                    activeCategory === cat.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Tools List */}
            <div className="space-y-0.5">
              {filteredTools.map((tool) => {
                const isActive = activeToolId === tool.id;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    id={`sidebar-tool-${tool.id}`}
                    onClick={() => {
                      onSelectTool(tool.id);
                      onCloseMobile();
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer group',
                      isActive
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 font-medium'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          'w-6 h-6 rounded flex items-center justify-center shrink-0 border transition-colors',
                          isActive
                            ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                            : 'bg-white/5 text-zinc-400 border-white/5 group-hover:text-zinc-200'
                        )}
                      >
                        <Icon name={tool.iconName} size={12} />
                      </div>
                      <span className="truncate">{tool.title}</span>
                    </div>

                    {tool.popular && (
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        hot
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sophisticated Dark Developer Tip Box */}
        <div className="p-3 border-t border-white/5 shrink-0">
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/90 border border-white/5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Dev Tip</span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Use JSON Formatter for deep-nested payloads to find bugs faster.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
