import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { formatZodError } from './zod-utils';

describe('formatZodError', () => {
  it('maps issues to a flat field->message record', () => {
    const schema = z.object({
      username: z.string().min(3, 'too short'),
      age: z.number().min(18, 'too young'),
    });

    let error: z.ZodError | null = null;
    try {
      schema.parse({ username: 'ab', age: 1 });
    } catch (e) {
      error = e as z.ZodError;
    }

    expect(error).not.toBeNull();
    const formatted = formatZodError(error as z.ZodError);

    expect(formatted.username).toBe('too short');
    expect(formatted.age).toBe('too young');
  });

  it('uses _form key when path is empty', () => {
    const schema = z.string().min(5, 'invalid');

    let error: z.ZodError | null = null;
    try {
      schema.parse('a');
    } catch (e) {
      error = e as z.ZodError;
    }

    expect(error).not.toBeNull();
    const formatted = formatZodError(error as z.ZodError);
    expect(formatted._form).toBe('invalid');
  });
});
