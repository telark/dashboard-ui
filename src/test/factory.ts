/** A typed factory. `build` gets a per-factory sequence, so records are unique without inventing names. */
export const createFactory = <T extends object>(build: (sequence: number) => T) => {
  let sequence = 0;
  return (overrides: Partial<T> = {}): T => {
    sequence += 1;
    return { ...build(sequence), ...overrides };
  };
};
