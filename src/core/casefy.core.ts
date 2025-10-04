import { CasefyOptions, CasefyResult } from '../types/case.types';
import { CasefyService } from '../services';

/**
 * Main casefy function - now uses OOP approach internally
 *
 * @param input - The input object to transform
 * @param options - Configuration options for the transformation
 * @returns CasefyResult with transformed data and metadata
 *
 * @example
 * ```typescript
 * const result = casefy(input, {
 *   from: 'snake_case',
 *   to: 'camelCase',
 *   deep: true,
 *   arrays: true
 * });
 * ```
 */
export function casefy<T = any>(input: T, options: CasefyOptions): CasefyResult<T> {
  // Validate options
  if (!options.from || !options.to) {
    throw new Error('Both "from" and "to" case styles must be specified');
  }

  try {
    const serviceOptions: any = {
      preserveTypes: options.preserveTypes ?? true,
      arrays: options.arrays ?? true,
      deep: options.deep ?? true,
    };

    if (options.fieldMappings) {
      serviceOptions.fieldMappings = options.fieldMappings;
    }
    if (options.excludeFields) {
      serviceOptions.excludeFields = options.excludeFields;
    }
    if (options.includeFields) {
      serviceOptions.includeFields = options.includeFields;
    }

    const service = new CasefyService(options.from, options.to, serviceOptions);

    const result = service.transform(input);

    return {
      data: result.data,
      transformedKeys: result.transformedKeys,
      from: options.from,
      to: options.to,
      deep: options.deep ?? true,
      arrays: options.arrays ?? true,
    };
  } catch (error) {
    // Re-throw validation errors, but handle other errors gracefully
    if (error instanceof Error && error.message.includes('Unsupported')) {
      throw error;
    }

    return {
      data: input,
      transformedKeys: 0,
      from: options.from,
      to: options.to,
      deep: options.deep ?? true,
      arrays: options.arrays ?? true,
    };
  }
}
