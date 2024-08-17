import { useInterval } from '../hooks/useInterval';
import { timeFormat } from '../utils/timeFormat';
import { AppState, Color, useAppReducer } from '../reducers/useAppReducer';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

export function Control() {
  const [state, dispatch] = useAppReducer();

  useInterval(() => {
    if (state.isTimerRunning) {
      dispatch({ type: 'time-add', payload: { value: -1 } });
    }
  }, 1000);

  function handleReset() {
    dispatch({ type: 'timer-running-set', payload: { value: false } });
    dispatch({ type: 'reset' });
  }

  function handleTimeStart() {
    dispatch({ type: 'timer-running-set', payload: { value: true } });
  }

  function handleTimeEnd() {
    dispatch({ type: 'timer-running-set', payload: { value: false } });
  }

  function handleTimeAdd() {
    dispatch({ type: 'time-add', payload: { value: 1 } });
  }

  function handleTimeSubtract() {
    dispatch({ type: 'time-add', payload: { value: -1 } });
  }

  useKeyboardShortcut(
    (e) => e.key === ' ',
    () => {
      dispatch({ type: 'timer-running-toggle' });
    },
  );

  useKeyboardShortcut(
    (e) => e.key === 'r',
    () => {
      dispatch({ type: 'timer-running-set', payload: { value: false } });
      dispatch({ type: 'reset' });
    },
  );

  useKeyboardShortcut(
    (e) => e.key === '+',
    () => {
      dispatch({ type: 'time-add', payload: { value: 1 } });
    },
  );

  useKeyboardShortcut(
    (e) => e.key === '-',
    () => {
      dispatch({ type: 'time-add', payload: { value: -1 } });
    },
  );

  const colors: Color[] = ['ao', 'aka'];

  return (
    <>
      <h1>Control</h1>
      <p style={{ color: state.isTimerRunning ? 'green' : 'white' }}>
        Time: {timeFormat(state.time)}
      </p>
      <button onClick={handleReset} disabled={state.isTimerRunning}>
        Reset
      </button>
      <button onClick={handleTimeStart} disabled={state.isTimerRunning}>
        Start
      </button>
      <button onClick={handleTimeEnd} disabled={!state.isTimerRunning}>
        Stop
      </button>
      <button onClick={handleTimeAdd} disabled={state.isTimerRunning}>
        +1
      </button>
      <button onClick={handleTimeSubtract} disabled={state.isTimerRunning}>
        -1
      </button>

      <div className="container">
        {colors.map((color) => (
          <div className="color-container">
            <h2>{color.toUpperCase()}</h2>
            <p>Score: {state[`${color}Score` as keyof AppState]}</p>
            <button
              onClick={() => {
                dispatch({ type: 'score-add', payload: { color, value: 3 } });
              }}
            >
              Ippon
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'score-add', payload: { color, value: 2 } });
              }}
            >
              Waza Ari
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'score-add', payload: { color, value: 1 } });
              }}
            >
              Yuko
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'score-add', payload: { color, value: -1 } });
              }}
            >
              -1
            </button>
            <button
              onClick={() => {
                dispatch({ type: 'senshu', payload: { color } });
              }}
              style={{
                ...(state.senshu === color ? { backgroundColor: 'green' } : {}),
              }}
            >
              Senshu
            </button>

            <p>Faults: {state[`${color}Faults` as keyof AppState]}</p>

            <div>
              {['CH1', 'CH2', 'CH3', 'HC', 'H'].map((label, index) => (
                <button
                  onClick={() => {
                    dispatch({
                      type: 'faults-set',
                      payload: { color, value: index + 1 },
                    });
                  }}
                  style={{
                    ...(state[`${color}Faults`] >= index + 1
                      ? { backgroundColor: 'red' }
                      : {}),
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
