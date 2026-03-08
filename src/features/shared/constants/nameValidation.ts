export interface NameValidationConfig {
  minLength: number;
  maxLength: number;
  allowedPattern: RegExp;
  duplicateErrorMessage: string;
  invalidCharsErrorMessage: string;
  lengthErrorMessage: (min: number, max: number) => string;
}

export const DEFAULT_NAME_VALIDATION_CONFIG: NameValidationConfig = {
  minLength: 1,
  maxLength: 100,
  allowedPattern: /^[a-zA-Z0-9_-]+$/,
  duplicateErrorMessage: 'This name already exists',
  invalidCharsErrorMessage:
    'Name can only contain letters, numbers, hyphens (-), and underscores (_)',
  lengthErrorMessage: (min: number, max: number) =>
    `Name must be between ${min} and ${max} characters`,
};
