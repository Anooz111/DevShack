export type ReferenceCategory =
  | 'all'
  | 'curl'
  | 'http'
  | 'git'
  | 'docker'
  | 'cron'
  | 'regex'
  | 'crypto'
  | 'ports'
  | 'jwt'
  | 'linux';

export interface ReferenceItem {
  id: string;
  title: string;
  category: Exclude<ReferenceCategory, 'all'>;
  categoryLabel: string;
  description: string;
  content: string;
  language?: string;
  keywords: string[];
  actionToolId?: string; // If present, clicking "Open Tool" jumps to this tool
  actionToolLabel?: string;
}

export const REFERENCE_CATEGORIES: { id: ReferenceCategory; label: string }[] = [
  { id: 'all', label: 'All References' },
  { id: 'curl', label: 'cURL & API' },
  { id: 'http', label: 'HTTP Status' },
  { id: 'git', label: 'Git Commands' },
  { id: 'docker', label: 'Docker' },
  { id: 'cron', label: 'Cron Presets' },
  { id: 'regex', label: 'Regex Patterns' },
  { id: 'crypto', label: 'Crypto & Hash' },
  { id: 'ports', label: 'Common Ports' },
  { id: 'jwt', label: 'JWT Specs' },
  { id: 'linux', label: 'Shell & Linux' },
];

