import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, formatCurrency } from '@/lib/utils';
import { teams } from '@/data/mock-data';
import { Button, Card, Input, Select, Badge } from '@/components/ui';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Server,
  Globe,
  Database,
  Code,
  Layers,
  GitBranch,
  Rocket,
  DollarSign,
} from 'lucide-react';
import type { ApplicationType, ServiceTier, Environment } from '@/types';

interface FormData {
  name: string;
  displayName: string;
  description: string;
  type: ApplicationType;
  team: string;
  tier: ServiceTier;
  language: string;
  framework: string;
  repository: string;
  environments: Environment[];
  compute: {
    type: 'kubernetes' | 'serverless' | 'vm';
    replicas: number;
    cpu: string;
    memory: string;
  };
  database: {
    type: 'postgres' | 'mysql' | 'mongodb' | 'dynamodb' | 'none';
    size: string;
  };
  cache: {
    type: 'redis' | 'memcached' | 'none';
    size: string;
  };
  monitoring: boolean;
  cdn: boolean;
}

const steps = [
  { id: 1, title: 'Basics', description: 'Application information' },
  { id: 2, title: 'Team & Tier', description: 'Ownership and criticality' },
  { id: 3, title: 'Infrastructure', description: 'Compute and storage' },
  { id: 4, title: 'Review', description: 'Confirm and create' },
];

const typeOptions = [
  { value: 'service', label: 'Service', icon: <Server className="w-5 h-5" />, description: 'Backend microservice' },
  { value: 'frontend', label: 'Frontend', icon: <Globe className="w-5 h-5" />, description: 'Web application' },
  { value: 'backend', label: 'Backend', icon: <Database className="w-5 h-5" />, description: 'API server' },
  { value: 'library', label: 'Library', icon: <Code className="w-5 h-5" />, description: 'Shared library' },
  { value: 'infrastructure', label: 'Infrastructure', icon: <Layers className="w-5 h-5" />, description: 'Infrastructure component' },
  { value: 'data-pipeline', label: 'Data Pipeline', icon: <GitBranch className="w-5 h-5" />, description: 'ETL or data workflow' },
];

const tierOptions = [
  { value: 'tier-1', label: 'Tier 1 - Critical', description: 'Revenue impacting, requires 99.99% uptime', color: 'bg-danger-100 text-danger-700' },
  { value: 'tier-2', label: 'Tier 2 - Important', description: 'Business critical, requires 99.9% uptime', color: 'bg-warning-100 text-warning-700' },
  { value: 'tier-3', label: 'Tier 3 - Standard', description: 'Internal tools, 99% uptime', color: 'bg-blue-100 text-blue-700' },
  { value: 'tier-4', label: 'Tier 4 - Development', description: 'Non-production, best effort', color: 'bg-slate-100 text-slate-700' },
];

const languageOptions = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'rust', label: 'Rust' },
  { value: 'other', label: 'Other' },
];

