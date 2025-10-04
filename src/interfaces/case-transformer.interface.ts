/**
 * Interface for case transformation strategies
 */
export interface ICaseTransformer {
  /**
   * Transform a string to the target case style
   * @param input - The input string to transform
   * @returns The transformed string
   */
  transform(input: string): string;

  /**
   * Transform a string with context information
   * @param input - The input string to transform
   * @param context - The transformation context
   * @returns The transformed string
   */
  transformWithContext(input: string, context: ICaseTransformContext): string;

  /**
   * Detect if a string matches this case style
   * @param input - The input string to check
   * @returns True if the string matches this case style
   */
  detect(input: string): boolean;

  /**
   * Get the case style name
   * @returns The case style name
   */
  getCaseStyle(): string;

  /**
   * Get the case style description
   * @returns The case style description
   */
  getDescription(): string;
}

/**
 * Interface for case transformation options
 */
export interface ICaseTransformOptions {
  /**
   * Whether to preserve the original types of values
   */
  preserveTypes?: boolean;

  /**
   * Whether to transform arrays
   */
  arrays?: boolean;

  /**
   * Whether to perform deep transformation
   */
  deep?: boolean;

  /**
   * Field mappings for custom field names
   */
  fieldMappings?: Record<string, string>;

  /**
   * Fields to exclude from transformation
   */
  excludeFields?: string[];

  /**
   * Fields to include in transformation (whitelist)
   */
  includeFields?: string[];
}

/**
 * Interface for case transformation result
 */
export interface ICaseTransformResult<T = any> {
  /**
   * The transformed data
   */
  data: T;

  /**
   * Number of keys that were transformed
   */
  transformedKeys: number;

  /**
   * The original case style
   */
  fromCase: string;

  /**
   * The target case style
   */
  toCase: string;

  /**
   * Whether the transformation was successful
   */
  success: boolean;

  /**
   * Any error message if transformation failed
   */
  error?: string;
}

/**
 * Interface for case transformation context
 */
export interface ICaseTransformContext {
  /**
   * The current path in the object being transformed
   */
  path: string;

  /**
   * The current depth in the object hierarchy
   */
  depth: number;

  /**
   * The parent object (if any)
   */
  parent?: any;

  /**
   * The key in the parent object
   */
  key?: string;

  /**
   * Whether this is an array item
   */
  isArrayItem?: boolean;

  /**
   * The array index (if applicable)
   */
  arrayIndex?: number;
}
