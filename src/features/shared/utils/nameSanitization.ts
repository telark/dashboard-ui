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
