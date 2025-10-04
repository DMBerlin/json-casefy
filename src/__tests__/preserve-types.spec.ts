import { casefy } from '../core/casefy.core';

// Helper to access transformed data properties
const getData = (result: any) => result.data as any;

describe('Preserve Types Option', () => {
  describe('preserveTypes: true (default)', () => {
    it('should preserve primitive types', () => {
      const input = {
        user_name: 'John',
        user_age: 30,
        is_active: true,
        balance: 1250.75,
        created_at: new Date('2023-06-15T10:30:00Z'),
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        preserveTypes: true,
      });

      const data = getData(result);
      expect(data.userName).toBe('John');
      expect(typeof data.userName).toBe('string');
      expect(data.userAge).toBe(30);
      expect(typeof data.userAge).toBe('number');
      expect(data.isActive).toBe(true);
      expect(typeof data.isActive).toBe('boolean');
      expect(data.balance).toBe(1250.75);
      expect(typeof data.balance).toBe('number');
      expect(data.createdAt).toBeInstanceOf(Date);
    });

    it('should preserve types in nested objects', () => {
      const input = {
        user_profile: {
          first_name: 'John',
          age: 30,
          is_verified: true,
          score: 95.5,
        },
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        preserveTypes: true,
      });

      const data = getData(result);
      expect(typeof data.userProfile.firstName).toBe('string');
      expect(typeof data.userProfile.age).toBe('number');
      expect(typeof data.userProfile.isVerified).toBe('boolean');
      expect(typeof data.userProfile.score).toBe('number');
    });

    it('should preserve types in arrays', () => {
      const input = {
        user_list: [
          { name: 'John', age: 30 },
          { name: 'Jane', age: 25 },
        ],
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        preserveTypes: true,
        arrays: true,
      });

      const data = getData(result);
      expect(Array.isArray(data.userList)).toBe(true);
      expect(typeof data.userList[0].name).toBe('string');
      expect(typeof data.userList[0].age).toBe('number');
    });
  });

  describe('preserveTypes: false', () => {
    it('should convert all primitive values to strings', () => {
      const input = {
        user_name: 'John',
        user_age: 30,
        is_active: true,
        balance: 1250.75,
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        preserveTypes: false,
      });

      const data = getData(result);
      expect(data.userName).toBe('John');
      expect(typeof data.userName).toBe('string');
      expect(data.userAge).toBe('30');
      expect(typeof data.userAge).toBe('string');
      expect(data.isActive).toBe('true');
      expect(typeof data.isActive).toBe('string');
      expect(data.balance).toBe('1250.75');
      expect(typeof data.balance).toBe('string');
    });

    it('should convert values to strings in nested objects', () => {
      const input = {
        user_profile: {
          first_name: 'John',
          age: 30,
          is_verified: true,
          score: 95.5,
        },
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        preserveTypes: false,
      });

      const data = getData(result);
      expect(typeof data.userProfile.firstName).toBe('string');
      expect(data.userProfile.age).toBe('30');
      expect(typeof data.userProfile.age).toBe('string');
      expect(data.userProfile.isVerified).toBe('true');
      expect(typeof data.userProfile.isVerified).toBe('string');
      expect(data.userProfile.score).toBe('95.5');
      expect(typeof data.userProfile.score).toBe('string');
    });

    it('should handle null and undefined values', () => {
      const input = {
        user_name: null,
        user_age: undefined,
        is_active: true,
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        preserveTypes: false,
      });

      const data = getData(result);
      expect(data.userName).toBe('null');
      expect(typeof data.userName).toBe('string');
      expect(data.userAge).toBe('undefined');
      expect(typeof data.userAge).toBe('string');
      expect(data.isActive).toBe('true');
      expect(typeof data.isActive).toBe('string');
    });
  });

  describe('default behavior', () => {
    it('should default to preserveTypes: true', () => {
      const input = {
        user_name: 'John',
        user_age: 30,
        is_active: true,
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
      });

      const data = getData(result);
      expect(typeof data.userName).toBe('string');
      expect(typeof data.userAge).toBe('number');
      expect(typeof data.isActive).toBe('boolean');
    });
  });
});
