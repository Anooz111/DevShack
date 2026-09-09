'use client';

import React, { useState, useMemo } from 'react';
import CryptoJS from 'crypto-js';
import { CodeEditor } from '../ui/CodeEditor';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { CopyButton } from '../ui/CopyButton';
import { Key, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const SAMPLE_TEXT = 'DevShack - Instant, High Performance Developer Toolkit';

export function HashGenerator({ tool, isFavorite, onToggleFavorite }: Props) {
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [secretKey, setSecretKey] = useState('');
  const [useHmac, setUseHmac] = useState(false);
  const [uppercase, setUppercase] = useState(false);
  const [compareHash, setCompareHash] = useState('');

  const hashes = useMemo(() => {
    if (!input) {
      return { md5: '', sha1: '', sha256: '', sha512: '' };
    }

    try {
      let md5 = '';
      let sha1 = '';
      let sha256 = '';
      let sha512 = '';

      if (useHmac && secretKey) {
        md5 = CryptoJS.HmacMD5(input, secretKey).toString();
        sha1 = CryptoJS.HmacSHA1(input, secretKey).toString();
        sha256 = CryptoJS.HmacSHA256(input, secretKey).toString();
        sha512 = CryptoJS.HmacSHA512(input, secretKey).toString();
      } else {
        md5 = CryptoJS.MD5(input).toString();
        sha1 = CryptoJS.SHA1(input).toString();
        sha256 = CryptoJS.SHA256(input).toString();
        sha512 = CryptoJS.SHA512(input).toString();
      }

      if (uppercase) {
        md5 = md5.toUpperCase();
        sha1 = sha1.toUpperCase();
        sha256 = sha256.toUpperCase();
        sha512 = sha512.toUpperCase();
      }

      return { md5, sha1, sha256, sha512 };
    } catch {
      return { md5: '', sha1: '', sha256: '', sha512: '' };
    }
  }, [input, secretKey, useHmac, uppercase]);

  const hashList = useMemo(
    () => [
      { name: 'MD5', bit: '128-bit', value: hashes.md5 },
      { name: 'SHA-1', bit: '160-bit', value: hashes.sha1 },
      { name: 'SHA-256', bit: '256-bit', value: hashes.sha256 },
      { name: 'SHA-512', bit: '512-bit', value: hashes.sha512 },
    ],
    [hashes]
  );

  const compareResult = useMemo(() => {
    if (!compareHash.trim()) return null;
    const target = compareHash.trim().toLowerCase();
    const matched = hashList.find((h) => h.value.toLowerCase() === target);
    if (matched) {
      return { match: true, algorithm: matched.name };
    }
    return { match: false, algorithm: null };
  }, [compareHash, hashList]);

  return (
    <div id="hash-generator-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onLoadSample={() => setInput(SAMPLE_TEXT)}
        onClear={() => {
          setInput('');
          setSecretKey('');
          setCompareHash('');
        }}
      />

      {/* Input area */}
      <div className="mb-4">
        <CodeEditor
          id="hash-input-text"
          label="Input Plaintext to Hash"
          value={input}
          onChange={setInput}
          placeholder="Type string to generate cryptographic hashes..."
          heightClass="h-[100px]"
        />
      </div>

      {/* Options Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-4 bg-zinc-900/90 border border-zinc-800 rounded-xl">
        <div className="flex items-center flex-wrap gap-4">
          <label className="inline-flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              id="hmac-toggle"
              checked={useHmac}
              onChange={(e) => setUseHmac(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-950 text-emerald-500 w-3.5 h-3.5"
            />
            <span className="font-medium">Enable HMAC (Keyed-Hash)</span>
          </label>

          <label className="inline-flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              id="hash-case-toggle"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded border-zinc-700 bg-zinc-950 text-emerald-500 w-3.5 h-3.5"
            />
            <span>UPPERCASE Digest</span>
          </label>
        </div>

        {useHmac && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Key className="w-4 h-4 text-amber-400 shrink-0" />
            <input
              type="text"
              id="hmac-secret-key"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="HMAC Secret Key / Salt"
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-zinc-700 w-full sm:w-64"
            />
          </div>
        )}
      </div>

      {/* Computed Hash Cards */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        {hashList.map((item) => (
          <div
            key={item.name}
            className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center gap-2 sm:w-32 shrink-0">
              <span className="text-xs font-bold text-zinc-200">{item.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                {item.bit}
              </span>
            </div>

            <div className="flex-1 font-mono text-xs text-emerald-400 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/80 break-all select-all">
              {item.value || '(enter text)'}
            </div>

            <CopyButton text={item.value} size="sm" />
          </div>
        ))}
      </div>

      {/* Hash Verifier / Comparator */}
      <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl">
        <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
          Compare / Verify with Known Hash
        </label>
        <div className="flex items-center gap-3">
          <input
            type="text"
            id="compare-hash-input"
            value={compareHash}
            onChange={(e) => setCompareHash(e.target.value)}
            placeholder="Paste hash to verify if it matches any computed digest above..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-zinc-700"
          />
          {compareResult && (
            <div
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border ${
                compareResult.match
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/80'
                  : 'bg-rose-950/40 text-rose-300 border-rose-800/80'
              }`}
            >
              {compareResult.match ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Matches {compareResult.algorithm}!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>No Match</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
