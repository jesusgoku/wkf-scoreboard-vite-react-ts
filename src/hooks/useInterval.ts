import { useEffect } from 'react';

export function useInterval(callback: TimerHandler, delay: number) {
  useEffect(() => {
    let interval = setInterval(callback, delay);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [callback, delay]);
}
