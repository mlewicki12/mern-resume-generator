
import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { GetAllResumes } from '../api/resume.api';
import { getCatch } from '../utils/promise';

const Resumes = () => {
  const [resumes, setResumes] = useState<any[]>([]);

  useEffect(() => {
    GetAllResumes()
      .then(data => setResumes(data))
      .catch(getCatch());
  }, []);

  return (
    <div className='m-1/2 w-1/2 h-full p-12 flex flex-col items-center'>
      {resumes.map(res => (
        <div key={res._id} className='container flex justify-between'>
          <h2 className='font-bold text-xl'>{res.name}</h2>
          {moment(res.createdAt).format('YYYY-MM-DD HH:mm')}
        </div>
      ))}
    </div>
  );
}

export default Resumes;