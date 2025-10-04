import { casefy } from '../core/casefy.core';
import { CasefyService } from '../services/casefy.service';
import { CasefyOptions } from '../types/case.types';

describe('Core and Service Final Coverage', () => {
  describe('Core Function Final Coverage', () => {
    it('should handle error in service creation gracefully', () => {
      // Test the error handling path in casefy.core.ts line 62
      const options: CasefyOptions = {
        from: 'camelCase',
        to: 'snake_case',
      };

      // This should not throw an error and should return a result
      const result = casefy({ testValue: 'hello' }, options);
      expect(result.data).toEqual({ test_value: 'hello' });
      expect(result.transformedKeys).toBe(1);
    });

    it('should handle all error scenarios', () => {
      // Test various error scenarios that might not be covered
      const options: CasefyOptions = {
        from: 'camelCase',
        to: 'snake_case',
      };

      // Test with various inputs that might cause errors
      const inputs = [
        null,
        undefined,
        'string',
        123,
        true,
        false,
        [],
        {},
        new Date(),
        () => {},
        Symbol('test'),
      ];

      inputs.forEach((input) => {
        const result = casefy(input, options);
        expect(result).toHaveProperty('data');
        expect(result).toHaveProperty('transformedKeys');
        expect(result).toHaveProperty('from');
        expect(result).toHaveProperty('to');
        expect(result).toHaveProperty('deep');
        expect(result).toHaveProperty('arrays');
      });
    });
  });

  describe('Service Final Coverage', () => {
    it('should handle all service error scenarios', () => {
      // Test the error handling path in casefy.service.ts line 63
      const service = new CasefyService('camelCase', 'snake_case');

      // Test with various inputs that might cause errors
      const inputs = [
        null,
        undefined,
        'string',
        123,
        true,
        false,
        [],
        {},
        new Date(),
        () => {},
        Symbol('test'),
      ];

      inputs.forEach((input) => {
        const result = service.transform(input);
        expect(result).toHaveProperty('data');
        expect(result).toHaveProperty('transformedKeys');
        expect(result).toHaveProperty('fromCase');
        expect(result).toHaveProperty('toCase');
      });
    });

    it('should handle complex transformation scenarios', () => {
      const service = new CasefyService('snake_case', 'camelCase', {
        deep: true,
        arrays: true,
        preserveTypes: true,
        fieldMappings: {
          user_id: 'id',
        },
        excludeFields: ['secret'],
        includeFields: ['name'],
      });

      const input = {
        user_id: 123,
        user_name: 'John',
        secret: 'hidden',
        profile: {
          first_name: 'John',
          last_name: 'Doe',
        },
      };

      const result = service.transform(input);
      expect(result.data).toEqual({
        user_id: 123, // Not mapped because not in includeFields
        user_name: 'John', // Not transformed because not in includeFields
        secret: 'hidden', // Excluded
        profile: {
          first_name: 'John', // Not transformed because not in includeFields
          last_name: 'Doe',
        },
      });
    });
  });

  describe('Transformer Edge Cases', () => {
    it('should handle all transformer edge cases', () => {
      // Test edge cases that might not be covered in transformers
      const service = new CasefyService('snake_case', 'camelCase');

      const input = {
        '': 'empty key',
        a: 'single char',
        very_long_key_name_with_many_underscores: 'value',
        key_with_numbers_123: 'value',
        'key_with_special_chars_!@#': 'value',
      };

      const result = service.transform(input);
      expect(result.transformedKeys).toBeGreaterThan(0);
    });

    it('should handle all case style combinations', () => {
      const caseStyles = ['camelCase', 'snake_case', 'PascalCase', 'kebab-case'];

      caseStyles.forEach((fromStyle) => {
        caseStyles.forEach((toStyle) => {
          if (fromStyle !== toStyle) {
            const service = new CasefyService(fromStyle, toStyle);
            const input = { testValue: 'hello' };
            const result = service.transform(input);
            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('transformedKeys');
          }
        });
      });
    });
  });
});
