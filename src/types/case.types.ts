/**
 * Supported case styles for JSON key transformation
 */
export type CaseStyle = 'snake_case' | 'camelCase' | 'PascalCase' | 'kebab-case';

/**
 * Configuration options for case transformation
 */
export interface CasefyOptions {
  /** Source case style to convert from */
  from: CaseStyle;
  /** Target case style to convert to */
  to: CaseStyle;
  /** Whether to transform nested objects (default: true) */
  deep?: boolean;
  /** Whether to transform array elements (default: true) */
  arrays?: boolean;
  /** Whether to preserve primitive value types (default: true) */
  preserveTypes?: boolean;
  /** Custom field mappings for specific transformations */
  fieldMappings?: Record<string, string>;
  /** Fields to exclude from transformation */
  excludeFields?: string[];
  /** Fields to include only (if specified, only these fields will be transformed) */
  includeFields?: string[];
}

/**
 * Result of case transformation operation
 */
export interface CasefyResult<T = any> {
  /** The transformed object */
  data: T;
  /** Number of keys transformed */
  transformedKeys: number;
  /** Original case style */
  from: CaseStyle;
  /** Target case style */
  to: CaseStyle;
  /** Whether deep transformation was applied */
  deep: boolean;
  /** Whether array transformation was applied */
  arrays: boolean;
}

/**
 * Internal transformer function type
 */
export type CaseTransformer = (input: string) => string;

/**
 * Strategy pattern interface for case transformers
 */
export interface CaseStrategy {
  /** Transform a string to this case style */
  transform: CaseTransformer;
  /** Detect if a string matches this case style */
  detect: (input: string) => boolean;
  /** Name of the case style */
  name: CaseStyle;
}
