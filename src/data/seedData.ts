import { Category, Resource } from '../types/resource';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'baas',
    name: 'Backend as a Service (BaaS)',
    slug: 'baas',
    description: 'Managed databases, authentication, file storage, and serverless compute.',
    iconName: 'Database',
    color: 'emerald',
    decisionThemes: [
      { label: 'All BaaS', description: 'Browse all backend platforms', filterValue: '' },
      { label: 'Best for rapid MVPs', description: 'Zero friction, instant API & auth setup', filterValue: 'mvp' },
      { label: 'Best database experience', description: 'Full SQL/PostgreSQL power with dashboard', filterValue: 'postgres' },
      { label: 'Best authentication', description: 'Deep OAuth, social logins & user management', filterValue: 'auth' },
      { label: 'Best open-source option', description: 'Fully self-hostable without vendor lock-in', filterValue: 'open-source' },
      { label: 'Best for serverless applications', description: 'Reactive state sync & function runners', filterValue: 'serverless' },
      { label: 'Best lightweight/free option', description: 'Single-binary SQLite or zero-cost tier', filterValue: 'lightweight' }
    ]
  },
  {
    id: 'ai-agents',
    name: 'AI Agents & Platforms',
    slug: 'ai-agents',
    description: 'Autonomous coding agents, agent frameworks, CLI tools, and browser automation.',
    iconName: 'Bot',
    color: 'indigo',
    decisionThemes: [
      { label: 'All Agents', description: 'Browse all agent platforms', filterValue: '' },
      { label: 'Best for coding & CLI', description: 'Terminal-based coding and direct repository edits', filterValue: 'coding' },
      { label: 'Best for IDE integration', description: 'In-editor agentic completions & refactoring', filterValue: 'ide' },
      { label: 'Best for multi-agent workflows', description: 'Role-playing agent teams & complex task DAGs', filterValue: 'multi-agent' },
      { label: 'Best for web & browser automation', description: 'DOM interaction, scraping, and form filling', filterValue: 'browser' },
      { label: 'Best for enterprise orchestration', description: 'Production-grade human-in-the-loop cycles', filterValue: 'orchestration' }
    ]
  },
  {
    id: 'ai-app-gen',
    name: 'AI Website / App Generation',
    slug: 'ai-app-gen',
    description: 'AI engines generating working prototypes, React components, and full-stack apps.',
    iconName: 'Sparkles',
    color: 'purple',
    decisionThemes: [
      { label: 'All App Generators', description: 'Browse all generation tools', filterValue: '' },
      { label: 'Best for Next.js & Tailwind UI', description: 'Production-ready React UI snippets', filterValue: 'react-ui' },
      { label: 'Best for full-stack applications', description: 'Complete backend, database, and UI from prompt', filterValue: 'full-stack' },
      { label: 'Best for in-browser sandbox', description: 'Instant live preview with zero setup', filterValue: 'sandbox' },
      { label: 'Best for rapid landing pages', description: 'High-converting design with copy and sections', filterValue: 'landing' }
    ]
  },
  {
    id: 'ai-design-ui',
    name: 'AI Design & UI Tools',
    slug: 'ai-design-ui',
    description: 'Tools for UI generation, wireframing, design inspiration, and asset generation.',
    iconName: 'Palette',
    color: 'amber',
    decisionThemes: [
      { label: 'All Design Tools', description: 'Browse all design & UI tools', filterValue: '' },
      { label: 'Best for text-to-Figma screens', description: 'High-fidelity mobile and desktop screens', filterValue: 'figma' },
      { label: 'Best for wireframing & sitemaps', description: 'Structural site planning and content flow', filterValue: 'wireframe' },
      { label: 'Best for vector & icon assets', description: 'Scalable SVGs, brand illustrations, and icons', filterValue: 'vector' },
      { label: 'Best for design inspiration', description: 'Real-world app flows and benchmark UI patterns', filterValue: 'inspiration' }
    ]
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  // --- Backend as a Service (BaaS) ---
  {
    id: 'res-supabase',
    name: 'Supabase',
    shortDescription: 'The open-source Firebase alternative with PostgreSQL, real-time subscriptions, Auth, and Storage.',
    categoryId: 'baas',
    tags: ['PostgreSQL', 'Auth', 'Realtime', 'Open Source', 'Storage', 'Edge Functions'],
    mainUseCase: 'Full-stack application backend with relational database power and instant REST/GraphQL APIs.',
    pricing: 'Freemium',
    pricingDetails: 'Generous free tier (2 projects, 500MB DB). Pro starts at $25/month.',
    keyStrengths: [
      'Standard PostgreSQL underneath with extensions (pgvector, PostGIS)',
      'Built-in Row Level Security (RLS) for rock-solid authorization',
      'Instant Auto-generated TypeScript types directly from your DB schema',
      'Strong open-source ecosystem with self-hosting options via Docker'
    ],
    keyLimitations: [
      'Row Level Security policies can become complex and affect performance if unindexed',
      'Cold starts on serverless edge functions during low traffic periods',
      'Free tier projects pause after 1 week of inactivity'
    ],
    websiteUrl: 'https://supabase.com',
    personalNotes: 'My go-to default for any project requiring relational queries, AI vector embeddings, or standard SQL migrations. Pair with Prisma or Drizzle for a fantastic developer experience.',
    bestFor: 'Best database experience & rapid SQL MVPs',
    isFavorite: true,
    rating: 5,
    iconSymbol: '⚡',
    addedAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'res-firebase',
    name: 'Firebase',
    shortDescription: 'Google cloud-backed app development platform with Firestore NoSQL, Authentication, and Hosting.',
    categoryId: 'baas',
    tags: ['NoSQL', 'Auth', 'Google Cloud', 'Firestore', 'Realtime', 'Hosting'],
    mainUseCase: 'Mobile and web applications needing quick prototyping, Google ecosystem integrations, and high-scale push notifications.',
    pricing: 'Freemium',
    pricingDetails: 'Spark free tier (1GB storage, 50k reads/day). Blaze pay-as-you-go thereafter.',
    keyStrengths: [
      'Ultra-reliable client-side authentication with seamless social and OAuth providers',
      'Real-time Firestore snapshot listeners with zero backend boilerplate',
      'Native mobile SDKs for iOS, Android, Flutter, and Web',
      'Turnkey hosting with custom domains and SSL in one CLI command'
    ],
    keyLimitations: [
      'NoSQL query flexibility is limited; complex multi-field filtering and full-text search require external services (e.g. Algolia)',
      'Vendor lock-in to Google Cloud infrastructure',
      'Cost can surge rapidly if read/write loops or heavy real-time listeners are unmonitored'
    ],
    websiteUrl: 'https://firebase.google.com',
    personalNotes: 'Unbeatable when mobile client auth and instant live updates are the top priority. For heavy relational queries, prefer Supabase instead.',
    bestFor: 'Best authentication & mobile real-time apps',
    isFavorite: false,
    rating: 4,
    iconSymbol: '🔥',
    addedAt: '2026-08-18T14:30:00Z'
  },
  {
    id: 'res-convex',
    name: 'Convex',
    shortDescription: 'The reactive backend-as-a-service designed for TypeScript and React with automatic real-time sync.',
    categoryId: 'baas',
    tags: ['TypeScript', 'Reactive', 'Realtime', 'Serverless', 'ACID Transactions'],
    mainUseCase: 'Modern React and Next.js applications wanting end-to-end type safety, scheduled jobs, and automatic UI re-renders without cache invalidation.',
    pricing: 'Freemium',
    pricingDetails: 'Generous free tier for side projects. Pro tier starts at $25/month per team seat.',
    keyStrengths: [
      '100% end-to-end TypeScript safety without manual code generation',
      'Zero cache-invalidation bugs: any DB change automatically re-renders affected UI components',
      'Full transactional ACID guarantees in serverless JavaScript functions',
      'Built-in vector search, cron jobs, and file storage'
    ],
    keyLimitations: [
      'Proprietary hosted engine—not as easily self-hosted as Supabase or PocketBase',
      'Requires learning Convex-specific query and mutation conventions',
      'Smaller third-party plugin ecosystem compared to Firebase'
    ],
    websiteUrl: 'https://convex.dev',
    personalNotes: 'Phenomenal developer experience for React/Next.js devs. Eliminates TanStack Query, optimistic UI headaches, and WebSockets setup entirely.',
    bestFor: 'Best for serverless applications & React DX',
    isFavorite: true,
    rating: 5,
    iconSymbol: '▲',
    addedAt: '2026-08-20T09:15:00Z'
  },
  {
    id: 'res-pocketbase',
    name: 'PocketBase',
    shortDescription: 'Open-source backend in 1 single file with embedded SQLite, realtime subscriptions, Auth, and admin UI.',
    categoryId: 'baas',
    tags: ['SQLite', 'Single Binary', 'Open Source', 'Self-Hosted', 'Go', 'Admin UI'],
    mainUseCase: 'Lightweight prototypes, internal tools, desktop companions, and single-server apps without cloud subscriptions.',
    pricing: 'Free',
    pricingDetails: '100% Free and Open Source (MIT). Host on any $3-$5 VPS or Raspberry Pi.',
    keyStrengths: [
      'Single executable file with zero dependencies; runs anywhere Go compiles',
      'Embedded SQLite database with WAL mode provides surprisingly fast queries',
      'Clean built-in admin dashboard for schema editing and data viewing out of the box',
      'Extensible via Go plugins or JavaScript hooks'
    ],
    keyLimitations: [
      'Vertical scaling only; SQLite is not designed for distributed multi-region clustering',
      'You are responsible for backups, server security, and uptime management',
      'Smaller ecosystem of pre-built SDKs compared to Firebase or Supabase'
    ],
    websiteUrl: 'https://pocketbase.io',
    personalNotes: 'Unmatched for solo devs who want zero recurring cloud bills. Drop a single binary on a Hetzner server and you have a complete backend in 3 minutes.',
    bestFor: 'Best lightweight/free option & self-hosted MVPs',
    isFavorite: true,
    rating: 5,
    iconSymbol: '📦',
    addedAt: '2026-08-22T11:00:00Z'
  },
  {
    id: 'res-appwrite',
    name: 'Appwrite',
    shortDescription: 'Self-hostable, secure end-to-end backend server for Web, Mobile, Native, and Server developers.',
    categoryId: 'baas',
    tags: ['Open Source', 'Self-Hosted', 'Docker', 'Multi-Platform', 'Functions'],
    mainUseCase: 'Companies and privacy-conscious teams needing a self-hosted Firebase equivalent compliant with GDPR/HIPAA.',
    pricing: 'Freemium',
    pricingDetails: 'Self-hosted is 100% free open source. Cloud tier offers free plan and $15/seat Pro.',
    keyStrengths: [
      'Clean REST and GraphQL APIs with support for Flutter, Android, iOS, React, Vue, Svelte',
      'Fine-grained user permission controls and multi-factor authentication (MFA)',
      'Comprehensive Cloud and Self-Hosted options with consistent APIs',
      'Built-in serverless functions supporting multiple runtimes (Node, Python, PHP, Ruby, Dart)'
    ],
    keyLimitations: [
      'Self-hosting requires orchestrating multiple Docker containers (Redis, MariaDB, Traefik)',
      'Query capabilities not as mature as raw PostgreSQL schema views',
      'Webhooks and function cold starts can occasionally lag'
    ],
    websiteUrl: 'https://appwrite.io',
    personalNotes: 'Strongest competitor to Firebase if you need full Docker self-hosting without being locked into Google Cloud.',
    bestFor: 'Best open-source option for cross-platform teams',
    isFavorite: false,
    rating: 4,
    iconSymbol: '🅰️',
    addedAt: '2026-08-25T16:20:00Z'
  },
  {
    id: 'res-neon',
    name: 'Neon',
    shortDescription: 'Serverless, fault-tolerant PostgreSQL with autoscaling, branching like Git, and scale-to-zero pricing.',
    categoryId: 'baas',
    tags: ['PostgreSQL', 'Serverless', 'DB Branching', 'Scale-to-Zero', 'Edge'],
    mainUseCase: 'Developer database workflows needing isolated database branches per pull request and serverless connection pooling.',
    pricing: 'Freemium',
    pricingDetails: 'Free tier includes 0.5GB storage and compute. Launch plan starting at $19/mo.',
    keyStrengths: [
      'Instant database branching for preview environments and CI/CD pipelines',
      'True separation of storage and compute: compute scales to zero when idle to save money',
      'Compatible with every standard PostgreSQL tool and ORM (Drizzle, Prisma, etc.)',
      'Ultra-fast serverless driver over WebSockets for Cloudflare Workers & Vercel'
    ],
    keyLimitations: [
      'Focuses purely on the database engine—does not provide built-in Auth or file storage UI like Supabase',
      'Cold start latency (1-2 seconds) when resuming an instance from scale-to-zero'
    ],
    websiteUrl: 'https://neon.tech',
    personalNotes: 'Combine Neon for database branching with Clerk or Auth.js for the cleanest modern Next.js serverless stack.',
    bestFor: 'Best database branching for CI/CD & preview envs',
    isFavorite: false,
    rating: 4,
    iconSymbol: '🟢',
    addedAt: '2026-08-28T08:00:00Z'
  },

  // --- AI Agents & Agent Platforms ---
  {
    id: 'res-claude-code',
    name: 'Claude Code',
    shortDescription: 'Anthropic\'s agentic command-line interface that understands your codebase and executes tasks directly in the terminal.',
    categoryId: 'ai-agents',
    tags: ['CLI', 'Terminal', 'Coding Agent', 'Anthropic', 'Autonomous', 'Git'],
    mainUseCase: 'Rapid terminal-driven development, deep multi-file codebase refactoring, running tests, fixing errors, and creating pull requests.',
    pricing: 'Paid',
    pricingDetails: 'Billed directly against Anthropic API token consumption (Claude 3.7 Sonnet).',
    keyStrengths: [
      'Lives in your local terminal—can run bash commands, run test suites, and read git diffs',
      'Incredible architectural comprehension of large repositories and code conventions',
      'Can plan complex multi-step refactors and execute them autonomously with verification',
      'Does not require switching to a separate proprietary IDE'
    ],
    keyLimitations: [
      'Can consume API tokens quickly on large repositories with lengthy context windows',
      'Terminal interface requires comfortable command-line fluency',
      'Requires cautious monitoring of destructive bash commands'
    ],
    websiteUrl: 'https://docs.anthropic.com/claude/docs/claude-code',
    personalNotes: 'Transformative for senior engineers who live in vim/tmux or standard terminals. Having the agent directly run `npm test` and iterate until tests pass is a game-changer.',
    bestFor: 'Best for coding & CLI terminal automation',
    isFavorite: true,
    rating: 5,
    iconSymbol: '⌨️',
    addedAt: '2026-08-30T12:00:00Z'
  },
  {
    id: 'res-cursor',
    name: 'Cursor',
    shortDescription: 'The AI-first code editor fork of VS Code with Composer multi-file editing and deep codebase indexing.',
    categoryId: 'ai-agents',
    tags: ['IDE', 'VS Code', 'Composer', 'Multi-File', 'Code Generation'],
    mainUseCase: 'Daily driver IDE for developers looking for context-aware multi-file generation, cursor chat, and inline diffing.',
    pricing: 'Freemium',
    pricingDetails: 'Hobby free plan (limited fast requests). Pro plan is $20/month with unlimited slow and 500 fast requests.',
    keyStrengths: [
      'Drop-in replacement for VS Code with full extension and settings compatibility',
      'Composer agent mode edits multiple files across your project in parallel with clean diff review',
      'Semantic codebase indexing (@codebase) understands your architecture without manual copying',
      'Instant tab completions that predict where you want to edit next'
    ],
    keyLimitations: [
      'Closed-source IDE fork; updates lag slightly behind upstream VS Code releases',
      'High-tier usage can occasionally experience queue slowdowns during peak hours',
      'Can make developers lazy with code review if diffs are blindly accepted'
    ],
    websiteUrl: 'https://cursor.com',
    personalNotes: 'Current standard for AI-assisted programming. The Composer feature alone cuts feature scaffolding time by 60-70%.',
    bestFor: 'Best for IDE integration & daily coding flow',
    isFavorite: true,
    rating: 5,
    iconSymbol: '🖱️',
    addedAt: '2026-08-16T15:00:00Z'
  },
  {
    id: 'res-langgraph',
    name: 'LangGraph',
    shortDescription: 'Library for building stateful, multi-actor applications with LLMs using cyclical graphs and human-in-the-loop controls.',
    categoryId: 'ai-agents',
    tags: ['Framework', 'Python', 'TypeScript', 'Multi-Agent', 'State Management', 'Cyclical'],
    mainUseCase: 'Engineering robust, production-grade agent systems that require loops, branching logic, persistent memory, and human approval steps.',
    pricing: 'Freemium',
    pricingDetails: 'Open source library is free. LangGraph Cloud offers hosted execution with a free tier.',
    keyStrengths: [
      'Explicit cyclical graph architecture (nodes and edges) avoids uncontrollable infinite agent loops',
      'Built-in time-travel debugging and state checkpointing to replay and inspect agent decisions',
      'First-class support for human-in-the-loop intervention and tool call approvals',
      'Available in both Python and TypeScript'
    ],
    keyLimitations: [
      'Steeper learning curve compared to simple single-prompt agent wrappers',
      'Requires designing state schemas and transition logic upfront',
      'LangChain ecosystem documentation can occasionally be confusing across versions'
    ],
    websiteUrl: 'https://langchain-ai.github.io/langgraph/',
    personalNotes: 'If you are building an actual agent product for end customers (not just a quick script), LangGraph gives you the control and observability you actually need in production.',
    bestFor: 'Best for enterprise orchestration & stateful agent graphs',
    isFavorite: false,
    rating: 4,
    iconSymbol: '🕸️',
    addedAt: '2026-08-24T18:10:00Z'
  },
  {
    id: 'res-crewai',
    name: 'CrewAI',
    shortDescription: 'Framework for orchestrating role-playing autonomous AI agents that collaborate to tackle complex goals.',
    categoryId: 'ai-agents',
    tags: ['Framework', 'Multi-Agent', 'Role-Playing', 'Python', 'Automation'],
    mainUseCase: 'Content generation pipelines, competitive research, market analysis, and task delegation among specialized agent personas.',
    pricing: 'Freemium',
    pricingDetails: 'Open-source core is free (MIT). CrewAI Enterprise offers cloud hosting and monitoring.',
    keyStrengths: [
      'Intuitive mental model: define Agents (Role, Goal, Backstory) and Tasks, then assemble them into a Crew',
      'Out of the box support for sequential and hierarchical delegation processes',
      'Large ecosystem of pre-built tools for web search, document parsing, and file output',
      'Fast onboarding for Python developers'
    ],
    keyLimitations: [
      'Less fine-grained low-level state control than LangGraph for strict deterministic pipelines',
      'Inter-agent chatter can consume substantial token budgets without proper output guardrails',
      'Primarily Python-focused; TypeScript support is limited'
    ],
    websiteUrl: 'https://crewai.com',
    personalNotes: 'Best when you want a team of specialists (e.g. Researcher + Writer + Fact Checker + Editor) to collaborate on a deliverable.',
    bestFor: 'Best for multi-agent workflows & team simulations',
    isFavorite: false,
    rating: 4,
    iconSymbol: '👥',
    addedAt: '2026-08-27T10:45:00Z'
  },
  {
    id: 'res-browserbase',
    name: 'Browserbase & Stagehand',
    shortDescription: 'Developer platform for running headless browsers at scale with Stagehand AI web automation SDK.',
    categoryId: 'ai-agents',
    tags: ['Browser Agent', 'Web Automation', 'Scraping', 'Headless Chrome', 'Stagehand'],
    mainUseCase: 'Automating browser workflows that require handling CAPTCHAs, bot detection, logins, and dynamic web navigation.',
    pricing: 'Freemium',
    pricingDetails: 'Free tier with monthly browser credits. Developer plan starts at $20/month.',
    keyStrengths: [
      'Stagehand SDK provides natural language browser commands: `page.act()`, `page.extract()`, `page.observe()`',
      'Built-in stealth mode, fingerprint spoofing, and residential proxy networks',
      'Live interactive session inspector to watch agent sessions in real time with video replays',
      'Eliminates flaky CSS selector breakages by using vision and DOM tree grounding'
    ],
    keyLimitations: [
      'Requires cloud browser instances; higher latency than local headless Playwright',
      'Cost scales with active browser compute minutes and proxy bandwidth',
      'Complex SPA workflows with heavy Canvas or WebGL can challenge vision extractors'
    ],
    websiteUrl: 'https://browserbase.com',
    personalNotes: 'Solves the hardest part of browser agents: keeping sessions alive without getting blocked by Cloudflare or Akamai.',
    bestFor: 'Best for web & browser automation without bot blocks',
    isFavorite: true,
    rating: 5,
    iconSymbol: '🌐',
    addedAt: '2026-09-01T14:00:00Z'
  },

  // --- AI Website / App Generation ---
  {
    id: 'res-v0',
    name: 'v0 by Vercel',
    shortDescription: 'Generative UI system by Vercel that crafts accessible React components using shadcn/ui and Tailwind CSS.',
    categoryId: 'ai-app-gen',
    tags: ['React', 'Next.js', 'shadcn/ui', 'Tailwind CSS', 'Generative UI', 'Vercel'],
    mainUseCase: 'Rapidly creating beautiful, production-ready React frontend components, dashboard layouts, and interactive UI widgets.',
    pricing: 'Freemium',
    pricingDetails: 'Free plan with monthly generation credits. Premium plans start at $20/month for unlimited generations.',
    keyStrengths: [
      'Generates exceptionally clean, idiomatic React code following shadcn/ui and Tailwind best practices',
      'One-click CLI install (`npx shadcn add "https://v0.dev/..."`) directly into your Next.js project',
      'Interactive canvas allows pinpointing specific UI elements to edit with targeted prompts',
      'Supports rendering live Lucide icons, responsive tables, and motion animations'
    ],
    keyLimitations: [
      'Focuses on frontend presentation and mockup state—does not generate full backends or persistent databases',
      'Can struggle with deeply complex state management graphs across distant sibling components',
      'Code output requires an existing React/Tailwind project setup to run locally'
    ],
    websiteUrl: 'https://v0.dev',
    personalNotes: 'The premier tool for generating frontend component code that you will actually want in your production repository. Clean, modern, accessible.',
    bestFor: 'Best for Next.js & Tailwind UI component generation',
    isFavorite: true,
    rating: 5,
    iconSymbol: '⚡',
    addedAt: '2026-08-14T11:20:00Z'
  },
  {
    id: 'res-lovable',
    name: 'Lovable',
    shortDescription: 'AI full-stack software engineer that turns ideas and designs into production-ready web apps with Supabase and GitHub sync.',
    categoryId: 'ai-app-gen',
    tags: ['Full Stack', 'Supabase', 'GitHub Sync', 'No-Code/Code', 'Instant Deploy'],
    mainUseCase: 'Building functional web apps, SaaS prototypes, and internal tools from prompt with automatic database schemas and live preview.',
    pricing: 'Freemium',
    pricingDetails: 'Free tier with daily edits. Pro plans start at $20/month.',
    keyStrengths: [
      'Direct integration with Supabase for instant database tables, auth, and storage creation',
      'Two-way sync with GitHub repository; you own and can export 100% of the code',
      'Visual element selector lets you click any button or card to request modifications',
      'High visual taste level and modern component libraries used by default'
    ],
    keyLimitations: [
      'Complex enterprise business logic eventually outgrows prompt-based iterations',
      'Custom external API integrations sometimes require manual code intervention via GitHub',
      'Monthly message quotas can run out quickly during intensive debugging'
    ],
    websiteUrl: 'https://lovable.dev',
    personalNotes: 'Fastest way to build a real prototype with an actual working database. The GitHub sync gives you full escape hatch flexibility.',
    bestFor: 'Best for full-stack applications with database & GitHub sync',
    isFavorite: true,
    rating: 5,
    iconSymbol: '❤️',
    addedAt: '2026-08-19T13:40:00Z'
  },
  {
    id: 'res-bolt-new',
    name: 'Bolt.new',
    shortDescription: 'In-browser AI development environment powered by WebContainers to build, run, and deploy full-stack apps.',
    categoryId: 'ai-app-gen',
    tags: ['WebContainers', 'StackBlitz', 'In-Browser', 'Full Stack', 'Zero Setup'],
    mainUseCase: 'Testing ideas, building prototypes, installing npm packages, and running a complete Node.js dev server directly inside the browser.',
    pricing: 'Freemium',
    pricingDetails: 'Free tier with token limits. Pro subscription starts at $20/month.',
    keyStrengths: [
      'Executes actual Node.js servers, npm packages, and Vite builds inside browser WebContainers',
      'Instantly creates terminal, file tree, code editor, and live preview in one tab',
      'One-click deploy to Netlify or push to GitHub',
      'Capable of fixing build errors and missing imports autonomously'
    ],
    keyLimitations: [
      'Heavy memory usage inside the browser tab; large projects can cause browser crashes',
      'Cannot run native C++ or binary-dependent npm packages due to WebAssembly limitations',
      'Token consumption can be rapid during full codebase rewrites'
    ],
    websiteUrl: 'https://bolt.new',
    personalNotes: 'Incredible for zero-friction experiments. You can test an idea on your iPad or Chromebook with no local terminal setup.',
    bestFor: 'Best for in-browser sandbox & zero-config prototypes',
    isFavorite: false,
    rating: 4,
    iconSymbol: '⚡',
    addedAt: '2026-08-21T17:00:00Z'
  },
  {
    id: 'res-replit-agent',
    name: 'Replit Agent',
    shortDescription: 'Autonomous AI software engineer that plans, creates, and deploys full-stack applications on cloud infrastructure.',
    categoryId: 'ai-app-gen',
    tags: ['Cloud IDE', 'Hosting', 'Python', 'Node.js', 'Autonomous', 'PostgreSQL'],
    mainUseCase: 'Non-technical founders or solo devs wanting an AI partner that handles environment provisioning, database setup, and hosting.',
    pricing: 'Paid',
    pricingDetails: 'Included with Replit Core membership ($25/month) plus compute usage.',
    keyStrengths: [
      'Configures cloud hosting, database connections, and environment variables automatically',
      'Explains high-level architectural architecture steps before writing code',
      'Works seamlessly on mobile via the Replit mobile app',
      'Includes persistent cloud hosting with custom domains ready to share'
    ],
    keyLimitations: [
      'Requires Replit paid subscription',
      'Codebase is hosted primarily inside Replit ecosystem; exporting to other cloud providers takes effort',
      'Can be slow to execute long multi-step build sequences'
    ],
    websiteUrl: 'https://replit.com/ai',
    personalNotes: 'Great for getting non-developers from concept to deployed URL without explaining terminal commands or cloud IAM roles.',
    bestFor: 'Best for end-to-end cloud deployment for non-devs',
    isFavorite: false,
    rating: 4,
    iconSymbol: '🔄',
    addedAt: '2026-08-26T12:15:00Z'
  },

  // --- AI Design & UI Tools ---
  {
    id: 'res-galileo',
    name: 'Galileo AI',
    shortDescription: 'Generative AI platform creating editable UI designs for mobile and desktop directly into Figma.',
    categoryId: 'ai-design-ui',
    tags: ['Figma', 'UI Design', 'Text-to-UI', 'Mobile Design', 'Generative UI'],
    mainUseCase: 'Transforming natural language descriptions or user stories into multi-screen Figma UI designs with clean auto-layout.',
    pricing: 'Freemium',
    pricingDetails: 'Free plan with 3 generations. Standard plans start at $19/month.',
    keyStrengths: [
      'Exports directly to editable Figma layers with proper Auto-Layout and vector shapes',
      'High-quality curation of mobile app UI patterns and aesthetic color palettes',
      'Can generate both mobile and web application views from single prompts',
      'Allows uploading design system reference images to guide styling'
    ],
    keyLimitations: [
      'Outputs visual design layouts—does not produce production React or HTML code',
      'Occasional text layer alignment glitches in complex responsive components',
      'Requires manual tweaking in Figma before passing to developers'
    ],
    websiteUrl: 'https://usegalileo.ai',
    personalNotes: 'Massive time saver for kickstarting new client proposals or visual direction in Figma before writing any code.',
    bestFor: 'Best for text-to-Figma screens & mobile UI concepts',
    isFavorite: true,
    rating: 4,
    iconSymbol: '🎨',
    addedAt: '2026-08-17T09:30:00Z'
  },
  {
    id: 'res-relume',
    name: 'Relume',
    shortDescription: 'AI website builder and wireframing library for Figma and Webflow with hundreds of pre-built layout blocks.',
    categoryId: 'ai-design-ui',
    tags: ['Wireframing', 'Sitemaps', 'Figma', 'Webflow', 'Component Library'],
    mainUseCase: 'Planning website architectures, generating comprehensive sitemaps, and generating wireframes in minutes.',
    pricing: 'Freemium',
    pricingDetails: 'Free plan with 1 project and basic sitemap generation. Pro is $32/month.',
    keyStrengths: [
      'Generates full sitemaps with page-by-page content sections based on company descriptions',
      'Direct one-click export to Figma and Webflow using the Client-First style system',
      'Huge library of over 1,000+ accessible, clean black-and-white wireframe components',
      'Guarantees rock-solid content hierarchy before jumping into colors and graphics'
    ],
    keyLimitations: [
      'Tailored specifically for marketing websites and landing pages rather than complex web app dashboards',
      'Best experienced when coupled with Webflow or Figma pipelines',
      'Pro tier is priced primarily for agencies and freelancers'
    ],
    websiteUrl: 'https://relume.io',
    personalNotes: 'The absolute gold standard for marketing website planning. Prevents the classic trap of designing pretty visuals with zero structured copywriting.',
    bestFor: 'Best for wireframing & sitemaps for marketing sites',
    isFavorite: true,
    rating: 5,
    iconSymbol: '📐',
    addedAt: '2026-08-23T15:10:00Z'
  },
  {
    id: 'res-uizard',
    name: 'Uizard',
    shortDescription: 'AI-powered collaborative design tool for wireframes, mockups, and turning hand-drawn sketches into prototypes.',
    categoryId: 'ai-design-ui',
    tags: ['Prototyping', 'Sketch-to-UI', 'Wireframes', 'Collaboration', 'Beginner Friendly'],
    mainUseCase: 'Quickly wireframing product flows, converting whiteboard sketches into digital screens, and team brainstorming.',
    pricing: 'Freemium',
    pricingDetails: 'Free plan (up to 2 projects). Pro plan is $12/month billed annually.',
    keyStrengths: [
      'Autodesigner transforms plain English prompts into clickable multi-screen prototypes',
      'Photo-to-screen feature converts napkin sketches and whiteboard drawings into digital UI',
      'Intuitive drag-and-drop interface much easier for product managers than Figma',
      'Interactive preview mode with hotspot screen transitions'
    ],
    keyLimitations: [
      'Less precision and vector tooling compared to native Figma for professional design teams',
      'Component token reusability across enterprise design systems is limited',
      'Code export is rudimentary compared to developer-centric tools'
    ],
    websiteUrl: 'https://uizard.io',
    personalNotes: 'Great for rapid ideation sessions with product managers and founders who don\'t know how to navigate Figma auto-layouts.',
    bestFor: 'Best for sketch-to-UI & beginner product prototyping',
    isFavorite: false,
    rating: 4,
    iconSymbol: '📱',
    addedAt: '2026-08-29T10:00:00Z'
  },
  {
    id: 'res-recraft',
    name: 'Recraft',
    shortDescription: 'AI image generator and vector design engine built specifically for UI designers, brand artists, and icon illustrators.',
    categoryId: 'ai-design-ui',
    tags: ['Vector', 'SVG', 'Icons', 'Illustrations', 'Design System', 'Brand Style'],
    mainUseCase: 'Generating consistent brand illustrations, clean SVG icons, 3D clay graphics, and UI empty-state artwork.',
    pricing: 'Freemium',
    pricingDetails: 'Free daily generation credits. Pro plan starts at $20/month with commercial rights.',
    keyStrengths: [
      'Generates native vector SVGs with clean paths, anchor points, and controllable colors',
      'Strict brand style consistency: lock in a custom color palette and aesthetic across 50+ illustrations',
      'Infinite canvas interface made for visual designers',
      'Built-in background removal, vectorization, and upscaling tools'
    ],
    keyLimitations: [
      'Focused on 2D/3D visual assets and icons, not full application screen layouts',
      'Complex custom typography inside generated illustrations often requires manual editing'
    ],
    websiteUrl: 'https://recraft.ai',
    personalNotes: 'Finally an AI art tool made for UI designers instead of generic prompt artists. Being able to export an illustration as an SVG and change the colors in code is incredible.',
    bestFor: 'Best for vector & icon assets with brand consistency',
    isFavorite: true,
    rating: 5,
    iconSymbol: '✒️',
    addedAt: '2026-09-02T16:30:00Z'
  },
  {
    id: 'res-mobbin',
    name: 'Mobbin',
    shortDescription: 'The world\'s largest mobile & web design library with real-world app screenshots, user flows, and UX patterns.',
    categoryId: 'ai-design-ui',
    tags: ['Inspiration', 'UX Flows', 'Design Patterns', 'Mobile', 'Web UI', 'Real Apps'],
    mainUseCase: 'Benchmarking proven UX patterns, onboarding sequences, checkout flows, and paywalls from top iOS, Android, and Web apps.',
    pricing: 'Freemium',
    pricingDetails: 'Free tier with access to recent apps. Pro is $10-$15/month for full archive and flows.',
    keyStrengths: [
      'Real production screenshots from thousands of leading apps (Airbnb, Uber, Linear, Stripe, etc.)',
      'Filter by UX pattern: onboarding, paywall, settings, navigation, empty states, search',
      'Full step-by-step user journey flows recorded screen by screen',
      'Direct copy-to-Figma plugin support'
    ],
    keyLimitations: [
      'Curated inspiration library rather than an active generative AI tool',
      'Most comprehensive flow diagrams require the paid Pro membership'
    ],
    websiteUrl: 'https://mobbin.com',
    personalNotes: 'Don\'t reinvent the wheel for checkout, signup, or billing flows. Study how the best teams in the world already solved it on Mobbin first.',
    bestFor: 'Best for design inspiration & real-world UX patterns',
    isFavorite: false,
    rating: 5,
    iconSymbol: '📱',
    addedAt: '2026-09-03T11:00:00Z'
  }
];
