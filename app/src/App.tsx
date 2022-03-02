
import React from 'react';
import { Outlet } from 'react-router-dom';

import { Nav } from './components';

const App = () => {
  return (
    <>
      <Nav />

      <main className='flex flex-col items-center h-full p-12'>
        <Outlet />
      </main>
    </>
  );
}

export default App;
