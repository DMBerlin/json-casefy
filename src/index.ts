/**
 * @fileoverview JSON Casefy - A powerful TypeScript library for transforming JSON object keys
 * between different case styles using DFS algorithm for optimal performance.
 *
 * This library provides a declarative way to transform object keys between:
 * - camelCase
 * - snake_case
 * - PascalCase
 * - kebab-case
 *
 * Features:
 * - DFS algorithm for O(n) runtime complexity
 * - Deep transformation of nested objects and arrays
 * - Type-safe transformations with full TypeScript support
 * - Zero dependencies
 * - Part of the json-* utilities family
 *
 * @author Daniel Marinho
 * @version 1.0.0
 * @license ISC
 */

import { casefy } from './core/casefy.core';
import { CasefyService } from './services';
import { CaseTransformerFactory } from './factories';

/**
 * The main transformation function exported by the json-casefy library.
 * Uses OOP approach internally for better maintainability and extensibility.
 *
 * @example
 * ```typescript
 * import { Casefy } from 'json-casefy';
 *
 * const input = { user_name: "John", user_age: 30 };
 * const result = Casefy.this(input, {
 *   from: 'snake_case',
 *   to: 'camelCase'
 * });
 * // Result: { userName: "John", userAge: 30 }
 * ```
 */
const Casefy = {
  this: casefy,
};

/**
 * OOP-based Casefy service for advanced usage
 *
 * @example
 * ```typescript
 * import { CasefyService } from 'json-casefy';
 *
 * const service = new CasefyService('snake_case', 'camelCase', {
 *   preserveTypes: true,
 *   arrays: true,
 *   deep: true
 * });
 * const result = service.transform({ user_name: "John", user_age: 30 });
 * // Result: { userName: "John", userAge: 30 }
 * ```
 */
export { CasefyService };

/**
 * Factory for creating and managing case transformers
 *
 * @example
 * ```typescript
 * import { CaseTransformerFactory } from 'json-casefy';
 *
 * const transformer = CaseTransformerFactory.getTransformer('camelCase');
 * const result = transformer.transform('user_name'); // 'userName'
 * ```
 */
export { CaseTransformerFactory };

export { Casefy };

// Export types for TypeScript users
export * from './types';

// Export interfaces for OOP usage
export * from './interfaces';

// Export abstract classes for OOP usage
export * from './abstracts';

// Export transformers for advanced usage
export * from './transformers';

// Export services for OOP usage
export * from './services';

// Export factories for OOP usage
export * from './factories';

// Export helpers for advanced usage
export * from './helpers';

// Export registries for advanced usage
export * from './registries';
