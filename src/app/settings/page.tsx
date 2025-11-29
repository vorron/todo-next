import SettingsPage from '@/screens/settings/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Settings',
    description: 'Customize your Todo App experience',
};

export default function Page() {
    return <SettingsPage />;
}
