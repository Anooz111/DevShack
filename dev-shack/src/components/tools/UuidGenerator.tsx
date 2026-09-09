'use client';

import React, { useState, useMemo } from 'react';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { RefreshCw, Download } from 'lucide-react';
import { CopyButton } from '../ui/CopyButton';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function UuidGenerator({ tool, isFavorite, onToggleFavorite }: Props) {
  const [version, setVersion] = useState<'v4' | 'v1' | 'nil'>('v4');
  const [count, setCount] = useState<number>(5);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const [quotes, setQuotes] = useState<'none' | 'double' | 'single' | 'array'>('none');
  const [seed, setSeed] = useState<number>(0);

  // Generate UUID helper
  const generateSingleUuid = (v: 'v4' | 'v1' | 'nil'): string => {
    if (v === 'nil') {
      return '00000000-0000-0000-0000-000000000000';
    }
    if (v === 'v4' && typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const val = c === 'x' ? r : (r & 0x3) | 0x8;
      return val.toString(16);
    });
  };

  const uuids = useMemo(() => {
    // seed is included as dependency for explicit regeneration
    void seed;
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let raw = generateSingleUuid(version);
      if (!hyphens) {
        raw = raw.replace(/-/g, '');
      }
      if (uppercase) {
        raw = raw.toUpperCase();
      }
      list.push(raw);
    }
    return list;
  }, [version, count, uppercase, hyphens, seed]);

  // Formatted output text
  const formattedText = useMemo(() => {
    if (quotes === 'double') {
      return uuids.map((u) => `"${u}"`).join('\n');
    }
    if (quotes === 'single') {
      return uuids.map((u) => `'${u}'`).join('\n');
    }
    if (quotes === 'array') {
      return `[\n  ${uuids.map((u) => `"${u}"`).join(',\n  ')}\n]`;
    }
    return uuids.join('\n');
  }, [uuids, quotes]);

  const handleDownload = () => {
    const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uuids-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="uuid-generator-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        copyText={formattedText}
        extraActions={
          <button
            type="button"
            id="download-uuids-btn"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .txt</span>
          </button>
        }
      />

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 mb-4 bg-zinc-900/90 border border-zinc-800 rounded-xl">
        <div>
          <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">UUID Version</label>
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
            <button
              type="button"
              id="uuid-v4"
              onClick={() => setVersion('v4')}
              className={`flex-1 py-1 rounded font-medium cursor-pointer ${
                version === 'v4' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              v4 (Random)
            </button>
            <button
              type="button"
              id="uuid-nil"
              onClick={() => setVersion('nil')}
              className={`flex-1 py-1 rounded font-medium cursor-pointer ${
                version === 'nil' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Nil (Empty)
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">
            Quantity: <span className="text-emerald-400 font-mono">{count}</span>
          </label>
          <div className="flex items-center gap-2">
            {[1, 5, 10, 50, 100].map((num) => (
              <button
                key={num}
                type="button"
                id={`count-${num}`}
                onClick={() => setCount(num)}
                className={`flex-1 py-1.5 text-xs font-mono rounded-lg border transition-colors cursor-pointer ${
                  count === num
                    ? 'bg-zinc-800 text-zinc-100 border-zinc-700 font-bold'
                    : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Case & Formatting</label>
          <div className="flex items-center gap-3 pt-1 text-xs text-zinc-300">
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-950 text-emerald-500 w-3.5 h-3.5"
              />
              <span>UPPERCASE</span>
            </label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hyphens}
                onChange={(e) => setHyphens(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-950 text-emerald-500 w-3.5 h-3.5"
              />
              <span>Hyphens</span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Wrapper / Quotes</label>
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
            {(['none', 'double', 'array'] as const).map((q) => (
              <button
                key={q}
                type="button"
                id={`quotes-${q}`}
                onClick={() => setQuotes(q)}
                className={`flex-1 py-1 rounded font-mono capitalize cursor-pointer ${
                  quotes === q ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {q === 'none' ? 'Plain' : q === 'double' ? '"Quotes"' : 'Array [ ]'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          id="regenerate-uuids-btn"
          onClick={() => setSeed((s) => s + 1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Regenerate Fresh Batch</span>
        </button>
        <span className="text-xs text-zinc-500 font-mono">
          Generated {uuids.length} unique identifiers
        </span>
      </div>

      {/* Generated Display Box */}
      <div className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 font-mono text-xs md:text-sm text-zinc-200 overflow-y-auto max-h-[450px]">
        {quotes === 'array' ? (
          <pre className="text-emerald-400 font-mono whitespace-pre-wrap">{formattedText}</pre>
        ) : (
          <div className="space-y-1.5">
            {uuids.map((u, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/60 group"
              >
                <span className="text-zinc-200 select-all">
                  {quotes === 'double' ? `"${u}"` : quotes === 'single' ? `'${u}'` : u}
                </span>
                <CopyButton
                  text={quotes === 'double' ? `"${u}"` : quotes === 'single' ? `'${u}'` : u}
                  size="icon"
                  variant="ghost"
                  className="opacity-60 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
