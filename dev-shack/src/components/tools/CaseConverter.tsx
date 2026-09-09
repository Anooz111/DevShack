'use client';

import React, { useState, useMemo } from 'react';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { CodeEditor } from '../ui/CodeEditor';
import { CopyButton } from '../ui/CopyButton';
import { CaseSensitive, Check } from 'lucide-react';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const SAMPLE_TEXT = 'developer utilities and tools for high productivity';

export function CaseConverter({ tool, isFavorite, onToggleFavorite }: Props) {
  const [input, setInput] = useState(SAMPLE_TEXT);

  const getWords = (str: string): string[] => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_.]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  };

  const conversions = useMemo(() => {
    if (!input.trim()) return [];

    const words = getWords(input);

    const camelCase = words
      .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
      .join('');

    const pascalCase = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');

    const snakeCase = words.map((w) => w.toLowerCase()).join('_');

    const constantCase = words.map((w) => w.toUpperCase()).join('_');

    const kebabCase = words.map((w) => w.toLowerCase()).join('-');

    const titleCase = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    const sentenceCase = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();

    const dotCase = words.map((w) => w.toLowerCase()).join('.');

    const pathCase = words.map((w) => w.toLowerCase()).join('/');

    const lowerCase = input.toLowerCase();
    const upperCase = input.toUpperCase();

    return [
      { name: 'camelCase', value: camelCase, desc: 'JS variables & properties' },
      { name: 'kebab-case', value: kebabCase, desc: 'URL slugs & CSS class names' },
      { name: 'snake_case', value: snakeCase, desc: 'Python & SQL database fields' },
      { name: 'PascalCase', value: pascalCase, desc: 'React components & classes' },
      { name: 'CONSTANT_CASE', value: constantCase, desc: 'Environment variables & constants' },
      { name: 'Title Case', value: titleCase, desc: 'Article and document headings' },
      { name: 'Sentence case', value: sentenceCase, desc: 'Natural standard prose sentences' },
      { name: 'dot.case', value: dotCase, desc: 'Config keys & domain properties' },
      { name: 'path/case', value: pathCase, desc: 'File and folder system paths' },
      { name: 'lowercase', value: lowerCase, desc: 'All lower alphanumeric' },
      { name: 'UPPERCASE', value: upperCase, desc: 'All upper alphanumeric' },
    ];
  }, [input]);

  const stats = useMemo(() => {
    const chars = input.length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const lines = input ? input.split('\n').length : 0;
    return { chars, words, lines };
  }, [input]);

  return (
    <div id="case-converter-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onLoadSample={() => setInput(SAMPLE_TEXT)}
        onClear={() => setInput('')}
        copyText={input}
      />

      <div className="mb-4">
        <CodeEditor
          id="case-input-text"
          label="Input Text"
          value={input}
          onChange={setInput}
          placeholder="Type or paste any text to transform into all cases..."
          heightClass="h-[100px]"
        />
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-4 text-xs text-zinc-400 font-mono">
        <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
          {stats.words} words
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
          {stats.chars} characters
        </span>
        <span className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
          {stats.lines} lines
        </span>
      </div>

      {/* Conversions Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
        {conversions.map((conv) => (
          <div
            key={conv.name}
            className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between hover:border-zinc-700 transition-colors group"
          >
            <div className="min-w-0 pr-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-300">{conv.name}</span>
                <span className="text-[10px] text-zinc-500 hidden sm:inline font-sans">
                  {conv.desc}
                </span>
              </div>
              <div className="font-mono text-xs text-emerald-400 font-semibold truncate mt-1 select-all">
                {conv.value}
              </div>
            </div>
            <CopyButton text={conv.value} size="icon" variant="ghost" />
          </div>
        ))}
      </div>
    </div>
  );
}
