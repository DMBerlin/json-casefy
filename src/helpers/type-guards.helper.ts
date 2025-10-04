/**
 * Static utility class for type checking and validation
 * Provides type guards and utility methods for data type detection
 */
export class TypeGuards {
  /**
   * Type guard to check if a value is a primitive type
   * @param value - The value to check
   * @returns True if the value is a primitive type
   */
  static isPrimitive(value: any): value is string | number | boolean | null | undefined {
    return (
      value === null ||
      value === undefined ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    );
  }

  /**
   * Type guard to check if a value is an array
   * @param value - The value to check
   * @returns True if the value is an array
   */
  static isArray(value: any): value is any[] {
    return Array.isArray(value);
  }

  /**
   * Type guard to check if a value is a plain object
   * @param value - The value to check
   * @returns True if the value is a plain object
   */
  static isObject(value: any): value is Record<string, any> {
    return (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.prototype.toString.call(value) === '[object Object]'
    );
  }

  /**
   * Type guard to check if a value is a Date object
   * @param value - The value to check
   * @returns True if the value is a Date
   */
  static isDate(value: any): value is Date {
    return value instanceof Date;
  }

  /**
   * Type guard to check if a value is a function
   * @param value - The value to check
   * @returns True if the value is a function
   */
  static isFunction(value: any): value is (...args: any[]) => any {
    return typeof value === 'function';
  }

  /**
   * Check if a value is null or undefined
   * @param value - The value to check
   * @returns True if the value is null or undefined
   */
  static isNullOrUndefined(value: any): value is null | undefined {
    return value === null || value === undefined;
  }

  /**
   * Check if a value is a string (including empty string)
   * @param value - The value to check
   * @returns True if the value is a string
   */
  static isString(value: any): value is string {
    return typeof value === 'string';
  }

  /**
   * Check if a value is a number (including NaN and Infinity)
   * @param value - The value to check
   * @returns True if the value is a number
   */
  static isNumber(value: any): value is number {
    return typeof value === 'number';
  }

  /**
   * Check if a value is a boolean
   * @param value - The value to check
   * @returns True if the value is a boolean
   */
  static isBoolean(value: any): value is boolean {
    return typeof value === 'boolean';
  }

  /**
   * Check if a value is a valid JSON-serializable value
   * @param value - The value to check
   * @returns True if the value can be JSON serialized
   */
  static isJSONSerializable(value: any): boolean {
    try {
      JSON.stringify(value);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the type name of a value as a string
   * @param value - The value to check
   * @returns The type name (e.g., 'string', 'number', 'object', etc.)
   */
  static getTypeName(value: any): string {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (this.isArray(value)) return 'array';
    if (this.isDate(value)) return 'date';
    if (this.isFunction(value)) return 'function';
    return typeof value;
  }
}
