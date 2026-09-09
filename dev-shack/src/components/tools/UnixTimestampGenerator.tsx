'use client';

import React, { useState, useEffect } from 'react';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { Pause, Play, RefreshCw, Zap } from 'lucide-react';
import { CopyButton } from '../ui/CopyButton';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function UnixTimestampGenerator({ tool, isFavorite, onToggleFavorite }: Props) {
  const [currentMs, setCurrentMs] = useState<number>(1742397800000);
  const [isTicking, setIsTicking] = useState<boolean>(true);

  // Live timer interval
  useEffect(() => {
    if (!isTicking) return;
    const interval = setInterval(() => {
      setCurrentMs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [isTicking]);

  const currentSec = Math.floor(currentMs / 1000);

  // Offsets presets
  const offsets = [
    { label: '+1 Hour', seconds: 3600 },
    { label: '+24 Hours (1 Day)', seconds: 86400 },
    { label: '+7 Days (1 Week)', seconds: 604800 },
    { label: '+30 Days (1 Month)', seconds: 2592000 },
    { label: '+365 Days (1 Year)', seconds: 31536000 },
    { label: '-1 Hour', seconds: -3600 },
    { label: '-24 Hours', seconds: -86400 },
    { label: '-7 Days', seconds: -604800 },
  ];

  return (
    <div id="unix-timestamp-generator-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        copyText={currentSec.toString()}
      />

      {/* Main Big Ticking Counter Banner */}
      <div className="p-6 mb-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 text-center shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className={`w-2.5 h-2.5 rounded-full ${isTicking ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {isTicking ? 'Live Unix Epoch Counter' : 'Epoch Counter Paused'}
          </span>
        </div>

        <div className="font-mono text-3xl sm:text-5xl font-extrabold text-emerald-400 tracking-tight my-3 select-all">
          {currentSec}
        </div>
        <div className="font-mono text-xs sm:text-sm text-zinc-500 mb-4">
          Milliseconds: <span className="text-zinc-300">{currentMs}</span> • UTC: {new Date(currentMs).toUTCString()}
        </div>

        <div className="flex items-center justify-center flex-wrap gap-2.5">
          <CopyButton text={currentSec.toString()} label="Copy Epoch Seconds" variant="primary" />
          <CopyButton text={currentMs.toString()} label="Copy Epoch Milliseconds" variant="outline" />
          <button
            type="button"
            id="toggle-ticking-btn"
            onClick={() => setIsTicking(!isTicking)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 rounded-lg transition-colors cursor-pointer"
          >
            {isTicking ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isTicking ? 'Freeze / Pause' : 'Resume Live'}</span>
          </button>
          {!isTicking && (
            <button
              type="button"
              id="reset-now-btn"
              onClick={() => {
                setCurrentMs(Date.now());
                setIsTicking(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Now</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Relative Epoch Offsets */}
      <div className="p-4 bg-zinc-900/80 rounded-xl border border-zinc-800 mb-6">
        <div className="text-xs font-semibold text-zinc-300 mb-3 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>Quick Epoch Offsets & Future / Past Timestamps</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {offsets.map((off) => {
            const targetSec = currentSec + off.seconds;
            const targetDate = new Date(targetSec * 1000);
            return (
              <div
                key={off.label}
                className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 hover:border-zinc-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 mb-1">
                    <span>{off.label}</span>
                    <CopyButton text={targetSec.toString()} size="icon" variant="ghost" />
                  </div>
                  <div className="font-mono text-sm text-emerald-400 font-bold">{targetSec}</div>
                  <div className="text-[10px] text-zinc-500 truncate mt-1">
                    {targetDate.toLocaleDateString()} {targetDate.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
