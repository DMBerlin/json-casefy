import { CasefyService } from '../services/casefy.service';
import { ICaseTransformOptions } from '../interfaces';

describe('CasefyService Comprehensive Coverage', () => {
  describe('Error Handling', () => {
    it('should handle transformation errors gracefully', () => {
      // This test covers the error handling in the service
      const service = new CasefyService('camelCase', 'snake_case');

      // Test with invalid input that might cause errors
      const result = service.transform(null);
      expect(result.data).toBe(null);
      expect(result.transformedKeys).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty objects', () => {
      const service = new CasefyService('camelCase', 'snake_case');
      const result = service.transform({});
      expect(result.data).toEqual({});
      expect(result.transformedKeys).toBe(0);
    });

    it('should handle objects with only excluded fields', () => {
      const service = new CasefyService('camelCase', 'snake_case', {
        excludeFields: ['firstName', 'lastName'],
      });
      const result = service.transform({
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result.data).toEqual({
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result.transformedKeys).toBe(0);
    });

    it('should handle objects with only included fields that match', () => {
      const service = new CasefyService('camelCase', 'snake_case', {
        includeFields: ['firstName'],
      });
      const result = service.transform({
        firstName: 'John',
        lastName: 'Doe',
      });
      expect(result.data).toEqual({
        first_name: 'John', // Transformed because it's in includeFields
        lastName: 'Doe', // Not transformed because not in includeFields
      });
      expect(result.transformedKeys).toBe(1);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle deeply nested objects with mixed options', () => {
      const service = new CasefyService('snake_case', 'camelCase', {
        deep: true,
        arrays: true,
        preserveTypes: false,
        fieldMappings: {
          user_id: 'id',
        },
        excludeFields: ['internal_data'],
      });

      const input = {
        user_id: 123,
        user_name: 'John',
        internal_data: 'secret',
        profile: {
          first_name: 'John',
          last_name: 'Doe',
          settings: {
            theme: 'dark',
            notifications: true,
          },
        },
        tags: ['admin', 'user'],
      };

      const result = service.transform(input);

      expect(result.data).toEqual({
        id: '123', // Mapped and converted to string
        userName: 'John',
        internal_data: 'secret', // Excluded
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          settings: {
            theme: 'dark',
            notifications: 'true', // Converted to string
          },
        },
        tags: ['admin', 'user'], // Array not transformed
      });
      expect(result.transformedKeys).toBeGreaterThan(0);
    });

    it('should handle arrays with mixed content', () => {
      const service = new CasefyService('snake_case', 'camelCase', {
        arrays: true,
        deep: true,
      });

      const input = [{ user_name: 'John' }, 'string', 123, { user_age: 30 }, null, undefined];

      const result = service.transform(input);

      expect(result.data).toEqual([
        { userName: 'John' },
        'string',
        123,
        { userAge: 30 },
        null,
        undefined,
      ]);
      expect(result.transformedKeys).toBe(2); // Only object keys transformed
    });
  });

  describe('Logging', () => {
    it('should enable and disable logging', () => {
      const service = new CasefyService('camelCase', 'snake_case');

      service.setLogging(true);
      expect((service as any).enableLogging).toBe(true);

      service.setLogging(false);
      expect((service as any).enableLogging).toBe(false);
    });
  });

  describe('Field Mappings', () => {
    it('should handle field mappings with case conversion', () => {
      const service = new CasefyService('snake_case', 'PascalCase', {
        fieldMappings: {
          user_name: 'fullName',
          user_age: 'age',
        },
      });

      const input = {
        user_name: 'John Doe',
        user_age: 30,
        user_email: 'john@example.com',
      };

      const result = service.transform(input);

      expect(result.data).toEqual({
        fullName: 'John Doe', // Mapped
        age: 30, // Mapped
        UserEmail: 'john@example.com', // Case converted
      });
    });
  });

  describe('Include/Exclude Fields', () => {
    it('should handle includeFields with case detection', () => {
      const service = new CasefyService('snake_case', 'camelCase', {
        includeFields: ['user_name', 'user_email'],
      });

      const input = {
        user_name: 'John',
        user_email: 'john@example.com',
        user_age: 30,
        profile_data: 'secret',
      };

      const result = service.transform(input);

      expect(result.data).toEqual({
        userName: 'John', // Transformed (included)
        userEmail: 'john@example.com', // Transformed (included)
        user_age: 30, // Not transformed (not included)
        profile_data: 'secret', // Not transformed (not included)
      });
    });

    it('should handle excludeFields with case detection', () => {
      const service = new CasefyService('snake_case', 'camelCase', {
        excludeFields: ['user_age', 'profile_data'],
      });

      const input = {
        user_name: 'John',
        user_email: 'john@example.com',
        user_age: 30,
        profile_data: 'secret',
      };

      const result = service.transform(input);

      expect(result.data).toEqual({
        userName: 'John', // Transformed
        userEmail: 'john@example.com', // Transformed
        user_age: 30, // Not transformed (excluded)
        profile_data: 'secret', // Not transformed (excluded)
      });
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle very deep nesting', () => {
      const service = new CasefyService('snake_case', 'camelCase', {
        deep: true,
      });

      // Create a deeply nested object
      let input: any = { level_0: 'value' };
      for (let i = 1; i < 10; i++) {
        input = { [`level_${i}`]: input };
      }

      const result = service.transform(input);
      expect(result.transformedKeys).toBe(10);
    });

    it('should handle large arrays', () => {
      const service = new CasefyService('snake_case', 'camelCase', {
        arrays: true,
      });

      const input = Array.from({ length: 100 }, (_, i) => ({
        item_id: i,
        item_name: `Item ${i}`,
      }));

      const result = service.transform(input);
      expect(result.data).toHaveLength(100);
      expect(result.transformedKeys).toBe(200); // 100 items * 2 keys each
    });
  });
});
