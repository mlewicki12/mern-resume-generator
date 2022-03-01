
import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className='w-full h-32 border-b border-black p-2 flex flex-row justify-center items-center'>
      <div className='w-1/2 flex flex-row justify-between items-center'>
        <Link to='/'>
          <h1 className='text-4xl font-sans'>Resume Builder</h1>
        </Link>
        <div>
          <Link to='/resumes'>
            <button>List</button>
          </Link>

          <Link to='/create'>
            <button>Create New</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Nav;