export const DEV_REFERENCES: ReferenceItem[] = [
  // cURL Commands
  {
    id: 'curl-post-json',
    title: 'cURL: POST JSON with Headers',
    category: 'curl',
    categoryLabel: 'cURL',
    description: 'Send a POST request with JSON payload and authorization header.',
    content: `curl -X POST https://api.example.com/v1/resource \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  -d '{"name": "DevShack", "active": true}'`,
    language: 'bash',
    keywords: ['curl', 'post', 'json', 'api', 'bearer', 'headers', 'http', 'request'],
  },
  {
    id: 'curl-get-auth',
    title: 'cURL: GET Request with Bearer Auth',
    category: 'curl',
    categoryLabel: 'cURL',
    description: 'Fetch data from protected endpoint with query parameters and bearer token.',
    content: `curl -s -X GET "https://api.example.com/v1/items?limit=10&page=1" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`,
    language: 'bash',
    keywords: ['curl', 'get', 'bearer', 'auth', 'token', 'query', 'params'],
  },
  {
    id: 'curl-multipart-upload',
    title: 'cURL: Multipart File Upload',
    category: 'curl',
    categoryLabel: 'cURL',
    description: 'Upload a binary file and accompanying form fields using multipart/form-data.',
    content: `curl -X POST https://api.example.com/v1/upload \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  -F "file=@/path/to/document.pdf" \\
  -F "title=Sample Document"`,
    language: 'bash',
    keywords: ['curl', 'upload', 'file', 'multipart', 'form-data', 'binary', 'attachment'],
  },
  {
    id: 'curl-follow-redirects',
    title: 'cURL: Follow Redirects & Output Headers',
    category: 'curl',
    categoryLabel: 'cURL',
    description: 'Inspect HTTP response headers while following 301/302 redirects.',
    content: `curl -ILs "https://example.com"`,
    language: 'bash',
    keywords: ['curl', 'headers', 'redirect', 'status', 'head', 'inspect', '301', '302'],
  },

  // Crypto & Hashes
  {
    id: 'ref-sha256',
    title: 'SHA-256 (256-bit Secure Hash)',
    category: 'crypto',
    categoryLabel: 'Cryptography',
    description: 'Standard 256-bit cryptographic digest used in TLS, Bitcoin, and file verification.',
    content: `Algorithm: SHA-256 (FIPS 180-4)
Digest Length: 256 bits (32 bytes, 64 hex characters)
Collision Resistance: Cryptographically Secure (128-bit security level)
Common Uses: Checksums, Digital Signatures, HMAC-SHA256 (JWT)`,
    language: 'text',
    keywords: ['sha256', 'sha-256', 'hash', 'checksum', 'crypto', 'digest', 'security'],
    actionToolId: 'hash-generator',
    actionToolLabel: 'Open Hash Generator',
  },
  {
    id: 'ref-sha512',
    title: 'SHA-512 (512-bit Secure Hash)',
    category: 'crypto',
    categoryLabel: 'Cryptography',
    description: 'High-security 512-bit digest (64 bytes, 128 hex chars) optimized for 64-bit architectures.',
    content: `Algorithm: SHA-512 (FIPS 180-4)
Digest Length: 512 bits (64 bytes, 128 hex characters)
Common Uses: Password hashing (PBKDF2/crypt), high-security integrity checks`,
    language: 'text',
    keywords: ['sha512', 'sha-512', 'hash', 'crypto', 'digest', '64-bit'],
    actionToolId: 'hash-generator',
    actionToolLabel: 'Open Hash Generator',
  },
  {
    id: 'ref-md5',
    title: 'MD5 (128-bit Digest)',
    category: 'crypto',
    categoryLabel: 'Cryptography',
    description: 'Legacy 128-bit checksum algorithm (32 hex chars). Note: Broken for cryptographic security, safe for quick caching keys.',
    content: `Algorithm: MD5 (RFC 1321)
Digest Length: 128 bits (16 bytes, 32 hex characters)
Security Status: DEPRECATED for security / signatures due to collision vulnerabilities.
Safe For: Cache keys, non-cryptographic database bucket IDs.`,
    language: 'text',
    keywords: ['md5', 'hash', 'checksum', 'digest', 'legacy'],
    actionToolId: 'hash-generator',
    actionToolLabel: 'Open Hash Generator',
  },

  // JWT
  {
    id: 'ref-jwt-structure',
    title: 'JWT Structure & Standard Claims',
    category: 'jwt',
    categoryLabel: 'JWT Specs',
    description: 'JSON Web Token (RFC 7519) format: Header.Payload.Signature with standard claims.',
    content: `Format: <Base64URL(Header)>.<Base64URL(Payload)>.<Signature>

Standard Registered Claims:
• iss (Issuer): Principal that issued the JWT
• sub (Subject): Unique user or entity ID
• aud (Audience): Target recipients for the token
• exp (Expiration Time): Unix timestamp when token expires
• nbf (Not Before): Unix timestamp before which token must not be accepted
• iat (Issued At): Unix timestamp when token was created
• jti (JWT ID): Unique identifier for one-time tokens`,
    language: 'text',
    keywords: ['jwt', 'json web token', 'claims', 'iss', 'sub', 'aud', 'exp', 'iat', 'auth', 'bearer'],
    actionToolId: 'jwt-decoder',
    actionToolLabel: 'Open JWT Decoder',
  },

  // Cron Presets
  {
    id: 'cron-every-5-min',
    title: 'Cron: Every 5 Minutes (*/5 * * * *)',
    category: 'cron',
    categoryLabel: 'Cron',
    description: 'Execute a command every 5 minutes continuously.',
    content: `*/5 * * * *`,
    language: 'cron',
    keywords: ['cron', 'every 5 minutes', 'schedule', 'cronjob', 'timer'],
    actionToolId: 'cron-generator',
    actionToolLabel: 'Open Cron Generator',
  },
  {
    id: 'cron-daily-midnight',
    title: 'Cron: Daily at Midnight (0 0 * * *)',
    category: 'cron',
    categoryLabel: 'Cron',
    description: 'Trigger task once every day exactly at 00:00 UTC.',
    content: `0 0 * * *`,
    language: 'cron',
    keywords: ['cron', 'daily', 'midnight', 'nightly', 'schedule'],
    actionToolId: 'cron-generator',
    actionToolLabel: 'Open Cron Generator',
  },
  {
    id: 'cron-workdays-9am',
    title: 'Cron: Weekdays Mon–Fri at 9:00 AM (0 9 * * 1-5)',
    category: 'cron',
    categoryLabel: 'Cron',
    description: 'Run Monday through Friday at 9:00 AM.',
    content: `0 9 * * 1-5`,
    language: 'cron',
    keywords: ['cron', 'weekdays', 'business hours', 'workdays', 'morning'],
    actionToolId: 'cron-generator',
    actionToolLabel: 'Open Cron Generator',
  },

  // HTTP Status Codes
  {
    id: 'http-200-series',
    title: 'HTTP 2xx: Success Codes (200, 201, 204)',
    category: 'http',
    categoryLabel: 'HTTP',
    description: 'Successful HTTP response statuses for REST APIs.',
    content: `• 200 OK: Standard successful GET/PUT/PATCH response with body.
• 201 Created: Request succeeded and a new resource was created (POST).
• 204 No Content: Request succeeded with no entity body (often DELETE/PUT).`,
    language: 'text',
    keywords: ['http', '200', '201', '204', 'ok', 'created', 'no content', 'success', 'rest api'],
  },
  {
    id: 'http-401-403',
    title: 'HTTP 401 Unauthorized vs 403 Forbidden',
    category: 'http',
    categoryLabel: 'HTTP',
    description: 'Authentication failure (401) vs permission denial (403).',
    content: `• 401 Unauthorized: The request lacks valid authentication credentials (e.g. missing/invalid Bearer token or expired session).
• 403 Forbidden: The server understood the identity, but refuses authorization because the user lacks required roles or permissions.`,
    language: 'text',
    keywords: ['http', '401', '403', 'unauthorized', 'forbidden', 'auth', 'permissions', 'rbac'],
  },
  {
    id: 'http-429-rate-limit',
    title: 'HTTP 429 Too Many Requests',
    category: 'http',
    categoryLabel: 'HTTP',
    description: 'Rate limiting status code. Server should include Retry-After header.',
    content: `Status: 429 Too Many Requests
Header: Retry-After: 60 (seconds or HTTP-date)
Usage: Returned when client has exceeded API quotas or rate limits.`,
    language: 'text',
    keywords: ['http', '429', 'rate limit', 'too many requests', 'throttling', 'retry-after'],
  },
  {
    id: 'http-502-503-504',
    title: 'HTTP 5xx: 502 Bad Gateway vs 503 vs 504 Gateway Timeout',
    category: 'http',
    categoryLabel: 'HTTP',
    description: 'Server and proxy error codes in modern microservices/proxies.',
    content: `• 500 Internal Server Error: Unhandled crash or exception in backend application.
• 502 Bad Gateway: Reverse proxy (Nginx/Cloudflare) received an invalid/empty response from upstream app.
• 503 Service Unavailable: Server is overloaded or down for maintenance.
• 504 Gateway Timeout: Upstream application took too long to respond to reverse proxy.`,
    language: 'text',
    keywords: ['http', '500', '502', '503', '504', 'bad gateway', 'timeout', 'nginx', 'proxy'],
  },

  // Common Dev Ports
  {
    id: 'ports-dev-database',
    title: 'Common Database Ports Reference',
    category: 'ports',
    categoryLabel: 'Ports',
    description: 'Default networking ports for PostgreSQL, MySQL, Redis, MongoDB, and Elasticsearch.',
    content: `• 5432 : PostgreSQL
• 3306 : MySQL / MariaDB
• 6379 : Redis
• 27017: MongoDB
• 9200 : Elasticsearch / OpenSearch
• 1433 : Microsoft SQL Server
• 8529 : ArangoDB`,
    language: 'text',
    keywords: ['port', 'ports', '5432', '3306', '6379', '27017', 'postgres', 'mysql', 'redis', 'mongo', 'database'],
  },
  {
    id: 'ports-web-servers',
    title: 'Common Web & Framework Ports',
    category: 'ports',
    categoryLabel: 'Ports',
    description: 'Standard local dev ports for Next.js, Vite, React, Express, Spring Boot.',
    content: `• 3000 : Next.js / Node / Create-React-App / AI Studio
• 5173 : Vite / SvelteKit / Vue
• 8080 : Spring Boot / Tomcat / Generic HTTP
• 8000 : Django / FastAPI / PHP built-in
• 4200 : Angular CLI
• 80   : Standard HTTP
• 443  : Standard HTTPS (TLS/SSL)`,
    language: 'text',
    keywords: ['port', 'ports', '3000', '5173', '8080', '8000', 'nextjs', 'vite', 'react', 'web server'],
  },

  // Git Cheatsheet
  {
    id: 'git-undo-commit',
    title: 'Git: Undo Last Commit (Keep vs Discard Changes)',
    category: 'git',
    categoryLabel: 'Git',
    description: 'Safely undo the most recent commit without losing your work.',
    content: `# Keep all modified files unstaged:
git reset --soft HEAD~1

# Or keep all modified files staged in index:
git reset --mixed HEAD~1

# DISCARD all changes completely (destructive):
git reset --hard HEAD~1`,
    language: 'bash',
    keywords: ['git', 'undo', 'commit', 'reset', 'soft', 'hard', 'head'],
  },
  {
    id: 'git-stash-helpers',
    title: 'Git: Stash with Message & Include Untracked',
    category: 'git',
    categoryLabel: 'Git',
    description: 'Save dirty working directory state including new untracked files.',
    content: `# Stash with descriptive message including untracked files:
git stash push -u -m "WIP: feature authentication"

# List stashes:
git stash list

# Apply and pop latest stash:
git stash pop`,
    language: 'bash',
    keywords: ['git', 'stash', 'pop', 'untracked', 'save', 'wip'],
  },
  {
    id: 'git-force-pull-overwrite',
    title: 'Git: Force Overwrite Local with Remote Branch',
    category: 'git',
    categoryLabel: 'Git',
    description: 'Discard all local divergence and match remote branch exactly.',
    content: `git fetch origin
git reset --hard origin/main`,
    language: 'bash',
    keywords: ['git', 'force pull', 'overwrite', 'fetch', 'reset', 'origin main'],
  },

  // Docker Commands
  {
    id: 'docker-cleanup-all',
    title: 'Docker: Clean Up All Unused Containers, Images & Volumes',
    category: 'docker',
    categoryLabel: 'Docker',
    description: 'Reclaim disk space by pruning stopped containers, dangling images, and unused networks.',
    content: `# Prune stopped containers, dangling networks, and dangling images:
docker system prune -f

# Include unused volumes and all unused images:
docker system prune -a --volumes -f`,
    language: 'bash',
    keywords: ['docker', 'cleanup', 'prune', 'disk space', 'volumes', 'images', 'containers'],
  },
  {
    id: 'docker-run-interactive',
    title: 'Docker: Run Interactive Shell in Container',
    category: 'docker',
    categoryLabel: 'Docker',
    description: 'Execute a bash or sh terminal inside an existing running container or new image.',
    content: `# In running container:
docker exec -it <container_name_or_id> /bin/bash

# In ephemeral new container:
docker run --rm -it alpine:latest /bin/sh`,
    language: 'bash',
    keywords: ['docker', 'exec', 'interactive', 'bash', 'shell', 'terminal', 'sh'],
  },

  // Regex Patterns
  {
    id: 'regex-email-rfc',
    title: 'Regex: Email Validation Pattern',
    category: 'regex',
    categoryLabel: 'Regex',
    description: 'Standard email address validator pattern for web forms.',
    content: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`,
    language: 'regex',
    keywords: ['regex', 'email', 'mail', 'pattern', 'validation', 'rfc'],
    actionToolId: 'regex-tester',
    actionToolLabel: 'Open Regex Tester',
  },
  {
    id: 'regex-url-pattern',
    title: 'Regex: HTTP / HTTPS URL Matcher',
    category: 'regex',
    categoryLabel: 'Regex',
    description: 'Match web addresses including protocol, domain, port, and path.',
    content: `^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$`,
    language: 'regex',
    keywords: ['regex', 'url', 'http', 'https', 'link', 'domain', 'uri'],
    actionToolId: 'regex-tester',
    actionToolLabel: 'Open Regex Tester',
  },
  {
    id: 'regex-ipv4-pattern',
    title: 'Regex: IPv4 Address Matcher',
    category: 'regex',
    categoryLabel: 'Regex',
    description: 'Validate standard IPv4 address octets between 0 and 255.',
    content: `^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$`,
    language: 'regex',
    keywords: ['regex', 'ip', 'ipv4', 'address', 'network', 'octet'],
    actionToolId: 'regex-tester',
    actionToolLabel: 'Open Regex Tester',
  },
  {
    id: 'regex-uuid-pattern',
    title: 'Regex: UUID v4 Matcher',
    category: 'regex',
    categoryLabel: 'Regex',
    description: 'Match standard RFC 4122 canonical UUID 8-4-4-4-12 pattern.',
    content: `^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$`,
    language: 'regex',
    keywords: ['regex', 'uuid', 'guid', 'v4', 'rfc4122'],
    actionToolId: 'regex-tester',
    actionToolLabel: 'Open Regex Tester',
  },

  // Linux & Shell
  {
    id: 'linux-find-port-process',
    title: 'Linux / macOS: Find Process Listening on Port & Kill',
    category: 'linux',
    categoryLabel: 'Linux',
    description: 'Identify what process is holding port 3000/8080 and free it.',
    content: `# Find process PID:
lsof -i :3000

# Or with netstat/ss:
ss -lptn 'sport = :3000'

# Kill process by PID:
kill -9 <PID>`,
    language: 'bash',
    keywords: ['linux', 'port', 'lsof', 'kill', 'process', 'pid', '3000', 'listening'],
  },
  {
    id: 'linux-grep-recursive',
    title: 'Linux: Recursive Grep Excluding Node Modules',
    category: 'linux',
    categoryLabel: 'Linux',
    description: 'Fast recursive search in text files skipping heavy directories.',
    content: `grep -rnI --exclude-dir={node_modules,.git,dist,.next} "SEARCH_STRING" .`,
    language: 'bash',
    keywords: ['linux', 'grep', 'search', 'find', 'recursive', 'exclude', 'node_modules'],
  },
];
