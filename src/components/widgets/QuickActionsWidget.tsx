import { useNavigate } from 'react-router-dom';
import { useNavigationStore } from '@/stores';
import { useToast } from '@/components/ui';
import {
  Plus,
  Rocket,
  Search,
  FileText,
  AlertTriangle,
  GitBranch,
  Database,
  BarChart3,
} from 'lucide-react';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

export function QuickActionsWidget() {
  const navigate = useNavigate();
  const { openSearch } = useNavigationStore();
  const toast = useToast();

  const actions: QuickAction[] = [
    {
      id: 'create-app',
      label: 'Create App',
      icon: <Plus className="w-5 h-5" />,
      color: 'bg-green-100 text-green-600 hover:bg-green-200',
      action: () => {
        navigate('/build/create');
        toast.info('Create Application', 'Starting the application creation wizard');
      },
    },
    {
      id: 'deploy',
      label: 'Deploy',
      icon: <Rocket className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
      action: () => {
        navigate('/deploy/deployments');
        toast.info('Deployments', 'View and manage your deployments');
      },
    },
    {
      id: 'search',
      label: 'Search',
      icon: <Search className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      action: () => {
        openSearch();
      },
    },
    {
      id: 'docs',
      label: 'API Docs',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-slate-100 text-slate-600 hover:bg-slate-200',
      action: () => {
        navigate('/discover/docs');
      },
    },
    {
      id: 'incident',
      label: 'Report Issue',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'bg-danger-100 text-danger-600 hover:bg-danger-200',
      action: () => {
        navigate('/manage/incidents');
        toast.info('Incidents', 'Report or view active incidents');
      },
    },
    {
      id: 'pipeline',
      label: 'Pipelines',
      icon: <GitBranch className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
      action: () => {
        navigate('/build/pipelines');
      },
    },
    {
      id: 'catalog',
      label: 'Catalog',
      icon: <Database className="w-5 h-5" />,
      color: 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200',
      action: () => {
        navigate('/discover/catalog');
      },
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-pink-100 text-pink-600 hover:bg-pink-200',
      action: () => {
        navigate('/manage/analytics');
      },
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.action}
          className={`p-3 rounded-lg ${action.color} transition-colors flex flex-col items-center gap-1.5`}
        >
          {action.icon}
          <span className="text-xs font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
