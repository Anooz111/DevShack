'use client';

import React from 'react';
import { Star, Sparkles, Trash2 } from 'lucide-react';
import { Icon } from './Icon';
import { CopyButton } from './CopyButton';
import { ToolDefinition } from '@/types/tools';

interface ToolHeaderProps {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onLoadSample?: () => void;
  onClear?: () => void;
  copyText?: string;
  extraActions?: React.ReactNode;
}

export function ToolHeader({
  tool,
  isFavorite = false,
  onToggleFavorite,
  onLoadSample,
  onClear,
  copyText,
  extraActions,
}: ToolHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-white/5">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
          <Icon name={tool.iconName} size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg md:text-xl font-semibold text-white tracking-tight">
              {tool.title}
            </h1>
            {onToggleFavorite && (
              <button
                type="button"
                id={`favorite-btn-${tool.id}`}
                onClick={onToggleFavorite}
                title={isFavorite ? 'Remove from pinned favorites' : 'Pin to favorites'}
                className={`p-1 rounded-md transition-colors ${
                  isFavorite
                    ? 'text-amber-400 hover:text-amber-300'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>
            )}
          </div>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5 max-w-2xl leading-relaxed">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2 self-start md:self-auto">
        {onLoadSample && (
          <button
            type="button"
            id="load-sample-btn"
            onClick={onLoadSample}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md text-zinc-300 bg-[#161618] hover:bg-[#1c1c1f] border border-white/10 hover:border-blue-500/50 hover:text-white transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Load Sample</span>
          </button>
        )}

        {onClear && (
          <button
            type="button"
            id="clear-btn"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md text-zinc-400 hover:text-rose-400 bg-[#161618] hover:bg-rose-950/20 border border-white/10 hover:border-rose-900/50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}

        {copyText !== undefined && (
          <CopyButton text={copyText} label="Copy Output" />
        )}

        {extraActions}
      </div>
    </div>
  );
}
