'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
  successLabel?: string;
  size?: 'sm' | 'md' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'primary';
  disabled?: boolean;
}

export function CopyButton({
  text,
  className,
  label,
  successLabel = 'Copied!',
  size = 'md',
  variant = 'outline',
  disabled = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!text || disabled) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const variantStyles = {
    default: 'bg-[#161618] text-zinc-100 hover:bg-[#1c1c1f] border border-white/10 hover:border-blue-500/50',
    outline: 'bg-[#161618] text-zinc-300 hover:text-white hover:bg-[#1c1c1f] border border-white/10 hover:border-blue-500/50',
    ghost: 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5',
    primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1.5 rounded-md',
    md: 'text-xs px-3 py-1.5 gap-2 rounded-lg font-medium',
    icon: 'p-1.5 rounded-md',
  };

  return (
    <button
      type="button"
      id="copy-btn"
      onClick={handleCopy}
      disabled={disabled || !text}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer select-none',
        variantStyles[variant],
        sizeStyles[size],
        copied && 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
        className
      )}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          {size !== 'icon' && <span>{successLabel}</span>}
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          {size !== 'icon' && <span>{label || 'Copy'}</span>}
        </>
      )}
    </button>
  );
}
