'use client';

import React, { useState, useMemo } from 'react';
import { CodeEditor } from '../ui/CodeEditor';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { ArrowDownAZ, Minimize2, CheckCheck, FileJson, Copy, ListTree, AlignLeft } from 'lucide-react';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const SAMPLE_JSON = `{
  "name": "DevShack",
  "version": "1.0.0",
  "private": true,
  "config": {
    "port": 3000,
    "environment": "production",
    "features": {
      "offlineReady": true,
      "instantConversion": true,
      "maxPayloadMb": 10
    }
  },
  "contributors": [
    { "id": 1, "role": "lead", "active": true },
    { "id": 2, "role": "maintainer", "active": false }
  ]
}`;

export function JsonFormatter({ tool, isFavorite, onToggleFavorite }: Props) {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [indentSize, setIndentSize] = useState<number>(2);
  const [viewMode, setViewMode] = useState<'editor' | 'tree'>('editor');

  const { output, error, parsedData, stats } = useMemo(() => {
    if (!input.trim()) {
      return { output: '', error: null, parsedData: null, stats: null };
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize === 0 ? undefined : indentSize);

      let keyCount = 0;
      let depth = 0;
      const countKeysAndDepth = (obj: unknown, currentDepth = 1): number => {
        if (currentDepth > depth) depth = currentDepth;
        if (typeof obj === 'object' && obj !== null) {
          if (Array.isArray(obj)) {
            obj.forEach((item) => countKeysAndDepth(item, currentDepth + 1));
          } else {
            const keys = Object.keys(obj);
            keyCount += keys.length;
            keys.forEach((key) => countKeysAndDepth((obj as Record<string, unknown>)[key], currentDepth + 1));
          }
        }
        return depth;
      };
      countKeysAndDepth(parsed);

      return {
        output: formatted,
        error: null,
        parsedData: parsed,
        stats: { keyCount, depth, type: Array.isArray(parsed) ? 'Array' : 'Object' },
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid JSON';
      return { output: '', error: message, parsedData: null, stats: null };
    }
  }, [input, indentSize]);

  const handleMinify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
    } catch {
      // Keep input for error display
    }
  };

  const handleSortKeys = () => {
    if (!input.trim()) return;
    try {
      const sortObject = (obj: unknown): unknown => {
        if (typeof obj !== 'object' || obj === null) return obj;
        if (Array.isArray(obj)) return obj.map(sortObject);
        const sortedKeys = Object.keys(obj).sort();
        const result: Record<string, unknown> = {};
        for (const key of sortedKeys) {
          result[key] = sortObject((obj as Record<string, unknown>)[key]);
        }
        return result;
      };
      const parsed = JSON.parse(input);
      const sorted = sortObject(parsed);
      setInput(JSON.stringify(sorted, null, indentSize === 0 ? 2 : indentSize));
    } catch {
      // Error handled by useMemo
    }
  };

  const handleFixCommon = () => {
    // Attempt auto-repairing common issues like unquoted keys or single quotes
    try {
      let fixed = input
        .replace(/'/g, '"') // Replace single quotes with double
        .replace(/(\w+)\s*:/g, '"$1":') // Quote unquoted keys
        .replace(/,\s*([}\]])/g, '$1'); // Remove trailing commas
      JSON.parse(fixed); // test
      setInput(fixed);
    } catch {
      // cannot auto fix
    }
  };

  return (
    <div id="json-formatter-container" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onLoadSample={() => setInput(SAMPLE_JSON)}
        onClear={() => setInput('')}
        copyText={output || input}
      />

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-4 bg-[#161618] border border-white/10 rounded-xl">
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
            <span className="text-zinc-500 px-2 font-medium">Indent:</span>
            {[2, 4, 0].map((size) => (
              <button
                key={size}
                type="button"
                id={`indent-size-${size}`}
                onClick={() => setIndentSize(size)}
                className={`px-2.5 py-1 rounded font-mono transition-colors ${
                  indentSize === size
                    ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {size === 0 ? 'Compact' : `${size} Sp`}
              </button>
            ))}
          </div>

          <button
            type="button"
            id="minify-json-btn"
            onClick={handleMinify}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-black/30 hover:bg-white/5 text-zinc-300 hover:text-white border border-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Minify</span>
          </button>

          <button
            type="button"
            id="sort-json-btn"
            onClick={handleSortKeys}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-black/30 hover:bg-white/5 text-zinc-300 hover:text-white border border-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowDownAZ className="w-3.5 h-3.5 text-zinc-400" />
            <span>Sort Keys</span>
          </button>

          <button
            type="button"
            id="fix-json-btn"
            onClick={handleFixCommon}
            title="Attempts to fix single quotes and trailing commas"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-black/30 hover:bg-white/5 text-zinc-300 hover:text-white border border-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auto-Repair</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {stats && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-mono bg-black/40 px-2.5 py-1 rounded-lg border border-white/10">
              <span>Type: {stats.type}</span>
              <span>•</span>
              <span>Keys: {stats.keyCount}</span>
              <span>•</span>
              <span>Depth: {stats.depth}</span>
            </div>
          )}

          <div className="flex items-center bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
            <button
              type="button"
              id="viewmode-editor"
              onClick={() => setViewMode('editor')}
              className={`p-1.5 rounded ${
                viewMode === 'editor' ? 'bg-white/10 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Editor View"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              id="viewmode-tree"
              onClick={() => setViewMode('tree')}
              className={`p-1.5 rounded ${
                viewMode === 'tree' ? 'bg-white/10 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Tree Inspector"
            >
              <ListTree className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'editor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          <CodeEditor
            id="json-input"
            label="Raw Input JSON"
            value={input}
            onChange={setInput}
            placeholder="Paste your JSON here to format, validate, or repair..."
            heightClass="h-[380px]"
            error={error}
          />
          <CodeEditor
            id="json-output"
            label="Formatted & Validated JSON"
            value={output}
            readOnly
            placeholder="Formatted output will display here..."
            heightClass="h-[380px]"
            successMessage={output ? 'Valid JSON' : null}
          />
        </div>
      ) : (
        <div className="border border-zinc-800 bg-zinc-950 rounded-xl p-4 overflow-y-auto max-h-[500px]">
          {error ? (
            <div className="text-rose-400 text-sm font-mono p-4">
              Cannot render tree view: {error}
            </div>
          ) : parsedData ? (
            <JsonTreeView data={parsedData} />
          ) : (
            <div className="text-zinc-500 text-sm">Enter valid JSON to inspect structure</div>
          )}
        </div>
      )}
    </div>
  );
}

// Tree view helper
function JsonTreeView({ data, depth = 0, name }: { data: unknown; depth?: number; name?: string }) {
  const [collapsed, setCollapsed] = useState(depth > 2);
  const isObject = typeof data === 'object' && data !== null;
  const isArray = Array.isArray(data);

  if (!isObject) {
    let color = 'text-amber-300';
    if (typeof data === 'string') color = 'text-emerald-400';
    if (typeof data === 'boolean') color = 'text-purple-400';
    if (data === null) color = 'text-rose-400';

    return (
      <div className="font-mono text-xs py-0.5 ml-4 flex items-center gap-1.5">
        {name && <span className="text-zinc-400">&quot;{name}&quot;:</span>}
        <span className={color}>
          {typeof data === 'string' ? `"${data}"` : String(data)}
        </span>
      </div>
    );
  }

  const keys = Object.keys(data as Record<string, unknown>);

  return (
    <div className="font-mono text-xs ml-4 py-0.5">
      <div
        onClick={() => setCollapsed(!collapsed)}
        className="cursor-pointer inline-flex items-center gap-1 text-zinc-300 hover:text-white select-none"
      >
        <span className="text-zinc-600 w-3">{collapsed ? '▶' : '▼'}</span>
        {name && <span className="text-cyan-300">&quot;{name}&quot;:</span>}
        <span className="text-zinc-500">
          {isArray ? `Array(${keys.length}) [` : `Object {${keys.length}}`}
        </span>
      </div>

      {!collapsed && (
        <div className="border-l border-zinc-800/80 ml-1.5 pl-2 my-1">
          {keys.map((key) => (
            <JsonTreeView
              key={key}
              name={isArray ? undefined : key}
              data={(data as Record<string, unknown>)[key]}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
      {!collapsed && (
        <span className="text-zinc-500">{isArray ? ']' : '}'}</span>
      )}
    </div>
  );
}
