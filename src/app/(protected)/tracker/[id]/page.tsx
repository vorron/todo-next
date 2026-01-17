import { WorkspaceDashboardPage } from '@/screens/workspace';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <WorkspaceDashboardPage params={{ id }} />;
}
