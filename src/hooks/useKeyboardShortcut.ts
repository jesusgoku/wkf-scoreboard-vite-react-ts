import { useCallback, useEffect } from 'react';

export function useKeyboardShortcut(
  isMatch: (e: KeyboardEvent) => boolean,
  callback: () => void,
) {
  const cb = useCallback(
    (e: KeyboardEvent) => {
      if (isMatch(e)) callback();
    },
    [isMatch, callback],
  );

  useEffect(() => {
    window.addEventListener('keydown', cb);

    return () => {
      window.removeEventListener('keydown', cb);
    };
  }, []);
}
