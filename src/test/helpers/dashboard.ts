import { screen } from '@testing-library/react';

/** The dashboard box titled `title`. Boxes are sections without their own accessible name. */
export const findBox = async (title: string): Promise<HTMLElement> => {
  const heading = await screen.findByRole('heading', { name: title });
  const box = heading.closest<HTMLElement>('section');
  if (!box) throw new Error(`No box titled ${title}`);
  return box;
};
