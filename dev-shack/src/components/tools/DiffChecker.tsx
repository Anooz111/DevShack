'use client';

import React, { useState, useMemo } from 'react';
import * as Diff from 'diff';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { GitCompare, ArrowLeftRight, Columns, AlignJustify } from 'lucide-react';
import { CodeEditor } from '../ui/CodeEditor';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const ORIGINAL_SAMPLE = `function calculateTotal(items, taxRate) {
  let subtotal = 0;
  for (let i = 0; i < items.length; i++) {
    subtotal += items[i].price * items[i].quantity;
  }
  const tax = subtotal * taxRate;
  return {
    subtotal: subtotal,
    tax: tax,
    total: subtotal + tax
  };
}`;

const MODIFIED_SAMPLE = `function calculateTotal(items, taxRate = 0.08) {
  // Use array reduce for cleaner functional calculation
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
  const tax = Number((subtotal * taxRate).toFixed(2));
  const discount = subtotal > 100 ? 10 : 0;

  return {
    subtotal,
    tax,
    discount,
    total: subtotal + tax - discount
  };
}`;

export function DiffChecker({ tool, isFavorite, onToggleFavorite }: Props) {
  const [original, setOriginal] = useState(ORIGINAL_SAMPLE);
  const [modified, setModified] = useState(MODIFIED_SAMPLE);
  const [diffMode, setDiffMode] = useState<'split' | 'unified'>('split');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  const diffResult = useMemo(() => {
    const orig = ignoreWhitespace ? original.replace(/\s+/g, ' ') : original;
    const mod = ignoreWhitespace ? modified.replace(/\s+/g, ' ') : modified;
    const linesDiff = Diff.diffLines(orig, mod);

    let addedCount = 0;
    let removedCount = 0;

    linesDiff.forEach((part) => {
      if (part.added) addedCount += part.count || 0;
      if (part.removed) removedCount += part.count || 0;
    });

    return { parts: linesDiff, addedCount, removedCount };
  }, [original, modified, ignoreWhitespace]);

  const handleSwap = () => {
    const temp = original;
    setOriginal(modified);
    setModified(temp);
  };

  return (
    <div id="diff-checker-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onLoadSample={() => {
          setOriginal(ORIGINAL_SAMPLE);
          setModified(MODIFIED_SAMPLE);
        }}
        onClear={() => {
          setOriginal('');
          setModified('');
        }}
      />

      {/* Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-4 bg-zinc-900/90 border border-zinc-800 rounded-xl">
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
            <button
              type="button"
              id="diff-mode-split"
              onClick={() => setDiffMode('split')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                diffMode === 'split' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              type="button"
              id="diff-mode-unified"
              onClick={() => setDiffMode('unified')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                diffMode === 'unified' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Unified Diff</span>
            </button>
          </div>

          <button
            type="button"
            id="swap-diff-btn"
            onClick={handleSwap}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap</span>
          </button>

          <label className="inline-flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              id="ignore-whitespace-checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-950 text-emerald-500 w-3.5 h-3.5"
            />
            <span>Ignore Whitespace</span>
          </label>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
            +{diffResult.addedCount} lines added
          </span>
          <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/60">
            -{diffResult.removedCount} lines removed
          </span>
        </div>
      </div>

      {/* Editors Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <CodeEditor
          id="diff-original-input"
          label="Original / Before"
          value={original}
          onChange={setOriginal}
          placeholder="Paste original text here..."
          heightClass="h-[200px]"
        />
        <CodeEditor
          id="diff-modified-input"
          label="Modified / After"
          value={modified}
          onChange={setModified}
          placeholder="Paste modified text here..."
          heightClass="h-[200px]"
        />
      </div>

      {/* Rendered Diff Result Viewer */}
      <div className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-950/80 overflow-hidden">
        <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 text-xs font-medium text-zinc-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <GitCompare className="w-4 h-4 text-emerald-400" />
            <span>Diff Comparison Output</span>
          </span>
        </div>

        <div className="p-4 overflow-x-auto max-h-[400px] font-mono text-xs leading-5">
          {diffResult.parts.length === 0 ? (
            <div className="text-zinc-500 text-center py-6">No difference between texts</div>
          ) : (
            diffResult.parts.map((part, idx) => {
              const color = part.added
                ? 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500'
                : part.removed
                ? 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500 line-through opacity-80'
                : 'text-zinc-400';

              const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';

              return (
                <div key={idx} className={`px-2 py-0.5 ${color} whitespace-pre-wrap`}>
                  {part.value.split('\n').map((line, lIdx, arr) => {
                    if (lIdx === arr.length - 1 && line === '') return null;
                    return (
                      <div key={lIdx}>
                        <span className="select-none text-zinc-600 mr-2">{prefix}</span>
                        {line}
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
