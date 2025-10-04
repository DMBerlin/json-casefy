import { CasefyService } from '../services';
import { CaseTransformerFactory } from '../factories';

describe('Context-Aware Transformations', () => {
  describe('CasefyService with Context', () => {
    it('should use transformWithContext for key transformations', () => {
      const service = new CasefyService('snake_case', 'camelCase');
      const input = {
        user_name: 'John',
        user_profile: {
          first_name: 'John',
          last_name: 'Doe',
        },
      };

      const result = service.transform(input);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        userName: 'John',
        userProfile: {
          firstName: 'John',
          lastName: 'Doe',
        },
      });
    });

    it('should provide context information during transformation', () => {
      const service = new CasefyService('snake_case', 'camelCase');

      // Enable logging to see context information
      service.setLogging(true);

      const input = {
        user_name: 'John',
        nested: {
          deep_property: 'value',
        },
      };

      // Capture console.debug calls
      const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();

      const result = service.transform(input);

      expect(result.success).toBe(true);

      // Verify that context information was logged
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[camelCase] user_name → userName'),
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[camelCase] deep_property → deepProperty'),
      );

      consoleSpy.mockRestore();
    });

    it('should handle array context correctly', () => {
      const service = new CasefyService('snake_case', 'camelCase');
      const input = {
        user_list: [{ first_name: 'John' }, { last_name: 'Doe' }],
      };

      const result = service.transform(input);

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        userList: [{ firstName: 'John' }, { lastName: 'Doe' }],
      });
    });

    it('should provide detailed context information', () => {
      const service = new CasefyService('snake_case', 'camelCase');
      service.setLogging(true);

      const input = {
        user_profile: {
          personal_info: {
            first_name: 'John',
          },
        },
      };

      const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();

      service.transform(input);

      // Check that context includes path information
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('user_profile'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('personal_info'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('first_name'));

      consoleSpy.mockRestore();
    });
  });

  describe('CaseTransformerFactory with Context', () => {
    it('should detect case styles with context', () => {
      const camelCaseTransformer = CaseTransformerFactory.getTransformer('camelCase');
      const snakeCaseTransformer = CaseTransformerFactory.getTransformer('snake_case');

      // Test detection
      expect(camelCaseTransformer.detect('userName')).toBe(true);
      expect(snakeCaseTransformer.detect('user_name')).toBe(true);

      // Test transformation with context
      const context = {
        path: 'user.profile',
        depth: 2,
        parent: {},
        key: 'user_name',
      };

      const result = camelCaseTransformer.transformWithContext('user_name', context);
      expect(result).toBe('userName');
    });

    it('should provide transformer information', () => {
      const transformer = CaseTransformerFactory.getTransformer('camelCase');

      expect(transformer.getCaseStyle()).toBe('camelCase');
      expect(transformer.getDescription()).toContain('camelCase');
    });
  });
});