export function CreateApplication() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    displayName: '',
    description: '',
    type: 'service',
    team: '',
    tier: 'tier-3',
    language: '',
    framework: '',
    repository: '',
    environments: ['development', 'staging', 'production'],
    compute: {
      type: 'kubernetes',
      replicas: 2,
      cpu: '0.5',
      memory: '512Mi',
    },
    database: {
      type: 'none',
      size: 'small',
    },
    cache: {
      type: 'none',
      size: 'small',
    },
    monitoring: true,
    cdn: false,
  });

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const estimatedCost = () => {
    let cost = 0;
    // Compute
    cost += formData.compute.replicas * 50;
    if (formData.compute.cpu === '1') cost += 30;
    if (formData.compute.cpu === '2') cost += 80;
    // Database
    if (formData.database.type !== 'none') {
      cost += formData.database.size === 'small' ? 50 : formData.database.size === 'medium' ? 150 : 400;
    }
    // Cache
    if (formData.cache.type !== 'none') {
      cost += formData.cache.size === 'small' ? 25 : formData.cache.size === 'medium' ? 75 : 200;
    }
    // Environments
    cost *= formData.environments.length * 0.5;
    // Add-ons
    if (formData.monitoring) cost += 20;
    if (formData.cdn) cost += 50;
    return Math.round(cost);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.displayName && formData.description && formData.type;
      case 2:
        return formData.team && formData.tier && formData.language;
      case 3:
        return formData.compute.type && formData.environments.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    navigate('/discover/catalog');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create New Application</h1>
        <p className="text-slate-500 mt-1">
          Set up a new application with all the infrastructure you need
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors',
                  currentStep > step.id
                    ? 'bg-success-500 text-white'
                    : currentStep === step.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-500'
                )}
              >
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <div className="hidden sm:block">
                <p className={cn(
                  'font-medium',
                  currentStep >= step.id ? 'text-slate-900' : 'text-slate-400'
                )}>
                  {step.title}
                </p>
                <p className="text-sm text-slate-500">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                'w-12 lg:w-24 h-0.5 mx-4',
                currentStep > step.id ? 'bg-success-500' : 'bg-slate-200'
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card padding="lg">
            {/* Step 1: Basics */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <Input
                  label="Application Name"
                  placeholder="my-service"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  hint="Lowercase letters, numbers, and hyphens only"
                />
                <Input
                  label="Display Name"
                  placeholder="My Service"
                  value={formData.displayName}
                  onChange={(e) => updateFormData({ displayName: e.target.value })}
                />
                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input min-h-[100px]"
                    placeholder="Describe what this application does..."
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Application Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {typeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateFormData({ type: option.value as ApplicationType })}
                        className={cn(
                          'p-4 rounded-lg border-2 text-left transition-colors',
                          formData.type === option.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-slate-200 hover:border-slate-300'
                        )}
                      >
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center mb-2',
                          formData.type === option.value
                            ? 'bg-primary-100 text-primary-600'
                            : 'bg-slate-100 text-slate-600'
                        )}>
                          {option.icon}
                        </div>
                        <p className="font-medium text-slate-900">{option.label}</p>
                        <p className="text-xs text-slate-500">{option.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Team & Tier */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="label">Owning Team</label>
                  <Select
                    value={formData.team}
                    onChange={(v) => updateFormData({ team: v })}
                    options={teams.map((t) => ({ value: t.id, label: t.name }))}
                    placeholder="Select a team..."
                  />
                </div>
                <div>
                  <label className="label">Service Tier</label>
                  <div className="space-y-3">
                    {tierOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateFormData({ tier: option.value as ServiceTier })}
                        className={cn(
                          'w-full p-4 rounded-lg border-2 text-left transition-colors flex items-center gap-4',
                          formData.tier === option.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-slate-200 hover:border-slate-300'
                        )}
                      >
                        <Badge className={option.color}>{option.value.replace('tier-', 'T')}</Badge>
                        <div>
                          <p className="font-medium text-slate-900">{option.label}</p>
                          <p className="text-sm text-slate-500">{option.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Language</label>
                    <Select
                      value={formData.language}
                      onChange={(v) => updateFormData({ language: v })}
                      options={languageOptions}
                      placeholder="Select language..."
                    />
                  </div>
                  <Input
                    label="Framework (optional)"
                    placeholder="e.g., React, FastAPI"
                    value={formData.framework}
                    onChange={(e) => updateFormData({ framework: e.target.value })}
                  />
                </div>
                <Input
                  label="Repository URL"
                  placeholder="github.com/company/repo"
                  value={formData.repository}
                  onChange={(e) => updateFormData({ repository: e.target.value })}
                />
              </div>
            )}

            {/* Step 3: Infrastructure */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="label">Environments</label>
                  <div className="flex flex-wrap gap-2">
                    {(['development', 'staging', 'production', 'sandbox'] as Environment[]).map((env) => (
                      <button
                        key={env}
                        onClick={() => {
                          const envs = formData.environments.includes(env)
                            ? formData.environments.filter((e) => e !== env)
                            : [...formData.environments, env];
                          updateFormData({ environments: envs });
                        }}
                        className={cn(
                          'px-4 py-2 rounded-lg border-2 font-medium capitalize transition-colors',
                          formData.environments.includes(env)
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        )}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Compute</label>
                  <Card className="p-4 bg-slate-50 border-slate-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-xs text-slate-500">Type</label>
                        <Select
                          value={formData.compute.type}
                          onChange={(v) => updateFormData({ compute: { ...formData.compute, type: v as 'kubernetes' | 'serverless' | 'vm' } })}
                          options={[
                            { value: 'kubernetes', label: 'Kubernetes' },
                            { value: 'serverless', label: 'Serverless' },
                            { value: 'vm', label: 'Virtual Machine' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Replicas</label>
                        <Select
                          value={String(formData.compute.replicas)}
                          onChange={(v) => updateFormData({ compute: { ...formData.compute, replicas: Number(v) } })}
                          options={[
                            { value: '1', label: '1' },
                            { value: '2', label: '2' },
                            { value: '3', label: '3' },
                            { value: '5', label: '5' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">CPU</label>
                        <Select
                          value={formData.compute.cpu}
                          onChange={(v) => updateFormData({ compute: { ...formData.compute, cpu: v } })}
                          options={[
                            { value: '0.25', label: '0.25 vCPU' },
                            { value: '0.5', label: '0.5 vCPU' },
                            { value: '1', label: '1 vCPU' },
                            { value: '2', label: '2 vCPU' },
                          ]}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500">Memory</label>
                        <Select
                          value={formData.compute.memory}
                          onChange={(v) => updateFormData({ compute: { ...formData.compute, memory: v } })}
                          options={[
                            { value: '256Mi', label: '256 MB' },
                            { value: '512Mi', label: '512 MB' },
                            { value: '1Gi', label: '1 GB' },
                            { value: '2Gi', label: '2 GB' },
                          ]}
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Database</label>
                    <Select
                      value={formData.database.type}
                      onChange={(v) => updateFormData({ database: { ...formData.database, type: v as FormData['database']['type'] } })}
                      options={[
                        { value: 'none', label: 'None' },
                        { value: 'postgres', label: 'PostgreSQL' },
                        { value: 'mysql', label: 'MySQL' },
                        { value: 'mongodb', label: 'MongoDB' },
                        { value: 'dynamodb', label: 'DynamoDB' },
                      ]}
                    />
                  </div>
                  <div>
                    <label className="label">Cache</label>
                    <Select
                      value={formData.cache.type}
                      onChange={(v) => updateFormData({ cache: { ...formData.cache, type: v as FormData['cache']['type'] } })}
                      options={[
                        { value: 'none', label: 'None' },
                        { value: 'redis', label: 'Redis' },
                        { value: 'memcached', label: 'Memcached' },
                      ]}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.monitoring}
                      onChange={(e) => updateFormData({ monitoring: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-700">Enable Monitoring</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.cdn}
                      onChange={(e) => updateFormData({ cdn: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-700">Enable CDN</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500">Application Name</p>
                    <p className="font-medium text-slate-900">{formData.displayName}</p>
                    <p className="text-sm text-slate-500">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Type</p>
                    <p className="font-medium text-slate-900 capitalize">{formData.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Team</p>
                    <p className="font-medium text-slate-900">
                      {teams.find((t) => t.id === formData.team)?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Tier</p>
                    <Badge className={tierOptions.find((t) => t.value === formData.tier)?.color}>
                      {formData.tier.replace('tier-', 'Tier ')}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Language</p>
                    <p className="font-medium text-slate-900 capitalize">{formData.language}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Environments</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.environments.map((env) => (
                        <Badge key={env} variant="neutral" size="sm" className="capitalize">
                          {env}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-500 mb-2">Infrastructure</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="info">{formData.compute.type}</Badge>
                    <Badge variant="info">{formData.compute.replicas} replicas</Badge>
                    <Badge variant="info">{formData.compute.cpu} CPU</Badge>
                    <Badge variant="info">{formData.compute.memory} RAM</Badge>
                    {formData.database.type !== 'none' && (
                      <Badge variant="info">{formData.database.type}</Badge>
                    )}
                    {formData.cache.type !== 'none' && (
                      <Badge variant="info">{formData.cache.type}</Badge>
                    )}
                    {formData.monitoring && <Badge variant="success">Monitoring</Badge>}
                    {formData.cdn && <Badge variant="success">CDN</Badge>}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep((s) => s - 1)}
                disabled={currentStep === 1}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Previous
              </Button>
              {currentStep < 4 ? (
                <Button
                  variant="primary"
                  onClick={() => setCurrentStep((s) => s + 1)}
                  disabled={!canProceed()}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  leftIcon={<Rocket className="w-4 h-4" />}
                >
                  Create Application
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Cost Estimation */}
        <div>
          <Card padding="lg" className="sticky top-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Cost Estimate</p>
                <p className="text-sm text-slate-500">Monthly projection</p>
              </div>
            </div>
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-slate-900">
                {formatCurrency(estimatedCost())}
              </p>
              <p className="text-sm text-slate-500">per month</p>
            </div>
            <div className="space-y-2 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Compute</span>
                <span className="text-slate-900">{formatCurrency(formData.compute.replicas * 50)}</span>
              </div>
              {formData.database.type !== 'none' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Database</span>
                  <span className="text-slate-900">{formatCurrency(50)}</span>
                </div>
              )}
              {formData.cache.type !== 'none' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Cache</span>
                  <span className="text-slate-900">{formatCurrency(25)}</span>
                </div>
              )}
              {formData.monitoring && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Monitoring</span>
                  <span className="text-slate-900">{formatCurrency(20)}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-4">
              * Estimates are approximate. Actual costs may vary based on usage.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
