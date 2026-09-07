import React, { useState } from 'react';
import { Category, Resource } from '../types/resource';
import {
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  HelpCircle,
  Layers,
  ChevronRight,
  ExternalLink,
  Target
} from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

interface DecisionMatrixProps {
  categories: Category[];
  resources: Resource[];
  activeCategoryId: string;
  onSelectCategory: (catId: string) => void;
  onSelectResource: (resource: Resource) => void;
  onFilterByBestFor: (bestForQuery: string) => void;
  activeBestForFilter: string;
}

interface PredefinedScenario {
  id: string;
  title: string;
  scenario: string;
  categoryId: string;
  recommendedIds: string[];
  rationale: string;
  quickTakeaway: string;
}

const DECISION_SCENARIOS: PredefinedScenario[] = [
  {
    id: 'sc-1',
    title: 'Building a production Next.js SaaS with relational data',
    scenario: 'You want real SQL with foreign keys, migrations, vector search, and built-in user authentication without dealing with raw AWS RDS setup.',
    categoryId: 'baas',
    recommendedIds: ['res-supabase', 'res-neon'],
    rationale: 'Supabase gives you complete PostgreSQL with Row Level Security, auto-generated TypeScript types, and auth out of the box. Neon is ideal if you need instant git-like database branching per PR.',
    quickTakeaway: 'Default to Supabase for the full BaaS suite, or Neon if pairing with Clerk/Auth.js.'
  },
  {
    id: 'sc-2',
    title: 'Building a real-time reactive collaborative web app',
    scenario: 'You need instant multiplayer synchronization, optimistic UI updates, and zero cache-invalidation bugs in React.',
    categoryId: 'baas',
    recommendedIds: ['res-convex', 'res-firebase'],
    rationale: 'Convex provides end-to-end TypeScript reactivity where any database mutation automatically updates the client without TanStack Query or WebSockets code. Firebase is great for high-scale mobile clients.',
    quickTakeaway: 'Convex offers the highest developer velocity for React teams today.'
  },
  {
    id: 'sc-3',
    title: 'Self-hosting a free backend with zero cloud bills',
    scenario: 'You want a lightweight backend with admin UI that you can deploy on a $3 VPS or Raspberry Pi without vendor lock-in.',
    categoryId: 'baas',
    recommendedIds: ['res-pocketbase', 'res-appwrite'],
    rationale: 'PocketBase is packaged as a single Go executable with embedded SQLite and instant REST/realtime APIs. Appwrite offers a full Docker suite with functions and GDPR compliance.',
    quickTakeaway: 'Pick PocketBase for single-binary simplicity; Appwrite for multi-platform teams.'
  },
  {
    id: 'sc-4',
    title: 'Autonomous coding in the terminal with repo context',
    scenario: 'You want an agent that lives in your bash terminal, understands full codebases, runs tests, and creates clean git commits.',
    categoryId: 'ai-agents',
    recommendedIds: ['res-claude-code'],
    rationale: 'Claude Code operates directly in your command line, inspects git diffs, executes test commands, and iterates autonomously until tests pass.',
    quickTakeaway: 'Claude Code is current gold standard for terminal-first developers.'
  },
  {
    id: 'sc-5',
    title: 'In-editor AI pair programmer for multi-file edits',
    scenario: 'You want a daily driver IDE that can generate code across multiple files in parallel with interactive diff reviews.',
    categoryId: 'ai-agents',
    recommendedIds: ['res-cursor'],
    rationale: 'Cursor\'s Composer feature indices your entire codebase and edits multiple files simultaneously while keeping full VS Code extension compatibility.',
    quickTakeaway: 'Cursor replaces VS Code for daily productivity.'
  },
  {
    id: 'sc-6',
    title: 'Generating accessible React & Tailwind UI from prompts',
    scenario: 'You need pristine frontend code using shadcn/ui and Tailwind CSS that you can directly copy into your Next.js project.',
    categoryId: 'ai-app-gen',
    recommendedIds: ['res-v0'],
    rationale: 'v0 produces the cleanest idiomatic React code that strictly follows accessibility guidelines and shadcn/ui design standards.',
    quickTakeaway: 'v0 is unbeatable for production-ready frontend components.'
  },
  {
    id: 'sc-7',
    title: 'Scaffolding a full-stack app with working DB in 5 minutes',
    scenario: 'You want to describe an application and get working UI, a provisioned database, authentication, and two-way GitHub sync.',
    categoryId: 'ai-app-gen',
    recommendedIds: ['res-lovable', 'res-bolt-new'],
    rationale: 'Lovable hooks directly into Supabase and pushes code to GitHub. Bolt.new runs full Node.js WebContainers directly in browser tabs.',
    quickTakeaway: 'Lovable for Supabase apps; Bolt.new for in-browser sandbox testing.'
  },
  {
    id: 'sc-8',
    title: 'Planning site architecture and copywriting before design',
    scenario: 'You need to map out website sitemaps, page wireframes, and section copy before spending time on colors and illustrations.',
    categoryId: 'ai-design-ui',
    recommendedIds: ['res-relume'],
    rationale: 'Relume generates full sitemaps and wireframe blocks that export directly to Figma and Webflow with the Client-First system.',
    quickTakeaway: 'Relume ensures content and structural hierarchy before visual design.'
  }
];

