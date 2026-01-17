import { CreateWorkspaceForm } from '@/features/workspace/ui/create-workspace-form';

/**
 * Tracker onboarding page - server-first
 * Создание первого workspace с возможностью редиректа
 */
export default function OnboardingPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome to Tracker</h1>
          <p className="text-muted-foreground">
            Create your first workspace to start tracking time
          </p>
        </div>

        <CreateWorkspaceForm onSuccess="/tracker" />
      </div>
    </div>
  );
}
