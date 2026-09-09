'use client';

import React, { useState } from 'react';
import { CodeEditor } from '../ui/CodeEditor';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { Upload, ArrowRight, ArrowLeft, Image as ImageIcon, FileText } from 'lucide-react';
import Image from 'next/image';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const SAMPLE_TEXT = 'DevShack: Modern Developer Utilities for fast and productive workflows!';

export function Base64Tool({ tool, isFavorite, onToggleFavorite }: Props) {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [text, setText] = useState(SAMPLE_TEXT);
  const [isUrlSafe, setIsUrlSafe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Encode logic (UTF-8 safe)
  const encodeBase64 = (str: string, urlSafe = false) => {
    try {
      const utf8Bytes = new TextEncoder().encode(str);
      let binary = '';
      utf8Bytes.forEach((b) => (binary += String.fromCharCode(b)));
      let encoded = btoa(binary);
      if (urlSafe) {
        encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
      return encoded;
    } catch {
      return '';
    }
  };

  // Decode logic (UTF-8 safe)
  const decodeBase64 = (str: string) => {
    try {
      let cleaned = str.trim();
      // Handle url safe
      cleaned = cleaned.replace(/-/g, '+').replace(/_/g, '/');
      while (cleaned.length % 4 !== 0) {
        cleaned += '=';
      }
      const binary = atob(cleaned);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : 'Invalid Base64 string');
    }
  };

  // Calculate output
  let output = '';
  try {
    if (mode === 'encode') {
      output = text ? encodeBase64(text, isUrlSafe) : '';
      if (error) setError(null);
    } else {
      if (text.trim()) {
        output = decodeBase64(text);
        if (error) setError(null);
      } else {
        output = '';
      }
    }
  } catch (err: unknown) {
    output = '';
    const msg = err instanceof Error ? err.message : 'Decoding error';
    if (error !== msg) setError(msg);
  }

  // Handle file drop/upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      if (result) {
        if (result.startsWith('data:image/')) {
          setPreviewImage(result);
        }
        if (mode === 'encode') {
          // Put the base64 part
          const b64 = result.split(',')[1] || result;
          setText(file.name + ':\n' + b64);
        } else {
          setText(result);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div id="base64-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onLoadSample={() => {
          if (mode === 'encode') {
            setText(SAMPLE_TEXT);
          } else {
            setText(encodeBase64(SAMPLE_TEXT, isUrlSafe));
          }
          setPreviewImage(null);
        }}
        onClear={() => {
          setText('');
          setError(null);
          setPreviewImage(null);
        }}
        copyText={output}
      />

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-4 bg-zinc-900/90 border border-zinc-800 rounded-xl">
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-medium">
            <button
              type="button"
              id="base64-mode-encode"
              onClick={() => {
                setMode('encode');
                setError(null);
              }}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mode === 'encode'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Encode Plaintext
            </button>
            <button
              type="button"
              id="base64-mode-decode"
              onClick={() => {
                setMode('decode');
                setError(null);
              }}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mode === 'decode'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Decode Base64
            </button>
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              id="url-safe-checkbox"
              checked={isUrlSafe}
              onChange={(e) => setIsUrlSafe(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span>URL-Safe (- and _ instead of + and /)</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-lg transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span>Upload File</span>
            <input
              type="file"
              id="base64-file-input"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {/* Editor Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <CodeEditor
          id="base64-input"
          label={mode === 'encode' ? 'Input (Plain Text / UTF-8)' : 'Input (Base64 String)'}
          value={text}
          onChange={setText}
          placeholder={mode === 'encode' ? 'Type or paste plaintext to encode...' : 'Paste Base64 encoded string here...'}
          heightClass="h-[380px]"
          error={mode === 'decode' ? error : null}
        />
        <CodeEditor
          id="base64-output"
          label={mode === 'encode' ? 'Output (Base64)' : 'Output (Decoded Plain Text)'}
          value={output}
          readOnly
          placeholder="Result will appear here..."
          heightClass="h-[380px]"
          successMessage={output ? (mode === 'encode' ? 'Base64 Encoded' : 'Decoded Successfully') : null}
        />
      </div>

      {previewImage && (
        <div className="mt-4 p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center gap-4">
          <ImageIcon className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs text-zinc-400">Detected Image Data:</div>
          <div className="relative w-16 h-16 rounded border border-zinc-800 overflow-hidden bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewImage} alt="Base64 Preview" className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
