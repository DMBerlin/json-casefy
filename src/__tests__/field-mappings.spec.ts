import { casefy } from '../core/casefy.core';

describe('Field Mappings', () => {
  describe('Basic field mapping', () => {
    it('should map specific fields to custom names', () => {
      const input = {
        user_id: 123,
        user_name: 'John',
        user_email: 'john@example.com',
        created_at: '2023-06-15T10:30:00Z',
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        fieldMappings: {
          user_id: 'id',
          user_name: 'fullName',
          user_email: 'email',
        },
      });

      const data = result.data as any;
      expect(data.id).toBe(123);
      expect(data.fullName).toBe('John');
      expect(data.email).toBe('john@example.com');
      expect(data.createdAt).toBe('2023-06-15T10:30:00Z'); // Not mapped, so gets camelCase
    });

    it('should work with nested objects', () => {
      const input = {
        user_profile: {
          first_name: 'John',
          last_name: 'Doe',
          contact_info: {
            email_address: 'john@example.com',
            phone_number: '123-456-7890',
          },
        },
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        fieldMappings: {
          user_profile: 'profile',
          first_name: 'firstName',
          last_name: 'lastName',
          contact_info: 'contact',
          email_address: 'email',
          phone_number: 'phone',
        },
      });

      const data = result.data as any;
      expect(data.profile.firstName).toBe('John');
      expect(data.profile.lastName).toBe('Doe');
      expect(data.profile.contact.email).toBe('john@example.com');
      expect(data.profile.contact.phone).toBe('123-456-7890');
    });

    it('should work with arrays', () => {
      const input = {
        user_list: [
          { user_name: 'John', user_age: 30 },
          { user_name: 'Jane', user_age: 25 },
        ],
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        fieldMappings: {
          user_list: 'users',
          user_name: 'name',
          user_age: 'age',
        },
        arrays: true,
      });

      const data = result.data as any;
      expect(Array.isArray(data.users)).toBe(true);
      expect(data.users[0].name).toBe('John');
      expect(data.users[0].age).toBe(30);
      expect(data.users[1].name).toBe('Jane');
      expect(data.users[1].age).toBe(25);
    });
  });

  describe('Field mapping with other options', () => {
    it('should work with excludeFields', () => {
      const input = {
        user_id: 123,
        user_name: 'John',
        user_email: 'john@example.com',
        internal_id: 'internal_123',
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        fieldMappings: {
          user_id: 'id',
          user_name: 'name',
        },
        excludeFields: ['internal_id'],
      });

      const data = result.data as any;
      expect(data.id).toBe(123);
      expect(data.name).toBe('John');
      expect(data.userEmail).toBe('john@example.com'); // Not mapped, gets camelCase
      expect(data.internal_id).toBe('internal_123'); // Excluded, not transformed
    });

    it('should work with includeFields', () => {
      const input = {
        user_id: 123,
        user_name: 'John',
        user_email: 'john@example.com',
        admin_id: 456,
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        fieldMappings: {
          user_id: 'id',
          user_name: 'name',
        },
        includeFields: ['user_id', 'user_name', 'user_email'],
      });

      const data = result.data as any;
      expect(data.id).toBe(123);
      expect(data.name).toBe('John');
      expect(data.userEmail).toBe('john@example.com');
      expect(data.admin_id).toBe(456); // Not included, not transformed
    });
  });

  describe('Edge cases', () => {
    it('should handle empty fieldMappings', () => {
      const input = {
        user_name: 'John',
        user_age: 30,
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        fieldMappings: {},
      });

      const data = result.data as any;
      expect(data.userName).toBe('John');
      expect(data.userAge).toBe(30);
    });

    it('should handle non-existent field mappings', () => {
      const input = {
        user_name: 'John',
        user_age: 30,
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        fieldMappings: {
          non_existent_field: 'mappedField',
          user_name: 'name',
        },
      });

      const data = result.data as any;
      expect(data.name).toBe('John');
      expect(data.userAge).toBe(30);
    });

    it('should handle field mappings that override case conversion', () => {
      const input = {
        user_name: 'John',
        user_age: 30,
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'PascalCase',
        fieldMappings: {
          user_name: 'fullName', // Override to camelCase
          user_age: 'age', // Override to camelCase
        },
      });

      const data = result.data as any;
      expect(data.fullName).toBe('John');
      expect(data.age).toBe(30); // Field mapping + case conversion = age (camelCase)
    });
  });

  describe('Complex scenarios', () => {
    it('should handle deep nested field mappings', () => {
      const input = {
        transaction_data: {
          transaction_id: 'txn_123',
          customer_info: {
            customer_id: 123,
            customer_name: 'John',
            contact_details: {
              email_address: 'john@example.com',
              phone_number: '123-456-7890',
            },
          },
        },
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        fieldMappings: {
          transaction_data: 'transaction',
          transaction_id: 'id',
          customer_info: 'customer',
          customer_id: 'id',
          customer_name: 'name',
          contact_details: 'contact',
          email_address: 'email',
          phone_number: 'phone',
        },
      });

      const data = result.data as any;
      expect(data.transaction.id).toBe('txn_123');
      expect(data.transaction.customer.id).toBe(123);
      expect(data.transaction.customer.name).toBe('John');
      expect(data.transaction.customer.contact.email).toBe('john@example.com');
      expect(data.transaction.customer.contact.phone).toBe('123-456-7890');
    });

    it('should handle mixed case styles with field mappings', () => {
      const input = {
        user_name: 'John',
        userAge: 30,
        'user-email': 'john@example.com',
        UserPhone: '123-456-7890',
      };

      const result = casefy(input, {
        from: 'snake_case',
        to: 'camelCase',
        fieldMappings: {
          user_name: 'name',
          userAge: 'age',
          'user-email': 'email',
          UserPhone: 'phone',
        },
      });

      const data = result.data as any;
      expect(data.name).toBe('John');
      expect(data.age).toBe(30);
      expect(data.email).toBe('john@example.com');
      expect(data.phone).toBe('123-456-7890');
    });
  });
});
