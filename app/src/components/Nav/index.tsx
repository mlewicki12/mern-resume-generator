
import React from 'react';
import { Link, useMatch, useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();

  const resumesActive = useMatch('/resumes');
  const createActive = useMatch('/create');

  return (
    <nav className='h-32 border-b border-black p-2 flex flex-row justify-center items-center'>
      <div className='w-1/2 flex flex-row justify-between items-center'>
        <Link to='/'>
          <h1 className='text-4xl font-sans'>Resume Builder</h1>
        </Link>
        <div>
          <button onClick={() => navigate('/resumes')} className={`${resumesActive && 'active'}`}>List</button>
          <button onClick={() => navigate('/create')} className={`${createActive && 'active'}`}>Create New</button>
        </div>
      </div>
    </nav>
  );
}

export default Nav;