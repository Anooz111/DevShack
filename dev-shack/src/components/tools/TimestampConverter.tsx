'use client';

import React, { useState, useMemo } from 'react';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { RefreshCw } from 'lucide-react';
import { CopyButton } from '../ui/CopyButton';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function TimestampConverter({ tool, isFavorite, onToggleFavorite }: Props) {
  const [epochInput, setEpochInput] = useState<string>('1742397800');
  const [unit, setUnit] = useState<'seconds' | 'milliseconds'>('seconds');
  const [dateInput, setDateInput] = useState<string>('2026-08-18T12:00');

  const parsedEpochDate = useMemo(() => {
    if (!epochInput.trim()) return null;
    const num = Number(epochInput.trim());
    if (isNaN(num)) return null;

    const ms = unit === 'seconds' ? num * 1000 : num;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;

    return {
      date: d,
      iso: d.toISOString(),
      utc: d.toUTCString(),
      local: d.toLocaleString(),
      epochSec: Math.floor(ms / 1000),
      epochMs: ms,
      dayOfWeek: d.toLocaleDateString(undefined, { weekday: 'long' }),
      timezoneOffset: `UTC${d.getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(d.getTimezoneOffset() / 60)}`,
    };
  }, [epochInput, unit]);

  // Convert Date input back to Epoch
  const customDateToEpoch = useMemo(() => {
    try {
      const d = new Date(dateInput);
      if (isNaN(d.getTime())) return null;
      return {
        seconds: Math.floor(d.getTime() / 1000),
        milliseconds: d.getTime(),
      };
    } catch {
      return null;
    }
  }, [dateInput]);

  const handleSetCurrentTime = () => {
    const now = Date.now();
    setEpochInput(unit === 'seconds' ? Math.floor(now / 1000).toString() : now.toString());
    setDateInput(new Date(now).toISOString().slice(0, 19));
  };

  return (
    <div id="timestamp-converter-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onLoadSample={handleSetCurrentTime}
        onClear={() => {
          setEpochInput('');
        }}
        copyText={parsedEpochDate?.iso || ''}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Epoch to Human Readable */}
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300">
                1. Epoch Unix Timestamp → Human Date
              </label>
              <button
                type="button"
                id="epoch-now-btn"
                onClick={handleSetCurrentTime}
                className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Set to Now
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                id="epoch-input-value"
                value={epochInput}
                onChange={(e) => setEpochInput(e.target.value)}
                placeholder="e.g. 1742397800"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 font-mono text-sm text-zinc-200 focus:outline-none focus:border-zinc-700"
              />

              <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
                <button
                  type="button"
                  id="unit-seconds"
                  onClick={() => setUnit('seconds')}
                  className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                    unit === 'seconds'
                      ? 'bg-zinc-800 text-zinc-100 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Sec (s)
                </button>
                <button
                  type="button"
                  id="unit-ms"
                  onClick={() => setUnit('milliseconds')}
                  className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                    unit === 'milliseconds'
                      ? 'bg-zinc-800 text-zinc-100 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Millis (ms)
                </button>
              </div>
            </div>
          </div>

          {/* Formatted Date Breakdown */}
          {parsedEpochDate ? (
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800/80">
                <span className="text-zinc-400 font-sans font-medium">UTC String</span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">{parsedEpochDate.utc}</span>
                  <CopyButton text={parsedEpochDate.utc} size="icon" variant="ghost" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800/80">
                <span className="text-zinc-400 font-sans font-medium">ISO 8601</span>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-300 font-bold">{parsedEpochDate.iso}</span>
                  <CopyButton text={parsedEpochDate.iso} size="icon" variant="ghost" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800/80">
                <span className="text-zinc-400 font-sans font-medium">Local Time</span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-200">{parsedEpochDate.local}</span>
                  <CopyButton text={parsedEpochDate.local} size="icon" variant="ghost" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800/80">
                <span className="text-zinc-400 font-sans font-medium">Day of Week</span>
                <span className="text-zinc-300 font-sans">{parsedEpochDate.dayOfWeek}</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500 text-xs border border-zinc-800 bg-zinc-950 rounded-xl">
              Enter a valid integer timestamp above
            </div>
          )}
        </div>

        {/* Right Column: Date Picker/String to Unix Epoch */}
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-3">
            <label className="text-xs font-semibold text-zinc-300 block">
              2. Human Date & Time → Epoch Unix Timestamp
            </label>
            <input
              type="datetime-local"
              id="custom-datetime-picker"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-700"
            />
          </div>

          {customDateToEpoch && (
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800/80">
                <div>
                  <div className="text-zinc-400 font-sans font-medium text-[11px]">Seconds (s)</div>
                  <div className="text-emerald-400 font-bold text-sm">{customDateToEpoch.seconds}</div>
                </div>
                <CopyButton text={customDateToEpoch.seconds.toString()} size="sm" />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-zinc-900/80 rounded-lg border border-zinc-800/80">
                <div>
                  <div className="text-zinc-400 font-sans font-medium text-[11px]">Milliseconds (ms)</div>
                  <div className="text-cyan-300 font-bold text-sm">{customDateToEpoch.milliseconds}</div>
                </div>
                <CopyButton text={customDateToEpoch.milliseconds.toString()} size="sm" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
