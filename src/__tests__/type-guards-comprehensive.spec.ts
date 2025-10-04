import { TypeGuards } from '../helpers/type-guards.helper';

describe('TypeGuards Comprehensive Coverage', () => {
  describe('isJSONSerializable', () => {
    it('should handle all JSON serializable types', () => {
      expect(TypeGuards.isJSONSerializable(null)).toBe(true);
      expect(TypeGuards.isJSONSerializable(undefined)).toBe(true);
      expect(TypeGuards.isJSONSerializable(true)).toBe(true);
      expect(TypeGuards.isJSONSerializable(false)).toBe(true);
      expect(TypeGuards.isJSONSerializable(0)).toBe(true);
      expect(TypeGuards.isJSONSerializable(123)).toBe(true);
      expect(TypeGuards.isJSONSerializable('hello')).toBe(true);
      expect(TypeGuards.isJSONSerializable('')).toBe(true);
      expect(TypeGuards.isJSONSerializable([])).toBe(true);
      expect(TypeGuards.isJSONSerializable({})).toBe(true);
      expect(TypeGuards.isJSONSerializable({ a: 1 })).toBe(true);
      expect(TypeGuards.isJSONSerializable([1, 2, 3])).toBe(true);
    });

    it('should handle non-JSON serializable types', () => {
      expect(TypeGuards.isJSONSerializable(() => {})).toBe(true); // Functions become undefined in JSON
      expect(TypeGuards.isJSONSerializable(new Date())).toBe(true); // Dates become strings
      expect(TypeGuards.isJSONSerializable(Symbol('test'))).toBe(true); // Symbols become undefined in JSON
      expect(TypeGuards.isJSONSerializable(BigInt(123))).toBe(false);
    });

    it('should handle complex nested structures', () => {
      const complexObject = {
        string: 'hello',
        number: 123,
        boolean: true,
        null: null,
        array: [1, 2, 3],
        object: { nested: true },
        date: new Date(),
        func: () => {},
      };

      expect(TypeGuards.isJSONSerializable(complexObject)).toBe(true);
    });

    it('should handle circular references', () => {
      const circular: any = { a: 1 };
      circular.self = circular;

      expect(TypeGuards.isJSONSerializable(circular)).toBe(false);
    });

    it('should handle objects with non-serializable properties', () => {
      const obj = {
        normal: 'value',
        symbol: Symbol('test'),
        bigint: BigInt(123),
      };

      expect(TypeGuards.isJSONSerializable(obj)).toBe(false);
    });
  });

  describe('getTypeName', () => {
    it('should return correct type names for all types', () => {
      expect(TypeGuards.getTypeName(null)).toBe('null');
      expect(TypeGuards.getTypeName(undefined)).toBe('undefined');
      expect(TypeGuards.getTypeName(true)).toBe('boolean');
      expect(TypeGuards.getTypeName(false)).toBe('boolean');
      expect(TypeGuards.getTypeName(0)).toBe('number');
      expect(TypeGuards.getTypeName(123)).toBe('number');
      expect(TypeGuards.getTypeName(NaN)).toBe('number');
      expect(TypeGuards.getTypeName(Infinity)).toBe('number');
      expect(TypeGuards.getTypeName('hello')).toBe('string');
      expect(TypeGuards.getTypeName('')).toBe('string');
      expect(TypeGuards.getTypeName([])).toBe('array');
      expect(TypeGuards.getTypeName([1, 2, 3])).toBe('array');
      expect(TypeGuards.getTypeName({})).toBe('object');
      expect(TypeGuards.getTypeName({ a: 1 })).toBe('object');
      expect(TypeGuards.getTypeName(new Date())).toBe('date');
      expect(TypeGuards.getTypeName(() => {})).toBe('function');
      expect(TypeGuards.getTypeName(class {})).toBe('function');
      expect(TypeGuards.getTypeName(Symbol('test'))).toBe('symbol');
      expect(TypeGuards.getTypeName(BigInt(123))).toBe('bigint');
    });

    it('should handle edge cases', () => {
      expect(TypeGuards.getTypeName(new RegExp('test'))).toBe('object');
      expect(TypeGuards.getTypeName(new Error('test'))).toBe('object');
      expect(TypeGuards.getTypeName(new Map())).toBe('object');
      expect(TypeGuards.getTypeName(new Set())).toBe('object');
    });
  });

  describe('Extended Type Guards', () => {
    it('should handle all isNullOrUndefined cases', () => {
      expect(TypeGuards.isNullOrUndefined(null)).toBe(true);
      expect(TypeGuards.isNullOrUndefined(undefined)).toBe(true);
      expect(TypeGuards.isNullOrUndefined(0)).toBe(false);
      expect(TypeGuards.isNullOrUndefined('')).toBe(false);
      expect(TypeGuards.isNullOrUndefined(false)).toBe(false);
      expect(TypeGuards.isNullOrUndefined({})).toBe(false);
      expect(TypeGuards.isNullOrUndefined([])).toBe(false);
    });

    it('should handle all isString cases', () => {
      expect(TypeGuards.isString('hello')).toBe(true);
      expect(TypeGuards.isString('')).toBe(true);
      expect(TypeGuards.isString('123')).toBe(true);
      expect(TypeGuards.isString(123)).toBe(false);
      expect(TypeGuards.isString(null)).toBe(false);
      expect(TypeGuards.isString(undefined)).toBe(false);
      expect(TypeGuards.isString({})).toBe(false);
      expect(TypeGuards.isString([])).toBe(false);
    });

    it('should handle all isNumber cases', () => {
      expect(TypeGuards.isNumber(123)).toBe(true);
      expect(TypeGuards.isNumber(0)).toBe(true);
      expect(TypeGuards.isNumber(-123)).toBe(true);
      expect(TypeGuards.isNumber(123.45)).toBe(true);
      expect(TypeGuards.isNumber(NaN)).toBe(true);
      expect(TypeGuards.isNumber(Infinity)).toBe(true);
      expect(TypeGuards.isNumber('123')).toBe(false);
      expect(TypeGuards.isNumber(null)).toBe(false);
      expect(TypeGuards.isNumber(undefined)).toBe(false);
      expect(TypeGuards.isNumber({})).toBe(false);
      expect(TypeGuards.isNumber([])).toBe(false);
    });

    it('should handle all isBoolean cases', () => {
      expect(TypeGuards.isBoolean(true)).toBe(true);
      expect(TypeGuards.isBoolean(false)).toBe(true);
      expect(TypeGuards.isBoolean(1)).toBe(false);
      expect(TypeGuards.isBoolean(0)).toBe(false);
      expect(TypeGuards.isBoolean('true')).toBe(false);
      expect(TypeGuards.isBoolean('false')).toBe(false);
      expect(TypeGuards.isBoolean(null)).toBe(false);
      expect(TypeGuards.isBoolean(undefined)).toBe(false);
      expect(TypeGuards.isBoolean({})).toBe(false);
      expect(TypeGuards.isBoolean([])).toBe(false);
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large objects efficiently', () => {
      const largeObject: Record<string, any> = {};
      for (let i = 0; i < 1000; i++) {
        largeObject[`key${i}`] = `value${i}`;
      }

      expect(TypeGuards.isObject(largeObject)).toBe(true);
      expect(TypeGuards.isJSONSerializable(largeObject)).toBe(true);
    });

    it('should handle deeply nested objects', () => {
      let nested: any = { level: 0 };
      for (let i = 1; i < 100; i++) {
        nested = { level: i, nested };
      }

      expect(TypeGuards.isObject(nested)).toBe(true);
      expect(TypeGuards.isJSONSerializable(nested)).toBe(true); // JSON.stringify handles deep nesting
    });

    it('should handle arrays with mixed types', () => {
      const mixedArray = [
        'string',
        123,
        true,
        null,
        undefined,
        {},
        [],
        new Date(),
        () => {},
        Symbol('test'),
      ];

      expect(TypeGuards.isArray(mixedArray)).toBe(true);
      expect(TypeGuards.isJSONSerializable(mixedArray)).toBe(true);
    });
  });

  describe('Consistency Tests', () => {
    it('should be consistent across multiple calls', () => {
      const testValues = [
        null,
        undefined,
        true,
        false,
        0,
        123,
        'hello',
        '',
        [],
        [1, 2, 3],
        {},
        { a: 1 },
        new Date(),
        () => {},
        Symbol('test'),
        BigInt(123),
      ];

      testValues.forEach((value) => {
        const result1 = TypeGuards.isPrimitive(value);
        const result2 = TypeGuards.isPrimitive(value);
        expect(result1).toBe(result2);
      });
    });

    it('should handle all combinations of type guards', () => {
      const testValue = 'hello';

      expect(TypeGuards.isPrimitive(testValue)).toBe(true);
      expect(TypeGuards.isString(testValue)).toBe(true);
      expect(TypeGuards.isArray(testValue)).toBe(false);
      expect(TypeGuards.isObject(testValue)).toBe(false);
      expect(TypeGuards.isDate(testValue)).toBe(false);
      expect(TypeGuards.isFunction(testValue)).toBe(false);
      expect(TypeGuards.isNullOrUndefined(testValue)).toBe(false);
      expect(TypeGuards.isNumber(testValue)).toBe(false);
      expect(TypeGuards.isBoolean(testValue)).toBe(false);
      expect(TypeGuards.isJSONSerializable(testValue)).toBe(true);
      expect(TypeGuards.getTypeName(testValue)).toBe('string');
    });
  });
});
