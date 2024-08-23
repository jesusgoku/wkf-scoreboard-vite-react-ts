import { useAppState } from '../reducers/useAppReducer';
import { timeFormat } from '../utils/timeFormat';
import { SCOREBOARD_COLORS } from '../constants';

export function Scoreboard() {
  const state = useAppState();

  return (
    <div className="container">
      <div className="match-container">
        {state.displayCategory && state.category && (
          <div className="match-category">{state.category}</div>
        )}

        {state.displayTatami && state.tatami && (
          <div className="match-tatami">
            <span className="match-tatami-label">tatami</span>
            {state.tatami}
          </div>
        )}

        <div className="match-timer">{timeFormat(state.time)}</div>

        {state.winner && <div className="match-result">{state.winner}</div>}
      </div>

      {SCOREBOARD_COLORS.map((color) => (
        <div className={`player-container ${color}`}>
          <div className="player-stats">
            <div className="player-color">{color}</div>
            <div className="player-score">{state[`${color}Score`]}</div>
            <div className="player-senshu">
              {state.senshu === color ? 'Senshu' : '\u00A0'}
            </div>
            <div className="player-faults">
              {['CH1', 'CH2', 'CH3', 'HC', 'H'].map((label, index) => (
                <div
                  key={label}
                  className="player-fault"
                  style={{
                    ...(state[`${color}Faults`] >= index + 1
                      ? { backgroundColor: 'yellowgreen' }
                      : {}),
                  }}
                >
                  {label}
                </div>
              ))}
            </div>

            {state.displayPlayersName && state[`${color}PlayerName`] && (
              <div className="player-current">
                <span className="player-label">Current</span>
                {state[`${color}PlayerName`]}
              </div>
            )}

            {state.displayNextPlayersName &&
              state[`${color}NextPlayerName`] && (
                <div className="player-next">
                  <span className="player-label">Next</span>
                  {state[`${color}NextPlayerName`]}
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
