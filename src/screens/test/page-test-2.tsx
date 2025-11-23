"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/ui";
import { createTodoSchema } from "@/entities/todo";
import { z } from "zod";
import "@/app/globals.css";

export default function TestValidationPage() {
  const [todoText, setTodoText] = useState("");
  const [error, setError] = useState("");

  const handleValidate = () => {
    try {
      createTodoSchema.parse({
        text: todoText,
        userId: "test-user-id",
        completed: false,
      });
      setError("");
      alert("Valid!");
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>Validation Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Todo Text"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            error={error}
            placeholder="Enter todo text (min 1 char, max 500)"
          />
          <Button onClick={handleValidate}>Validate</Button>
        </CardContent>
      </Card>
    </div>
  );
}
