import {
  CamelCaseTransformer,
  SnakeCaseTransformer,
  PascalCaseTransformer,
  KebabCaseTransformer,
} from '../transformers';

describe('Case Transformers', () => {
  describe('CamelCase Transformer', () => {
    const transformer = new CamelCaseTransformer();

    it('should transform snake_case to camelCase', () => {
      expect(transformer.transform('user_name')).toBe('userName');
      expect(transformer.transform('first_name')).toBe('firstName');
      expect(transformer.transform('user_age')).toBe('userAge');
    });

    it('should transform kebab-case to camelCase', () => {
      expect(transformer.transform('user-name')).toBe('userName');
      expect(transformer.transform('first-name')).toBe('firstName');
    });

    it('should transform PascalCase to camelCase', () => {
      expect(transformer.transform('UserName')).toBe('userName');
      expect(transformer.transform('FirstName')).toBe('firstName');
    });

    it('should detect camelCase strings', () => {
      expect(transformer.detect('userName')).toBe(true);
      expect(transformer.detect('firstName')).toBe(true);
      expect(transformer.detect('user_name')).toBe(false);
      expect(transformer.detect('UserName')).toBe(false);
      expect(transformer.detect('user-name')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(transformer.transform('')).toBe('');
      expect(transformer.transform('user')).toBe('user');
      expect(transformer.transform('USER')).toBe('uSER');
    });

    it('should get case style name', () => {
      expect(transformer.getCaseStyle()).toBe('camelCase');
    });

    it('should get description', () => {
      expect(transformer.getDescription()).toContain('camelCase');
    });
  });

  describe('SnakeCase Transformer', () => {
    const transformer = new SnakeCaseTransformer();

    it('should transform camelCase to snake_case', () => {
      expect(transformer.transform('userName')).toBe('user_name');
      expect(transformer.transform('firstName')).toBe('first_name');
      expect(transformer.transform('userAge')).toBe('user_age');
    });

    it('should transform PascalCase to snake_case', () => {
      expect(transformer.transform('UserName')).toBe('user_name');
      expect(transformer.transform('FirstName')).toBe('first_name');
    });

    it('should transform kebab-case to snake_case', () => {
      expect(transformer.transform('user-name')).toBe('user_name');
      expect(transformer.transform('first-name')).toBe('first_name');
    });

    it('should detect snake_case strings', () => {
      expect(transformer.detect('user_name')).toBe(true);
      expect(transformer.detect('first_name')).toBe(true);
      expect(transformer.detect('userName')).toBe(false);
      expect(transformer.detect('UserName')).toBe(false);
      expect(transformer.detect('user-name')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(transformer.transform('')).toBe('');
      expect(transformer.transform('user')).toBe('user');
      expect(transformer.transform('USER')).toBe('u_s_e_r');
    });

    it('should get case style name', () => {
      expect(transformer.getCaseStyle()).toBe('snake_case');
    });

    it('should get description', () => {
      expect(transformer.getDescription()).toContain('snake_case');
    });
  });

  describe('PascalCase Transformer', () => {
    const transformer = new PascalCaseTransformer();

    it('should transform snake_case to PascalCase', () => {
      expect(transformer.transform('user_name')).toBe('UserName');
      expect(transformer.transform('first_name')).toBe('FirstName');
      expect(transformer.transform('user_age')).toBe('UserAge');
    });

    it('should transform camelCase to PascalCase', () => {
      expect(transformer.transform('userName')).toBe('UserName');
      expect(transformer.transform('firstName')).toBe('FirstName');
    });

    it('should transform kebab-case to PascalCase', () => {
      expect(transformer.transform('user-name')).toBe('UserName');
      expect(transformer.transform('first-name')).toBe('FirstName');
    });

    it('should detect PascalCase strings', () => {
      expect(transformer.detect('UserName')).toBe(true);
      expect(transformer.detect('FirstName')).toBe(true);
      expect(transformer.detect('userName')).toBe(false);
      expect(transformer.detect('user_name')).toBe(false);
      expect(transformer.detect('user-name')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(transformer.transform('')).toBe('');
      expect(transformer.transform('user')).toBe('User');
      expect(transformer.transform('USER')).toBe('USER');
    });

    it('should get case style name', () => {
      expect(transformer.getCaseStyle()).toBe('PascalCase');
    });

    it('should get description', () => {
      expect(transformer.getDescription()).toContain('PascalCase');
    });
  });

  describe('KebabCase Transformer', () => {
    const transformer = new KebabCaseTransformer();

    it('should transform snake_case to kebab-case', () => {
      expect(transformer.transform('user_name')).toBe('user-name');
      expect(transformer.transform('first_name')).toBe('first-name');
      expect(transformer.transform('user_age')).toBe('user-age');
    });

    it('should transform camelCase to kebab-case', () => {
      expect(transformer.transform('userName')).toBe('user-name');
      expect(transformer.transform('firstName')).toBe('first-name');
    });

    it('should transform PascalCase to kebab-case', () => {
      expect(transformer.transform('UserName')).toBe('user-name');
      expect(transformer.transform('FirstName')).toBe('first-name');
    });

    it('should detect kebab-case strings', () => {
      expect(transformer.detect('user-name')).toBe(true);
      expect(transformer.detect('first-name')).toBe(true);
      expect(transformer.detect('userName')).toBe(false);
      expect(transformer.detect('user_name')).toBe(false);
      expect(transformer.detect('UserName')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(transformer.transform('')).toBe('');
      expect(transformer.transform('user')).toBe('user');
      expect(transformer.transform('USER')).toBe('u-s-e-r');
    });

    it('should get case style name', () => {
      expect(transformer.getCaseStyle()).toBe('kebab-case');
    });

    it('should get description', () => {
      expect(transformer.getDescription()).toContain('kebab-case');
    });
  });
});
