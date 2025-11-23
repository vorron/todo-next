export function LoginPageSkeleton() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
                    <p className="mt-2 text-gray-600">Sign in to manage your todos</p>
                </div>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
}