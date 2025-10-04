import { TypeGuards } from '../helpers/type-guards.helper';

describe('TypeGuards Static Class', () => {
  describe('isPrimitive', () => {
    it('should identify primitive types', () => {
      expect(TypeGuards.isPrimitive('string')).toBe(true);
      expect(TypeGuards.isPrimitive(123)).toBe(true);
      expect(TypeGuards.isPrimitive(true)).toBe(true);
      expect(TypeGuards.isPrimitive(false)).toBe(true);
      expect(TypeGuards.isPrimitive(null)).toBe(true);
      expect(TypeGuards.isPrimitive(undefined)).toBe(true);
    });

    it('should reject non-primitive types', () => {
      expect(TypeGuards.isPrimitive({})).toBe(false);
      expect(TypeGuards.isPrimitive([])).toBe(false);
      expect(TypeGuards.isPrimitive(new Date())).toBe(false);
      expect(TypeGuards.isPrimitive(() => {})).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should identify arrays', () => {
      expect(TypeGuards.isArray([])).toBe(true);
      expect(TypeGuards.isArray([1, 2, 3])).toBe(true);
      expect(TypeGuards.isArray(['a', 'b', 'c'])).toBe(true);
    });

    it('should reject non-arrays', () => {
      expect(TypeGuards.isArray({})).toBe(false);
      expect(TypeGuards.isArray('string')).toBe(false);
      expect(TypeGuards.isArray(123)).toBe(false);
      expect(TypeGuards.isArray(null)).toBe(false);
      expect(TypeGuards.isArray(undefined)).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should identify plain objects', () => {
      expect(TypeGuards.isObject({})).toBe(true);
      expect(TypeGuards.isObject({ key: 'value' })).toBe(true);
      expect(TypeGuards.isObject({ nested: { key: 'value' } })).toBe(true);
    });

    it('should reject non-objects', () => {
      expect(TypeGuards.isObject([])).toBe(false);
      expect(TypeGuards.isObject('string')).toBe(false);
      expect(TypeGuards.isObject(123)).toBe(false);
      expect(TypeGuards.isObject(null)).toBe(false);
      expect(TypeGuards.isObject(undefined)).toBe(false);
      expect(TypeGuards.isObject(new Date())).toBe(false);
    });
  });

  describe('isDate', () => {
    it('should identify Date objects', () => {
      expect(TypeGuards.isDate(new Date())).toBe(true);
      expect(TypeGuards.isDate(new Date('2023-01-01'))).toBe(true);
    });

    it('should reject non-Date objects', () => {
      expect(TypeGuards.isDate({})).toBe(false);
      expect(TypeGuards.isDate([])).toBe(false);
      expect(TypeGuards.isDate('string')).toBe(false);
      expect(TypeGuards.isDate(123)).toBe(false);
      expect(TypeGuards.isDate(null)).toBe(false);
      expect(TypeGuards.isDate(undefined)).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should identify functions', () => {
      expect(TypeGuards.isFunction(() => {})).toBe(true);
      expect(TypeGuards.isFunction(function () {})).toBe(true);
      expect(TypeGuards.isFunction(async () => {})).toBe(true);
    });

    it('should reject non-functions', () => {
      expect(TypeGuards.isFunction({})).toBe(false);
      expect(TypeGuards.isFunction([])).toBe(false);
      expect(TypeGuards.isFunction('string')).toBe(false);
      expect(TypeGuards.isFunction(123)).toBe(false);
      expect(TypeGuards.isFunction(null)).toBe(false);
      expect(TypeGuards.isFunction(undefined)).toBe(false);
    });
  });
});
