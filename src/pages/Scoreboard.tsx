import { AppState, Color, useAppState } from '../reducers/useAppReducer';
import { timeFormat } from '../utils/timeFormat';

export function Scoreboard() {
  const state = useAppState();
  const colors: Color[] = ['ao', 'aka'];

  return (
    <>
      <h1>Scoreboard</h1>
      <p
        style={{
          color: state.isTimerRunning ? 'green' : 'white',
          fontSize: '10vmin',
        }}
      >
        {timeFormat(state.time)}
      </p>

      <p className="winner">{state.winner ? state.winner : '\u00A0'}</p>

      <div className="container">
        {colors.map((color) => (
          <div className="color-container">
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
                      ? { backgroundColor: 'red' }
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
