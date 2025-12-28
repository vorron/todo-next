'use client';

import { Card, CardContent, CardHeader, CardTitle, useHeaderFromTemplate } from '@/shared/ui';

export function AboutPage() {
  useHeaderFromTemplate(undefined, 'about');

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Todo App</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A modern, production-ready todo application built with Next.js 16 and best practices.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              Modern Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Built with Next.js 15, TypeScript, Tailwind CSS, and Redux Toolkit for optimal
              performance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Feature-Sliced Design architecture, proper error handling, and responsive design.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              Production Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Includes testing, error boundaries, loading states, and accessibility features.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
              Real-time synchronization
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
              Priority levels
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
              Due dates & reminders
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
              Tag system
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
              Search & filtering
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-blue-500 rounded-full"></div>
              Responsive design
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
