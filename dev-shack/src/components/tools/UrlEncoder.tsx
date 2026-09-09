'use client';

import React, { useState, useMemo } from 'react';
import { CodeEditor } from '../ui/CodeEditor';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { Plus, Trash2, Link2, ExternalLink } from 'lucide-react';
import { CopyButton } from '../ui/CopyButton';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const SAMPLE_URL = 'https://api.devshack.io/v1/search?query=developer tools & kits&category=utilities&sort=popular&filters[active]=true#results';

interface QueryParam {
  key: string;
  value: string;
}

export function UrlEncoder({ tool, isFavorite, onToggleFavorite }: Props) {
  const [mode, setMode] = useState<'encode' | 'decode' | 'params'>('encode');
  const [input, setInput] = useState(SAMPLE_URL);
  const [encodeType, setEncodeType] = useState<'component' | 'uri'>('component');

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: null };
    try {
      if (mode === 'encode') {
        const res = encodeType === 'component' ? encodeURIComponent(input) : encodeURI(input);
        return { output: res, error: null };
      } else if (mode === 'decode') {
        const res = encodeType === 'component' ? decodeURIComponent(input) : decodeURI(input);
        return { output: res, error: null };
      }
      return { output: '', error: null };
    } catch (err: unknown) {
      return { output: '', error: err instanceof Error ? err.message : 'URL processing error' };
    }
  }, [input, mode, encodeType]);

  // Query parameter table parser
  const [parsedBaseUrl, setParsedBaseUrl] = useState('');
  const [parsedHash, setParsedHash] = useState('');
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);

  // Sync params when switching to params mode or on load
  const syncParamsFromInput = (urlStr: string) => {
    try {
      const questionIdx = urlStr.indexOf('?');
      const hashIdx = urlStr.indexOf('#');
      
      let base = urlStr;
      let queryStr = '';
      let hash = '';

      if (hashIdx !== -1) {
        hash = urlStr.slice(hashIdx + 1);
        base = urlStr.slice(0, hashIdx);
      }
      if (questionIdx !== -1) {
        queryStr = base.slice(questionIdx + 1);
        base = base.slice(0, questionIdx);
      }

      setParsedBaseUrl(base);
      setParsedHash(hash);

      if (queryStr) {
        const pairs = queryStr.split('&');
        const params: QueryParam[] = pairs.map((pair) => {
          const [k, ...rest] = pair.split('=');
          return {
            key: decodeURIComponent(k || ''),
            value: decodeURIComponent(rest.join('=') || ''),
          };
        });
        setQueryParams(params);
      } else {
        setQueryParams([]);
      }
    } catch {
      // Fallback
    }
  };

  const handleUpdateParam = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...queryParams];
    updated[index][field] = val;
    setQueryParams(updated);
    rebuildUrlFromParams(parsedBaseUrl, updated, parsedHash);
  };

  const handleAddParam = () => {
    const updated = [...queryParams, { key: 'new_param', value: '' }];
    setQueryParams(updated);
    rebuildUrlFromParams(parsedBaseUrl, updated, parsedHash);
  };

  const handleDeleteParam = (index: number) => {
    const updated = queryParams.filter((_, i) => i !== index);
    setQueryParams(updated);
    rebuildUrlFromParams(parsedBaseUrl, updated, parsedHash);
  };

  const rebuildUrlFromParams = (base: string, params: QueryParam[], hash: string) => {
    const queryPart = params
      .filter((p) => p.key.trim())
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join('&');

    let full = base;
    if (queryPart) full += `?${queryPart}`;
    if (hash) full += `#${hash}`;
    setInput(full);
  };

  return (
    <div id="url-encoder-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onLoadSample={() => {
          setInput(SAMPLE_URL);
          syncParamsFromInput(SAMPLE_URL);
        }}
        onClear={() => {
          setInput('');
          setQueryParams([]);
          setParsedBaseUrl('');
          setParsedHash('');
        }}
        copyText={output || input}
      />

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-4 bg-zinc-900/90 border border-zinc-800 rounded-xl">
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-medium">
            <button
              type="button"
              id="url-mode-encode"
              onClick={() => setMode('encode')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mode === 'encode'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Encode
            </button>
            <button
              type="button"
              id="url-mode-decode"
              onClick={() => setMode('decode')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mode === 'decode'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Decode
            </button>
            <button
              type="button"
              id="url-mode-params"
              onClick={() => {
                setMode('params');
                syncParamsFromInput(input);
              }}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mode === 'params'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Query Params Table
            </button>
          </div>

          {mode !== 'params' && (
            <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
              <span className="text-zinc-500 px-2">Scope:</span>
              <button
                type="button"
                id="url-scope-component"
                onClick={() => setEncodeType('component')}
                className={`px-2 py-1 rounded font-mono ${
                  encodeType === 'component'
                    ? 'bg-zinc-800 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Encodes all special chars including /:?&="
              >
                Component
              </button>
              <button
                type="button"
                id="url-scope-uri"
                onClick={() => setEncodeType('uri')}
                className={`px-2 py-1 rounded font-mono ${
                  encodeType === 'uri'
                    ? 'bg-zinc-800 text-zinc-100 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Preserves URI structural characters like :// and ?&"
              >
                Full URI
              </button>
            </div>
          )}
        </div>
      </div>

      {mode === 'params' ? (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
            <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">Base URL / Endpoint</label>
            <input
              type="text"
              id="params-base-url"
              value={parsedBaseUrl}
              onChange={(e) => {
                setParsedBaseUrl(e.target.value);
                rebuildUrlFromParams(e.target.value, queryParams, parsedHash);
              }}
              placeholder="https://api.example.com/v1/endpoint"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs md:text-sm font-mono text-zinc-200 focus:outline-none focus:border-zinc-700"
            />
          </div>

          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300">
                Query Parameters ({queryParams.length})
              </span>
              <button
                type="button"
                id="add-query-param-btn"
                onClick={handleAddParam}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add Parameter</span>
              </button>
            </div>

            {queryParams.length === 0 ? (
              <div className="text-center py-6 text-xs text-zinc-500">
                No query parameters detected in URL. Click &quot;Add Parameter&quot; to build.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {queryParams.map((param, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={param.key}
                      onChange={(e) => handleUpdateParam(idx, 'key', e.target.value)}
                      placeholder="key (e.g. limit)"
                      className="w-1/3 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-700"
                    />
                    <span className="text-zinc-600 font-mono">=</span>
                    <input
                      type="text"
                      value={param.value}
                      onChange={(e) => handleUpdateParam(idx, 'value', e.target.value)}
                      placeholder="value (e.g. 50)"
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-700"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteParam(idx)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 rounded transition-colors"
                      title="Remove parameter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-300">Generated Full URL</label>
              <CopyButton text={input} size="sm" />
            </div>
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 font-mono text-xs text-emerald-400 break-all select-all">
              {input || '(empty)'}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
          <CodeEditor
            id="url-input"
            label={mode === 'encode' ? 'Raw URL or String to Encode' : 'Encoded URL to Decode'}
            value={input}
            onChange={setInput}
            placeholder="Type or paste URL here..."
            heightClass="h-[380px]"
            error={error}
          />
          <CodeEditor
            id="url-output"
            label={mode === 'encode' ? 'Encoded URL' : 'Decoded URL'}
            value={output}
            readOnly
            placeholder="Result will appear here..."
            heightClass="h-[380px]"
            successMessage={output ? 'Processed' : null}
          />
        </div>
      )}
    </div>
  );
}
