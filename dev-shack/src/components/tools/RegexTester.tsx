'use client';

import React, { useState, useMemo } from 'react';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { Check, AlertCircle, Sparkles, Replace, BookOpen } from 'lucide-react';
import { CopyButton } from '../ui/CopyButton';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const REGEX_PRESETS = [
  { name: 'Email Address', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', flags: 'g' },
  { name: 'IPv4 Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
  { name: 'URL / Web Link', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', flags: 'gi' },
  { name: 'UUID v4', pattern: '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}', flags: 'gi' },
  { name: 'Date (YYYY-MM-DD)', pattern: '\\b\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])\\b', flags: 'g' },
  { name: 'HEX Color Code', pattern: '#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b', flags: 'g' },
  { name: 'Slug string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$', flags: 'g' },
];

const SAMPLE_TEXT = `Contact us at support@devshack.io or hello@example.org.
Servers located at 192.168.1.1 and 10.0.0.254.
Release date: 2026-08-18. Theme color is #10b981 and #0f172a.
UUID: 4a3e8b12-98c4-4c7b-8f19-3e9a1b2c3d4e.
Visit https://devshack.io/docs for more details.`;

export function RegexTester({ tool, isFavorite, onToggleFavorite }: Props) {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState({ g: true, i: true, m: false, s: false, u: false });
  const [testText, setTestText] = useState(SAMPLE_TEXT);
  const [replacement, setReplacement] = useState('[REDACTED_EMAIL]');
  const [showReplace, setShowReplace] = useState(false);

  const flagString = Object.entries(flags)
    .filter(([, active]) => active)
    .map(([k]) => k)
    .join('');

  const { matches, error, replacedText, matchCount } = useMemo(() => {
    if (!pattern) return { matches: [], error: null, replacedText: testText, matchCount: 0 };
    try {
      const regex = new RegExp(pattern, flagString);
      const allMatches: { text: string; index: number; groups?: string[] }[] = [];

      if (flags.g) {
        let match;
        // prevent infinite loops with zero-length matches
        let lastIndex = -1;
        while ((match = regex.exec(testText)) !== null) {
          if (regex.lastIndex === lastIndex) {
            regex.lastIndex++;
          }
          lastIndex = regex.lastIndex;
          allMatches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (!regex.global) break;
          if (allMatches.length > 500) break; // safety guard
        }
      } else {
        const match = testText.match(regex);
        if (match && match.index !== undefined) {
          allMatches.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      let replaced = '';
      if (showReplace) {
        replaced = testText.replace(regex, replacement);
      }

      return { matches: allMatches, error: null, replacedText: replaced, matchCount: allMatches.length };
    } catch (err: unknown) {
      return {
        matches: [],
        error: err instanceof Error ? err.message : 'Invalid Regular Expression',
        replacedText: testText,
        matchCount: 0,
      };
    }
  }, [pattern, flagString, testText, replacement, showReplace, flags.g]);

  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleApplyPreset = (preset: typeof REGEX_PRESETS[0]) => {
    setPattern(preset.pattern);
    setFlags({
      g: preset.flags.includes('g'),
      i: preset.flags.includes('i'),
      m: preset.flags.includes('m'),
      s: preset.flags.includes('s'),
      u: preset.flags.includes('u'),
    });
  };

  return (
    <div id="regex-tester-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onLoadSample={() => {
          setPattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
          setTestText(SAMPLE_TEXT);
        }}
        onClear={() => {
          setPattern('');
          setTestText('');
        }}
        copyText={`/${pattern}/${flagString}`}
      />

      {/* Regex Input & Flags */}
      <div className="p-4 mb-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1 flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 focus-within:border-zinc-700">
            <span className="text-zinc-500 font-mono text-base select-none">/</span>
            <input
              type="text"
              id="regex-pattern-input"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Insert regex pattern here..."
              className="flex-1 bg-transparent px-2 font-mono text-sm text-emerald-400 focus:outline-none placeholder:text-zinc-600"
            />
            <span className="text-zinc-500 font-mono text-base select-none">/{flagString}</span>
          </div>

          {/* Flags toggles */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            {(['g', 'i', 'm', 's'] as (keyof typeof flags)[]).map((f) => (
              <button
                key={f}
                type="button"
                id={`regex-flag-${f}`}
                onClick={() => toggleFlag(f)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors ${
                  flags[f]
                    ? 'bg-zinc-800 text-emerald-400 font-bold border border-zinc-700'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title={`Flag: ${f}`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            type="button"
            id="toggle-substitution-btn"
            onClick={() => setShowReplace(!showReplace)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors ${
              showReplace
                ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
                : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border-zinc-800'
            }`}
          >
            <Replace className="w-3.5 h-3.5" />
            <span>Substitute / Replace</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 bg-rose-950/30 p-2 rounded-lg border border-rose-900/50">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Preset quick buttons */}
        <div className="flex items-center flex-wrap gap-1.5 pt-1">
          <span className="text-[11px] text-zinc-500 font-medium mr-1 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Presets:
          </span>
          {REGEX_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {showReplace && (
        <div className="p-3 mb-4 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center gap-3">
          <label className="text-xs font-semibold text-zinc-400 shrink-0">Replace With:</label>
          <input
            type="text"
            id="regex-replacement-input"
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            placeholder="Replacement string (e.g. $1 or [MASKED])..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-700"
          />
        </div>
      )}

      {/* Main editor and Match Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-950/70 overflow-hidden">
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-900/80 border-b border-zinc-800 text-xs">
            <span className="font-medium text-zinc-300">Test String</span>
            <span className="font-mono text-zinc-500">
              {matchCount} {matchCount === 1 ? 'match' : 'matches'} found
            </span>
          </div>
          <textarea
            id="regex-test-text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Type text to match against..."
            className="w-full bg-transparent p-3.5 font-mono text-xs md:text-sm text-zinc-200 focus:outline-none min-h-[220px] max-h-[400px] resize-y"
          />
        </div>

        <div className="flex flex-col rounded-xl border border-zinc-800 bg-zinc-950/70 overflow-hidden">
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-900/80 border-b border-zinc-800 text-xs">
            <span className="font-medium text-zinc-300">
              {showReplace ? 'Replaced Output' : `Match Details (${matchCount})`}
            </span>
            {showReplace && <CopyButton text={replacedText} size="sm" />}
          </div>

          <div className="p-3.5 overflow-y-auto max-h-[400px] font-mono text-xs space-y-2">
            {showReplace ? (
              <pre className="text-zinc-200 whitespace-pre-wrap">{replacedText}</pre>
            ) : matches.length === 0 ? (
              <div className="text-zinc-500 py-10 text-center">
                {pattern ? 'No regex matches found in test string' : 'Enter a regex pattern'}
              </div>
            ) : (
              matches.map((m, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/50">
                      #{idx + 1}: &quot;{m.text}&quot;
                    </span>
                    <span className="text-zinc-500 text-[10px]">Index: {m.index}</span>
                  </div>
                  {m.groups && m.groups.length > 0 && (
                    <div className="pl-2 border-l border-zinc-800 mt-1 space-y-0.5 text-zinc-400">
                      {m.groups.map((g, gIdx) => (
                        <div key={gIdx} className="text-[11px]">
                          Group {gIdx + 1}: <span className="text-amber-300">&quot;{g}&quot;</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
