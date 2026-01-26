import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  X,
  Search,
  BookOpen,
  FileText,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Clock,
  Bookmark,
  BookMarked,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Lightbulb,
  GraduationCap,
  AlertCircle,
  Rocket,
  Box,
  Upload,
  Activity,
  AlertTriangle,
  Shield,
  DollarSign,
  Code,
} from 'lucide-react';
import { useDocumentationStore } from '@/stores';
import { 
  documentationCategories, 
  documentationArticles, 
  contextualHelp as allContextualHelp,
} from '@/data/documentation-data';

type Tab = 'contextual' | 'browse' | 'search' | 'bookmarks';

const categoryIcons: Record<string, typeof Rocket> = {
  'getting-started': Rocket,
  'applications': Box,
  'deployments': Upload,
  'monitoring': Activity,
  'incidents': AlertTriangle,
  'security': Shield,
  'costs': DollarSign,
  'api': Code,
};

export function HelpSidebar() {
  const location = useLocation();
  const {
    isSidebarOpen,
    closeSidebar,
    searchQuery,
    searchResults,
    search,
    clearSearch,
    bookmarks,
    readingHistory,
    toggleBookmark,
    isBookmarked,
    helpfulArticles,
    unhelpfulArticles,
    submitFeedback,
  } = useDocumentationStore();

  const [activeTab, setActiveTab] = useState<Tab>('contextual');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  // Get contextual help for current page
  const contextualHelp = useMemo(() => {
    const pageUrl = location.pathname;
    return allContextualHelp.filter((h) => {
      if (h.location === pageUrl) return true;
      if (h.location.includes('*')) {
        const pattern = h.location.replace(/\*/g, '.*');
        return new RegExp(`^${pattern}$`).test(pageUrl);
      }
      return false;
    });
  }, [location.pathname]);

  // Get suggested articles based on current page
  const suggestedArticles = useMemo(() => {
    // Find articles relevant to current page
    const pathParts = location.pathname.split('/').filter(Boolean);
    const category = pathParts[0];
    
    return documentationArticles
      .filter(article => {
        if (article.category === category) return true;
        if (article.tags.some(tag => pathParts.includes(tag))) return true;
        return false;
      })
      .slice(0, 5);
  }, [location.pathname]);

  // Recent articles from history
  const recentArticles = useMemo(() => {
    return readingHistory
      .slice(0, 5)
      .map(id => documentationArticles.find(a => a.id === id))
      .filter(Boolean);
  }, [readingHistory]);

  // Bookmarked articles
  const bookmarkedArticles = useMemo(() => {
    return bookmarks
      .map(id => documentationArticles.find(a => a.id === id))
      .filter(Boolean);
  }, [bookmarks]);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + ?
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        if (isSidebarOpen) {
          closeSidebar();
        } else {
          useDocumentationStore.getState().openSidebar();
        }
      }
      // Escape to close
      if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, closeSidebar]);

  if (!isSidebarOpen) return null;

  const selectedArticleData = selectedArticle 
    ? documentationArticles.find(a => a.id === selectedArticle) 
    : null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-surface border-l border-border-subtle z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Help Center</h2>
              <p className="text-xs text-text-tertiary">⌘/ to toggle</p>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            className="p-2 hover:bg-surface-raised rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-tertiary" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border-subtle">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => search(e.target.value)}
              placeholder="Search documentation..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-raised border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-surface rounded transition-colors"
              >
                <X className="w-3 h-3 text-text-tertiary" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        {!searchQuery && !selectedArticle && (
          <div className="flex border-b border-border-subtle">
            {[
              { id: 'contextual' as Tab, label: 'This Page', icon: Lightbulb },
              { id: 'browse' as Tab, label: 'Browse', icon: BookOpen },
              { id: 'bookmarks' as Tab, label: 'Saved', icon: Bookmark },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'text-accent border-b-2 border-accent bg-accent/5'
                    : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-raised'
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Search Results */}
          {searchQuery && (
            <div className="p-4 space-y-4">
              {searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-text-disabled mx-auto mb-3" />
                  <p className="text-text-secondary">No results found</p>
                  <p className="text-sm text-text-tertiary mt-1">
                    Try different keywords or browse categories
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-text-tertiary">
                    {searchResults.length} results for "{searchQuery}"
                  </p>
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => {
                          if (result.type === 'article') {
                            setSelectedArticle(result.id);
                          }
                          clearSearch();
                        }}
                        className="w-full text-left p-3 bg-surface-raised hover:bg-border-subtle rounded-lg transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                            result.type === 'article' && 'bg-accent/20 text-accent',
                            result.type === 'faq' && 'bg-purple-500/20 text-purple-400',
                            result.type === 'glossary' && 'bg-blue-500/20 text-blue-400',
                          )}>
                            {result.type === 'article' && <FileText className="w-4 h-4" />}
                            {result.type === 'faq' && <HelpCircle className="w-4 h-4" />}
                            {result.type === 'glossary' && <BookOpen className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-text-primary text-sm">
                              {result.title}
                            </p>
                            <p className="text-xs text-text-tertiary mt-0.5 line-clamp-2">
                              {result.description}
                            </p>
                            {result.category && (
                              <span className="inline-block mt-1.5 px-2 py-0.5 bg-surface rounded text-xs text-text-tertiary">
                                {result.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Article Detail View */}
          {selectedArticle && selectedArticleData && !searchQuery && (
            <div className="p-4">
              <button
                onClick={() => setSelectedArticle(null)}
                className="flex items-center gap-1 text-sm text-text-tertiary hover:text-text-secondary mb-4 transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Back</span>
              </button>

              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-accent font-medium uppercase">
                      {selectedArticleData.contentType}
                    </span>
                    <h3 className="text-lg font-semibold text-text-primary mt-1">
                      {selectedArticleData.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleBookmark(selectedArticleData.id)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      isBookmarked(selectedArticleData.id)
                        ? 'bg-accent/20 text-accent'
                        : 'hover:bg-surface-raised text-text-tertiary'
                    )}
                  >
                    {isBookmarked(selectedArticleData.id) ? (
                      <BookMarked className="w-5 h-5" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {selectedArticleData.estimatedReadTime} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    {selectedArticleData.difficulty}
                  </span>
                </div>

                <p className="text-sm text-text-secondary">
                  {selectedArticleData.description}
                </p>

                {/* Article content preview */}
                <div className="prose prose-invert prose-sm max-w-none">
                  <div 
                    className="text-text-secondary whitespace-pre-line"
                    dangerouslySetInnerHTML={{ 
                      __html: selectedArticleData.content
                        .replace(/^#+\s+(.+)$/gm, '<h4 class="text-text-primary font-semibold mt-4 mb-2">$1</h4>')
                        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary">$1</strong>')
                        .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-surface-raised rounded text-accent text-xs">$1</code>')
                        .replace(/```[\s\S]*?```/g, (match) => {
                          const code = match.replace(/```\w*\n?/, '').replace(/```$/, '');
                          return `<pre class="p-3 bg-surface-raised rounded-lg overflow-x-auto"><code class="text-xs">${code}</code></pre>`;
                        })
                    }}
                  />
                </div>

                {/* Feedback */}
                <div className="pt-4 border-t border-border-subtle">
                  <p className="text-sm text-text-tertiary mb-3">Was this helpful?</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => submitFeedback(selectedArticleData.id, true)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm',
                        helpfulArticles.includes(selectedArticleData.id)
                          ? 'bg-success/20 text-success'
                          : 'bg-surface-raised text-text-secondary hover:bg-border-subtle'
                      )}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Yes</span>
                    </button>
                    <button
                      onClick={() => submitFeedback(selectedArticleData.id, false)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm',
                        unhelpfulArticles.includes(selectedArticleData.id)
                          ? 'bg-error/20 text-error'
                          : 'bg-surface-raised text-text-secondary hover:bg-border-subtle'
                      )}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>No</span>
                    </button>
                  </div>
                </div>

                {/* Full article link */}
                <Link
                  to={`/help/articles/${selectedArticleData.slug}`}
                  onClick={closeSidebar}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
                >
                  <span>Read full article</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Tab Content */}
          {!searchQuery && !selectedArticle && (
            <>
              {/* Contextual Help Tab */}
              {activeTab === 'contextual' && (
                <div className="p-4 space-y-6">
                  {/* Page-specific help */}
                  {contextualHelp.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-accent" />
                        Help for this page
                      </h3>
                      <div className="space-y-2">
                        {contextualHelp.map((help) => (
                          <div
                            key={help.id}
                            className="p-3 bg-surface-raised rounded-lg"
                          >
                            <p className="text-sm text-text-primary">
                              {help.content.quick}
                            </p>
                            {help.content.detailed && (
                              <p className="text-xs text-text-tertiary mt-2">
                                {help.content.detailed.substring(0, 150)}...
                              </p>
                            )}
                            {help.content.relatedLinks && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {help.content.relatedLinks.map((link, i) => (
                                  <Link
                                    key={i}
                                    to={link.url}
                                    onClick={closeSidebar}
                                    className="text-xs text-accent hover:text-accent-hover"
                                  >
                                    {link.label} →
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested articles */}
                  {suggestedArticles.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-text-primary mb-3">
                        Suggested for you
                      </h3>
                      <div className="space-y-2">
                        {suggestedArticles.map((article) => (
                          <button
                            key={article.id}
                            onClick={() => setSelectedArticle(article.id)}
                            className="w-full text-left p-3 bg-surface-raised hover:bg-border-subtle rounded-lg transition-colors"
                          >
                            <p className="text-sm font-medium text-text-primary">
                              {article.title}
                            </p>
                            <p className="text-xs text-text-tertiary mt-1 line-clamp-2">
                              {article.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick links */}
                  <div>
                    <h3 className="text-sm font-medium text-text-primary mb-3">
                      Quick links
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/help"
                        onClick={closeSidebar}
                        className="flex items-center gap-2 p-3 bg-surface-raised hover:bg-border-subtle rounded-lg transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-accent" />
                        <span className="text-sm text-text-primary">Documentation</span>
                      </Link>
                      <Link
                        to="/help/faq"
                        onClick={closeSidebar}
                        className="flex items-center gap-2 p-3 bg-surface-raised hover:bg-border-subtle rounded-lg transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-text-primary">FAQ</span>
                      </Link>
                      <Link
                        to="/help/api"
                        onClick={closeSidebar}
                        className="flex items-center gap-2 p-3 bg-surface-raised hover:bg-border-subtle rounded-lg transition-colors"
                      >
                        <Code className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-text-primary">API Reference</span>
                      </Link>
                      <a
                        href="#"
                        className="flex items-center gap-2 p-3 bg-surface-raised hover:bg-border-subtle rounded-lg transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-text-primary">Get Support</span>
                      </a>
                    </div>
                  </div>

                  {/* Recent */}
                  {recentArticles.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-text-tertiary" />
                        Recently viewed
                      </h3>
                      <div className="space-y-1">
                        {recentArticles.map((article) => (
                          <button
                            key={article!.id}
                            onClick={() => setSelectedArticle(article!.id)}
                            className="w-full text-left px-3 py-2 hover:bg-surface-raised rounded-lg transition-colors"
                          >
                            <p className="text-sm text-text-primary">
                              {article!.title}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Browse Tab */}
              {activeTab === 'browse' && (
                <div className="p-4 space-y-2">
                  {documentationCategories.map((category) => {
                    const Icon = categoryIcons[category.id] || BookOpen;
                    const isExpanded = expandedCategory === category.id;
                    const articles = documentationArticles.filter(
                      a => a.category === category.id
                    );

                    return (
                      <div key={category.id}>
                        <button
                          onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                          className="w-full flex items-center justify-between p-3 bg-surface-raised hover:bg-border-subtle rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-accent" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-text-primary text-sm">
                                {category.name}
                              </p>
                              <p className="text-xs text-text-tertiary">
                                {category.articleCount} articles
                              </p>
                            </div>
                          </div>
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 text-text-tertiary transition-transform',
                              isExpanded && 'rotate-180'
                            )}
                          />
                        </button>

                        {isExpanded && (
                          <div className="mt-1 ml-11 space-y-1">
                            {articles.map((article) => (
                              <button
                                key={article.id}
                                onClick={() => setSelectedArticle(article.id)}
                                className="w-full text-left px-3 py-2 hover:bg-surface-raised rounded-lg transition-colors"
                              >
                                <p className="text-sm text-text-primary">
                                  {article.title}
                                </p>
                                <p className="text-xs text-text-tertiary">
                                  {article.estimatedReadTime} min read
                                </p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bookmarks Tab */}
              {activeTab === 'bookmarks' && (
                <div className="p-4">
                  {bookmarkedArticles.length === 0 ? (
                    <div className="text-center py-8">
                      <Bookmark className="w-12 h-12 text-text-disabled mx-auto mb-3" />
                      <p className="text-text-secondary">No bookmarks yet</p>
                      <p className="text-sm text-text-tertiary mt-1">
                        Save articles for quick access
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {bookmarkedArticles.map((article) => (
                        <button
                          key={article!.id}
                          onClick={() => setSelectedArticle(article!.id)}
                          className="w-full text-left p-3 bg-surface-raised hover:bg-border-subtle rounded-lg transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-text-primary text-sm">
                                {article!.title}
                              </p>
                              <p className="text-xs text-text-tertiary mt-1">
                                {article!.category} · {article!.estimatedReadTime} min
                              </p>
                            </div>
                            <BookMarked className="w-4 h-4 text-accent flex-shrink-0" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-subtle bg-surface-raised">
          <div className="flex items-center justify-between">
            <Link
              to="/help"
              onClick={closeSidebar}
              className="text-sm text-accent hover:text-accent-hover transition-colors"
            >
              Open full Help Center
            </Link>
            <a
              href="#"
              className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
