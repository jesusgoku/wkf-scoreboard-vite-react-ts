import {
  Dispatch,
  Reducer,
  ReducerAction,
  ReducerState,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from 'react';

export function useBroadcastReducer<R extends Reducer<any, any>>(
  channelName: string,
  reducer: R,
  initialState: ReducerState<R>,
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  const channel = useRef<BroadcastChannel | null>(null);
  const [state, dispatch] = useReducer(function (
    state: R,
    action: ReducerAction<R>,
  ) {
    if (action === 'regenerate') {
      return { ...state };
    }

    return reducer(state, action);
  },
  initialState);

  useEffect(() => {
    if (channel.current) {
      channel.current.postMessage(state);
    }
  }, [state]);

  const cb = useCallback(
    (e: MessageEvent) => {
      if (e.data === 'regenerate') {
        dispatch('regenerate' as ReducerAction<R>);
      }
    },
    [channelName],
  );

  useEffect(() => {
    channel.current = new BroadcastChannel(channelName);

    channel.current.addEventListener('message', cb);

    return () => {
      if (channel.current) {
        channel.current.removeEventListener('message', cb);
        channel.current.close();
        channel.current = null;
      }
    };
  }, [cb]);

  return [state, dispatch];
}
