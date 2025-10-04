import { BaseCaseTransformer } from '../abstracts';

/**
 * kebab-case transformer implementation
 * Converts strings to kebab-case format
 */
export class KebabCaseTransformer extends BaseCaseTransformer {
  constructor() {
    super('kebab-case', 'Converts strings to kebab-case format (e.g., first-name)');
  }

  transform(input: string): string {
    if (!this.isValidInput(input)) return input;
    if (input.length === 0) return input;

    // Handle special cases
    if (input === '_') return '-';
    if (input === '-') return '-';
    if (input === ' ') return '-';

    const result = input
      .replace(/([A-Z])/g, '-$1')
      .replace(/[-_\s]+/g, '-')
      .replace(/^-/, '')
      .toLowerCase();

    return result;
  }

  detect(input: string): boolean {
    if (!this.isValidInput(input)) return false;

    // kebab-case: lowercase with hyphens, no consecutive hyphens
    return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(input);
  }
}
