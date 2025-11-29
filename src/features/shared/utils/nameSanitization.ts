import type { NameValidationConfig } from '../constants/nameValidation';

export const sanitizeName = (
  value: string,
  config: Pick<NameValidationConfig, 'allowedPattern'>,
): string => {
  if (!value) {
    return '';
  }

  return value
    .split('')
    .filter((char) => config.allowedPattern.test(char))
    .join('');
};

export const validateNameFormat = (
  value: string,
  config: Pick<
    NameValidationConfig,
    'minLength' | 'maxLength' | 'allowedPattern' | 'invalidCharsErrorMessage' | 'lengthErrorMessage'
  >,
): string | null => {
  if (!value || value.trim() === '') {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.length < config.minLength || trimmed.length > config.maxLength) {
    return config.lengthErrorMessage(config.minLength, config.maxLength);
  }

  if (!config.allowedPattern.test(trimmed)) {
    return config.invalidCharsErrorMessage;
  }

  return null;
};
