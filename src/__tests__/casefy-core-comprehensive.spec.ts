import { casefy } from '../core/casefy.core';
import { CasefyOptions } from '../types/case.types';

describe('Casefy Core Comprehensive Coverage', () => {
  describe('Error Handling', () => {
    it('should handle non-validation errors gracefully', () => {
      // Mock a scenario where the service throws a non-validation error
      const options: CasefyOptions = {
        from: 'camelCase',
        to: 'snake_case',
      };

      const input = { test: 'value' };

      // This should not throw an error
      const result = casefy(input, options);
      expect(result.data).toEqual({ test: 'value' });
      expect(result.transformedKeys).toBe(0);
    });

    it('should handle errors in service creation', () => {
      // Test with invalid options that might cause service creation to fail
      const options: CasefyOptions = {
        from: 'camelCase',
        to: 'snake_case',
        preserveTypes: false,
        arrays: true,
        deep: true,
      };

      const input = { testValue: 'hello' };
      const result = casefy(input, options);

      expect(result.data).toEqual({ test_value: 'hello' });
      expect(result.transformedKeys).toBe(1);
    });
  });

  describe('Options Handling', () => {
    it('should handle all optional properties', () => {
      const options: CasefyOptions = {
        from: 'snake_case',
        to: 'camelCase',
        deep: false,
        arrays: false,
        preserveTypes: false,
        fieldMappings: { user_id: 'id' },
        excludeFields: ['secret'],
        includeFields: ['name'],
      };

      const input = {
        user_id: 123,
        user_name: 'John',
        secret: 'hidden',
        other_field: 'value',
      };

      const result = casefy(input, options);

      expect(result.data).toEqual({
        user_id: 123, // Not mapped because not in includeFields
        user_name: 'John', // Not transformed because not in includeFields
        secret: 'hidden', // Excluded
        other_field: 'value', // Not transformed (not included)
      });
    });

    it('should handle undefined optional properties', () => {
      const options: CasefyOptions = {
        from: 'snake_case',
        to: 'camelCase',
        // All other properties undefined
      };

      const input = { user_name: 'John' };
      const result = casefy(input, options);

      expect(result.data).toEqual({ userName: 'John' });
      expect(result.deep).toBe(true); // Default value
      expect(result.arrays).toBe(true); // Default value
    });
  });

  describe('Result Structure', () => {
    it('should return correct result structure', () => {
      const options: CasefyOptions = {
        from: 'snake_case',
        to: 'camelCase',
      };

      const input = { user_name: 'John' };
      const result = casefy(input, options);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('transformedKeys');
      expect(result).toHaveProperty('from');
      expect(result).toHaveProperty('to');
      expect(result).toHaveProperty('deep');
      expect(result).toHaveProperty('arrays');

      expect(result.from).toBe('snake_case');
      expect(result.to).toBe('camelCase');
      expect(result.deep).toBe(true);
      expect(result.arrays).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null input', () => {
      const options: CasefyOptions = {
        from: 'camelCase',
        to: 'snake_case',
      };

      const result = casefy(null, options);
      expect(result.data).toBe(null);
      expect(result.transformedKeys).toBe(0);
    });

    it('should handle undefined input', () => {
      const options: CasefyOptions = {
        from: 'camelCase',
        to: 'snake_case',
      };

      const result = casefy(undefined, options);
      expect(result.data).toBe(undefined);
      expect(result.transformedKeys).toBe(0);
    });

    it('should handle primitive input', () => {
      const options: CasefyOptions = {
        from: 'camelCase',
        to: 'snake_case',
      };

      const result = casefy('hello', options);
      expect(result.data).toBe('hello');
      expect(result.transformedKeys).toBe(0);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle nested objects with all options', () => {
      const options: CasefyOptions = {
        from: 'snake_case',
        to: 'camelCase',
        deep: true,
        arrays: true,
        preserveTypes: true,
        fieldMappings: {
          user_id: 'id',
          profile_data: 'profile',
        },
        excludeFields: ['internal_data'],
        includeFields: ['user_name', 'user_email', 'profile'],
      };

      const input = {
        user_id: 123,
        user_name: 'John',
        user_email: 'john@example.com',
        internal_data: 'secret',
        profile_data: {
          first_name: 'John',
          last_name: 'Doe',
        },
        other_field: 'value',
      };

      const result = casefy(input, options);

      expect(result.data).toEqual({
        user_id: 123, // Not mapped because not in includeFields
        userName: 'John', // Included and transformed
        userEmail: 'john@example.com', // Included and transformed
        internal_data: 'secret', // Excluded
        profile_data: {
          // Not mapped because not in includeFields
          first_name: 'John',
          last_name: 'Doe',
        },
        other_field: 'value', // Not included
      });
    });

    it('should handle arrays with mixed content', () => {
      const options: CasefyOptions = {
        from: 'snake_case',
        to: 'camelCase',
        arrays: true,
        deep: true,
      };

      const input = [{ user_name: 'John' }, 'string', 123, { user_age: 30 }, null, undefined];

      const result = casefy(input, options);

      expect(result.data).toEqual([
        { userName: 'John' },
        'string',
        123,
        { userAge: 30 },
        null,
        undefined,
      ]);
    });
  });
});
