// app/about/page.tsx
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">About This App</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-lg text-gray-700 mb-4">
            This is a modern Todo application built with Next.js 16, demonstrating 
            contemporary React development practices and architectural patterns.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            Technologies & Features
          </h2>
          
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Next.js 16 with App Router</li>
            <li>TypeScript for type safety</li>
            <li>Redux Toolkit (RTK) Query for data fetching</li>
            <li>Modular API architecture</li>
            <li>JSON Server for mock backend</li>
            <li>Responsive design with Tailwind CSS</li>
            <li>Multi-user todo management</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
            Best Practices Demonstrated
          </h2>
          
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Feature-based folder structure</li>
            <li>Proper separation of concerns</li>
            <li>Type-safe API endpoints</li>
            <li>Efficient state management</li>
            <li>Error handling and loading states</li>
            <li>Component reusability</li>
          </ul>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              This application serves as a learning resource for modern React development 
              patterns and scalable application architecture.
            </p>
          </div>

          <div className="mt-8 flex space-x-4">
            <Link
              href="/"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/profile"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}