import { CasefyService, CaseTransformerFactory } from '../index';

describe('OOP Casefy Implementation', () => {
  describe('CasefyService', () => {
    it('should transform data using OOP approach', () => {
      const service = new CasefyService('snake_case', 'camelCase', {
        preserveTypes: true,
        arrays: true,
        deep: true,
      });

      const input = {
        user_id: 123,
        user_name: 'John',
        profile: {
          first_name: 'John',
          last_name: 'Doe',
        },
      };

      const result = service.transform(input);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        userId: 123,
        userName: 'John',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
        },
      });
      expect(result.transformedKeys).toBe(4);
      expect(result.fromCase).toBe('snake_case');
      expect(result.toCase).toBe('camelCase');
    });

    it('should handle transformation errors gracefully', () => {
      expect(() => {
        new CasefyService('invalid_case', 'camelCase');
      }).toThrow('Unsupported source case style: invalid_case');
    });

    it('should provide transformation statistics', () => {
      const service = new CasefyService('snake_case', 'camelCase', {
        preserveTypes: false,
        arrays: true,
      });

      const stats = service.getStats();

      expect(stats.fromCase).toBe('snake_case');
      expect(stats.toCase).toBe('camelCase');
      expect(stats.options.preserveTypes).toBe(false);
      expect(stats.options.arrays).toBe(true);
      expect(stats.availableTransformers).toContain('camelCase');
      expect(stats.availableTransformers).toContain('snake_case');
    });

    it('should work with field mappings', () => {
      const service = new CasefyService('snake_case', 'camelCase', {
        fieldMappings: {
          user_id: 'id',
          user_name: 'fullName',
        },
      });

      const input = {
        user_id: 123,
        user_name: 'John',
        user_email: 'john@example.com',
      };

      const result = service.transform(input);

      expect(result.data).toEqual({
        id: 123,
        fullName: 'John',
        userEmail: 'john@example.com',
      });
    });

    it('should work with excludeFields', () => {
      const service = new CasefyService('snake_case', 'camelCase', {
        excludeFields: ['user_id'],
      });

      const input = {
        user_id: 123,
        user_name: 'John',
      };

      const result = service.transform(input);

      expect(result.data).toEqual({
        user_id: 123,
        userName: 'John',
      });
    });

    it('should work with includeFields', () => {
      const service = new CasefyService('snake_case', 'camelCase', {
        includeFields: ['user_id'],
      });

      const input = {
        user_id: 123,
        user_name: 'John',
      };

      const result = service.transform(input);

      expect(result.data).toEqual({
        userId: 123,
        user_name: 'John',
      });
    });
  });

  describe('CaseTransformerFactory', () => {
    it('should get transformer by case style', () => {
      const transformer = CaseTransformerFactory.getTransformer('camelCase');

      expect(transformer).toBeDefined();
      expect(transformer.getCaseStyle()).toBe('camelCase');
      expect(transformer.getDescription()).toContain('camelCase');
    });

    it('should throw error for unsupported case style', () => {
      expect(() => {
        CaseTransformerFactory.getTransformer('unsupported_case');
      }).toThrow('Unsupported case style: unsupported_case');
    });

    it('should get all available case styles', () => {
      const styles = CaseTransformerFactory.getAvailableCaseStyles();

      expect(styles).toContain('camelCase');
      expect(styles).toContain('snake_case');
      expect(styles).toContain('PascalCase');
      expect(styles).toContain('kebab-case');
    });

    it('should check if case style is supported', () => {
      expect(CaseTransformerFactory.isSupported('camelCase')).toBe(true);
      expect(CaseTransformerFactory.isSupported('unsupported_case')).toBe(false);
    });

    it('should detect case style from string', () => {
      expect(CaseTransformerFactory.detectCaseStyle('userName')).toBe('camelCase');
      expect(CaseTransformerFactory.detectCaseStyle('user_name')).toBe('snake_case');
      expect(CaseTransformerFactory.detectCaseStyle('UserName')).toBe('PascalCase');
      expect(CaseTransformerFactory.detectCaseStyle('user-name')).toBe('kebab-case');
      expect(CaseTransformerFactory.detectCaseStyle('123abc')).toBe(null);
    });

    it('should get transformer information', () => {
      const info = CaseTransformerFactory.getTransformerInfo('camelCase');

      expect(info).toBeDefined();
      expect(info!.name).toBe('camelCase');
      expect(info!.description).toContain('camelCase');
    });

    it('should return null for unsupported transformer info', () => {
      const info = CaseTransformerFactory.getTransformerInfo('unsupported_case');

      expect(info).toBeNull();
    });

    it('should register custom transformer', () => {
      const customTransformer = {
        transform: (input: string) => input.toUpperCase(),
        transformWithContext: (input: string, _context: any) => input.toUpperCase(),
        detect: (input: string) => /^[A-Z]+$/.test(input),
        getCaseStyle: () => 'UPPER_CASE',
        getDescription: () => 'Converts to uppercase',
      };

      CaseTransformerFactory.registerTransformer('UPPER_CASE', customTransformer);

      expect(CaseTransformerFactory.isSupported('UPPER_CASE')).toBe(true);
      expect(CaseTransformerFactory.getTransformer('UPPER_CASE')).toBe(customTransformer);
    });

    it('should clear and reset transformers', () => {
      // Register a custom transformer
      const customTransformer = {
        transform: (input: string) => input.toUpperCase(),
        transformWithContext: (input: string, _context: any) => input.toUpperCase(),
        detect: (input: string) => /^[A-Z]+$/.test(input),
        getCaseStyle: () => 'UPPER_CASE',
        getDescription: () => 'Converts to uppercase',
      };

      CaseTransformerFactory.registerTransformer('UPPER_CASE', customTransformer);
      expect(CaseTransformerFactory.isSupported('UPPER_CASE')).toBe(true);

      // Reset to defaults
      CaseTransformerFactory.reset();
      expect(CaseTransformerFactory.isSupported('UPPER_CASE')).toBe(false);
      expect(CaseTransformerFactory.isSupported('camelCase')).toBe(true);
    });
  });

  describe('Individual Transformers', () => {
    it('should work with CamelCaseTransformer', () => {
      const transformer = CaseTransformerFactory.getTransformer('camelCase');

      expect(transformer.transform('user_name')).toBe('userName');
      expect(transformer.transform('first_name')).toBe('firstName');
      expect(transformer.detect('userName')).toBe(true);
      expect(transformer.detect('user_name')).toBe(false);
    });

    it('should work with SnakeCaseTransformer', () => {
      const transformer = CaseTransformerFactory.getTransformer('snake_case');

      expect(transformer.transform('userName')).toBe('user_name');
      expect(transformer.transform('firstName')).toBe('first_name');
      expect(transformer.detect('user_name')).toBe(true);
      expect(transformer.detect('userName')).toBe(false);
    });

    it('should work with PascalCaseTransformer', () => {
      const transformer = CaseTransformerFactory.getTransformer('PascalCase');

      expect(transformer.transform('user_name')).toBe('UserName');
      expect(transformer.transform('first_name')).toBe('FirstName');
      expect(transformer.detect('UserName')).toBe(true);
      expect(transformer.detect('userName')).toBe(false);
    });

    it('should work with KebabCaseTransformer', () => {
      const transformer = CaseTransformerFactory.getTransformer('kebab-case');

      expect(transformer.transform('userName')).toBe('user-name');
      expect(transformer.transform('firstName')).toBe('first-name');
      expect(transformer.detect('user-name')).toBe(true);
      expect(transformer.detect('userName')).toBe(false);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle nested objects and arrays', () => {
      const service = new CasefyService('snake_case', 'camelCase', {
        arrays: true,
        deep: true,
      });

      const input = {
        user_id: 123,
        user_name: 'John',
        orders: [
          {
            order_id: 1,
            order_date: '2023-06-15',
            items: [
              { item_id: 1, item_name: 'Product A' },
              { item_id: 2, item_name: 'Product B' },
            ],
          },
        ],
      };

      const result = service.transform(input);

      expect(result.data).toEqual({
        userId: 123,
        userName: 'John',
        orders: [
          {
            orderId: 1,
            orderDate: '2023-06-15',
            items: [
              { itemId: 1, itemName: 'Product A' },
              { itemId: 2, itemName: 'Product B' },
            ],
          },
        ],
      });
    });

    it('should handle preserveTypes option', () => {
      const service = new CasefyService('snake_case', 'camelCase', {
        preserveTypes: false,
      });

      const input = {
        user_id: 123,
        user_name: 'John',
        is_active: true,
        balance: 1250.75,
      };

      const result = service.transform(input);

      expect(result.data).toEqual({
        userId: '123',
        userName: 'John',
        isActive: 'true',
        balance: '1250.75',
      });
    });
  });
});
