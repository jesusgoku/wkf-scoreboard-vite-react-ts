import { Link } from 'react-router-dom';

export function Home() {
  return (
    <>
      <h1>WKF Score Board</h1>

      <p>
        <Link to={'/control'} target="_blank">
          Control
        </Link>
      </p>

      <p>
        <Link to={'/scoreboard'} target="_blank">
          Scoreboard
        </Link>
      </p>
    </>
  );
}
