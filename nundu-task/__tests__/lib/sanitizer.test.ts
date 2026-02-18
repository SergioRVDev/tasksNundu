import { escapeHtml, sanitizeString, sanitizeObject, isValidEmail, isValidDate } from '@/lib/sanitizer';

describe('Sanitizer', () => {
  describe('escapeHtml', () => {
    it('escapes HTML entities', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    });

    it('escapes quotes', () => {
      expect(escapeHtml('"test"')).toBe('&quot;test&quot;');
    });

    it('escapes ampersands', () => {
      expect(escapeHtml('test & test')).toBe('test &amp; test');
    });

    it('handles single quotes', () => {
      expect(escapeHtml("'test'")).toBe('&#x27;test&#x27;');
    });

    it('returns safe strings unchanged', () => {
      expect(escapeHtml('hello world')).toBe('hello world');
    });
  });

  describe('sanitizeString', () => {
    it('escapes malicious content', () => {
      const result = sanitizeString('<img src=x onerror="alert(1)">');
      expect(result).not.toContain('<img');
      // The content is escaped so 'onerror' still appears but as part of escaped entity
      expect(result).toContain('onerror');
      expect(result).toContain('&quot;');
    });

    it('trims whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('returns null for strings exceeding max length', () => {
      const result = sanitizeString('a'.repeat(100), 50);
      expect(result).toBeNull();
    });

    it('returns escaped string for valid input', () => {
      expect(sanitizeString('Test String')).toBe('Test String');
    });

    it('returns null for empty strings', () => {
      expect(sanitizeString('')).toBeNull();
      expect(sanitizeString('   ')).toBeNull();
    });
  });

  describe('sanitizeObject', () => {
    it('validates string fields', () => {
      const result = sanitizeObject(
        { name: 'John' },
        { name: { type: 'string' } }
      );

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('John');
    });

    it('rejects empty string fields', () => {
      const result = sanitizeObject(
        { name: '' },
        { name: { type: 'string' } }
      );

      expect(result.success).toBe(false);
      expect(result.errors?.name).toBeDefined();
    });

    it('enforces max length', () => {
      const result = sanitizeObject(
        { name: 'a'.repeat(100) },
        { name: { type: 'string', maxLength: 50 } }
      );

      expect(result.success).toBe(false);
      expect(result.errors?.name).toBeDefined();
    });

    it('validates email format', () => {
      const validResult = sanitizeObject(
        { email: 'test@example.com' },
        { email: { type: 'email' } }
      );

      expect(validResult.success).toBe(true);

      const invalidResult = sanitizeObject(
        { email: 'invalid-email' },
        { email: { type: 'email' } }
      );

      expect(invalidResult.success).toBe(false);
    });

    it('accepts valid multiple fields', () => {
      const result = sanitizeObject(
        { name: 'John', email: 'john@example.com', description: 'Developer' },
        {
          name: { type: 'string', maxLength: 100 },
          email: { type: 'email' },
          description: { type: 'string', maxLength: 500 }
        }
      );

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('John');
      expect(result.data?.email).toBe('john@example.com');
    });
  });

  describe('isValidEmail', () => {
    it('validates correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.co.uk')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });

    it('handles edge cases', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('test @example.com')).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('validates ISO date format', () => {
      expect(isValidDate('2026-02-18')).toBe(true);
      expect(isValidDate('2025-12-31')).toBe(true);
    });

    it('accepts various date formats that new Date() can parse', () => {
      // JavaScript Date constructor is lenient and accepts many formats
      expect(isValidDate('02-18-2026')).toBe(true);
      expect(isValidDate('2026/02/18')).toBe(true);
    });

    it('rejects clearly invalid dates', () => {
      expect(isValidDate('invalid')).toBe(false);
      expect(isValidDate('not a date')).toBe(false);
    });

    it('validates basic date operations', () => {
      expect(isValidDate('2026-02-18')).toBe(true);
      expect(typeof isValidDate('2026-02-18')).toBe('boolean');
    });
  });
});
