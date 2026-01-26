// ============================================================================
// Documentation & Knowledge Management Types
// ============================================================================

export type ContentType = 'tutorial' | 'how-to' | 'reference' | 'explanation';
export type PersonaType = 'developer' | 'tech-lead' | 'manager' | 'executive';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface DocumentationArticle {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  contentType: ContentType;
  category: string;
  subcategory?: string;
  tags: string[];
  personas: PersonaType[];
  difficulty: DifficultyLevel;
  estimatedReadTime: number; // minutes
  prerequisites?: string[];
  relatedArticles?: string[];
  lastUpdated: string;
  author: string;
  views?: number;
  helpfulVotes?: number;
  featured?: boolean;
}

export interface ContextualHelp {
  id: string;
  location: string; // URL path pattern or component ID
  elementSelector?: string;
  triggers: HelpTrigger[];
  content: HelpContent;
  personaVariations?: Partial<Record<PersonaType, Partial<HelpContent>>>;
  priority: number;
}

export type HelpTrigger = 
  | 'hover'
  | 'focus'
  | 'error'
  | 'confusion'
  | 'first-visit'
  | 'inactivity'
  | 'manual';

export interface HelpContent {
  quick: string;
  detailed: string;
  tutorial?: string; // article ID
  examples?: CodeExample[];
  relatedLinks?: HelpLink[];
  videoUrl?: string;
}

export interface CodeExample {
  id: string;
  title: string;
  language: string;
  code: string;
  description?: string;
}

export interface HelpLink {
  label: string;
  url: string;
  type: 'internal' | 'external';
  icon?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  persona: PersonaType;
  difficulty: DifficultyLevel;
  estimatedTime: number;
  steps: TutorialStep[];
  completionReward?: string;
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  targetPage?: string;
  action?: 'click' | 'type' | 'navigate' | 'observe';
  validation?: TutorialValidation;
  hint?: string;
}

export interface TutorialValidation {
  type: 'element-exists' | 'element-value' | 'url-match' | 'custom';
  value: string;
}

export interface FaqCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  questions: FaqQuestion[];
}

export interface FaqQuestion {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  relatedArticles?: string[];
  helpfulVotes?: number;
}

export interface SearchSuggestion {
  query: string;
  type: 'popular' | 'recent' | 'suggested';
  category?: string;
}

export interface HelpFeedback {
  articleId: string;
  helpful: boolean;
  feedback?: string;
  timestamp: string;
}

export interface DocumentationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  articleCount: number;
  subcategories?: DocumentationSubcategory[];
}

export interface DocumentationSubcategory {
  id: string;
  name: string;
  slug: string;
  articleCount: number;
}

export interface Glossary {
  term: string;
  definition: string;
  relatedTerms?: string[];
  seeAlso?: string[];
}

export interface Runbook {
  id: string;
  title: string;
  description: string;
  category: 'incident-response' | 'operational' | 'maintenance' | 'deployment';
  severity?: 'critical' | 'high' | 'medium' | 'low';
  steps: RunbookStep[];
  relatedIncidents?: string[];
  lastUsed?: string;
  owner: string;
}

export interface RunbookStep {
  id: string;
  title: string;
  description: string;
  commands?: string[];
  expectedOutcome: string;
  troubleshooting?: string;
  automation?: {
    available: boolean;
    actionId?: string;
  };
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  persona: PersonaType;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  modules: LearningModule[];
  certification?: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  articles: string[];
  quiz?: Quiz;
  completed?: boolean;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}
