import { useState } from 'react';

// Lists mount a closed modal per row or card; rendering none of them until the first
// open keeps page mounts cheap, and staying mounted afterwards keeps the close animation.
export const useOpenedOnce = (open: boolean): boolean => {
  const [opened, setOpened] = useState(open);
  if (open && !opened) setOpened(true);
  return opened || open;
};
