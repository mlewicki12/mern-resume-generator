
import React from 'react';

import Nav from './components/nav';
import Resumes from './components/resumes';

const App = () => {
  return (
    <>
      <Nav />

      <main className='w-full flex flex-col items-center'>
        <Resumes />
      </main>
    </>
  );
}

export default App;
