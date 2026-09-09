'use client';

import React, { useState, useMemo } from 'react';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { Pipette, Eye, Copy, Sparkles, Check } from 'lucide-react';
import { CopyButton } from '../ui/CopyButton';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ColorConverter({ tool, isFavorite, onToggleFavorite }: Props) {
  const [hexInput, setHexInput] = useState('#10b981');

  // Convert Hex to RGB
  const rgb = useMemo(() => {
    let clean = hexInput.replace('#', '').trim();
    if (clean.length === 3) {
      clean = clean.split('').map((c) => c + c).join('');
    }
    if (clean.length !== 6) return { r: 16, g: 185, b: 129, isValid: false };
    const num = parseInt(clean, 16);
    if (isNaN(num)) return { r: 16, g: 185, b: 129, isValid: false };
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
      isValid: true,
    };
  }, [hexInput]);

  // Convert RGB to HSL
  const hsl = useMemo(() => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }, [rgb]);

  // Convert RGB to HSV
  const hsv = useMemo(() => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (max !== min) {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    };
  }, [rgb]);

  // Convert RGB to CMYK
  const cmyk = useMemo(() => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const k = 1 - Math.max(r, g, b);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    const c = Math.round(((1 - r - k) / (1 - k)) * 100);
    const m = Math.round(((1 - g - k) / (1 - k)) * 100);
    const y = Math.round(((1 - b - k) / (1 - k)) * 100);
    return { c, m, y, k: Math.round(k * 100) };
  }, [rgb]);

  // WCAG Contrast ratio with White (#FFFFFF) & Black (#000000)
  const contrast = useMemo(() => {
    const getLuminance = (r: number, g: number, b: number) => {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };
    const lum = getLuminance(rgb.r, rgb.g, rgb.b);
    const lumWhite = getLuminance(255, 255, 255);
    const lumBlack = getLuminance(0, 0, 0);

    const ratioWhite = (Math.max(lum, lumWhite) + 0.05) / (Math.min(lum, lumWhite) + 0.05);
    const ratioBlack = (Math.max(lum, lumBlack) + 0.05) / (Math.min(lum, lumBlack) + 0.05);

    return {
      againstWhite: ratioWhite.toFixed(2),
      againstBlack: ratioBlack.toFixed(2),
      whitePassAA: ratioWhite >= 4.5,
      blackPassAA: ratioBlack >= 4.5,
      whitePassAAA: ratioWhite >= 7,
      blackPassAAA: ratioBlack >= 7,
    };
  }, [rgb]);

  // Generate 9-step tonal shades
  const shades = useMemo(() => {
    const steps = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    return steps.map((l) => {
      return `hsl(${hsl.h}, ${hsl.s}%, ${l}%)`;
    });
  }, [hsl]);

  const colorFormats = [
    { label: 'HEX', value: hexInput.startsWith('#') ? hexInput : `#${hexInput}` },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'RGBA', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1.0)` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'HSV', value: `hsv(${hsv.h}°, ${hsv.s}%, ${hsv.v}%)` },
    { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
    { label: 'CSS Variable', value: `--color-primary: ${hexInput};` },
  ];

  return (
    <div id="color-converter-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onLoadSample={() => setHexInput('#10b981')}
        onClear={() => setHexInput('#000000')}
        copyText={hexInput}
      />

      {/* Main Color Picker Card */}
      <div className="p-5 mb-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center gap-4">
          <div
            className="w-24 h-24 rounded-2xl border-2 border-zinc-700/80 shadow-md transition-all shrink-0 cursor-pointer relative overflow-hidden"
            style={{ backgroundColor: hexInput }}
          >
            <input
              type="color"
              id="native-color-picker"
              value={hexInput.startsWith('#') && hexInput.length === 7 ? hexInput : '#10b981'}
              onChange={(e) => setHexInput(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1">Color Code Input</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="hex-color-input"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                placeholder="#10b981 or #fff"
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 font-mono text-sm text-zinc-100 font-bold focus:outline-none focus:border-zinc-700 w-36 uppercase"
              />
              <CopyButton text={hexInput} size="md" />
            </div>
          </div>
        </div>

        {/* WCAG Contrast Ratio Checker */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            className="p-3 rounded-xl border flex items-center justify-between"
            style={{ backgroundColor: hexInput, color: '#ffffff' }}
          >
            <div>
              <div className="text-[11px] font-bold opacity-80">White Text Contrast</div>
              <div className="text-sm font-extrabold">{contrast.againstWhite} : 1</div>
            </div>
            <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 text-white">
              {contrast.whitePassAA ? 'AA Pass' : 'Fail'}
            </div>
          </div>

          <div
            className="p-3 rounded-xl border flex items-center justify-between"
            style={{ backgroundColor: hexInput, color: '#000000' }}
          >
            <div>
              <div className="text-[11px] font-bold opacity-80">Black Text Contrast</div>
              <div className="text-sm font-extrabold">{contrast.againstBlack} : 1</div>
            </div>
            <div className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/50 text-black">
              {contrast.blackPassAA ? 'AA Pass' : 'Fail'}
            </div>
          </div>
        </div>
      </div>

      {/* Formats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {colorFormats.map((fmt) => (
          <div
            key={fmt.label}
            className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between hover:border-zinc-700 transition-colors"
          >
            <div className="min-w-0">
              <div className="text-[11px] text-zinc-500 font-medium">{fmt.label}</div>
              <div className="font-mono text-xs text-emerald-400 font-bold truncate mt-0.5">
                {fmt.value}
              </div>
            </div>
            <CopyButton text={fmt.value} size="icon" variant="ghost" />
          </div>
        ))}
      </div>

      {/* 9-Step Tonal Palette Generator */}
      <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800">
        <div className="text-xs font-semibold text-zinc-300 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Monochromatic Shading Palette (10% - 90% Lightness)</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {shades.map((shade, idx) => (
            <div
              key={idx}
              onClick={() => {
                // Approximate hex
              }}
              className="flex flex-col items-center gap-1 p-2 bg-zinc-950 rounded-lg border border-zinc-800"
            >
              <div
                className="w-full h-10 rounded-md border border-zinc-700/50"
                style={{ backgroundColor: shade }}
              />
              <span className="text-[10px] font-mono text-zinc-400">{(idx + 1) * 10}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
