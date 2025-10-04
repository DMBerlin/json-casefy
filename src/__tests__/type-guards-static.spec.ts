import { TypeGuards } from '../helpers/type-guards.helper';

describe('TypeGuards Static Utility Class', () => {
  describe('Basic Type Guards', () => {
    it('should identify primitive types correctly', () => {
      expect(TypeGuards.isPrimitive('string')).toBe(true);
      expect(TypeGuards.isPrimitive(123)).toBe(true);
      expect(TypeGuards.isPrimitive(true)).toBe(true);
      expect(TypeGuards.isPrimitive(null)).toBe(true);
      expect(TypeGuards.isPrimitive(undefined)).toBe(true);
      expect(TypeGuards.isPrimitive({})).toBe(false);
      expect(TypeGuards.isPrimitive([])).toBe(false);
      expect(TypeGuards.isPrimitive(new Date())).toBe(false);
    });

    it('should identify arrays correctly', () => {
      expect(TypeGuards.isArray([])).toBe(true);
      expect(TypeGuards.isArray([1, 2, 3])).toBe(true);
      expect(TypeGuards.isArray(new Array())).toBe(true);
      expect(TypeGuards.isArray({})).toBe(false);
      expect(TypeGuards.isArray('string')).toBe(false);
      expect(TypeGuards.isArray(null)).toBe(false);
    });

    it('should identify objects correctly', () => {
      expect(TypeGuards.isObject({})).toBe(true);
      expect(TypeGuards.isObject({ key: 'value' })).toBe(true);
      expect(TypeGuards.isObject(new Object())).toBe(true);
      expect(TypeGuards.isObject([])).toBe(false);
      expect(TypeGuards.isObject(null)).toBe(false);
      expect(TypeGuards.isObject(new Date())).toBe(false);
    });

    it('should identify Date objects correctly', () => {
      expect(TypeGuards.isDate(new Date())).toBe(true);
      expect(TypeGuards.isDate(new Date('2023-01-01'))).toBe(true);
      expect(TypeGuards.isDate({})).toBe(false);
      expect(TypeGuards.isDate('2023-01-01')).toBe(false);
      expect(TypeGuards.isDate(null)).toBe(false);
    });

    it('should identify functions correctly', () => {
      expect(TypeGuards.isFunction(() => {})).toBe(true);
      expect(TypeGuards.isFunction(function () {})).toBe(true);
      expect(TypeGuards.isFunction(Array.isArray)).toBe(true);
      expect(TypeGuards.isFunction({})).toBe(false);
      expect(TypeGuards.isFunction('function')).toBe(false);
      expect(TypeGuards.isFunction(null)).toBe(false);
    });
  });

  describe('Extended Type Guards', () => {
    it('should identify null and undefined correctly', () => {
      expect(TypeGuards.isNullOrUndefined(null)).toBe(true);
      expect(TypeGuards.isNullOrUndefined(undefined)).toBe(true);
      expect(TypeGuards.isNullOrUndefined(0)).toBe(false);
      expect(TypeGuards.isNullOrUndefined('')).toBe(false);
      expect(TypeGuards.isNullOrUndefined(false)).toBe(false);
    });

    it('should identify strings correctly', () => {
      expect(TypeGuards.isString('hello')).toBe(true);
      expect(TypeGuards.isString('')).toBe(true);
      expect(TypeGuards.isString('123')).toBe(true);
      expect(TypeGuards.isString(123)).toBe(false);
      expect(TypeGuards.isString(null)).toBe(false);
      expect(TypeGuards.isString(undefined)).toBe(false);
    });

    it('should identify numbers correctly', () => {
      expect(TypeGuards.isNumber(123)).toBe(true);
      expect(TypeGuards.isNumber(0)).toBe(true);
      expect(TypeGuards.isNumber(-123)).toBe(true);
      expect(TypeGuards.isNumber(NaN)).toBe(true);
      expect(TypeGuards.isNumber(Infinity)).toBe(true);
      expect(TypeGuards.isNumber('123')).toBe(false);
      expect(TypeGuards.isNumber(null)).toBe(false);
    });

    it('should identify booleans correctly', () => {
      expect(TypeGuards.isBoolean(true)).toBe(true);
      expect(TypeGuards.isBoolean(false)).toBe(true);
      expect(TypeGuards.isBoolean(1)).toBe(false);
      expect(TypeGuards.isBoolean(0)).toBe(false);
      expect(TypeGuards.isBoolean('true')).toBe(false);
      expect(TypeGuards.isBoolean(null)).toBe(false);
    });
  });

  describe('Advanced Type Guards', () => {
    it('should identify JSON serializable values correctly', () => {
      expect(TypeGuards.isJSONSerializable({})).toBe(true);
      expect(TypeGuards.isJSONSerializable([])).toBe(true);
      expect(TypeGuards.isJSONSerializable('string')).toBe(true);
      expect(TypeGuards.isJSONSerializable(123)).toBe(true);
      expect(TypeGuards.isJSONSerializable(true)).toBe(true);
      expect(TypeGuards.isJSONSerializable(null)).toBe(true);
      expect(TypeGuards.isJSONSerializable(undefined)).toBe(true);
      expect(TypeGuards.isJSONSerializable(new Date())).toBe(true); // Date is JSON serializable
      expect(TypeGuards.isJSONSerializable(() => {})).toBe(true); // Functions serialize to undefined
    });

    it('should get correct type names', () => {
      expect(TypeGuards.getTypeName('hello')).toBe('string');
      expect(TypeGuards.getTypeName(123)).toBe('number');
      expect(TypeGuards.getTypeName(true)).toBe('boolean');
      expect(TypeGuards.getTypeName(null)).toBe('null');
      expect(TypeGuards.getTypeName(undefined)).toBe('undefined');
      expect(TypeGuards.getTypeName([])).toBe('array');
      expect(TypeGuards.getTypeName({})).toBe('object');
      expect(TypeGuards.getTypeName(new Date())).toBe('date');
      expect(TypeGuards.getTypeName(() => {})).toBe('function');
    });
  });

  describe('Edge Cases', () => {
    it('should handle edge cases correctly', () => {
      // Empty values
      expect(TypeGuards.isPrimitive('')).toBe(true);
      expect(TypeGuards.isPrimitive(0)).toBe(true);
      expect(TypeGuards.isPrimitive(false)).toBe(true);

      // Special objects
      expect(TypeGuards.isObject(Object.create(null))).toBe(true);
      expect(TypeGuards.isObject(new String('hello'))).toBe(false); // String object, not plain object

      // Array-like objects
      expect(TypeGuards.isArray({ length: 0 })).toBe(false);
      expect(TypeGuards.isArray('string')).toBe(false);

      // Function edge cases
      expect(TypeGuards.isFunction(class {})).toBe(true); // Classes are functions in JavaScript
      expect(TypeGuards.isFunction(async () => {})).toBe(true);
    });
  });

  describe('Performance and Consistency', () => {
    it('should be consistent with multiple calls', () => {
      const testValue = { key: 'value' };

      expect(TypeGuards.isObject(testValue)).toBe(true);
      expect(TypeGuards.isObject(testValue)).toBe(true);
      expect(TypeGuards.isPrimitive(testValue)).toBe(false);
      expect(TypeGuards.isPrimitive(testValue)).toBe(false);
    });

    it('should handle large objects efficiently', () => {
      const largeObject: Record<string, string> = {};
      for (let i = 0; i < 1000; i++) {
        largeObject[`key${i}`] = `value${i}`;
      }

      expect(TypeGuards.isObject(largeObject)).toBe(true);
      expect(TypeGuards.isArray(largeObject)).toBe(false);
    });
  });
});
