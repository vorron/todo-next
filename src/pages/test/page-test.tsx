"use client";

import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Spinner,
} from "@/shared/ui";
import { useState } from "react";

export function TestPage() {
  const [value, setValue] = useState("");

  return (
    <div className="container mx-auto p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>UI Components Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-x-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            <Button isLoading>Loading</Button>
          </div>

          <Input
            label="Test Input"
            placeholder="Enter text..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <Input
            label="Error Input"
            error="This field is required"
            placeholder="Has error"
          />

          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </CardContent>
      </Card>
    </div>
  );
}
