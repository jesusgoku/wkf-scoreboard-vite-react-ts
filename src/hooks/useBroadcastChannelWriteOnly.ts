import { useEffect, useRef } from 'react';

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
