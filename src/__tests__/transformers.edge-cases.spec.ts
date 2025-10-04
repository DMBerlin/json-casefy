import {
  CamelCaseTransformer,
  SnakeCaseTransformer,
  PascalCaseTransformer,
  KebabCaseTransformer,
} from '../transformers';

describe('Case Transformers Edge Cases', () => {
  describe('CamelCase Transformer Edge Cases', () => {
    const transformer = new CamelCaseTransformer();

    it('should handle strings with multiple separators', () => {
      expect(transformer.transform('user_name_age')).toBe('userNameAge');
      expect(transformer.transform('user-name-age')).toBe('userNameAge');
      expect(transformer.transform('user name age')).toBe('userNameAge');
    });

    it('should handle strings with numbers', () => {
      expect(transformer.transform('user_1_name')).toBe('user1Name');
      expect(transformer.transform('user-1-name')).toBe('user1Name');
    });

    it('should handle empty strings and special cases', () => {
      expect(transformer.transform('')).toBe('');
      expect(transformer.transform('_')).toBe('_');
      expect(transformer.transform('-')).toBe('');
      expect(transformer.transform(' ')).toBe('');
    });

    it('should handle already camelCase strings', () => {
      expect(transformer.transform('userName')).toBe('userName');
      expect(transformer.transform('firstName')).toBe('firstName');
    });
  });

  describe('SnakeCase Transformer Edge Cases', () => {
    const transformer = new SnakeCaseTransformer();

    it('should handle strings with multiple uppercase letters', () => {
      expect(transformer.transform('XMLHttpRequest')).toBe('x_m_l_http_request');
      expect(transformer.transform('HTTPSRequest')).toBe('h_t_t_p_s_request');
    });

    it('should handle strings with numbers', () => {
      expect(transformer.transform('user1Name')).toBe('user1_name');
      expect(transformer.transform('user1Age')).toBe('user1_age');
    });

    it('should handle empty strings and special cases', () => {
      expect(transformer.transform('')).toBe('');
      expect(transformer.transform('_')).toBe('_');
      expect(transformer.transform('-')).toBe('_');
      expect(transformer.transform(' ')).toBe('_');
    });

    it('should handle already snake_case strings', () => {
      expect(transformer.transform('user_name')).toBe('user_name');
      expect(transformer.transform('first_name')).toBe('first_name');
    });
  });

  describe('PascalCase Transformer Edge Cases', () => {
    const transformer = new PascalCaseTransformer();

    it('should handle strings with multiple separators', () => {
      expect(transformer.transform('user_name_age')).toBe('UserNameAge');
      expect(transformer.transform('user-name-age')).toBe('UserNameAge');
      expect(transformer.transform('user name age')).toBe('UserNameAge');
    });

    it('should handle strings with numbers', () => {
      expect(transformer.transform('user_1_name')).toBe('User1Name');
      expect(transformer.transform('user-1-name')).toBe('User1Name');
    });

    it('should handle empty strings and special cases', () => {
      expect(transformer.transform('')).toBe('');
      expect(transformer.transform('_')).toBe('_');
      expect(transformer.transform('-')).toBe('');
      expect(transformer.transform(' ')).toBe('');
    });

    it('should handle already PascalCase strings', () => {
      expect(transformer.transform('UserName')).toBe('UserName');
      expect(transformer.transform('FirstName')).toBe('FirstName');
    });
  });

  describe('KebabCase Transformer Edge Cases', () => {
    const transformer = new KebabCaseTransformer();

    it('should handle strings with multiple uppercase letters', () => {
      expect(transformer.transform('XMLHttpRequest')).toBe('x-m-l-http-request');
      expect(transformer.transform('HTTPSRequest')).toBe('h-t-t-p-s-request');
    });

    it('should handle strings with numbers', () => {
      expect(transformer.transform('user1Name')).toBe('user1-name');
      expect(transformer.transform('user1Age')).toBe('user1-age');
    });

    it('should handle empty strings and special cases', () => {
      expect(transformer.transform('')).toBe('');
      expect(transformer.transform('_')).toBe('-');
      expect(transformer.transform('-')).toBe('-');
      expect(transformer.transform(' ')).toBe('-');
    });

    it('should handle already kebab-case strings', () => {
      expect(transformer.transform('user-name')).toBe('user-name');
      expect(transformer.transform('first-name')).toBe('first-name');
    });
  });
});
