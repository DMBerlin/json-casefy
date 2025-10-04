import {
  ICaseTransformer,
  ICaseTransformOptions,
  ICaseTransformResult,
  ICaseTransformContext,
} from '../interfaces';
import { CaseTransformerFactory } from '../factories';
import { TypeGuards } from '../helpers';

/**
 * OOP-based Casefy service for JSON case transformation
 */
export class CasefyService {
  private fromTransformer: ICaseTransformer;
  private toTransformer: ICaseTransformer;
  private options: ICaseTransformOptions;
  private enableLogging: boolean = false;

  constructor(fromCase: string, toCase: string, options: ICaseTransformOptions = {}) {
    // Validate case styles before creating transformers
    if (!CaseTransformerFactory.isSupported(fromCase)) {
      throw new Error(`Unsupported source case style: ${fromCase}`);
    }
    if (!CaseTransformerFactory.isSupported(toCase)) {
      throw new Error(`Unsupported target case style: ${toCase}`);
    }

    this.fromTransformer = CaseTransformerFactory.getTransformer(fromCase);
    this.toTransformer = CaseTransformerFactory.getTransformer(toCase);
    this.options = {
      preserveTypes: true,
      arrays: true,
      deep: true,
      ...options,
    };
  }

  /**
   * Enable or disable transformation logging
   * @param enabled - Whether to enable logging
   */
  setLogging(enabled: boolean): void {
    this.enableLogging = enabled;
  }

  /**
   * Transform the input data
   * @param input - The input data to transform
   * @returns The transformation result
   */
  transform(input: any): ICaseTransformResult {
    try {
      const result = this.dfsTransform(input, '', 0);

      return {
        data: result.data,
        transformedKeys: result.transformedKeys,
        fromCase: this.fromTransformer.getCaseStyle(),
        toCase: this.toTransformer.getCaseStyle(),
        success: true,
      };
    } catch (error) {
      return {
        data: input,
        transformedKeys: 0,
        fromCase: this.fromTransformer.getCaseStyle(),
        toCase: this.toTransformer.getCaseStyle(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Depth-first search transformation
   * @param input - The input data
   * @param path - The current path
   * @param depth - The current depth
   * @returns The transformation result
   */
  private dfsTransform(
    input: any,
    path: string,
    depth: number,
  ): { data: any; transformedKeys: number } {
    // Handle null/undefined
    if (input === null || input === undefined) {
      if (this.options.preserveTypes === false) {
        return { data: String(input), transformedKeys: 0 };
      }
      return { data: input, transformedKeys: 0 };
    }

    // Handle primitives
    if (TypeGuards.isPrimitive(input)) {
      if (this.options.preserveTypes === false) {
        return { data: String(input), transformedKeys: 0 };
      }
      return { data: input, transformedKeys: 0 };
    }

    // Handle arrays
    if (TypeGuards.isArray(input)) {
      if (!this.options.arrays) {
        return { data: input, transformedKeys: 0 };
      }

      let totalTransformedKeys = 0;
      const transformedArray = input.map((item: any, index: number) => {
        const itemPath = `${path}[${index}]`;
        const result = this.dfsTransform(item, itemPath, depth + 1);
        totalTransformedKeys += result.transformedKeys;
        return result.data;
      });

      return { data: transformedArray, transformedKeys: totalTransformedKeys };
    }

    // Handle objects
    if (TypeGuards.isObject(input)) {
      const transformedObject: any = {};
      let transformedKeys = 0;

      for (const [key, value] of Object.entries(input)) {
        const context: ICaseTransformContext = {
          path: path ? `${path}.${key}` : key,
          depth,
          parent: input,
          key,
          enableLogging: this.enableLogging,
        } as any;

        // Check if field should be excluded
        if (this.shouldExcludeField(key, context)) {
          transformedObject[key] = value;
          continue;
        }

        // Check if field should be included (whitelist mode)
        if (this.options.includeFields && !this.shouldIncludeField(key, context)) {
          transformedObject[key] = value;
          continue;
        }

        // Apply field mapping if specified
        const mappedKey = this.getMappedField(key);

        // Only transform keys that match the source case style or are explicitly mapped
        let finalKey = key;
        if (mappedKey) {
          finalKey = mappedKey;
        } else if (this.fromTransformer.detect(key)) {
          finalKey = this.toTransformer.transformWithContext(key, context);
        }

        // Transform the value (only if deep is enabled or it's not an object)
        if (this.options.deep || !TypeGuards.isObject(value)) {
          const valueResult = this.dfsTransform(value, context.path, depth + 1);
          transformedObject[finalKey] = valueResult.data;
          transformedKeys += valueResult.transformedKeys;
        } else {
          transformedObject[finalKey] = value;
        }

        // Count this key transformation
        if (finalKey !== key) {
          transformedKeys++;
        }
      }

      return { data: transformedObject, transformedKeys };
    }

    // Handle other types (Date, Function, etc.)
    return { data: input, transformedKeys: 0 };
  }

  /**
   * Check if a field should be excluded
   * @param key - The field key
   * @param context - The transformation context
   * @returns True if the field should be excluded
   */
  private shouldExcludeField(key: string, _context: ICaseTransformContext): boolean {
    if (!this.options.excludeFields) return false;

    return this.options.excludeFields.some((field) => {
      // Simple field name matching (current behavior)
      return field === key;
    });
  }

  /**
   * Check if a field should be included (whitelist mode)
   * @param key - The field key
   * @param context - The transformation context
   * @returns True if the field should be included
   */
  private shouldIncludeField(key: string, _context: ICaseTransformContext): boolean {
    if (!this.options.includeFields) return true;

    return this.options.includeFields.some((field) => {
      // Simple field name matching (current behavior)
      return field === key;
    });
  }

  /**
   * Get mapped field name if specified
   * @param key - The original field key
   * @returns The mapped field name or null
   */
  private getMappedField(key: string): string | null {
    if (!this.options.fieldMappings) return null;
    return this.options.fieldMappings[key] || null;
  }

  /**
   * Get transformation statistics
   * @returns Statistics about the transformation
   */
  getStats(): {
    fromCase: string;
    toCase: string;
    options: ICaseTransformOptions;
    availableTransformers: string[];
  } {
    return {
      fromCase: this.fromTransformer.getCaseStyle(),
      toCase: this.toTransformer.getCaseStyle(),
      options: this.options,
      availableTransformers: CaseTransformerFactory.getAvailableCaseStyles(),
    };
  }
}
