import { useCallback, useEffect, useState } from 'react';

export function useBroadcastChannelReadOnly<T = any>(
  channelName: string,
  initialState: T,
) {
  const [state, setState] = useState<T>(initialState);

  const cb = useCallback(
    (e: MessageEvent) => {
      setState(e.data);
    },
    [channelName],
  );

  useEffect(() => {
    const channel = new BroadcastChannel(channelName);

    channel.addEventListener('message', cb);
    channel.postMessage('regenerate');

    return () => {
      channel.removeEventListener('message', cb);
      channel.close();
    };
  }, [channelName]);

  return state;
}
