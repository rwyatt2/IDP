import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, SearchInput, Button } from '@/components/ui';
import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  Video,
  FileText,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Search,
  Rocket,
  Server,
  Shield,
  Zap,
  Users,
  Mail,
  Clock,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How do I create a new application?',
    answer: 'Navigate to Build > Create Application. You\'ll be guided through a wizard that helps you set up your application with the right configurations, dependencies, and CI/CD pipelines.',
    category: 'Getting Started',
  },
  {
    question: 'How do I deploy my application?',
    answer: 'Once your application is configured, you can trigger deployments from the Deploy section. Deployments can be manual or automated via CI/CD pipelines. All deployments go through the configured change gates.',
    category: 'Deployments',
  },
  {
    question: 'What are change gates?',
    answer: 'Change gates are approval workflows that control when and how changes can be deployed. They can include manual approvals, automated tests, and scheduling rules to ensure safe deployments.',
    category: 'Deployments',
  },
  {
    question: 'How do I get notified about incidents?',
    answer: 'Configure your notification preferences in Settings > Notifications. You can receive alerts via email, Slack, PagerDuty, or push notifications based on severity and your on-call schedule.',
    category: 'Incidents',
  },
  {
    question: 'How do I add team members?',
    answer: 'Team management is handled through your organization\'s identity provider. Contact your platform admin to add new team members or modify team structures.',
    category: 'Teams',
  },
  {
    question: 'How do I install extensions?',
    answer: 'Browse the Extension Marketplace from the main navigation. Find the extension you want and click Install. Some extensions may require admin approval before they become available.',
    category: 'Extensions',
  },
  {
    question: 'How do I track costs?',
    answer: 'Visit Manage > Costs to see a breakdown of infrastructure costs by application, team, and resource type. You can set up budget alerts and analyze trends over time.',
    category: 'Costs',
  },
  {
    question: 'How do I configure environment variables?',
    answer: 'Go to Build > Configure Services, select your application, and navigate to the Environment Variables tab. You can manage variables per environment (dev, staging, production).',
    category: 'Configuration',
  },
];

const quickLinks = [
  { title: 'Getting Started Guide', description: 'Learn the basics of the platform', icon: <Rocket className="w-5 h-5" />, url: '#' },
  { title: 'API Documentation', description: 'Complete API reference', icon: <FileText className="w-5 h-5" />, url: '#' },
  { title: 'Video Tutorials', description: 'Step-by-step video guides', icon: <Video className="w-5 h-5" />, url: '#' },
  { title: 'Best Practices', description: 'Recommendations for success', icon: <Zap className="w-5 h-5" />, url: '#' },
  { title: 'Security Guide', description: 'Security policies and guidelines', icon: <Shield className="w-5 h-5" />, url: '#' },
  { title: 'Architecture Overview', description: 'Platform architecture docs', icon: <Server className="w-5 h-5" />, url: '#' },
];

function FaqAccordion({ faq, isOpen, onToggle }: { faq: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium text-slate-900">{faq.question}</span>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4">
          <p className="text-slate-600">{faq.answer}</p>
        </div>
      )}
    </div>
  );
}

export function Help() {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(faqs.map((f) => f.category))];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = search === '' ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">How can we help?</h1>
        <p className="text-slate-500 mt-2">
          Search our knowledge base or browse common questions below
        </p>
        <div className="mt-6 max-w-md mx-auto">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            placeholder="Search for help..."
            inputSize="lg"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <Card key={link.title} variant="hover" className="p-5 cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                {link.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{link.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{link.description}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ */}
        <div className="lg:col-span-2">
          <Card padding="lg">
            <CardHeader title="Frequently Asked Questions" />

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mt-4 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    selectedCategory === category
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {category === 'all' ? 'All Topics' : category}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div>
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No results found for "{search}"</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <FaqAccordion
                    key={faq.question}
                    faq={faq}
                    isOpen={openFaq === faq.question}
                    onToggle={() => setOpenFaq(openFaq === faq.question ? null : faq.question)}
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Support */}
          <Card padding="lg">
            <CardHeader title="Need more help?" />
            <div className="mt-4 space-y-3">
              <Button variant="secondary" className="w-full justify-start" leftIcon={<MessageSquare className="w-4 h-4" />}>
                Start a conversation
              </Button>
              <Button variant="secondary" className="w-full justify-start" leftIcon={<Mail className="w-4 h-4" />}>
                Email support
              </Button>
              <Button variant="secondary" className="w-full justify-start" leftIcon={<BookOpen className="w-4 h-4" />}>
                Browse documentation
              </Button>
            </div>
          </Card>

          {/* Support Hours */}
          <Card padding="lg">
            <CardHeader title="Support Hours" />
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-success-50 border border-success-200">
                <Clock className="w-5 h-5 text-success-600" />
                <div>
                  <p className="font-medium text-success-800">Currently Online</p>
                  <p className="text-sm text-success-700">Avg response: 5 mins</p>
                </div>
              </div>
              <div className="text-sm text-slate-500">
                <p className="font-medium text-slate-900 mb-2">Business Hours</p>
                <p>Monday - Friday</p>
                <p>9:00 AM - 6:00 PM PST</p>
              </div>
              <div className="text-sm text-slate-500 pt-3 border-t border-slate-100">
                <p className="font-medium text-slate-900 mb-2">Emergency Support</p>
                <p>24/7 for critical incidents</p>
              </div>
            </div>
          </Card>

          {/* Community */}
          <Card padding="lg">
            <CardHeader title="Community" />
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                <Users className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900">Developer Forum</p>
                  <p className="text-sm text-slate-500">Ask the community</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                <MessageSquare className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-900">#platform-help</p>
                  <p className="text-sm text-slate-500">Slack channel</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
