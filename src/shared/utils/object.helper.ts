export const deepPick = (obj: any, path: string): any => {
  return path.split('.').reduce((prev, curr) => prev[curr], obj);
};
