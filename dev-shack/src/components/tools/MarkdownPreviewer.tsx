'use client';

import React, { useState, useMemo } from 'react';
import { ToolHeader } from '../ui/ToolHeader';
import { ToolDefinition } from '@/types/tools';
import { Download, FileText, Code2, Eye, Columns } from 'lucide-react';
import { CopyButton } from '../ui/CopyButton';

interface Props {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const SAMPLE_MARKDOWN = `# DevShack — Pocket Dev Utility

DevShack is a **minimal, unified dashboard** consolidating critical everyday developer tools into a single lightning-fast client-side suite.

## ✨ Core Features
- **Zero latency**: Everything computes in real-time in the browser.
- **Offline ready**: Works anywhere without mandatory external roundtrips.
- **18+ Dev Utilities**: JSON, YAML, Base64, JWT, Hashes, Cron, and Diffing.

### 💻 Code Example
\`\`\`typescript
interface DevTool {
  id: string;
  name: string;
  category: 'formatters' | 'converters' | 'generators';
}

const tool: DevTool = {
  id: 'markdown-previewer',
  name: 'Markdown Previewer',
  category: 'formatters'
};
\`\`\`

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

### 📊 Quick Comparison
| Tool | Latency | Status |
| :--- | :--- | :--- |
| JSON Formatter | 1ms | ✅ Ready |
| Regex Tester | 2ms | ✅ Ready |
| Diff Checker | 3ms | ✅ Ready |

Check out the [DevShack GitHub](https://github.com) or join the community!
`;

export function MarkdownPreviewer({ tool, isFavorite, onToggleFavorite }: Props) {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [viewTab, setViewTab] = useState<'split' | 'edit' | 'preview'>('split');

  // Convert markdown to clean HTML
  const htmlOutput = useMemo(() => {
    let raw = markdown;

    // Code blocks
    raw = raw.replace(/```([a-zA-Z0-9]*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="bg-zinc-950 p-3 rounded-lg border border-zinc-800 my-3 font-mono text-xs overflow-x-auto text-emerald-300"><code>${escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline code
    raw = raw.replace(/`([^`]+)`/g, '<code class="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-xs">$1</code>');

    // Headers
    raw = raw.replace(/^### (.*$)/gim, '<h3 class="text-base font-semibold text-zinc-100 mt-4 mb-2">$1</h3>');
    raw = raw.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-zinc-100 mt-5 mb-2 pb-1 border-b border-zinc-800">$1</h2>');
    raw = raw.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-zinc-100 mt-2 mb-3 pb-2 border-b border-zinc-800">$1</h1>');

    // Blockquotes
    raw = raw.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-emerald-500 pl-3 italic text-zinc-400 my-3">$1</blockquote>');

    // Bold & Italics
    raw = raw.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-zinc-100">$1</strong>');
    raw = raw.replace(/\*(.*?)\*/g, '<em class="italic text-zinc-300">$1</em>');

    // Links
    raw = raw.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-emerald-400 hover:underline font-medium">$1</a>');

    // Tables (Simple parsing)
    const lines = raw.split('\n');
    let inTable = false;
    let tableHtml = '';
    const newLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('|') && line.endsWith('|')) {
        if (!inTable) {
          inTable = true;
          tableHtml = '<table class="w-full text-left border-collapse my-3 text-xs"><tbody>';
        }
        if (line.includes('---')) {
          continue; // Divider
        }
        const cells = line
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        tableHtml += '<tr class="border-b border-zinc-800">';
        cells.forEach((c) => {
          tableHtml += `<td class="p-2 text-zinc-300">${c}</td>`;
        });
        tableHtml += '</tr>';
      } else {
        if (inTable) {
          tableHtml += '</tbody></table>';
          newLines.push(tableHtml);
          inTable = false;
          tableHtml = '';
        }
        newLines.push(lines[i]);
      }
    }
    if (inTable) {
      tableHtml += '</tbody></table>';
      newLines.push(tableHtml);
    }

    raw = newLines.join('\n');

    // Lists
    raw = raw.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-zinc-300 my-0.5">$1</li>');

    // Paragraphs
    raw = raw.replace(/\n\n/g, '<div class="my-2"></div>');

    return raw;
  }, [markdown]);

  function escapeHtml(str: string) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const charCount = markdown.length;

  return (
    <div id="markdown-previewer-tool" className="flex flex-col h-full">
      <ToolHeader
        tool={tool}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onLoadSample={() => setMarkdown(SAMPLE_MARKDOWN)}
        onClear={() => setMarkdown('')}
        copyText={markdown}
        extraActions={
          <button
            type="button"
            id="download-markdown-btn"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>
        }
      />

      {/* Mode Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-4 bg-zinc-900/90 border border-zinc-800 rounded-xl">
        <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
          <button
            type="button"
            id="view-split"
            onClick={() => setViewTab('split')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              viewTab === 'split' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split View</span>
          </button>
          <button
            type="button"
            id="view-edit"
            onClick={() => setViewTab('edit')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              viewTab === 'edit' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Editor Only</span>
          </button>
          <button
            type="button"
            id="view-preview"
            onClick={() => setViewTab('preview')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              viewTab === 'preview' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Only</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
          <CopyButton text={htmlOutput} label="Copy Rendered HTML" size="sm" />
        </div>
      </div>

      {/* Editor & Preview Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {(viewTab === 'split' || viewTab === 'edit') && (
          <div className={`flex flex-col rounded-xl border border-zinc-800 bg-zinc-950/70 overflow-hidden ${viewTab === 'edit' ? 'col-span-2' : ''}`}>
            <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/80 border-b border-zinc-800 text-xs text-zinc-300 font-medium">
              <span>Markdown Source</span>
            </div>
            <textarea
              id="markdown-raw-editor"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type Markdown content here..."
              className="w-full bg-transparent p-4 font-mono text-xs md:text-sm text-zinc-200 focus:outline-none min-h-[420px] resize-y"
            />
          </div>
        )}

        {(viewTab === 'split' || viewTab === 'preview') && (
          <div className={`flex flex-col rounded-xl border border-zinc-800 bg-zinc-950/70 overflow-hidden ${viewTab === 'preview' ? 'col-span-2' : ''}`}>
            <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/80 border-b border-zinc-800 text-xs text-zinc-300 font-medium">
              <span>Live Rendered HTML</span>
            </div>
            <div
              id="markdown-rendered-view"
              className="p-5 overflow-y-auto max-h-[500px] text-zinc-200 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
