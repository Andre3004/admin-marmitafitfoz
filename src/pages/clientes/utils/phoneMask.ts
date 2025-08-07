export const applyPhoneMask = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '');

  if (cleanValue.length <= 10) {
    return cleanValue.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
  }

  return cleanValue
    .replace(/(\d{2})(\d{1})(\d{4})(\d{0,4})/, '($1) $2 $3-$4')
    .trim();
};

export const removePhoneMask = (value: string): string => {
  return value.replace(/\D/g, '');
};

export const validatePhoneFormat = (value: string): boolean => {
  const cleanValue = removePhoneMask(value);
  return cleanValue.length >= 10 && cleanValue.length <= 11;
};
