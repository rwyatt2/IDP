import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/shell';
import {
  Dashboard,
  Extensions,
  SystemCatalog,
  ApplicationDetail,
  CreateApplication,
  Deployments,
  Incidents,
  Costs,
  // Discover pages
  SearchPage,
  Dependencies,
  ApiDocs,
  TeamDetail,
  // Build pages
  ConfigureServices,
  Pipelines,
  Infrastructure,
  // Deploy pages
  Releases,
  DeploymentDetail,
  DeploymentHistory,
  Environments,
  ChangeGates,
  // Manage pages
  Observability,
  IncidentDetail,
  Analytics,
  // Other pages
  ExtensionDetail,
  Profile,
  Settings,
  Help,
} from '@/pages';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Discover Phase */}
          <Route path="discover">
            <Route index element={<Navigate to="catalog" replace />} />
            <Route path="catalog" element={<SystemCatalog />} />
            <Route path="catalog/:id" element={<ApplicationDetail />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="dependencies" element={<Dependencies />} />
            <Route path="docs" element={<ApiDocs />} />
            <Route path="teams/:id" element={<TeamDetail />} />
          </Route>

          {/* Build Phase */}
          <Route path="build">
            <Route index element={<Navigate to="create" replace />} />
            <Route path="create" element={<CreateApplication />} />
            <Route path="configure" element={<ConfigureServices />} />
            <Route path="pipelines" element={<Pipelines />} />
            <Route path="infrastructure" element={<Infrastructure />} />
          </Route>

          {/* Deploy Phase */}
          <Route path="deploy">
            <Route index element={<Navigate to="deployments" replace />} />
            <Route path="releases" element={<Releases />} />
            <Route path="deployments" element={<Deployments />} />
            <Route path="deployments/:id" element={<DeploymentDetail />} />
            <Route path="history" element={<DeploymentHistory />} />
            <Route path="environments" element={<Environments />} />
            <Route path="gates" element={<ChangeGates />} />
          </Route>

          {/* Manage Phase */}
          <Route path="manage">
            <Route index element={<Navigate to="observability" replace />} />
            <Route path="observability" element={<Observability />} />
            <Route path="costs" element={<Costs />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="incidents/:id" element={<IncidentDetail />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          {/* Extensions */}
          <Route path="extensions" element={<Extensions />} />
          <Route path="extensions/:id" element={<ExtensionDetail />} />

          {/* User Pages */}
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="help" element={<Help />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
