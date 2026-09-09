'use client';

import React from 'react';
import { ToolDefinition } from '@/types/tools';
import { JsonFormatter } from './tools/JsonFormatter';
import { JsonYamlConverter } from './tools/JsonYamlConverter';
import { Base64Tool } from './tools/Base64Tool';
import { UrlEncoder } from './tools/UrlEncoder';
import { JwtDecoder } from './tools/JwtDecoder';
import { UuidGenerator } from './tools/UuidGenerator';
import { HashGenerator } from './tools/HashGenerator';
import { RegexTester } from './tools/RegexTester';
import { CronGenerator } from './tools/CronGenerator';
import { TimestampConverter } from './tools/TimestampConverter';
import { UnixTimestampGenerator } from './tools/UnixTimestampGenerator';
import { ColorConverter } from './tools/ColorConverter';
import { HtmlEntityTool } from './tools/HtmlEntityTool';
import { MarkdownPreviewer } from './tools/MarkdownPreviewer';
import { DiffChecker } from './tools/DiffChecker';
import { CaseConverter } from './tools/CaseConverter';
import { LoremIpsumGenerator } from './tools/LoremIpsumGenerator';
import { QrCodeGenerator } from './tools/QrCodeGenerator';

interface ToolRendererProps {
  tool: ToolDefinition;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ToolRenderer({ tool, isFavorite, onToggleFavorite }: ToolRendererProps) {
  switch (tool.id) {
    case 'json-formatter':
      return <JsonFormatter tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'json-yaml':
      return <JsonYamlConverter tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'base64':
      return <Base64Tool tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'url-encoder':
      return <UrlEncoder tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'jwt-decoder':
      return <JwtDecoder tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'uuid-generator':
      return <UuidGenerator tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'hash-generator':
      return <HashGenerator tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'regex-tester':
      return <RegexTester tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'cron-generator':
      return <CronGenerator tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'timestamp-converter':
      return <TimestampConverter tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'unix-timestamp-generator':
      return <UnixTimestampGenerator tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'color-converter':
      return <ColorConverter tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'html-entity':
      return <HtmlEntityTool tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'markdown-previewer':
      return <MarkdownPreviewer tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'diff-checker':
      return <DiffChecker tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'case-converter':
      return <CaseConverter tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'lorem-ipsum':
      return <LoremIpsumGenerator tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    case 'qr-code':
      return <QrCodeGenerator tool={tool} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />;
    default:
      return (
        <div className="p-8 text-center text-zinc-500">
          Tool &quot;{tool.title}&quot; is not yet available.
        </div>
      );
  }
}
