import { useInterval } from '../hooks/useInterval';
import { timeFormat } from '../utils/timeFormat';
import { AppState, useAppReducer } from '../reducers/useAppReducer';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';
import { SCOREBOARD_COLORS } from '../constants';
import { Howl } from 'howler';
import { useEffect, useState } from 'react';
import timeoutSound from '../assets/timeout.mp3';
import { usePrevious } from '../hooks/usePrevious';

const sound = new Howl({
  src: [timeoutSound],
});

export function Control() {
  const [state, dispatch] = useAppReducer();
  const prevState = usePrevious(state);
  const [displaySettings, setDisplaySetting] = useState<boolean>(false);

  useEffect(() => {
    if (
      state.playSounds &&
      state.isTimerRunning &&
      state.time === state.atoshiBarakuTime
    ) {
      sound.loop(false).play();
    }

    if (state.playSounds && state.winner && prevState?.winner === undefined) {
      sound.loop(true).play();

      setTimeout(() => {
        sound.loop(false);
      }, 2000);
    }
  }, [state]);

  // -- Hooks
  useInterval(() => {
    if (state.isTimerRunning) {
      dispatch({ type: 'time-add', payload: { value: -1 } });
    }
  }, 1000);

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

  // -- Handlers
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

  return (
    <>
      <div style={{ display: displaySettings ? 'block' : 'none' }}>
        <button
          onClick={() => {
            setDisplaySetting(false);
          }}
        >
          Close
        </button>

        <p>Match Time</p>
        <input
          name="match-time"
          type="number"
          defaultValue={90}
          min={0}
          step={1}
          placeholder="Match Time"
          value={state.matchTime}
          onChange={(e) => {
            dispatch({
              type: 'match-time-set',
              payload: { value: parseInt(e.target.value, 10) },
            });
          }}
        />
        <p>Atoshi Baraku Time</p>
        <input
          name="atoshi-baraku-time"
          type="number"
          defaultValue={1}
          min={0}
          step={1}
          placeholder="Atoshi Baraku Time"
          value={state.atoshiBarakuTime}
          onChange={(e) => {
            dispatch({
              type: 'atoshi-baraku-time-set',
              payload: { value: parseInt(e.target.value, 10) },
            });
          }}
        />
        <p>Play Sounds</p>
        <input
          name="play-sounds"
          type="checkbox"
          placeholder="Play Sound"
          checked={state.playSounds}
          onChange={() => {
            dispatch({ type: 'play-sounds-toggle' });
          }}
        />
      </div>

      <div style={{ display: displaySettings ? 'none' : 'block' }}>
        <div className="container">
          <div className="timer-container">
            <button
              onClick={() => {
                setDisplaySetting(true);
              }}
            >
              Settings
            </button>
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
            <button
              onClick={handleTimeSubtract}
              disabled={state.isTimerRunning}
            >
              -1
            </button>
          </div>
          {SCOREBOARD_COLORS.map((color) => (
            <div className={`color-container ${color}`}>
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
                  dispatch({
                    type: 'score-add',
                    payload: { color, value: -1 },
                  });
                }}
              >
                -1
              </button>
              <button
                onClick={() => {
                  dispatch({ type: 'senshu', payload: { color } });
                }}
                style={{
                  ...(state.senshu === color
                    ? { backgroundColor: 'green' }
                    : {}),
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
      </div>
    </>
  );
}
