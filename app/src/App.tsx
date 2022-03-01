
import React from 'react';
import { Outlet } from 'react-router-dom';

import { Nav } from './components';

const App = () => {
  return (
    <>
      <Nav />

      <main className='w-full flex flex-col items-center p-12'>
        <Outlet />
      </main>
    </>
  );
}

export default App;
