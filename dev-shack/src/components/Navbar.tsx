'use client';

import { Search, Menu, ArrowLeft } from 'lucide-react';
import { ToolDefinition } from '@/types/tools';
import { Icon } from './ui/Icon';

interface NavbarProps {
  activeTool: ToolDefinition | null;
  onOpenCommandPalette: () => void;
  onOpenMobileMenu: () => void;
  onBackToDashboard: () => void;
}

export function Navbar({
  activeTool,
  onOpenCommandPalette,
  onOpenMobileMenu,
  onBackToDashboard,
}: NavbarProps) {
  return (
    <header
      id="devshack-navbar"
      className="h-14 border-b border-white/5 bg-[#0E0E10] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0"
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          id="mobile-menu-trigger"
          onClick={onOpenMobileMenu}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/5 lg:hidden"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {activeTool ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="back-to-dashboard-btn"
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-md transition-colors cursor-pointer border border-white/5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <span className="text-zinc-600 text-xs">/</span>
            <div className="flex items-center gap-2">
              <Icon name={activeTool.iconName} size={14} className="text-blue-400" />
              <span className="text-xs md:text-sm font-semibold text-white truncate">
                {activeTool.title}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-sm">
              D
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              DevShack <span className="text-blue-500">.</span>
            </span>
          </div>
        )}
      </div>

      {/* Center Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-md mx-4 sm:mx-8">
        <div className="relative w-full">
          <input
            type="text"
            readOnly
            onClick={onOpenCommandPalette}
            placeholder="Quick search tools (⌘ + K)"
            className="w-full bg-[#161618] border border-white/10 hover:border-blue-500/50 rounded-md py-1.5 pl-9 pr-4 text-xs md:text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
          />
          <Search className="w-4 h-4 absolute left-3 top-2 text-zinc-500 pointer-events-none" />
        </div>
      </div>

      {/* Right User/Version Pill */}
      <div className="flex items-center gap-3 text-xs font-medium shrink-0">
        <span className="px-2 py-1 bg-white/5 rounded border border-white/10 text-zinc-300 hidden sm:inline-block font-mono text-[11px]">
          v1.0.4
        </span>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border border-white/20 shadow-md flex items-center justify-center text-[11px] font-bold text-white">
          D
        </div>
      </div>
    </header>
  );
}
