export const formatCurrency = (value: any): string =>
  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const parseJson = (data: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing json', error);
  }
  return null;
};
