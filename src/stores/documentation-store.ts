import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DocumentationArticle,
  HelpFeedback,
} from '@/types/documentation';
import {
  documentationArticles,
  faqCategories,
  contextualHelp,
  glossary,
} from '@/data/documentation-data';

interface SearchResult {
  id: string;
  type: 'article' | 'faq' | 'glossary' | 'contextual';
  title: string;
  description: string;
  relevance: number;
  url?: string;
  category?: string;
}

interface DocumentationState {
  // Search
  searchQuery: string;
  searchResults: SearchResult[];
  recentSearches: string[];
  popularSearches: string[];
  
  // Help sidebar
  isSidebarOpen: boolean;
  currentPageHelp: typeof contextualHelp;
  activeContextualHelp: string | null;
  
  // Article viewing
  currentArticle: DocumentationArticle | null;
  readingHistory: string[];
  bookmarks: string[];
  
  // Feedback
  helpfulArticles: string[];
  unhelpfulArticles: string[];
  feedbackHistory: HelpFeedback[];
  
  // Learning progress
  completedArticles: string[];
  completedTutorials: string[];
  currentLearningPath: string | null;
  learningProgress: Record<string, number>;
  
  // Actions
  setSearchQuery: (query: string) => void;
  search: (query: string) => void;
  clearSearch: () => void;
  addRecentSearch: (query: string) => void;
  
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  setCurrentPageHelp: (pageUrl: string) => void;
  setActiveContextualHelp: (helpId: string | null) => void;
  
  setCurrentArticle: (articleId: string | null) => void;
  addToReadingHistory: (articleId: string) => void;
  toggleBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;
  
  submitFeedback: (articleId: string, helpful: boolean, feedback?: string) => void;
  
  markArticleComplete: (articleId: string) => void;
  markTutorialComplete: (tutorialId: string) => void;
  setCurrentLearningPath: (pathId: string | null) => void;
  updateLearningProgress: (pathId: string, progress: number) => void;
  
  getArticleById: (id: string) => DocumentationArticle | undefined;
  getRelatedArticles: (articleId: string) => DocumentationArticle[];
  getArticlesByCategory: (category: string) => DocumentationArticle[];
  getSuggestedArticles: () => DocumentationArticle[];
  getContextualHelpForPage: (pageUrl: string) => typeof contextualHelp;
}

