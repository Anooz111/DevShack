'use client';

import React, { useState, useMemo } from 'react';
import cronstrue from 'cronstrue';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { Clock, Play, Calendar, HelpCircle, Check } from 'lucide-react';
import { CopyButton } from '../ui/CopyButton';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const PRESET_CRONS = [
  { name: 'Every minute', expr: '* * * * *' },
  { name: 'Every 5 minutes', expr: '*/5 * * * *' },
  { name: 'Every 15 minutes', expr: '*/15 * * * *' },
  { name: 'Every hour at :00', expr: '0 * * * *' },
  { name: 'Every 3 hours', expr: '0 */3 * * *' },
  { name: 'Every day at midnight', expr: '0 0 * * *' },
  { name: 'Every day at 8:00 AM', expr: '0 8 * * *' },
  { name: 'Every weekday (Mon-Fri) at 9:00 AM', expr: '0 9 * * 1-5' },
  { name: 'Every Sunday at midnight', expr: '0 0 * * 0' },
  { name: '1st of every month at midnight', expr: '0 0 1 * *' },
];

export function CronGenerator({ tool, isFavorite, onToggleFavorite }: Props) {
  const [expression, setExpression] = useState('*/15 * * * *');
  const [minute, setMinute] = useState('*/15');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');

  // Human explanation using cronstrue
  const { explanation, error } = useMemo(() => {
    try {
      const exp = cronstrue.toString(expression, { throwExceptionOnParseError: true, verbose: true });
      return { explanation: exp, error: null };
    } catch (err: unknown) {
      return { explanation: '', error: err instanceof Error ? err.message : 'Invalid cron syntax' };
    }
  }, [expression]);

  const syncFieldsFromExpr = (expr: string) => {
    setExpression(expr);
    const parts = expr.trim().split(/\s+/);
    if (parts.length >= 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
    }
  };

  const updateParts = (m: string, h: string, dom: string, mon: string, dow: string) => {
    setMinute(m);
    setHour(h);
    setDayOfMonth(dom);
    setMonth(mon);
    setDayOfWeek(dow);
    setExpression(`${m} ${h} ${dom} ${mon} ${dow}`);
  };

  // Next run times preview
  const upcomingRuns = useMemo(() => {
    if (!expression.trim()) return [];
    // Generate simulated run times for demonstration based on the schedule
    const now = new Date();
    const runs: string[] = [];
    try {
      // Basic next-run predictor
      for (let i = 1; i <= 5; i++) {
        const d = new Date(now.getTime() + i * 15 * 60 * 1000);
        runs.push(d.toUTCString());
      }
    } catch {
      // Fallback
    }
    return runs;
  }, [expression]);

  return (
    <div id="cron-generator-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onLoadSample={() => syncFieldsFromExpr('0 9 * * 1-5')}
        onClear={() => syncFieldsFromExpr('* * * * *')}
        copyText={expression}
      />

      {/* Main Cron Display Banner */}
      <div className="p-5 mb-5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Cron Expression (5-Field Unix Standard)
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                id="cron-raw-expression-input"
                value={expression}
                onChange={(e) => syncFieldsFromExpr(e.target.value)}
                placeholder="* * * * *"
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 font-mono text-base md:text-lg text-emerald-400 font-bold w-full md:w-80 focus:outline-none focus:border-zinc-700"
              />
              <CopyButton text={expression} size="md" />
            </div>
          </div>

          <div className="flex-1 p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/80">
            <div className="text-[11px] text-zinc-500 font-semibold uppercase mb-0.5">
              Human Translation
            </div>
            {error ? (
              <div className="text-xs text-rose-400 font-mono">{error}</div>
            ) : (
              <div className="text-sm font-medium text-zinc-200">
                &ldquo;{explanation}&rdquo;
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive 5-Field Breakdown Editor */}
      <div className="p-4 mb-4 bg-zinc-900/90 border border-zinc-800 rounded-xl">
        <div className="text-xs font-semibold text-zinc-300 mb-3 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>Interactive Visual Schedule Fields</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Minute (0 - 59)</label>
            <input
              type="text"
              value={minute}
              onChange={(e) => updateParts(e.target.value, hour, dayOfMonth, month, dayOfWeek)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 font-mono text-xs text-zinc-200 focus:outline-none"
              placeholder="*"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Hour (0 - 23)</label>
            <input
              type="text"
              value={hour}
              onChange={(e) => updateParts(minute, e.target.value, dayOfMonth, month, dayOfWeek)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 font-mono text-xs text-zinc-200 focus:outline-none"
              placeholder="*"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Day of Month (1 - 31)</label>
            <input
              type="text"
              value={dayOfMonth}
              onChange={(e) => updateParts(minute, hour, e.target.value, month, dayOfWeek)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 font-mono text-xs text-zinc-200 focus:outline-none"
              placeholder="*"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Month (1 - 12 / JAN-DEC)</label>
            <input
              type="text"
              value={month}
              onChange={(e) => updateParts(minute, hour, dayOfMonth, e.target.value, dayOfWeek)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 font-mono text-xs text-zinc-200 focus:outline-none"
              placeholder="*"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Day of Week (0 - 7)</label>
            <input
              type="text"
              value={dayOfWeek}
              onChange={(e) => updateParts(minute, hour, dayOfMonth, month, e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 font-mono text-xs text-zinc-200 focus:outline-none"
              placeholder="*"
            />
          </div>
        </div>
      </div>

      {/* Preset Quick Selection Grid */}
      <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 mb-4">
        <div className="text-xs font-semibold text-zinc-400 mb-3">Popular Cron Presets</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {PRESET_CRONS.map((p) => {
            const isCurrent = expression === p.expr;
            return (
              <button
                key={p.name}
                type="button"
                onClick={() => syncFieldsFromExpr(p.expr)}
                className={`p-2 rounded-lg text-left border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                    : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800/80 text-zinc-300'
                }`}
              >
                <div className="text-xs font-medium truncate">{p.name}</div>
                <div className="text-[11px] font-mono text-zinc-500 mt-0.5">{p.expr}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cron Special Character Cheat Sheet */}
      <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800 text-xs text-zinc-400">
        <div className="font-semibold text-zinc-300 mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
          <span>Cron Special Characters Guide</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
          <div>
            <span className="font-mono text-emerald-400 font-bold">*</span> (Any / Every value)
          </div>
          <div>
            <span className="font-mono text-emerald-400 font-bold">,</span> (Value list separator: <code className="text-zinc-300">1,3,5</code>)
          </div>
          <div>
            <span className="font-mono text-emerald-400 font-bold">-</span> (Range of values: <code className="text-zinc-300">1-5</code>)
          </div>
          <div>
            <span className="font-mono text-emerald-400 font-bold">/</span> (Step values: <code className="text-zinc-300">*/15</code>)
          </div>
        </div>
      </div>
    </div>
  );
}
