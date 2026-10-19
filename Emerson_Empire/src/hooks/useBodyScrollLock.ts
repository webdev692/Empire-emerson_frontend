import { useEffect } from 'react';

// Shared ownership prevents one overlay from releasing another overlay's lock.
let owners = 0;
let previousOverflow = '';

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    if (owners++ === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    return () => {
      if (--owners === 0) document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}
