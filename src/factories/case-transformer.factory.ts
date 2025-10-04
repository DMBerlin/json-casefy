import { ICaseTransformer } from '../interfaces';
import { TransformerRegistry } from '../registries';

/**
 * Factory class for creating case transformers using lazy initialization and singleton pattern
 * Follows clean architecture principles:
 * - Lazy initialization (create only when needed)
 * - Auto-registration (no manual initialization)
 * - Singleton pattern (one instance per case style)
 * - Open/Closed principle (easy to extend)
 */
export class CaseTransformerFactory {
  private static instances: Map<string, ICaseTransformer> = new Map();
  private static customTransformers: Map<string, ICaseTransformer> = new Map();

  /**
   * Get a transformer by case style name (lazy initialization)
   * @param caseStyle - The case style name
   * @returns The transformer instance
   * @throws Error if transformer not found
   */
  static getTransformer(caseStyle: string): ICaseTransformer {
    // Check custom transformers first
    if (this.customTransformers.has(caseStyle)) {
      return this.customTransformers.get(caseStyle)!;
    }

    // Check if we already have an instance (singleton)
    if (this.instances.has(caseStyle)) {
      return this.instances.get(caseStyle)!;
    }

    // Lazy initialization - create instance only when needed
    const TransformerClass = TransformerRegistry.getTransformerClass(caseStyle);
    if (!TransformerClass) {
      throw new Error(`Unsupported case style: ${caseStyle}`);
    }

    // Create and cache the instance (singleton pattern)
    const instance = new TransformerClass() as ICaseTransformer;
    this.instances.set(caseStyle, instance);
    return instance;
  }

  /**
   * Register a custom transformer
   * @param caseStyle - The case style name
   * @param transformer - The transformer instance
   */
  static registerTransformer(caseStyle: string, transformer: ICaseTransformer): void {
    this.customTransformers.set(caseStyle, transformer);
  }

  /**
   * Get all available case styles (auto-discovered)
   * @returns Array of case style names
   */
  static getAvailableCaseStyles(): string[] {
    return TransformerRegistry.getAvailableCaseStyles();
  }

  /**
   * Get all transformers (lazy-loaded)
   * @returns Map of case style to transformer
   */
  static getAllTransformers(): Map<string, ICaseTransformer> {
    const allTransformers = new Map<string, ICaseTransformer>();

    // Add custom transformers
    for (const [caseStyle, transformer] of this.customTransformers) {
      allTransformers.set(caseStyle, transformer);
    }

    // Add lazy-loaded instances
    for (const [caseStyle, transformer] of this.instances) {
      allTransformers.set(caseStyle, transformer);
    }

    return allTransformers;
  }

  /**
   * Check if a case style is supported
   * @param caseStyle - The case style name
   * @returns True if supported
   */
  static isSupported(caseStyle: string): boolean {
    return (
      this.customTransformers.has(caseStyle) ||
      TransformerRegistry.getTransformerClass(caseStyle) !== undefined
    );
  }

  /**
   * Auto-detect case style from a string
   * @param input - The input string
   * @returns The detected case style or null
   */
  static detectCaseStyle(input: string): string | null {
    // Check custom transformers first
    for (const [caseStyle, transformer] of this.customTransformers) {
      if (transformer.detect(input)) {
        return caseStyle;
      }
    }

    // Check built-in transformers (lazy-loaded)
    const availableStyles = this.getAvailableCaseStyles();
    for (const caseStyle of availableStyles) {
      if (this.isSupported(caseStyle)) {
        const transformer = this.getTransformer(caseStyle);
        if (transformer.detect(input)) {
          return caseStyle;
        }
      }
    }
    return null;
  }

  /**
   * Get transformer information
   * @param caseStyle - The case style name
   * @returns Transformer information object
   */
  static getTransformerInfo(caseStyle: string): { name: string; description: string } | null {
    if (!this.isSupported(caseStyle)) {
      return null;
    }

    const transformer = this.getTransformer(caseStyle);
    return {
      name: transformer.getCaseStyle(),
      description: transformer.getDescription(),
    };
  }

  /**
   * Clear all registered transformers
   */
  static clear(): void {
    this.instances.clear();
    this.customTransformers.clear();
  }

  /**
   * Reset to default state (clear all instances)
   */
  static reset(): void {
    this.clear();
  }

  /**
   * Get factory statistics
   * @returns Factory statistics object
   */
  static getStats(): {
    totalAvailable: number;
    instancesCreated: number;
    customTransformers: number;
  } {
    return {
      totalAvailable: this.getAvailableCaseStyles().length,
      instancesCreated: this.instances.size,
      customTransformers: this.customTransformers.size,
    };
  }
}
