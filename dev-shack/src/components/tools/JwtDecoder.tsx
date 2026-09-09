'use client';

import React, { useState, useMemo } from 'react';
import { CodeEditor } from '../ui/CodeEditor';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { CopyButton } from '../ui/CopyButton';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const SAMPLE_JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggRGV2ZWxvcGVyIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxODk4NjQwODAwLCJlbWFpbCI6ImFsZXhAZGV2c2hhY2suaW8ifQ.kK1o_9hA4p3s_J88Q4vN0k6vS-m8X6nZ0-9w3K9Q0wE`;

export function JwtDecoder({ tool, isFavorite, onToggleFavorite }: Props) {
  const [token, setToken] = useState(SAMPLE_JWT);

  const decoded = useMemo(() => {
    if (!token.trim()) {
      return {
        header: '',
        payload: '',
        signature: '',
        rawHeader: null,
        rawPayload: null,
        error: null,
        isExpired: false,
        expiresFormatted: null,
        issuedFormatted: null,
      };
    }

    try {
      const parts = token.trim().split('.');
      if (parts.length !== 3) {
        throw new Error('JWT must consist of exactly 3 parts separated by dots.');
      }

      const decodeBase64Url = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) {
          base64 += '=';
        }
        return decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const headerObj = JSON.parse(decodeBase64Url(parts[0]));
      const payloadObj = JSON.parse(decodeBase64Url(parts[1]));

      let isExpired = false;
      let expiresFormatted = null;
      let issuedFormatted = null;

      if (payloadObj.exp && typeof payloadObj.exp === 'number') {
        const expDate = new Date(payloadObj.exp * 1000);
        expiresFormatted = expDate.toUTCString();
        // Check expiration against a static epoch reference or parse check
        if (expDate.getTime() < 1740000000000) {
          isExpired = true;
        }
      }

      if (payloadObj.iat && typeof payloadObj.iat === 'number') {
        const iatDate = new Date(payloadObj.iat * 1000);
        issuedFormatted = iatDate.toUTCString();
      }

      return {
        header: JSON.stringify(headerObj, null, 2),
        payload: JSON.stringify(payloadObj, null, 2),
        signature: parts[2],
        rawHeader: headerObj,
        rawPayload: payloadObj,
        error: null,
        isExpired,
        expiresFormatted,
        issuedFormatted,
      };
    } catch (err: unknown) {
      return {
        header: '',
        payload: '',
        signature: '',
        rawHeader: null,
        rawPayload: null,
        error: err instanceof Error ? err.message : 'Invalid JSON Web Token',
        isExpired: false,
        expiresFormatted: null,
        issuedFormatted: null,
      };
    }
  }, [token]);

  return (
    <div id="jwt-decoder-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onLoadSample={() => setToken(SAMPLE_JWT)}
        onClear={() => setToken('')}
        copyText={decoded.payload}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Token Input Column */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <CodeEditor
            id="jwt-input-token"
            label="Encoded JWT Token"
            value={token}
            onChange={setToken}
            placeholder="Paste eyJhbGci... token here"
            errorMessage={decoded.error}
            heightClass="h-[360px]"
          />

          {/* Quick claim tags */}
          {decoded.rawPayload && (
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2 text-xs">
              <div className="font-semibold text-zinc-300 flex items-center justify-between">
                <span>Claims Overview</span>
                {decoded.rawHeader?.alg && (
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800">
                    Alg: {decoded.rawHeader.alg}
                  </span>
                )}
              </div>

              {decoded.issuedFormatted && (
                <div className="flex items-center justify-between text-zinc-400 font-mono text-[11px]">
                  <span>Issued At (iat):</span>
                  <span className="text-zinc-300">{decoded.issuedFormatted}</span>
                </div>
              )}

              {decoded.expiresFormatted && (
                <div className="flex items-center justify-between text-zinc-400 font-mono text-[11px]">
                  <span>Expires At (exp):</span>
                  <span className={decoded.isExpired ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {decoded.expiresFormatted}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Decoded Output Columns */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4">
            <CodeEditor
              id="jwt-header-output"
              label="Decoded Header (Algorithm & Token Type)"
              value={decoded.header}
              readOnly
              heightClass="h-[140px]"
              successMessage={decoded.header ? 'Valid Header' : null}
            />

            <CodeEditor
              id="jwt-payload-output"
              label="Decoded Payload (Claims & Data)"
              value={decoded.payload}
              readOnly
              heightClass="h-[240px]"
              successMessage={decoded.payload ? 'Valid Claims' : null}
            />

            {decoded.signature && (
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                <div className="flex items-center justify-between mb-1.5 text-xs text-zinc-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Signature Hash
                  </span>
                  <CopyButton text={decoded.signature} size="sm" variant="ghost" />
                </div>
                <div className="font-mono text-xs text-cyan-300 break-all p-2 bg-zinc-900 rounded-lg border border-zinc-800/80">
                  {decoded.signature}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
