import { casefy } from '../core/casefy.core';
import { CasefyOptions } from '../types/case.types';

describe('Casefy Core', () => {
  describe('Basic transformations', () => {
    it('should transform snake_case to camelCase', () => {
      const input = { user_name: 'John', user_age: 30 };
      const result = casefy(input, { from: 'snake_case', to: 'camelCase' });

      expect(result.data).toEqual({ userName: 'John', userAge: 30 });
      expect(result.transformedKeys).toBe(2);
      expect(result.from).toBe('snake_case');
      expect(result.to).toBe('camelCase');
    });

    it('should transform camelCase to snake_case', () => {
      const input = { userName: 'John', userAge: 30 };
      const result = casefy(input, { from: 'camelCase', to: 'snake_case' });

      expect(result.data).toEqual({ user_name: 'John', user_age: 30 });
      expect(result.transformedKeys).toBe(2);
    });

    it('should transform snake_case to PascalCase', () => {
      const input = { user_name: 'John', user_age: 30 };
      const result = casefy(input, { from: 'snake_case', to: 'PascalCase' });

      expect(result.data).toEqual({ UserName: 'John', UserAge: 30 });
      expect(result.transformedKeys).toBe(2);
    });

    it('should transform snake_case to kebab-case', () => {
      const input = { user_name: 'John', user_age: 30 };
      const result = casefy(input, { from: 'snake_case', to: 'kebab-case' });

      expect(result.data).toEqual({ 'user-name': 'John', 'user-age': 30 });
      expect(result.transformedKeys).toBe(2);
    });
  });

  describe('Deep transformations', () => {
    it('should transform nested objects', () => {
      const input = {
        user_name: 'John',
        user_profile: {
          first_name: 'John',
          last_name: 'Doe',
          contact_info: {
            email_address: 'john@example.com',
            phone_number: '123-456-7890',
          },
        },
      };

      const result = casefy(input, { from: 'snake_case', to: 'camelCase' });

      expect(result.data).toEqual({
        userName: 'John',
        userProfile: {
          firstName: 'John',
          lastName: 'Doe',
          contactInfo: {
            emailAddress: 'john@example.com',
            phoneNumber: '123-456-7890',
          },
        },
      });
      expect(result.transformedKeys).toBe(7);
    });

    it('should transform arrays when arrays option is true', () => {
      const input = {
        user_list: [
          { user_name: 'John', user_age: 30 },
          { user_name: 'Jane', user_age: 25 },
        ],
      };

      const result = casefy(input, { from: 'snake_case', to: 'camelCase', arrays: true });

      expect(result.data).toEqual({
        userList: [
          { userName: 'John', userAge: 30 },
          { userName: 'Jane', userAge: 25 },
        ],
      });
      expect(result.transformedKeys).toBe(5);
    });

    it('should not transform arrays when arrays option is false', () => {
      const input = {
        user_list: [{ user_name: 'John', user_age: 30 }],
      };

      const result = casefy(input, { from: 'snake_case', to: 'camelCase', arrays: false });

      expect(result.data).toEqual({
        userList: [{ user_name: 'John', user_age: 30 }],
      });
      expect(result.transformedKeys).toBe(1);
    });
  });

  describe('Field filtering', () => {
    it('should exclude specified fields', () => {
      const input = { user_name: 'John', user_age: 30, id: 123 };
      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        excludeFields: ['user_age'],
      });

      expect(result.data).toEqual({ userName: 'John', user_age: 30, id: 123 });
      expect(result.transformedKeys).toBe(1);
    });

    it('should include only specified fields', () => {
      const input = { user_name: 'John', user_age: 30, id: 123 };
      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        includeFields: ['user_name'],
      });

      expect(result.data).toEqual({ userName: 'John', user_age: 30, id: 123 });
      expect(result.transformedKeys).toBe(1);
    });

    it('should apply field mappings', () => {
      const input = { user_name: 'John', user_age: 30 };
      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        fieldMappings: { user_name: 'fullName' },
      });

      expect(result.data).toEqual({ fullName: 'John', userAge: 30 });
      expect(result.transformedKeys).toBe(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle null and undefined', () => {
      expect(casefy(null, { from: 'snake_case', to: 'camelCase' }).data).toBeNull();
      expect(casefy(undefined, { from: 'snake_case', to: 'camelCase' }).data).toBeUndefined();
    });

    it('should handle primitives', () => {
      expect(casefy('string', { from: 'snake_case', to: 'camelCase' }).data).toBe('string');
      expect(casefy(123, { from: 'snake_case', to: 'camelCase' }).data).toBe(123);
      expect(casefy(true, { from: 'snake_case', to: 'camelCase' }).data).toBe(true);
    });

    it('should handle empty objects', () => {
      const result = casefy({}, { from: 'snake_case', to: 'camelCase' });
      expect(result.data).toEqual({});
      expect(result.transformedKeys).toBe(0);
    });

    it('should handle empty arrays', () => {
      const result = casefy([], { from: 'snake_case', to: 'camelCase' });
      expect(result.data).toEqual([]);
      expect(result.transformedKeys).toBe(0);
    });

    it('should handle mixed arrays', () => {
      const input = [{ user_name: 'John' }, 'string', 123, { user_age: 30 }];

      const result = casefy(input, { from: 'snake_case', to: 'camelCase', arrays: true });

      expect(result.data).toEqual([{ userName: 'John' }, 'string', 123, { userAge: 30 }]);
      expect(result.transformedKeys).toBe(2);
    });
  });

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

  describe('Performance and complexity', () => {
    it('should handle large nested objects efficiently', () => {
      const createNestedObject = (depth: number): any => {
        if (depth === 0) return { user_name: 'John' };
        return { nested: createNestedObject(depth - 1) };
      };

      const input = createNestedObject(10);
      const start = Date.now();
      const result = casefy(input, { from: 'snake_case', to: 'camelCase' });
      const end = Date.now();

      expect(end - start).toBeLessThan(100); // Should complete in under 100ms
      expect(result.transformedKeys).toBe(1); // Only the root key gets transformed
    });
  });
});
