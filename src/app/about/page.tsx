import AboutPage from '@/screens/about/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About',
    description: 'Learn more about our Todo App',
};

export default function Page() {
    return <AboutPage />;
}
