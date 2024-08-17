import { useCallback, useEffect, useRef, useState } from 'react';

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

    return () => {
      channel.removeEventListener('message', cb);
      channel.close();
    };
  }, [channelName]);

  return state;
}

export function useBroadcastChannelWriteOnly<T>(channelName: string) {
  const channel = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    channel.current = new BroadcastChannel(channelName);

    return () => {
      if (channel.current) {
        channel.current.close();
        channel.current = null;
      }
    };
  }, [channelName]);

  return (data: T) => {
    if (channel.current) {
      channel.current.postMessage(data);
    }
  };
}