export const useDocumentationStore = create<DocumentationState>()(
  persist(
    (set, get) => ({
      // Initial state
      searchQuery: '',
      searchResults: [],
      recentSearches: [],
      popularSearches: [
        'how to deploy',
        'create application',
        'rollback deployment',
        'set up alerts',
        'api documentation',
      ],
      
      isSidebarOpen: false,
      currentPageHelp: [],
      activeContextualHelp: null,
      
      currentArticle: null,
      readingHistory: [],
      bookmarks: [],
      
      helpfulArticles: [],
      unhelpfulArticles: [],
      feedbackHistory: [],
      
      completedArticles: [],
      completedTutorials: [],
      currentLearningPath: null,
      learningProgress: {},
      
      // Actions
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      search: (query) => {
        if (!query.trim()) {
          set({ searchResults: [], searchQuery: '' });
          return;
        }
        
        const lowerQuery = query.toLowerCase();
        const results: SearchResult[] = [];
        
        // Search articles
        documentationArticles.forEach((article) => {
          const titleMatch = article.title.toLowerCase().includes(lowerQuery);
          const descMatch = article.description.toLowerCase().includes(lowerQuery);
          const contentMatch = article.content.toLowerCase().includes(lowerQuery);
          const tagMatch = article.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
          
          if (titleMatch || descMatch || contentMatch || tagMatch) {
            let relevance = 0;
            if (titleMatch) relevance += 10;
            if (descMatch) relevance += 5;
            if (tagMatch) relevance += 3;
            if (contentMatch) relevance += 1;
            
            results.push({
              id: article.id,
              type: 'article',
              title: article.title,
              description: article.description,
              relevance,
              url: `/help/articles/${article.slug}`,
              category: article.category,
            });
          }
        });
        
        // Search FAQs
        faqCategories.forEach((category) => {
          category.questions.forEach((faq) => {
            const questionMatch = faq.question.toLowerCase().includes(lowerQuery);
            const answerMatch = faq.answer.toLowerCase().includes(lowerQuery);
            
            if (questionMatch || answerMatch) {
              results.push({
                id: faq.id,
                type: 'faq',
                title: faq.question,
                description: faq.answer.substring(0, 150) + '...',
                relevance: questionMatch ? 8 : 3,
                category: category.name,
              });
            }
          });
        });
        
        // Search glossary
        glossary.forEach((term) => {
          const termMatch = term.term.toLowerCase().includes(lowerQuery);
          const defMatch = term.definition.toLowerCase().includes(lowerQuery);
          
          if (termMatch || defMatch) {
            results.push({
              id: term.term,
              type: 'glossary',
              title: term.term,
              description: term.definition,
              relevance: termMatch ? 6 : 2,
            });
          }
        });
        
        // Sort by relevance
        results.sort((a, b) => b.relevance - a.relevance);
        
        set({ searchResults: results.slice(0, 20), searchQuery: query });
        get().addRecentSearch(query);
      },
      
      clearSearch: () => set({ searchQuery: '', searchResults: [] }),
      
      addRecentSearch: (query) => {
        const recent = get().recentSearches.filter(s => s !== query);
        recent.unshift(query);
        set({ recentSearches: recent.slice(0, 10) });
      },
      
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      closeSidebar: () => set({ isSidebarOpen: false }),
      openSidebar: () => set({ isSidebarOpen: true }),
      
      setCurrentPageHelp: (pageUrl) => {
        const pageHelp = contextualHelp.filter((help) => {
          // Match exact path or pattern
          if (help.location === pageUrl) return true;
          // Match wildcards
          if (help.location.includes('*')) {
            const pattern = help.location.replace(/\*/g, '.*');
            return new RegExp(`^${pattern}$`).test(pageUrl);
          }
          return false;
        });
        set({ currentPageHelp: pageHelp });
      },
      
      setActiveContextualHelp: (helpId) => set({ activeContextualHelp: helpId }),
      
      setCurrentArticle: (articleId) => {
        if (!articleId) {
          set({ currentArticle: null });
          return;
        }
        const article = documentationArticles.find(a => a.id === articleId);
        set({ currentArticle: article || null });
        if (article) {
          get().addToReadingHistory(articleId);
        }
      },
      
      addToReadingHistory: (articleId) => {
        const history = get().readingHistory.filter(id => id !== articleId);
        history.unshift(articleId);
        set({ readingHistory: history.slice(0, 50) });
      },
      
      toggleBookmark: (articleId) => {
        const bookmarks = get().bookmarks;
        if (bookmarks.includes(articleId)) {
          set({ bookmarks: bookmarks.filter(id => id !== articleId) });
        } else {
          set({ bookmarks: [...bookmarks, articleId] });
        }
      },
      
      isBookmarked: (articleId) => get().bookmarks.includes(articleId),
      
      submitFeedback: (articleId, helpful, feedback) => {
        const state = get();
        
        if (helpful) {
          set({
            helpfulArticles: [...state.helpfulArticles.filter(id => id !== articleId), articleId],
            unhelpfulArticles: state.unhelpfulArticles.filter(id => id !== articleId),
          });
        } else {
          set({
            unhelpfulArticles: [...state.unhelpfulArticles.filter(id => id !== articleId), articleId],
            helpfulArticles: state.helpfulArticles.filter(id => id !== articleId),
          });
        }
        
        set({
          feedbackHistory: [
            ...state.feedbackHistory,
            { articleId, helpful, feedback, timestamp: new Date().toISOString() },
          ],
        });
      },
      
      markArticleComplete: (articleId) => {
        const completed = get().completedArticles;
        if (!completed.includes(articleId)) {
          set({ completedArticles: [...completed, articleId] });
        }
      },
      
      markTutorialComplete: (tutorialId) => {
        const completed = get().completedTutorials;
        if (!completed.includes(tutorialId)) {
          set({ completedTutorials: [...completed, tutorialId] });
        }
      },
      
      setCurrentLearningPath: (pathId) => set({ currentLearningPath: pathId }),
      
      updateLearningProgress: (pathId, progress) => {
        set({
          learningProgress: {
            ...get().learningProgress,
            [pathId]: progress,
          },
        });
      },
      
      getArticleById: (id) => documentationArticles.find(a => a.id === id),
      
      getRelatedArticles: (articleId) => {
        const article = documentationArticles.find(a => a.id === articleId);
        if (!article) return [];
        
        // Get articles with matching tags or same category
        return documentationArticles
          .filter(a => {
            if (a.id === articleId) return false;
            if (a.category === article.category) return true;
            if (article.tags.some(tag => a.tags.includes(tag))) return true;
            if (article.relatedArticles?.includes(a.id)) return true;
            return false;
          })
          .slice(0, 5);
      },
      
      getArticlesByCategory: (category) => {
        return documentationArticles.filter(a => a.category === category);
      },
      
      getSuggestedArticles: () => {
        const { readingHistory, completedArticles } = get();
        
        // If new user, suggest featured articles
        if (readingHistory.length === 0) {
          return documentationArticles.filter(a => a.featured).slice(0, 5);
        }
        
        // Suggest based on reading history
        const recentCategories = readingHistory
          .slice(0, 5)
          .map(id => documentationArticles.find(a => a.id === id)?.category)
          .filter(Boolean);
        
        return documentationArticles
          .filter(a => {
            if (completedArticles.includes(a.id)) return false;
            if (recentCategories.includes(a.category)) return true;
            return false;
          })
          .slice(0, 5);
      },
      
      getContextualHelpForPage: (pageUrl) => {
        return contextualHelp.filter((help) => {
          if (help.location === pageUrl) return true;
          if (help.location.includes('*')) {
            const pattern = help.location.replace(/\*/g, '.*');
            return new RegExp(`^${pattern}$`).test(pageUrl);
          }
          return false;
        });
      },
    }),
    {
      name: 'documentation-storage',
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        bookmarks: state.bookmarks,
        readingHistory: state.readingHistory,
        helpfulArticles: state.helpfulArticles,
        unhelpfulArticles: state.unhelpfulArticles,
        completedArticles: state.completedArticles,
        completedTutorials: state.completedTutorials,
        learningProgress: state.learningProgress,
      }),
    }
  )
);
