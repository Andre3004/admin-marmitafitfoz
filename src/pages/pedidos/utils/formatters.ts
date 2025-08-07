export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatCurrencyInput = (value: string): string => {
  const numericValue = value.replace(/[^\d]/g, '');
  const floatValue = parseFloat(numericValue) / 100;

  if (isNaN(floatValue)) {
    return '';
  }

  return floatValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const parseCurrencyInput = (value: string): number => {
  const numericValue = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(numericValue) || 0;
};

export const formatApiCurrency = (value: number): number => {
  return parseFloat(value.toFixed(2));
};

export const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('pt-BR');
};

export const formatDateTime = (date: string): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDateForInput = (date: string): string => {
  if (!date) {
    return '';
  }
  const dateObj = new Date(date);
  return dateObj.toISOString().split('T')[0];
};

export const formatDateTimeForInput = (date: string): string => {
  if (!date) {
    return '';
  }
  const dateObj = new Date(date);
  const isoString = dateObj.toISOString();
  return isoString.slice(0, 16);
};

export const formatDateToAPI = (date: string): string => {
  return new Date(date).toISOString().split('T')[0];
};

export const formatDateTimeToAPI = (date: string): string => {
  return new Date(date).toISOString();
};
