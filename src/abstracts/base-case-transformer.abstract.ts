import { ICaseTransformer, ICaseTransformContext } from '../interfaces';

/**
 * Abstract base class for case transformation strategies
 */
export abstract class BaseCaseTransformer implements ICaseTransformer {
  protected readonly caseStyle: string;
  protected readonly description: string;

  constructor(caseStyle: string, description: string) {
    this.caseStyle = caseStyle;
    this.description = description;
  }

  /**
   * Transform a string to the target case style
   * Must be implemented by subclasses
   */
  abstract transform(input: string): string;

  /**
   * Transform a string with context information
   * Default implementation calls transform() and logs the result
   * @param input - The input string to transform
   * @param context - The transformation context
   * @returns The transformed string
   */
  transformWithContext(input: string, context: ICaseTransformContext): string {
    const result = this.transform(input);
    this.logTransformation(input, result, context);
    return result;
  }

  /**
   * Detect if a string matches this case style
   * Must be implemented by subclasses
   */
  abstract detect(input: string): boolean;

  /**
   * Get the case style name
   */
  getCaseStyle(): string {
    return this.caseStyle;
  }

  /**
   * Get the case style description
   */
  getDescription(): string {
    return this.description;
  }

  /**
   * Validate input string
   * @param input - The input string to validate
   * @returns True if the input is valid
   */
  protected isValidInput(input: string): boolean {
    return typeof input === 'string';
  }

  /**
   * Handle empty or invalid input
   * @param input - The input string
   * @returns The input as-is if invalid, or transformed if valid
   */
  protected handleInvalidInput(input: string): string {
    if (!this.isValidInput(input)) {
      return input;
    }
    return this.transform(input);
  }

  /**
   * Get transformation context information
   * @param context - The transformation context
   * @returns Context information string
   */
  protected getContextInfo(context: ICaseTransformContext): string {
    const parts = [context.path];
    if (context.isArrayItem) {
      parts.push(`array[${context.arrayIndex}]`);
    }
    if (context.depth > 0) {
      parts.push(`depth:${context.depth}`);
    }
    return parts.join(' ');
  }

  /**
   * Log transformation activity (for debugging)
   * @param input - The input string
   * @param output - The output string
   * @param context - The transformation context
   */
  protected logTransformation(input: string, output: string, context: ICaseTransformContext): void {
    // Only log if the transformation actually changed something
    if (input !== output) {
      const contextInfo = this.getContextInfo(context);
      const logMessage = `[${this.caseStyle}] ${input} → ${output} (${contextInfo})`;

      // Check if logging is enabled (this would be set by the service)
      const loggingEnabled = (context as any).enableLogging || false;

      if (loggingEnabled && typeof console !== 'undefined') {
        // Use console.log as fallback if console.debug is not available
        if (console.debug) {
          console.debug(logMessage);
        } else if (console.log) {
          console.log(logMessage);
        }
      }
    }
  }
}
