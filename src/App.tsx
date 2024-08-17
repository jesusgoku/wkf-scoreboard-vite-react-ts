import './App.css';

import { StrictMode } from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Home } from './pages/Home';
import { Control } from './pages/Control';
import { Scoreboard } from './pages/Scoreboard';

const router = createHashRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/control',
    element: <Control />,
  },
  {
    path: '/scoreboard',
    element: <Scoreboard />,
  },
]);

function App() {
  return (
    <>
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>
    </>
  );
}

export default App;
