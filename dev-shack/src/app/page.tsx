'use client';

import React, { useState, useEffect, useSyncExternalStore, useCallback } from 'react';
import { DEV_TOOLS, ToolCategory } from '@/types/tools';
import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { DashboardOverview } from '@/components/DashboardOverview';
import { ToolRenderer } from '@/components/ToolRenderer';
import { CommandPalette } from '@/components/ui/CommandPalette';

const DEFAULT_FAVORITES = [
  'json-formatter',
  'jwt-decoder',
  'diff-checker',
  'uuid-generator',
  'regex-tester',
];

// External Store Subscribers
function subscribeHash(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
function getHashSnapshot() {
  return window.location.hash.replace('#', '');
}
function getHashServerSnapshot() {
  return '';
}

function subscribeFavorites(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('devshack_fav_event', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('devshack_fav_event', callback);
  };
}
function getFavoritesSnapshot() {
  try {
    return localStorage.getItem('devshack_favorites') || JSON.stringify(DEFAULT_FAVORITES);
  } catch {
    return JSON.stringify(DEFAULT_FAVORITES);
  }
}
function getFavoritesServerSnapshot() {
  return JSON.stringify(DEFAULT_FAVORITES);
}

export default function HomePage() {
  const hash = useSyncExternalStore(subscribeHash, getHashSnapshot, getHashServerSnapshot);
  const favoritesJson = useSyncExternalStore(
    subscribeFavorites,
    getFavoritesSnapshot,
    getFavoritesServerSnapshot
  );

  const activeToolId = hash && DEV_TOOLS.some((t) => t.id === hash) ? hash : null;

  const favorites = React.useMemo(() => {
    try {
      const parsed = JSON.parse(favoritesJson);
      return Array.isArray(parsed) ? parsed : DEFAULT_FAVORITES;
    } catch {
      return DEFAULT_FAVORITES;
    }
  }, [favoritesJson]);

  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global key shortcuts (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTool = useCallback((id: string | null) => {
    if (typeof window !== 'undefined') {
      window.location.hash = id || '';
    }
  }, []);

  const handleToggleFavorite = useCallback((toolId: string) => {
    try {
      const current = localStorage.getItem('devshack_favorites');
      const list: string[] = current ? JSON.parse(current) : DEFAULT_FAVORITES;
      const next = list.includes(toolId) ? list.filter((id) => id !== toolId) : [...list, toolId];
      localStorage.setItem('devshack_favorites', JSON.stringify(next));
      window.dispatchEvent(new Event('devshack_fav_event'));
    } catch {
      // Ignore
    }
  }, []);

  const activeTool = activeToolId
    ? DEV_TOOLS.find((t) => t.id === activeToolId) || null
    : null;

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-zinc-300 overflow-hidden font-sans antialiased selection:bg-blue-600/30 selection:text-blue-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activeToolId={activeToolId}
        activeCategory={activeCategory}
        favorites={favorites}
        onSelectTool={handleSelectTool}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (activeToolId !== null) {
            handleSelectTool(null);
          }
        }}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0A0A0B]">
        <Navbar
          activeTool={activeTool}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onBackToDashboard={() => handleSelectTool(null)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-hide">
          {activeTool ? (
            <div className="max-w-6xl mx-auto h-full flex flex-col">
              <ToolRenderer
                tool={activeTool}
                isFavorite={favorites.includes(activeTool.id)}
                onToggleFavorite={() => handleToggleFavorite(activeTool.id)}
              />
            </div>
          ) : (
            <DashboardOverview
              onSelectTool={handleSelectTool}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </main>

        {/* Sophisticated Dark Status Footer */}
        <footer className="h-8 bg-[#0E0E10] border-t border-white/5 px-4 sm:px-6 flex items-center justify-between text-[10px] text-zinc-500 uppercase tracking-widest shrink-0">
          <div className="flex items-center gap-2">
            <span>Client Engine:</span>
            <span className="text-emerald-500 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Localhost (Active)
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 font-mono">
            <span>Tools: {DEV_TOOLS.length} Loaded</span>
            <span>Sync: LocalStorage</span>
            <span className="text-zinc-400">DevShack v1.0.4</span>
          </div>
        </footer>
      </div>

      {/* Cmd + K Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTool={handleSelectTool}
      />
    </div>
  );
}
