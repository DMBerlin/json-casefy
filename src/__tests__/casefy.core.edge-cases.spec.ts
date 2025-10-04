import { casefy } from '../core/casefy.core';

describe('Casefy Core Edge Cases', () => {
  describe('Error handling', () => {
    it('should throw error for missing from option', () => {
      expect(() => casefy({}, { to: 'camelCase' } as any)).toThrow(
        'Both "from" and "to" case styles must be specified',
      );
    });

    it('should throw error for missing to option', () => {
      expect(() => casefy({}, { from: 'snake_case' } as any)).toThrow(
        'Both "from" and "to" case styles must be specified',
      );
    });

    it('should throw error for unsupported from case style', () => {
      expect(() => casefy({}, { from: 'invalid_case' as any, to: 'camelCase' })).toThrow(
        'Unsupported source case style: invalid_case',
      );
    });

    it('should throw error for unsupported to case style', () => {
      expect(() => casefy({}, { from: 'snake_case', to: 'invalid_case' as any })).toThrow(
        'Unsupported target case style: invalid_case',
      );
    });
  });

  describe('Field filtering edge cases', () => {
    it('should handle empty excludeFields array', () => {
      const input = { user_name: 'John', user_age: 30 };
      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        excludeFields: [],
      });

      expect(result.data).toEqual({ userName: 'John', userAge: 30 });
      expect(result.transformedKeys).toBe(2);
    });

    it('should handle empty includeFields array', () => {
      const input = { user_name: 'John', user_age: 30 };
      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        includeFields: [],
      });

      expect(result.data).toEqual({ user_name: 'John', user_age: 30 });
      expect(result.transformedKeys).toBe(0);
    });

    it('should handle field mappings with non-existent fields', () => {
      const input = { user_name: 'John', user_age: 30 };
      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        fieldMappings: {
          non_existent_field: 'mappedField',
          user_name: 'fullName',
        },
      });

      expect(result.data).toEqual({ fullName: 'John', userAge: 30 });
      expect(result.transformedKeys).toBe(2);
    });
  });

  describe('Deep transformation edge cases', () => {
    it('should handle deep: false with nested objects', () => {
      const input = {
        user_name: 'John',
        user_profile: {
          first_name: 'John',
          last_name: 'Doe',
        },
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        deep: false,
      });

      expect(result.data).toEqual({
        userName: 'John',
        userProfile: {
          first_name: 'John',
          last_name: 'Doe',
        },
      });
      expect(result.transformedKeys).toBe(2);
    });

    it('should handle arrays: false with nested arrays', () => {
      const input = {
        user_list: [{ user_name: 'John' }, { user_name: 'Jane' }],
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        arrays: false,
      });

      expect(result.data).toEqual({
        userList: [{ user_name: 'John' }, { user_name: 'Jane' }],
      });
      expect(result.transformedKeys).toBe(1);
    });
  });

  describe('Complex data types', () => {
    it('should handle Date objects', () => {
      const input = {
        user_name: 'John',
        created_at: new Date('2023-06-15T10:30:00Z'),
      };

      const result = casefy(input, { from: 'snake_case', to: 'camelCase' });

      expect(result.data).toEqual({
        userName: 'John',
        createdAt: new Date('2023-06-15T10:30:00Z'),
      });
      expect(result.transformedKeys).toBe(2);
    });

    it('should handle functions', () => {
      const input = {
        user_name: 'John',
        callback: () => 'test',
      };

      const result = casefy(input, { from: 'snake_case', to: 'camelCase' });

      expect(result.data).toEqual({
        userName: 'John',
        callback: expect.any(Function),
      });
      expect(result.transformedKeys).toBe(1);
    });

    it('should handle mixed arrays with primitives', () => {
      const input = [{ user_name: 'John' }, 'string', 123, true, null, { user_age: 30 }];

      const result = casefy(input, { from: 'snake_case', to: 'camelCase', arrays: true });

      expect(result.data).toEqual([
        { userName: 'John' },
        'string',
        123,
        true,
        null,
        { userAge: 30 },
      ]);
      expect(result.transformedKeys).toBe(2);
    });
  });

  describe('Case detection edge cases', () => {
    it('should handle keys that do not match source case style', () => {
      const input = {
        'already-camelCase': 'value1',
        snake_case_key: 'value2',
        PascalCaseKey: 'value3',
      };

      const result = casefy(input, { from: 'snake_case', to: 'camelCase' });

      expect(result.data).toEqual({
        'already-camelCase': 'value1',
        snakeCaseKey: 'value2',
        PascalCaseKey: 'value3',
      });
      expect(result.transformedKeys).toBe(1);
    });

    it('should handle empty strings as keys', () => {
      const input = {
        '': 'empty key',
        user_name: 'John',
      };

      const result = casefy(input, { from: 'snake_case', to: 'camelCase' });

      expect(result.data).toEqual({
        '': 'empty key',
        userName: 'John',
      });
      expect(result.transformedKeys).toBe(1);
    });

    it('should handle numeric keys', () => {
      const input = {
        '0': 'zero',
        '1': 'one',
        user_name: 'John',
      };

      const result = casefy(input, { from: 'snake_case', to: 'camelCase' });

      expect(result.data).toEqual({
        '0': 'zero',
        '1': 'one',
        userName: 'John',
      });
      expect(result.transformedKeys).toBe(1);
    });
  });
});
