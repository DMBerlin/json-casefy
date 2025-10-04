import { BaseCaseTransformer } from '../abstracts';

/**
 * snake_case transformer implementation
 * Converts strings to snake_case format
 */
export class SnakeCaseTransformer extends BaseCaseTransformer {
  constructor() {
    super('snake_case', 'Converts strings to snake_case format (e.g., first_name)');
  }

  transform(input: string): string {
    if (!this.isValidInput(input)) return input;
    if (input.length === 0) return input;

    // Handle special cases
    if (input === '_') return '_';
    if (input === '-') return '_';
    if (input === ' ') return '_';

    const result = input
      .replace(/([A-Z])/g, '_$1')
      .replace(/[-_\s]+/g, '_')
      .replace(/^_/, '')
      .toLowerCase();

    return result;
  }

  detect(input: string): boolean {
    if (!this.isValidInput(input)) return false;

    // snake_case: lowercase with underscores, no consecutive underscores
    return /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/.test(input);
  }
}
