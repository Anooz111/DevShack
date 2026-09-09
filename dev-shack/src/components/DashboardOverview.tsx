'use client';

import React, { useState } from 'react';
import { DEV_TOOLS, CATEGORIES, ToolCategory, ToolDefinition } from '@/types/tools';
import { Icon } from './ui/Icon';
import { Search, Star, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';


interface DashboardOverviewProps {
  onSelectTool: (toolId: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
}

// Color badges for each tool category and specific utility
const TOOL_ICON_COLORS: Record<string, { bg: string; text: string }> = {
  'json-formatter': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'jwt-decoder': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  'base64': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  'uuid-generator': { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  'hash-generator': { bg: 'bg-rose-500/10', text: 'text-rose-400' },
  'regex-tester': { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  'cron-generator': { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  'timestamp-converter': { bg: 'bg-teal-500/10', text: 'text-teal-400' },
  'color-converter': { bg: 'bg-pink-500/10', text: 'text-pink-400' },
  'html-entity': { bg: 'bg-sky-500/10', text: 'text-sky-400' },
  'markdown-previewer': { bg: 'bg-lime-500/10', text: 'text-lime-400' },
  'diff-checker': { bg: 'bg-zinc-500/10', text: 'text-zinc-300' },
  'unix-timestamp-generator': { bg: 'bg-teal-500/10', text: 'text-teal-400' },
  'json-yaml': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'url-encoder': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  'case-converter': { bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  'lorem-ipsum': { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  'qr-code': { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
};

export function DashboardOverview({
  onSelectTool,
  favorites,
  onToggleFavorite,
}: DashboardOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');

  const filteredTools = DEV_TOOLS.filter((tool) => {
    const matchesCategory =
      selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div id="dashboard-overview" className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold text-white tracking-tight">Utility Dashboard</h2>
        <span className="text-xs text-zinc-500 font-medium">
          {DEV_TOOLS.length} Tools Available
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="dashboard-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. JSON, JWT, Regex, Diff)..."
            className="w-full bg-[#161618] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs md:text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              id={`overview-cat-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer',
                selectedCategory === cat.id
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10 border border-white/5'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Bento Grid matching Sophisticated Dark design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTools.length === 0 ? (
          <div className="col-span-full py-16 text-center text-zinc-500 text-sm border border-dashed border-white/10 rounded-xl bg-[#0E0E10]">
            No tools match &quot;{searchQuery}&quot;. Try resetting your search query.
          </div>
        ) : (
          filteredTools.map((tool) => {
            const isFav = favorites.includes(tool.id);
            const colorScheme = TOOL_ICON_COLORS[tool.id] || {
              bg: 'bg-blue-500/10',
              text: 'text-blue-400',
            };

            return (
              <div
                key={tool.id}
                id={`card-${tool.id}`}
                onClick={() => onSelectTool(tool.id)}
                className="tool-card p-5 rounded-xl cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform',
                        colorScheme.bg,
                        colorScheme.text
                      )}
                    >
                      <Icon name={tool.iconName} size={18} />
                    </div>

                    <div className="flex items-center gap-1">
                      {tool.popular && (
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> Hot
                        </span>
                      )}
                      <button
                        type="button"
                        id={`card-fav-btn-${tool.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(tool.id);
                        }}
                        title={isFav ? 'Remove from favorites' : 'Pin to favorites'}
                        className={`p-1 rounded transition-colors ${
                          isFav
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-zinc-600 hover:text-zinc-400 opacity-30 group-hover:opacity-100'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-100 mb-1 group-hover:text-white transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 leading-snug">
                    {tool.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5 text-[11px]">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                    {tool.category}
                  </span>
                  <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 text-[11px] font-medium">
                    Open <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
