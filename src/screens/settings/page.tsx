import { SettingsForm } from '@/features/settings/ui/settings-form';

export default function SettingsPage() {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                    <p className="text-gray-600">
                        Customize your Todo App to suit your preferences
                    </p>
                </div>

                <SettingsForm />
            </div>
        </div>
    );
}