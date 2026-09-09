'use client';

import React from 'react';
import { CopyButton } from './CopyButton';
import { Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils'

interface CodeEditorProps {
  id?: string;
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  error?: string | null;
  errorMessage?: string | null;
  successMessage?: string | null;
  actions?: React.ReactNode;
  heightClass?: string;
  showStats?: boolean;
  showCopy?: boolean;
  showClear?: boolean;
  badge?: string;
}

export function CodeEditor({
  id,
  label,
  value,
  onChange,
  placeholder = 'Type or paste content here...',
  readOnly = false,
  error,
  errorMessage,
  successMessage,
  actions,
  heightClass = 'min-h-[220px] max-h-[500px]',
  showStats = true,
  showCopy = true,
  showClear = true,
  badge,
}: CodeEditorProps) {
  const activeError = error ?? errorMessage ?? null;
  const lineCount = value ? value.split('\n').length : 0;
  const charCount = value ? value.length : 0;
  const byteSize = value ? new Blob([value]).size : 0;

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-[#111112] overflow-hidden shadow-sm transition-all focus-within:border-blue-500/50">
      {(label || actions || showCopy || showClear || badge) && (
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#161618] border-b border-white/5 text-xs">
          <div className="flex items-center gap-2">
            {label && <span className="font-medium text-zinc-200">{label}</span>}
            {badge && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-zinc-400 border border-white/10">
                {badge}
              </span>
            )}
            {activeError && (
              <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                Invalid Syntax
              </span>
            )}
            {successMessage && !activeError && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {successMessage}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {actions}
            {showCopy && value && (
              <CopyButton text={value} size="sm" variant="ghost" />
            )}
            {showClear && !readOnly && value && onChange && (
              <button
                type="button"
                id={`clear-editor-${id || 'generic'}`}
                onClick={() => onChange('')}
                title="Clear content"
                className="p-1 text-zinc-500 hover:text-rose-400 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="relative flex-1">
        <textarea
          id={id || (label ? `editor-${label.toLowerCase().replace(/\s+/g, '-')}` : 'code-editor-textarea')}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          spellCheck={false}
          className={cn(
            'w-full bg-transparent p-3.5 font-mono text-xs md:text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none resize-y',
            heightClass,
            readOnly && 'bg-black/20 text-zinc-300 selection:bg-blue-600/30 selection:text-blue-200',
            activeError && 'border-rose-900/50 bg-rose-950/5'
          )}
        />
      </div>

      {activeError && (
        <div className="px-3.5 py-2 bg-rose-950/30 border-t border-rose-900/50 text-xs text-rose-300 font-mono flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div className="break-all">{activeError}</div>
        </div>
      )}

      {showStats && (
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#161618]/60 border-t border-white/5 text-[11px] text-zinc-500 font-mono">
          <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
          <div className="flex items-center gap-3">
            <span>{charCount.toLocaleString()} chars</span>
            <span>•</span>
            <span>{formatBytes(byteSize)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
