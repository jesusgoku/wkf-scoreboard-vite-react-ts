import { Reducer, ReducerState } from 'react';
import { useBroadcastReducer } from '../hooks/useBroadcastReducer';
import { useBroadcastChannelReadOnly } from '../hooks/useBroadcastChannelReadOnly';

export function makeBroadcastReducer<R extends Reducer<any, any>>(
  channelName: string,
  reducer: R,
  initialState: ReducerState<R>,
) {
  return {
    useReducer: () => useBroadcastReducer(channelName, reducer, initialState),
    useState: () => useBroadcastChannelReadOnly(channelName, initialState),
  };
}
