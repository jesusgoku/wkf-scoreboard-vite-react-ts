import { AppState, useAppState } from '../reducers/useAppReducer';
import { timeFormat } from '../utils/timeFormat';
import { SCOREBOARD_COLORS } from '../constants';

export function Scoreboard() {
  const state = useAppState();

  return (
    <>
      <div className="container">
        <div className="timer-container">
          <p
            style={{
              color: state.isTimerRunning ? 'green' : 'white',
              fontSize: '10vmin',
            }}
          >
            {timeFormat(state.time)}
          </p>

          <p className="winner">{state.winner ? state.winner : '\u00A0'}</p>
        </div>
        {SCOREBOARD_COLORS.map((color) => (
          <div className={`color-container ${color} scoreboard`}>
            <h2>{color.toUpperCase()}</h2>
            <p style={{ fontSize: '8vmin' }}>
              {state[`${color}Score` as keyof AppState]}{' '}
            </p>
            <p style={{ color: 'green' }}>
              {state.senshu === color ? 'Senshu' : '\u00A0'}
            </p>

            {/* <p>Faults: {state[`${color}Faults` as keyof AppState]}</p> */}

            <ul className="faults-container">
              {['CH1', 'CH2', 'CH3', 'HC', 'H'].map((label, index) => (
                <li
                  style={{
                    ...(state[`${color}Faults`] >= index + 1
                      ? { backgroundColor: 'yellowgreen' }
                      : {}),
                  }}
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}
