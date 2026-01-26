import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardHeader, Button, Badge } from '@/components/ui';
import { useDocumentationStore } from '@/stores';
import {
  documentationCategories,
  documentationArticles,
  faqCategories,
  learningPaths,
  glossary,
} from '@/data/documentation-data';
import {
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
  GraduationCap,
  Users,
  Mail,
  Video,
  Rocket,
  Box,
  Upload,
  Activity,
  AlertTriangle,
  Shield,
  DollarSign,
  Code,
  Star,
  TrendingUp,
  Play,
  CheckCircle,
} from 'lucide-react';

type ViewMode = 'home' | 'category' | 'article' | 'faq' | 'learning' | 'glossary';

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

export function Help() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
  const {
    searchResults,
    search: performSearch,
    clearSearch,
    toggleBookmark,
    isBookmarked,
    helpfulArticles,
    unhelpfulArticles,
    submitFeedback,
    completedArticles,
  } = useDocumentationStore();

  const view = (searchParams.get('view') as ViewMode) || 'home';
  const categoryId = searchParams.get('category');
  const articleId = searchParams.get('article');

  // Get current category and article
  const currentCategory = categoryId 
    ? documentationCategories.find(c => c.id === categoryId) 
    : null;
  const currentArticle = articleId 
    ? documentationArticles.find(a => a.id === articleId) 
    : null;

  // Filter articles by category
  const categoryArticles = useMemo(() => {
    if (!categoryId) return [];
    return documentationArticles.filter(a => a.category === categoryId);
  }, [categoryId]);

  // Featured articles
  const featuredArticles = useMemo(() => {
    return documentationArticles.filter(a => a.featured).slice(0, 4);
  }, []);

  // Popular articles (by views)
  const popularArticles = useMemo(() => {
    return [...documentationArticles]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearch(query);
    if (query.trim()) {
      performSearch(query);
    } else {
      clearSearch();
    }
  };

  // Navigate to different views
  const goToCategory = (catId: string) => {
    setSearchParams({ view: 'category', category: catId });
    clearSearch();
    setSearch('');
  };

  const goToArticle = (artId: string) => {
    setSearchParams({ view: 'article', article: artId });
    clearSearch();
    setSearch('');
  };

  const goHome = () => {
    setSearchParams({});
    clearSearch();
    setSearch('');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary">Help Center</h1>
        <p className="text-text-tertiary mt-2 max-w-lg mx-auto">
          Find answers, learn best practices, and get the most out of the platform
        </p>

        {/* Search */}
        <div className="mt-6 max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search documentation, FAQ, guides..."
              className="w-full pl-12 pr-4 py-3.5 bg-surface-raised border border-border-subtle rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
            />
            {search && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {search && searchResults.length > 0 && (
        <Card padding="lg">
          <CardHeader 
            title={`Search Results`}
            description={`${searchResults.length} results for "${search}"`}
          />
          <div className="mt-4 divide-y divide-border-subtle">
            {searchResults.slice(0, 10).map((result) => (
              <button
                key={result.id}
                onClick={() => result.type === 'article' && goToArticle(result.id)}
                className="w-full text-left py-4 first:pt-0 last:pb-0 hover:bg-surface-raised -mx-4 px-4 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                    result.type === 'article' && 'bg-accent/20 text-accent',
                    result.type === 'faq' && 'bg-purple-500/20 text-purple-400',
                    result.type === 'glossary' && 'bg-blue-500/20 text-blue-400',
                  )}>
                    {result.type === 'article' && <FileText className="w-5 h-5" />}
                    {result.type === 'faq' && <HelpCircle className="w-5 h-5" />}
                    {result.type === 'glossary' && <BookOpen className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary">{result.title}</p>
                    <p className="text-sm text-text-tertiary mt-1 line-clamp-2">
                      {result.description}
                    </p>
                    {result.category && (
                      <Badge variant="default" className="mt-2">
                        {result.category}
                      </Badge>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* No Search Results */}
      {search && searchResults.length === 0 && (
        <Card padding="lg" className="text-center py-12">
          <Search className="w-12 h-12 text-text-disabled mx-auto mb-4" />
          <p className="text-text-secondary">No results found for "{search}"</p>
          <p className="text-sm text-text-tertiary mt-2">
            Try different keywords or browse categories below
          </p>
        </Card>
      )}

      {/* Home View */}
      {!search && view === 'home' && (
        <>
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setSearchParams({ view: 'learning' })}
              className="p-4 bg-gradient-to-br from-accent/20 to-purple-500/20 border border-accent/30 rounded-xl hover:border-accent/50 transition-colors group"
            >
              <GraduationCap className="w-8 h-8 text-accent mb-3" />
              <p className="font-semibold text-text-primary">Learning Paths</p>
              <p className="text-sm text-text-tertiary mt-1">Guided tutorials</p>
            </button>
            <button
              onClick={() => setSearchParams({ view: 'faq' })}
              className="p-4 bg-surface-raised border border-border-subtle rounded-xl hover:border-border-default transition-colors"
            >
              <HelpCircle className="w-8 h-8 text-purple-400 mb-3" />
              <p className="font-semibold text-text-primary">FAQ</p>
              <p className="text-sm text-text-tertiary mt-1">Common questions</p>
            </button>
            <button
              onClick={() => goToCategory('api')}
              className="p-4 bg-surface-raised border border-border-subtle rounded-xl hover:border-border-default transition-colors"
            >
              <Code className="w-8 h-8 text-blue-400 mb-3" />
              <p className="font-semibold text-text-primary">API Reference</p>
              <p className="text-sm text-text-tertiary mt-1">Complete API docs</p>
            </button>
            <button
              onClick={() => setSearchParams({ view: 'glossary' })}
              className="p-4 bg-surface-raised border border-border-subtle rounded-xl hover:border-border-default transition-colors"
            >
              <BookOpen className="w-8 h-8 text-green-400 mb-3" />
              <p className="font-semibold text-text-primary">Glossary</p>
              <p className="text-sm text-text-tertiary mt-1">Terms & definitions</p>
            </button>
          </div>

          {/* Featured Articles */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Featured Articles
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {featuredArticles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => goToArticle(article.id)}
                  className="text-left p-5 bg-surface-raised border border-border-subtle rounded-xl hover:border-accent/50 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <Badge variant="accent" size="sm">
                      {article.contentType}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-text-tertiary group-hover:text-accent transition-colors" />
                  </div>
                  <h3 className="font-semibold text-text-primary mt-3">
                    {article.title}
                  </h3>
                  <p className="text-sm text-text-tertiary mt-2 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-text-disabled">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.estimatedReadTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {article.helpfulVotes}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Browse by Category */}
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Browse by Category
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {documentationCategories.map((category) => {
                const Icon = categoryIcons[category.id] || BookOpen;
                return (
                  <button
                    key={category.id}
                    onClick={() => goToCategory(category.id)}
                    className="text-left p-5 bg-surface-raised border border-border-subtle rounded-xl hover:border-accent/50 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-3 group-hover:bg-accent/30 transition-colors">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-semibold text-text-primary">
                      {category.name}
                    </h3>
                    <p className="text-sm text-text-tertiary mt-1 line-clamp-2">
                      {category.description}
                    </p>
                    <p className="text-xs text-text-disabled mt-3">
                      {category.articleCount} articles
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular & Support Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Popular Articles */}
            <div className="lg:col-span-2">
              <Card padding="lg">
                <CardHeader 
                  title="Popular Articles"
                  description="Most read documentation"
                  action={<TrendingUp className="w-5 h-5 text-accent" />}
                />
                <div className="mt-4 divide-y divide-border-subtle">
                  {popularArticles.map((article, index) => (
                    <button
                      key={article.id}
                      onClick={() => goToArticle(article.id)}
                      className="w-full text-left py-3 first:pt-0 last:pb-0 flex items-center gap-4 hover:bg-surface-raised -mx-4 px-4 transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-surface-raised flex items-center justify-center text-xs font-medium text-text-tertiary">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary truncate">
                          {article.title}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {article.views?.toLocaleString()} views
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-tertiary" />
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Support */}
            <Card padding="lg">
              <CardHeader 
                title="Need More Help?"
                action={<MessageSquare className="w-5 h-5 text-accent" />}
              />
              <div className="mt-4 space-y-3">
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 bg-surface-raised rounded-lg hover:bg-border-subtle transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-accent" />
                  <div>
                    <p className="font-medium text-text-primary text-sm">Live Chat</p>
                    <p className="text-xs text-text-tertiary">Talk to our team</p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 bg-surface-raised rounded-lg hover:bg-border-subtle transition-colors"
                >
                  <Mail className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-medium text-text-primary text-sm">Email Support</p>
                    <p className="text-xs text-text-tertiary">support@platform.dev</p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 bg-surface-raised rounded-lg hover:bg-border-subtle transition-colors"
                >
                  <Users className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-medium text-text-primary text-sm">Community</p>
                    <p className="text-xs text-text-tertiary">Join the discussion</p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 p-3 bg-surface-raised rounded-lg hover:bg-border-subtle transition-colors"
                >
                  <Video className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="font-medium text-text-primary text-sm">Video Tutorials</p>
                    <p className="text-xs text-text-tertiary">Watch and learn</p>
                  </div>
                </a>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Category View */}
      {!search && view === 'category' && currentCategory && (
        <>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button onClick={goHome} className="text-text-tertiary hover:text-accent">
              Help Center
            </button>
            <ChevronRight className="w-4 h-4 text-text-disabled" />
            <span className="text-text-primary">{currentCategory.name}</span>
          </div>

          {/* Category Header */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
              {(() => {
                const Icon = categoryIcons[currentCategory.id] || BookOpen;
                return <Icon className="w-7 h-7 text-accent" />;
              })()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                {currentCategory.name}
              </h2>
              <p className="text-text-tertiary">{currentCategory.description}</p>
            </div>
          </div>

          {/* Subcategories */}
          {currentCategory.subcategories && currentCategory.subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentCategory.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  className="px-4 py-2 bg-surface-raised border border-border-subtle rounded-lg text-sm text-text-secondary hover:border-accent/50 hover:text-text-primary transition-colors"
                >
                  {sub.name}
                  <span className="ml-2 text-text-disabled">({sub.articleCount})</span>
                </button>
              ))}
            </div>
          )}

          {/* Articles List */}
          <div className="space-y-3">
            {categoryArticles.map((article) => (
              <button
                key={article.id}
                onClick={() => goToArticle(article.id)}
                className="w-full text-left p-5 bg-surface-raised border border-border-subtle rounded-xl hover:border-accent/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" size="sm">
                        {article.contentType}
                      </Badge>
                      <Badge 
                        variant={article.difficulty === 'beginner' ? 'success' : article.difficulty === 'intermediate' ? 'warning' : 'error'} 
                        size="sm"
                      >
                        {article.difficulty}
                      </Badge>
                      {isBookmarked(article.id) && (
                        <BookMarked className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-text-tertiary mt-2 line-clamp-2">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-text-disabled">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.estimatedReadTime} min read
                      </span>
                      {article.helpfulVotes && (
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {article.helpfulVotes} found helpful
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-tertiary group-hover:text-accent transition-colors flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Article View */}
      {!search && view === 'article' && currentArticle && (
        <>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button onClick={goHome} className="text-text-tertiary hover:text-accent">
              Help Center
            </button>
            <ChevronRight className="w-4 h-4 text-text-disabled" />
            <button 
              onClick={() => goToCategory(currentArticle.category)}
              className="text-text-tertiary hover:text-accent"
            >
              {documentationCategories.find(c => c.id === currentArticle.category)?.name}
            </button>
            <ChevronRight className="w-4 h-4 text-text-disabled" />
            <span className="text-text-primary truncate max-w-[200px]">{currentArticle.title}</span>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card padding="lg">
                {/* Article Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="accent">{currentArticle.contentType}</Badge>
                      <Badge 
                        variant={currentArticle.difficulty === 'beginner' ? 'success' : currentArticle.difficulty === 'intermediate' ? 'warning' : 'error'}
                      >
                        {currentArticle.difficulty}
                      </Badge>
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary">
                      {currentArticle.title}
                    </h1>
                    <p className="text-text-tertiary mt-2">
                      {currentArticle.description}
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-text-disabled">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {currentArticle.estimatedReadTime} min read
                      </span>
                      <span>
                        Updated {new Date(currentArticle.lastUpdated).toLocaleDateString()}
                      </span>
                      <span>by {currentArticle.author}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBookmark(currentArticle.id)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      isBookmarked(currentArticle.id)
                        ? 'bg-accent/20 text-accent'
                        : 'hover:bg-surface-raised text-text-tertiary'
                    )}
                    title={isBookmarked(currentArticle.id) ? 'Remove bookmark' : 'Bookmark'}
                  >
                    {isBookmarked(currentArticle.id) ? (
                      <BookMarked className="w-5 h-5" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Article Content */}
                <div className="prose prose-invert prose-sm max-w-none">
                  <div 
                    className="text-text-secondary leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: currentArticle.content
                        .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-text-primary mt-8 mb-4">$1</h1>')
                        .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-text-primary mt-6 mb-3">$1</h2>')
                        .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium text-text-primary mt-4 mb-2">$3</h3>')
                        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
                        .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-surface-raised rounded text-accent text-sm">$1</code>')
                        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-accent hover:text-accent-hover underline">$1</a>')
                        .replace(/^\- (.+)$/gm, '<li class="ml-4 list-disc text-text-secondary">$1</li>')
                        .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-text-secondary">$1</li>')
                        .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="p-4 bg-surface-raised rounded-lg overflow-x-auto my-4"><code class="text-sm text-text-secondary">$2</code></pre>')
                        .replace(/\n\n/g, '</p><p class="my-4">')
                    }}
                  />
                </div>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-border-subtle">
                  <p className="text-sm font-medium text-text-tertiary mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {currentArticle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-surface-raised rounded-full text-xs text-text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Feedback */}
                <div className="mt-6 pt-6 border-t border-border-subtle">
                  <p className="text-sm font-medium text-text-primary mb-3">
                    Was this article helpful?
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => submitFeedback(currentArticle.id, true)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                        helpfulArticles.includes(currentArticle.id)
                          ? 'bg-success/20 text-success'
                          : 'bg-surface-raised text-text-secondary hover:bg-border-subtle'
                      )}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Yes, helpful</span>
                    </button>
                    <button
                      onClick={() => submitFeedback(currentArticle.id, false)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                        unhelpfulArticles.includes(currentArticle.id)
                          ? 'bg-error/20 text-error'
                          : 'bg-surface-raised text-text-secondary hover:bg-border-subtle'
                      )}
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span>Not helpful</span>
                    </button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Related Articles */}
              {currentArticle.relatedArticles && currentArticle.relatedArticles.length > 0 && (
                <Card padding="md">
                  <h3 className="font-semibold text-text-primary mb-3">Related Articles</h3>
                  <div className="space-y-2">
                    {currentArticle.relatedArticles.map((relId) => {
                      const relArticle = documentationArticles.find(a => a.id === relId);
                      if (!relArticle) return null;
                      return (
                        <button
                          key={relId}
                          onClick={() => goToArticle(relId)}
                          className="w-full text-left p-2 hover:bg-surface-raised rounded-lg transition-colors"
                        >
                          <p className="text-sm text-text-primary">{relArticle.title}</p>
                          <p className="text-xs text-text-tertiary mt-0.5">
                            {relArticle.estimatedReadTime} min read
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* Prerequisites */}
              {currentArticle.prerequisites && currentArticle.prerequisites.length > 0 && (
                <Card padding="md">
                  <h3 className="font-semibold text-text-primary mb-3">Prerequisites</h3>
                  <div className="space-y-2">
                    {currentArticle.prerequisites.map((preId) => {
                      const preArticle = documentationArticles.find(a => a.id === preId);
                      if (!preArticle) return null;
                      return (
                        <button
                          key={preId}
                          onClick={() => goToArticle(preId)}
                          className="w-full text-left p-2 hover:bg-surface-raised rounded-lg transition-colors flex items-center gap-2"
                        >
                          {completedArticles.includes(preId) ? (
                            <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-border-subtle flex-shrink-0" />
                          )}
                          <p className="text-sm text-text-primary">{preArticle.title}</p>
                        </button>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* Get Support */}
              <Card padding="md" className="bg-gradient-to-br from-accent/10 to-purple-500/10 border-accent/30">
                <h3 className="font-semibold text-text-primary mb-2">Still need help?</h3>
                <p className="text-sm text-text-tertiary mb-4">
                  Our team is here to assist you
                </p>
                <Button variant="primary" className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* FAQ View */}
      {!search && view === 'faq' && (
        <>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button onClick={goHome} className="text-text-tertiary hover:text-accent">
              Help Center
            </button>
            <ChevronRight className="w-4 h-4 text-text-disabled" />
            <span className="text-text-primary">FAQ</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <HelpCircle className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                Frequently Asked Questions
              </h2>
              <p className="text-text-tertiary">Find quick answers to common questions</p>
            </div>
          </div>

          <div className="space-y-6">
            {faqCategories.map((category) => (
              <Card key={category.id} padding="lg">
                <CardHeader 
                  title={category.name}
                  description={category.description}
                />
                <div className="mt-4 divide-y divide-border-subtle">
                  {category.questions.map((faq) => (
                    <div key={faq.id}>
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between py-4 text-left"
                      >
                        <span className="font-medium text-text-primary pr-4">
                          {faq.question}
                        </span>
                        {expandedFaq === faq.id ? (
                          <ChevronDown className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                        )}
                      </button>
                      {expandedFaq === faq.id && (
                        <div className="pb-4">
                          <p className="text-text-secondary leading-relaxed">
                            {faq.answer}
                          </p>
                          {faq.relatedArticles && faq.relatedArticles.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {faq.relatedArticles.map((artId) => {
                                const article = documentationArticles.find(a => a.id === artId);
                                if (!article) return null;
                                return (
                                  <button
                                    key={artId}
                                    onClick={() => goToArticle(artId)}
                                    className="text-sm text-accent hover:text-accent-hover flex items-center gap-1"
                                  >
                                    <FileText className="w-3 h-3" />
                                    {article.title}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Learning Paths View */}
      {!search && view === 'learning' && (
        <>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button onClick={goHome} className="text-text-tertiary hover:text-accent">
              Help Center
            </button>
            <ChevronRight className="w-4 h-4 text-text-disabled" />
            <span className="text-text-primary">Learning Paths</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                Learning Paths
              </h2>
              <p className="text-text-tertiary">Structured guides to master the platform</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {learningPaths.map((path) => (
              <Card key={path.id} padding="lg" className="hover:border-accent/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="accent">{path.persona}</Badge>
                      <Badge 
                        variant={path.difficulty === 'beginner' ? 'success' : path.difficulty === 'intermediate' ? 'warning' : 'error'}
                      >
                        {path.difficulty}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {path.title}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-accent" />
                  </div>
                </div>
                
                <p className="text-sm text-text-tertiary mb-4">
                  {path.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-text-disabled mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {path.estimatedHours} hours
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {path.modules.length} modules
                  </span>
                </div>

                {/* Modules preview */}
                <div className="space-y-2 mb-4">
                  {path.modules.slice(0, 3).map((module, index) => (
                    <div 
                      key={module.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-surface-raised flex items-center justify-center text-xs text-text-tertiary">
                        {index + 1}
                      </div>
                      <span className="text-text-secondary">{module.title}</span>
                    </div>
                  ))}
                  {path.modules.length > 3 && (
                    <p className="text-xs text-text-tertiary ml-9">
                      +{path.modules.length - 3} more modules
                    </p>
                  )}
                </div>

                <Button variant="primary" className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Glossary View */}
      {!search && view === 'glossary' && (
        <>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <button onClick={goHome} className="text-text-tertiary hover:text-accent">
              Help Center
            </button>
            <ChevronRight className="w-4 h-4 text-text-disabled" />
            <span className="text-text-primary">Glossary</span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                Glossary
              </h2>
              <p className="text-text-tertiary">Platform terminology and definitions</p>
            </div>
          </div>

          <Card padding="lg">
            <div className="divide-y divide-border-subtle">
              {glossary.sort((a, b) => a.term.localeCompare(b.term)).map((item) => (
                <div key={item.term} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="font-semibold text-text-primary">{item.term}</h3>
                  <p className="text-sm text-text-secondary mt-1">{item.definition}</p>
                  {item.relatedTerms && item.relatedTerms.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-text-tertiary">Related:</span>
                      <div className="flex flex-wrap gap-1">
                        {item.relatedTerms.map((term) => (
                          <span
                            key={term}
                            className="px-2 py-0.5 bg-surface-raised rounded text-xs text-text-secondary"
                          >
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
