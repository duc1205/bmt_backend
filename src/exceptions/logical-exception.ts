import { ErrorException } from './error-exception';
import { ErrorCode } from './error-code';
import { ValidationError } from 'class-validator';

export class LogicalException extends ErrorException {
  constructor(
    code: ErrorCode,
    message: string | undefined,
    description: string | Record<string, string[]> | undefined,
  ) {
    super(code, message, description);
  }

  public getErrors(): Record<string, any> {
    return {
      error_code: this.code,
      error_message: this.message,
      error_description: this.description,
    };
  }

  static fromValidationErrors(errors: ValidationError[]): LogicalException {
    const descriptions: Record<string, string[]> = {};
    errors.forEach((error: ValidationError) => {
      if (error.constraints) {
        const constraintDescription: string[] = [];
        const constraints = Object.keys(error.constraints);
        for (const constraint of constraints) {
          constraintDescription.push(error.constraints[`${constraint}`]);
        }
        descriptions[`${error.property}`] = constraintDescription;
      }
    });

    return new LogicalException(ErrorCode.VALIDATION_ERROR, 'Validation error.', descriptions);
  }
}
