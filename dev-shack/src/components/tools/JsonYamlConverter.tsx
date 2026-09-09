'use client';

import React, { useState, useEffect } from 'react';
import * as yaml from 'js-yaml';
import { CodeEditor } from '../ui/CodeEditor';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { ArrowLeftRight, ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const SAMPLE_JSON = `{
  "server": {
    "host": "localhost",
    "port": 8080,
    "ssl": true,
    "cors": {
      "enabled": true,
      "origins": ["https://app.devshack.io", "https://api.devshack.io"]
    }
  },
  "database": {
    "poolSize": 10,
    "timeout": "30s"
  }
}`;

const SAMPLE_YAML = `server:
  host: localhost
  port: 8080
  ssl: true
  cors:
    enabled: true
    origins:
      - https://app.devshack.io
      - https://api.devshack.io
database:
  poolSize: 10
  timeout: 30s
`;

export function JsonYamlConverter({ tool, isFavorite, onToggleFavorite }: Props) {
  const [direction, setDirection] = useState<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml');
  const [jsonText, setJsonText] = useState(SAMPLE_JSON);
  const [yamlText, setYamlText] = useState(SAMPLE_YAML);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [yamlError, setYamlError] = useState<string | null>(null);

  // Convert on json text change when direction is json-to-yaml
  const handleJsonChange = (val: string) => {
    setJsonText(val);
    if (!val.trim()) {
      setYamlText('');
      setJsonError(null);
      return;
    }
    try {
      const parsed = JSON.parse(val);
      const dumped = yaml.dump(parsed, { indent: 2, lineWidth: -1 });
      setYamlText(dumped);
      setJsonError(null);
    } catch (err: unknown) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  // Convert on yaml text change when direction is yaml-to-json
  const handleYamlChange = (val: string) => {
    setYamlText(val);
    if (!val.trim()) {
      setJsonText('');
      setYamlError(null);
      return;
    }
    try {
      const loaded = yaml.load(val);
      const stringified = JSON.stringify(loaded, null, 2);
      setJsonText(stringified);
      setYamlError(null);
    } catch (err: unknown) {
      setYamlError(err instanceof Error ? err.message : 'Invalid YAML');
    }
  };

  const handleSwap = () => {
    setDirection((prev) => (prev === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml'));
  };

  return (
    <div id="json-yaml-converter" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onLoadSample={() => {
          if (direction === 'json-to-yaml') {
            handleJsonChange(SAMPLE_JSON);
          } else {
            handleYamlChange(SAMPLE_YAML);
          }
        }}
        onClear={() => {
          setJsonText('');
          setYamlText('');
          setJsonError(null);
          setYamlError(null);
        }}
      />

      {/* Toolbar Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-4 bg-zinc-900/90 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-medium">
            <button
              type="button"
              id="mode-json-to-yaml"
              onClick={() => setDirection('json-to-yaml')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                direction === 'json-to-yaml'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>JSON</span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
              <span>YAML</span>
            </button>
            <button
              type="button"
              id="mode-yaml-to-json"
              onClick={() => setDirection('yaml-to-json')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                direction === 'yaml-to-json'
                  ? 'bg-zinc-800 text-zinc-100 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>YAML</span>
              <ArrowRight className="w-3 h-3 text-emerald-400" />
              <span>JSON</span>
            </button>
          </div>

          <button
            type="button"
            id="swap-direction-btn"
            onClick={handleSwap}
            className="p-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 rounded-lg transition-colors"
            title="Swap source and target"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
          Bidirectional Instant Parser
        </span>
      </div>

      {/* Editor Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {direction === 'json-to-yaml' ? (
          <>
            <CodeEditor
              id="json-yaml-json-input"
              label="Input JSON"
              value={jsonText}
              onChange={handleJsonChange}
              placeholder="Paste JSON here..."
              heightClass="h-[400px]"
              error={jsonError}
            />
            <CodeEditor
              id="json-yaml-yaml-output"
              label="Target YAML"
              value={yamlText}
              readOnly
              placeholder="YAML output will appear here..."
              heightClass="h-[400px]"
              successMessage={yamlText && !jsonError ? 'Valid YAML' : null}
            />
          </>
        ) : (
          <>
            <CodeEditor
              id="json-yaml-yaml-input"
              label="Input YAML"
              value={yamlText}
              onChange={handleYamlChange}
              placeholder="Paste YAML here..."
              heightClass="h-[400px]"
              error={yamlError}
            />
            <CodeEditor
              id="json-yaml-json-output"
              label="Target JSON"
              value={jsonText}
              readOnly
              placeholder="JSON output will appear here..."
              heightClass="h-[400px]"
              successMessage={jsonText && !yamlError ? 'Valid JSON' : null}
            />
          </>
        )}
      </div>
    </div>
  );
}
