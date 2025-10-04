import { BaseCaseTransformer } from '../abstracts';

/**
 * PascalCase transformer implementation
 * Converts strings to PascalCase format
 */
export class PascalCaseTransformer extends BaseCaseTransformer {
  constructor() {
    super('PascalCase', 'Converts strings to PascalCase format (e.g., FirstName)');
  }

  transform(input: string): string {
    if (!this.isValidInput(input)) return input;
    if (input.length === 0) return input;

    // Handle special cases
    if (input === '_') return '_';
    if (input === '-') return '';
    if (input === ' ') return '';

    const result = input
      .replace(/([-_\s]+)([a-zA-Z0-9])/g, (_, __, char) => char.toUpperCase())
      .replace(/^([a-z])/, (_, letter) => letter.toUpperCase())
      .replace(/^[-_\s]+/, ''); // Remove leading separators

    return result;
  }

  detect(input: string): boolean {
    if (!this.isValidInput(input)) return false;

    // PascalCase: starts with uppercase, contains no separators, has mixed case
    return /^[A-Z][a-zA-Z0-9]*$/.test(input);
  }
}
