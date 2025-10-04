import { BaseCaseTransformer } from '../abstracts';

/**
 * camelCase transformer implementation
 * Converts strings to camelCase format
 */
export class CamelCaseTransformer extends BaseCaseTransformer {
  constructor() {
    super('camelCase', 'Converts strings to camelCase format (e.g., firstName)');
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
      .replace(/^([A-Z])/, (_, letter) => letter.toLowerCase())
      .replace(/^[-_\s]+/, ''); // Remove leading separators

    return result;
  }

  detect(input: string): boolean {
    if (!this.isValidInput(input)) return false;

    // camelCase: starts with lowercase, contains no separators, has mixed case
    return /^[a-z][a-zA-Z0-9]*$/.test(input) && /[A-Z]/.test(input);
  }
}
