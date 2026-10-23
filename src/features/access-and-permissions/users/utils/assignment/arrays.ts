import { compareCodeUnits } from '../../../../../utils/layout/sort';

export const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort(compareCodeUnits);
  const sortedB = [...b].sort(compareCodeUnits);
  return sortedA.every((val, idx) => val === sortedB[idx]);
};