export const DecisionMatrix: React.FC<DecisionMatrixProps> = ({
  categories,
  resources,
  activeCategoryId,
  onSelectCategory,
  onSelectResource,
  onFilterByBestFor,
  activeBestForFilter
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DECISION_SCENARIOS[0].id);

  const selectedScenario =
    DECISION_SCENARIOS.find((s) => s.id === selectedScenarioId) || DECISION_SCENARIOS[0];

  const currentCategory = categories.find((c) => c.id === activeCategoryId);

  // Recommended resources for selected scenario
  const recommendedResources = resources.filter((r) =>
    selectedScenario.recommendedIds.includes(r.id)
  );

  return (
    <div className="space-y-6">
      {/* Category Decision Bar (If category is selected) */}
      {currentCategory && currentCategory.decisionThemes && currentCategory.decisionThemes.length > 0 && (
        <div className="p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-50/70 via-sky-50/50 to-transparent dark:from-indigo-950/40 dark:via-sky-950/20 dark:to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
              {currentCategory.name} Decision Matrix
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:inline">
              — Quick filter by what you need most:
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {currentCategory.decisionThemes.map((theme) => {
              const active = activeBestForFilter.toLowerCase() === theme.filterValue?.toLowerCase();
              return (
                <button
                  key={theme.label}
                  id={`decision-theme-${theme.label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => onFilterByBestFor(active ? '' : theme.filterValue || '')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white/80 hover:bg-white dark:bg-stone-900/80 dark:hover:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                  title={theme.description}
                >
                  <span className="font-semibold">{theme.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive "Which Tool Should I Use?" Advisor */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Decision Guide: Which tool should you use?
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Select your architectural scenario to get instant tool recommendations with rationales.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
          {/* Scenarios List */}
          <div className="lg:col-span-5 space-y-1.5 max-h-96 overflow-y-auto pr-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-2 mb-1">
              Common Developer Scenarios
            </div>
            {DECISION_SCENARIOS.map((sc) => {
              const isSelected = sc.id === selectedScenarioId;
              return (
                <button
                  key={sc.id}
                  id={`scenario-btn-${sc.id}`}
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 text-stone-900 dark:text-stone-100 shadow-xs'
                      : 'border-stone-100 dark:border-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-900/40 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold leading-snug">
                      {sc.title}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mt-0.5 transition-transform ${
                        isSelected ? 'text-indigo-600 dark:text-indigo-400 translate-x-0.5' : 'text-stone-400'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Scenario Details & Recommended Tool Cards */}
          <div className="lg:col-span-7 bg-stone-50/60 dark:bg-stone-950/40 p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Architecture Recommendation</span>
              </div>

              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">
                {selectedScenario.title}
              </h3>

              <p className="text-xs text-stone-600 dark:text-stone-300 mb-4 leading-relaxed">
                {selectedScenario.scenario}
              </p>

              {/* Rationale Callout */}
              <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 mb-4 space-y-1.5">
                <div className="text-[11px] font-bold text-stone-700 dark:text-stone-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Why these tools?</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {selectedScenario.rationale}
                </p>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold pt-1 border-t border-stone-100 dark:border-stone-800">
                  ⚡ Takeaway: {selectedScenario.quickTakeaway}
                </div>
              </div>

              {/* Recommended Tool Items */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Recommended Options ({recommendedResources.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recommendedResources.map((res) => (
                    <div
                      key={res.id}
                      onClick={() => onSelectResource(res)}
                      className="group p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-indigo-400 dark:hover:border-indigo-600 cursor-pointer transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{res.iconSymbol || '⚡'}</span>
                            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              {res.name}
                            </span>
                          </div>
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded border bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                            {res.pricing}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mb-2">
                          {res.shortDescription}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-medium pt-2 border-t border-stone-100 dark:border-stone-800">
                        <span>View analysis</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
