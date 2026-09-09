export type ToolCategory =
  | 'all'
  | 'formatters'
  | 'converters'
  | 'encoders'
  | 'generators'
  | 'text'
  | 'utilities';

export interface ToolDefinition {
  id: string;
  title: string;
  shortName: string;
  description: string;
  category: Exclude<ToolCategory, 'all'>;
  iconName: string;
  keywords: string[];
  badge?: string;
  popular?: boolean;
}

export const CATEGORIES: { id: ToolCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Tools', icon: 'LayoutGrid' },
  { id: 'formatters', label: 'Formatters & Viewers', icon: 'Code' },
  { id: 'converters', label: 'Converters', icon: 'ArrowLeftRight' },
  { id: 'encoders', label: 'Encoders & Cryptography', icon: 'ShieldCheck' },
  { id: 'generators', label: 'Generators', icon: 'Sparkles' },
  { id: 'text', label: 'Text & Diff', icon: 'FileText' },
  { id: 'utilities', label: 'Dev Utilities', icon: 'Wrench' },
];

export const DEV_TOOLS: ToolDefinition[] = [
  {
    id: 'json-formatter',
    title: 'JSON Formatter & Validator',
    shortName: 'JSON Formatter',
    description: 'Prettify, minify, sort keys, inspect tree and validate syntax errors in JSON.',
    category: 'formatters',
    iconName: 'Braces',
    keywords: ['json', 'formatter', 'beautifier', 'validator', 'prettify', 'minify', 'lint', 'tree'],
    popular: true,
  },
  {
    id: 'json-yaml',
    title: 'JSON ↔ YAML Converter',
    shortName: 'JSON ↔ YAML',
    description: 'Convert bidirectional data between JSON and clean YAML formats in real-time.',
    category: 'converters',
    iconName: 'FileCode2',
    keywords: ['json', 'yaml', 'yml', 'converter', 'transform', 'parser'],
    popular: true,
  },
  {
    id: 'base64',
    title: 'Base64 Encode & Decode',
    shortName: 'Base64',
    description: 'Encode/decode plain text, raw strings, and inspect binary images/files with URL-safe option.',
    category: 'encoders',
    iconName: 'Binary',
    keywords: ['base64', 'encode', 'decode', 'b64', 'binary', 'ascii', 'data url', 'image'],
    popular: true,
  },
  {
    id: 'url-encoder',
    title: 'URL Encoder & Decoder',
    shortName: 'URL Encoder',
    description: 'Encode or decode URLs and components, parse query parameters into editable tables.',
    category: 'encoders',
    iconName: 'Link',
    keywords: ['url', 'uri', 'encode', 'decode', 'query params', 'querystring', 'percent encoding'],
    popular: true,
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Decoder',
    shortName: 'JWT Decoder',
    description: 'Decode JSON Web Tokens, inspect header/payload claims, and verify expiry dates in human time.',
    category: 'encoders',
    iconName: 'KeyRound',
    keywords: ['jwt', 'token', 'auth', 'bearer', 'decode', 'payload', 'claims', 'expiration'],
    popular: true,
  },
  {
    id: 'uuid-generator',
    title: 'UUID / GUID Generator',
    shortName: 'UUID Generator',
    description: 'Generate standard v4, v1, or nil UUIDs in bulk with custom casing, hyphens, and formats.',
    category: 'generators',
    iconName: 'Fingerprint',
    keywords: ['uuid', 'guid', 'v4', 'v1', 'random id', 'generator', 'unique id'],
    popular: true,
  },
  {
    id: 'hash-generator',
    title: 'Hash Generator & HMAC',
    shortName: 'Hash Generator',
    description: 'Generate cryptographic digests with MD5, SHA-1, SHA-256, SHA-512, and HMAC support.',
    category: 'encoders',
    iconName: 'Hash',
    keywords: ['hash', 'md5', 'sha1', 'sha256', 'sha512', 'hmac', 'crypto', 'checksum', 'digest'],
    popular: true,
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester & Cheatsheet',
    shortName: 'Regex Tester',
    description: 'Test regular expressions with real-time match highlighting, capture groups, and replacement tester.',
    category: 'utilities',
    iconName: 'Regex',
    keywords: ['regex', 'regexp', 'regular expression', 'pattern', 'test', 'replace', 'matcher'],
    popular: true,
  },
  {
    id: 'cron-generator',
    title: 'Cron Expression Generator & Explainer',
    shortName: 'Cron Generator',
    description: 'Build cron schedules visually, translate syntax into plain English, and preview upcoming triggers.',
    category: 'generators',
    iconName: 'Clock',
    keywords: ['cron', 'schedule', 'tab', 'cronjob', 'expression', 'generator', 'explainer'],
    popular: true,
  },
  {
    id: 'timestamp-converter',
    title: 'Timestamp Converter',
    shortName: 'Timestamp',
    description: 'Convert Unix epoch seconds/milliseconds to UTC, ISO 8601, local dates, and relative human time.',
    category: 'converters',
    iconName: 'CalendarClock',
    keywords: ['timestamp', 'epoch', 'unix', 'time', 'date', 'iso', 'utc', 'converter'],
    popular: true,
  },
  {
    id: 'unix-timestamp-generator',
    title: 'Unix Timestamp Generator',
    shortName: 'Unix Epoch Live',
    description: 'Live ticking Unix epoch counter, quick offset presets (+1h, +24h, +7d, +1mo), and time math.',
    category: 'generators',
    iconName: 'Timer',
    keywords: ['unix timestamp', 'epoch live', 'current time', 'seconds', 'milliseconds', 'offset'],
  },
  {
    id: 'color-converter',
    title: 'Color Converter & Contrast Checker',
    shortName: 'Color Converter',
    description: 'Convert HEX, RGB, HSL, HSV, and CMYK formats. Inspect WCAG contrast and tonal shades.',
    category: 'converters',
    iconName: 'Palette',
    keywords: ['color', 'hex', 'rgb', 'hsl', 'hsv', 'cmyk', 'picker', 'contrast', 'wcag', 'palette'],
    popular: true,
  },
  {
    id: 'html-entity',
    title: 'HTML Entity Encoder / Decoder',
    shortName: 'HTML Entities',
    description: 'Escape and unescape special characters to named, numeric, and hex HTML entities.',
    category: 'encoders',
    iconName: 'CodeXml',
    keywords: ['html', 'entities', 'escape', 'unescape', 'encode', 'decode', 'special chars'],
  },
  {
    id: 'markdown-previewer',
    title: 'Markdown Previewer & Editor',
    shortName: 'Markdown Preview',
    description: 'Real-time side-by-side Markdown editor with rendered preview, word stats, and HTML export.',
    category: 'text',
    iconName: 'FileText',
    keywords: ['markdown', 'md', 'preview', 'editor', 'gfm', 'html render', 'document'],
    popular: true,
  },
  {
    id: 'diff-checker',
    title: 'Diff Checker',
    shortName: 'Diff Checker',
    description: 'Compare two text snippets side-by-side or unified with granular word-level change highlights.',
    category: 'text',
    iconName: 'GitCompare',
    keywords: ['diff', 'compare', 'difference', 'merge', 'changes', 'text compare', 'git diff'],
    popular: true,
  },
  {
    id: 'case-converter',
    title: 'Text Case Converter',
    shortName: 'Case Converter',
    description: 'Transform text into camelCase, kebab-case, snake_case, PascalCase, CONSTANT_CASE, and more.',
    category: 'text',
    iconName: 'CaseSensitive',
    keywords: ['case', 'camelcase', 'kebab', 'snake', 'pascal', 'uppercase', 'lowercase', 'titlecase'],
  },
  {
    id: 'lorem-ipsum',
    title: 'Lorem Ipsum Generator',
    shortName: 'Lorem Ipsum',
    description: 'Generate customizable dummy placeholder text by paragraphs, sentences, words, or lists.',
    category: 'generators',
    iconName: 'AlignLeft',
    keywords: ['lorem', 'ipsum', 'placeholder', 'dummy text', 'filler', 'generator'],
  },
  {
    id: 'qr-code',
    title: 'QR Code Generator',
    shortName: 'QR Code',
    description: 'Create high-resolution QR codes for plain URLs, text, Wi-Fi networks, emails, and vCards.',
    category: 'generators',
    iconName: 'QrCode',
    keywords: ['qr', 'qrcode', 'barcode', 'generator', 'wifi', 'vcard', 'url', 'svg', 'png'],
    popular: true,
  },
];
