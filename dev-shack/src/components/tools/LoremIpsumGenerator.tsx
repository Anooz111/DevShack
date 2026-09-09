'use client';

import React, { useState, useMemo } from 'react';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { CodeEditor } from '../ui/CodeEditor';
import { RefreshCw } from 'lucide-react';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'architecto', 'beatae',
  'vitae', 'dicta', 'explicabo', 'nemo', 'ipsam', 'voluptatem', 'quia', 'voluptas',
  'aspernatur', 'aut', 'odit', 'fugit', 'magni', 'dolores', 'eos', 'ratione',
  'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'dolorem', 'adipisci', 'numquam',
];

// Linear Congruential Generator for deterministic pseudo-random word selection
function makePrng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function next() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function LoremIpsumGenerator({ tool, isFavorite, onToggleFavorite }: Props) {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words' | 'list'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [wrapHtml, setWrapHtml] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(1);

  const outputText = useMemo(() => {
    const prng = makePrng(seed * 7919 + count * 31 + (startWithLorem ? 101 : 13));

    const generateSentence = (isFirst = false): string => {
      const len = Math.floor(prng() * 8) + 8;
      const words: string[] = [];
      if (isFirst && startWithLorem) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet,', 'consectetur', 'adipiscing', 'elit.');
        return words.join(' ');
      }
      for (let i = 0; i < len; i++) {
        const idx = Math.floor(prng() * LOREM_WORDS.length);
        words.push(LOREM_WORDS[idx]);
      }
      const raw = words.join(' ');
      return raw.charAt(0).toUpperCase() + raw.slice(1) + '.';
    };

    const generateParagraph = (isFirst = false): string => {
      const sentenceCount = Math.floor(prng() * 3) + 4;
      const sentences: string[] = [];
      for (let i = 0; i < sentenceCount; i++) {
        sentences.push(generateSentence(isFirst && i === 0));
      }
      return sentences.join(' ');
    };

    if (type === 'paragraphs') {
      const paras: string[] = [];
      for (let i = 0; i < count; i++) {
        const p = generateParagraph(i === 0);
        paras.push(wrapHtml ? `<p>${p}</p>` : p);
      }
      return paras.join('\n\n');
    }

    if (type === 'sentences') {
      const s: string[] = [];
      for (let i = 0; i < count; i++) {
        s.push(generateSentence(i === 0));
      }
      return s.join(' ');
    }

    if (type === 'words') {
      const words: string[] = [];
      if (startWithLorem) {
        words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
      }
      while (words.length < count) {
        const idx = Math.floor(prng() * LOREM_WORDS.length);
        words.push(LOREM_WORDS[idx]);
      }
      return words.slice(0, count).join(' ');
    }

    if (type === 'list') {
      const items: string[] = [];
      for (let i = 0; i < count; i++) {
        const s = generateSentence(i === 0);
        items.push(wrapHtml ? `  <li>${s}</li>` : `• ${s}`);
      }
      return wrapHtml ? `<ul>\n${items.join('\n')}\n</ul>` : items.join('\n');
    }

    return '';
  }, [type, count, startWithLorem, wrapHtml, seed]);

  return (
    <div id="lorem-ipsum-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        copyText={outputText}
        extraActions={
          <button
            type="button"
            id="regen-lorem-btn"
            onClick={() => setSeed((s) => s + 1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        }
      />

      {/* Control Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 mb-4 bg-zinc-900/90 border border-zinc-800 rounded-xl">
        <div>
          <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Generate Type</label>
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
            {(['paragraphs', 'sentences', 'words', 'list'] as const).map((t) => (
              <button
                key={t}
                type="button"
                id={`lorem-type-${t}`}
                onClick={() => setType(t)}
                className={`flex-1 py-1 rounded font-medium capitalize ${
                  type === t ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t === 'paragraphs' ? 'Paras' : t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-400 block mb-1.5">
            Quantity: <span className="text-emerald-400 font-mono">{count}</span>
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 3, 5, 10, 20].map((num) => (
              <button
                key={num}
                type="button"
                id={`lorem-count-${num}`}
                onClick={() => setCount(num)}
                className={`flex-1 py-1.5 text-xs font-mono rounded-lg border ${
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
          <label className="text-xs font-semibold text-zinc-400 block mb-1.5">Formatting Options</label>
          <div className="flex items-center gap-3 pt-1 text-xs text-zinc-300">
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                id="start-with-lorem-checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-950 text-emerald-500 w-3.5 h-3.5"
              />
              <span>Start with &quot;Lorem...&quot;</span>
            </label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                id="wrap-html-checkbox"
                checked={wrapHtml}
                onChange={(e) => setWrapHtml(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-950 text-emerald-500 w-3.5 h-3.5"
              />
              <span>Wrap &lt;HTML&gt;</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <CodeEditor
          id="lorem-output-text"
          label="Generated Placeholder Text"
          value={outputText}
          readOnly
          heightClass="h-[400px]"
        />
      </div>
    </div>
  );
}
