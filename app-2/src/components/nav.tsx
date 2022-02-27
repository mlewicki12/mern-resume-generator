
import React from 'react';

const Nav = () => {
  return (
    <nav className='w-full h-32 border-b border-black p-2 flex flex-row justify-center items-center'>
      <div className='w-1/2 flex flex-row justify-between items-center'>
        <h1 className='text-4xl font-sans'>Resume Builder</h1>
        <div>
          <button>Create New</button>
        </div>
      </div>
    </nav>
  );
}

export default Nav;