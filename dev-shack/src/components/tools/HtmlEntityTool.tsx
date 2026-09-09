'use client';

import React, { useState, useMemo } from 'react';
import { CodeEditor } from '../ui/CodeEditor';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const SAMPLE_HTML = `<div class="card" id="devshack-card">
  <h2>Welcome & Enjoy Developer Tools!</h2>
  <p>Prices start at $19.99 & special discount is 20% off > regular tier.</p>
  <span>© 2026 "DevShack" • 'Minimalist' & <Secure></span>
</div>`;

export function HtmlEntityTool({ tool, isFavorite, onToggleFavorite }: Props) {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [format, setFormat] = useState<'named' | 'decimal' | 'hex'>('named');
  const [input, setInput] = useState(SAMPLE_HTML);

  const output = useMemo(() => {
    if (!input) return '';

    if (mode === 'encode') {
      if (format === 'named') {
        const map: Record<string, string> = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '©': '&copy;',
          '®': '&reg;',
          '™': '&trade;',
          '€': '&euro;',
          '£': '&pound;',
          '¥': '&yen;',
          '•': '&bull;',
        };
        return input.replace(/[&<>"'©®™€£¥•]/g, (ch) => map[ch] || ch);
      } else if (format === 'decimal') {
        return input
          .split('')
          .map((ch) => {
            const code = ch.charCodeAt(0);
            return code > 127 || '&<>"\''.includes(ch) ? `&#${code};` : ch;
          })
          .join('');
      } else {
        // Hex
        return input
          .split('')
          .map((ch) => {
            const code = ch.charCodeAt(0);
            return code > 127 || '&<>"\''.includes(ch) ? `&#x${code.toString(16)};` : ch;
          })
          .join('');
      }
    } else {
      // Decode
      if (typeof document !== 'undefined') {
        const txt = document.createElement('textarea');
        txt.innerHTML = input;
        return txt.value;
      }
      return input;
    }
  }, [input, mode, format]);

  return (
    <div id="html-entity-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onLoadSample={() => setInput(SAMPLE_HTML)}
        onClear={() => setInput('')}
        copyText={output}
      />

      {/* Mode Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-4 bg-zinc-900/90 border border-zinc-800 rounded-xl">
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-medium">
            <button
              type="button"
              id="html-mode-encode"
              onClick={() => setMode('encode')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mode === 'encode'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Encode to HTML Entities
            </button>
            <button
              type="button"
              id="html-mode-decode"
              onClick={() => setMode('decode')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mode === 'decode'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Decode Entities to Text
            </button>
          </div>

          {mode === 'encode' && (
            <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
              <span className="text-zinc-500 px-2">Type:</span>
              {(['named', 'decimal', 'hex'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  id={`entity-format-${f}`}
                  onClick={() => setFormat(f)}
                  className={`px-2.5 py-1 rounded font-mono capitalize ${
                    format === f
                      ? 'bg-zinc-800 text-zinc-100 font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {f === 'named' ? 'Named (&amp;)' : f === 'decimal' ? 'Dec (&#38;)' : 'Hex (&#x26;)'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <CodeEditor
          id="html-entity-input"
          label={mode === 'encode' ? 'Raw HTML / Text' : 'HTML Entities to Decode'}
          value={input}
          onChange={setInput}
          placeholder="Paste or type content here..."
          heightClass="h-[380px]"
        />
        <CodeEditor
          id="html-entity-output"
          label={mode === 'encode' ? 'Escaped HTML Entities' : 'Decoded Plain Text'}
          value={output}
          readOnly
          placeholder="Result will appear here..."
          heightClass="h-[380px]"
          successMessage={output ? 'Processed' : null}
        />
      </div>
    </div>
  );
}
