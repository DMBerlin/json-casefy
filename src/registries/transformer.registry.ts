import { ICaseTransformer } from '../interfaces';
import { CamelCaseTransformer } from '../transformers/camel-case.transformer';
import { SnakeCaseTransformer } from '../transformers/snake-case.transformer';
import { PascalCaseTransformer } from '../transformers/pascal-case.transformer';
import { KebabCaseTransformer } from '../transformers/kebab-case.transformer';

/**
 * Registry for auto-discovering available transformers
 *
 * This registry follows the Registry Pattern and provides:
 * - Auto-discovery of available transformer classes
 * - Type-safe transformer class retrieval
 * - Centralized transformer metadata management
 *
 * @example
 * ```typescript
 * const availableStyles = TransformerRegistry.getAvailableCaseStyles();
 * const TransformerClass = TransformerRegistry.getTransformerClass('camelCase');
 * ```
 */
export class TransformerRegistry {
  /**
   * Registry of all available transformer classes
   * Maps case style names to their corresponding transformer classes
   */
  private static readonly TRANSFORMER_CLASSES = [
    { caseStyle: 'camelCase', class: CamelCaseTransformer },
    { caseStyle: 'snake_case', class: SnakeCaseTransformer },
    { caseStyle: 'PascalCase', class: PascalCaseTransformer },
    { caseStyle: 'kebab-case', class: KebabCaseTransformer },
  ] as const;

  /**
   * Get all available case styles
   * @returns Array of case style names
   *
   * @example
   * ```typescript
   * const styles = TransformerRegistry.getAvailableCaseStyles();
   * // Returns: ['camelCase', 'snake_case', 'PascalCase', 'kebab-case']
   * ```
   */
  static getAvailableCaseStyles(): string[] {
    return this.TRANSFORMER_CLASSES.map((t) => t.caseStyle);
  }

  /**
   * Get transformer class by case style
   * @param caseStyle - The case style name
   * @returns The transformer class constructor or undefined
   *
   * @example
   * ```typescript
   * const CamelCaseClass = TransformerRegistry.getTransformerClass('camelCase');
   * const instance = new CamelCaseClass();
   * ```
   */
  static getTransformerClass(caseStyle: string): (new () => ICaseTransformer) | undefined {
    const transformer = this.TRANSFORMER_CLASSES.find((t) => t.caseStyle === caseStyle);
    return transformer?.class;
  }

  /**
   * Check if a case style is supported by the registry
   * @param caseStyle - The case style name
   * @returns True if the case style is supported
   *
   * @example
   * ```typescript
   * const isSupported = TransformerRegistry.isSupported('camelCase');
   * // Returns: true
   * ```
   */
  static isSupported(caseStyle: string): boolean {
    return this.TRANSFORMER_CLASSES.some((t) => t.caseStyle === caseStyle);
  }

  /**
   * Get transformer metadata
   * @param caseStyle - The case style name
   * @returns Transformer metadata or undefined
   *
   * @example
   * ```typescript
   * const metadata = TransformerRegistry.getTransformerMetadata('camelCase');
   * // Returns: { caseStyle: 'camelCase', class: CamelCaseTransformer }
   * ```
   */
  static getTransformerMetadata(
    caseStyle: string,
  ): { caseStyle: string; class: new () => ICaseTransformer } | undefined {
    return this.TRANSFORMER_CLASSES.find((t) => t.caseStyle === caseStyle);
  }

  /**
   * Get all transformer metadata
   * @returns Array of all transformer metadata
   *
   * @example
   * ```typescript
   * const allMetadata = TransformerRegistry.getAllTransformerMetadata();
   * // Returns: Array of { caseStyle, class } objects
   * ```
   */
  static getAllTransformerMetadata(): Array<{
    caseStyle: string;
    class: new () => ICaseTransformer;
  }> {
    return [...this.TRANSFORMER_CLASSES];
  }

  /**
   * Get registry statistics
   * @returns Registry statistics object
   *
   * @example
   * ```typescript
   * const stats = TransformerRegistry.getStats();
   * // Returns: { totalTransformers: 4, supportedStyles: [...] }
   * ```
   */
  static getStats(): {
    totalTransformers: number;
    supportedStyles: string[];
  } {
    return {
      totalTransformers: this.TRANSFORMER_CLASSES.length,
      supportedStyles: this.getAvailableCaseStyles(),
    };
  }
}
