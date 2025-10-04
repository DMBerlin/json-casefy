import { BaseCaseTransformer } from '../abstracts/base-case-transformer.abstract';
import { ICaseTransformContext } from '../interfaces';

/**
 * Test implementation of BaseCaseTransformer for testing purposes
 */
class TestCaseTransformer extends BaseCaseTransformer {
  constructor() {
    super('test', 'Test transformer for coverage testing');
  }

  transform(input: string): string {
    return input.toUpperCase();
  }

  detect(input: string): boolean {
    return /^[A-Z]+$/.test(input);
  }

  // Expose protected methods for testing
  public testHandleInvalidInput(input: string): string {
    return this.handleInvalidInput(input);
  }

  public testGetContextInfo(context: ICaseTransformContext): string {
    return this.getContextInfo(context);
  }

  public testLogTransformation(
    input: string,
    output: string,
    context: ICaseTransformContext,
  ): void {
    this.logTransformation(input, output, context);
  }
}

describe('BaseCaseTransformer', () => {
  let transformer: TestCaseTransformer;

  beforeEach(() => {
    transformer = new TestCaseTransformer();
  });

  describe('handleInvalidInput', () => {
    it('should return input as-is for invalid input', () => {
      const result = transformer.testHandleInvalidInput('');
      expect(result).toBe('');
    });

    it('should transform valid input', () => {
      const result = transformer.testHandleInvalidInput('hello');
      expect(result).toBe('HELLO');
    });
  });

  describe('getContextInfo', () => {
    it('should return basic path info', () => {
      const context: ICaseTransformContext = {
        path: 'user.name',
        depth: 0,
      };
      const result = transformer.testGetContextInfo(context);
      expect(result).toBe('user.name');
    });

    it('should include array item info', () => {
      const context: ICaseTransformContext = {
        path: 'users',
        depth: 0,
        isArrayItem: true,
        arrayIndex: 0,
      };
      const result = transformer.testGetContextInfo(context);
      expect(result).toBe('users array[0]');
    });

    it('should include depth info', () => {
      const context: ICaseTransformContext = {
        path: 'user.profile.name',
        depth: 3,
      };
      const result = transformer.testGetContextInfo(context);
      expect(result).toBe('user.profile.name depth:3');
    });

    it('should include all context info', () => {
      const context: ICaseTransformContext = {
        path: 'users',
        depth: 2,
        isArrayItem: true,
        arrayIndex: 1,
      };
      const result = transformer.testGetContextInfo(context);
      expect(result).toBe('users array[1] depth:2');
    });
  });

  describe('logTransformation', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'debug').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should log transformation when input differs from output', () => {
      const context: ICaseTransformContext = {
        path: 'user.name',
        depth: 1,
        enableLogging: true,
      } as any;

      transformer.testLogTransformation('hello', 'HELLO', context);
      expect(consoleSpy).toHaveBeenCalledWith('[test] hello → HELLO (user.name depth:1)');
    });

    it('should not log when input equals output', () => {
      const context: ICaseTransformContext = {
        path: 'user.name',
        depth: 1,
        enableLogging: true,
      } as any;

      transformer.testLogTransformation('hello', 'hello', context);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should not log when logging is disabled', () => {
      const context: ICaseTransformContext = {
        path: 'user.name',
        depth: 1,
        enableLogging: false,
      } as any;

      transformer.testLogTransformation('hello', 'HELLO', context);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should handle console fallback scenario', () => {
      // Test that the method exists and can be called
      const context: ICaseTransformContext = {
        path: 'user.name',
        depth: 1,
        enableLogging: true,
      } as any;

      // This should not throw an error
      expect(() => {
        transformer.testLogTransformation('hello', 'HELLO', context);
      }).not.toThrow();
    });
  });

  describe('getCaseStyle', () => {
    it('should return the case style', () => {
      expect(transformer.getCaseStyle()).toBe('test');
    });
  });

  describe('getDescription', () => {
    it('should return the description', () => {
      expect(transformer.getDescription()).toBe('Test transformer for coverage testing');
    });
  });

  describe('transformWithContext', () => {
    it('should transform with context and log', () => {
      const consoleSpy = jest.spyOn(console, 'debug').mockImplementation();

      const context: ICaseTransformContext = {
        path: 'user.name',
        depth: 1,
        enableLogging: true,
      } as any;

      const result = transformer.transformWithContext('hello', context);
      expect(result).toBe('HELLO');
      expect(consoleSpy).toHaveBeenCalledWith('[test] hello → HELLO (user.name depth:1)');

      consoleSpy.mockRestore();
    });
  });
});
