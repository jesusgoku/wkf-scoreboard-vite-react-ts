import { makeBroadcastReducer } from '../factories/makeBroadcastReducer';

export type Color = 'aka' | 'ao';

export interface AppState {
  time: number;
  isTimerRunning: boolean;
  akaScore: number;
  aoScore: number;
  akaFaults: number;
  aoFaults: number;
  senshu?: Color;
  winner?: Color | 'hikiwake';
}

export const initialAppState: AppState = {
  time: 90,
  isTimerRunning: false,
  akaScore: 0,
  aoScore: 0,
  akaFaults: 0,
  aoFaults: 0,
};

type BaseAction<
  TType extends string,
  TPayload = undefined,
> = TPayload extends undefined
  ? {
      type: TType;
    }
  : {
      type: TType;
      payload: TPayload;
    };

type AppStateAction =
  | BaseAction<'reset'>
  | BaseAction<'timer-running-toggle'>
  | BaseAction<'timer-running-set', { value: boolean }>
  | BaseAction<'time-add', { value: number }>
  | BaseAction<'senshu', { color: Color }>
  | BaseAction<'score-add', { color: Color; value: number }>
  | BaseAction<'faults-set', { color: Color; value: number }>;

function reducer(state: AppState, action: AppStateAction): AppState {
  let nextState = state;

  switch (action.type) {
    case 'reset':
      return { ...initialAppState };
    case 'timer-running-toggle':
      nextState = {
        ...state,
        isTimerRunning: !state.isTimerRunning,
      };
      break;
    case 'timer-running-set':
      nextState = {
        ...state,
        isTimerRunning: action.payload.value,
      };
      break;
    case 'time-add':
      nextState = {
        ...state,
        time: state.time + action.payload.value,
      };
      break;
    case 'score-add':
      const key = `${action.payload.color}Score`;
      const score = state[key as keyof AppState] as number;

      nextState = {
        ...state,
        [key]: score + action.payload.value,
      };
      break;
    case 'faults-set':
      nextState = {
        ...state,
        [`${action.payload.color}Faults`]: action.payload.value,
      };
      break;
    case 'senshu':
      nextState = {
        ...state,
        senshu:
          state.senshu === action.payload.color
            ? undefined
            : action.payload.color,
      };
      break;
    default:
      nextState = state;
      break;
  }

  if (nextState.time > 0) nextState.winner = undefined;

  if (nextState.akaFaults >= 5) nextState.winner = 'ao';
  if (nextState.aoFaults >= 5) nextState.winner = 'aka';
  if (Math.abs(nextState.akaScore - nextState.aoScore) >= 8)
    nextState.winner = nextState.akaScore > nextState.aoScore ? 'aka' : 'ao';

  if (nextState.time === 0) {
    if (Math.abs(nextState.akaScore - nextState.aoScore) > 0)
      nextState.winner = nextState.akaScore > nextState.aoScore ? 'aka' : 'ao';
    else if (nextState.senshu) nextState.winner = nextState.senshu;
    else nextState.winner = 'hikiwake';
  }

  if (nextState.time === 0 || nextState.winner)
    nextState.isTimerRunning = false;

  return nextState;
}

export const {
  useReducer: useAppReducer, //
  useState: useAppState,
} = makeBroadcastReducer('app-state', reducer, initialAppState);
