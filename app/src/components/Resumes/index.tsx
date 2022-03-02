
import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { DeleteResume, GenerateResume, GetAllResumes } from '../../api/resume.api';
import { getCatch } from '../../utils/promise';

const Resumes = () => {
  const [resumes, setResumes] = useState<any[]>([]);

  const handleGenerate = (id: string) => {
    GenerateResume(id, 'pink')
      .then(response => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'resume.pdf';
        link.click();
      })
      .catch(console.error);
  }

  const handleDelete = (id: string) => {
    DeleteResume(id)
      .then(() => setResumes(
        resumes.filter(item => item._id !== id)
      ))
      .catch(console.error);
  }

  useEffect(() => {
    GetAllResumes()
      .then(data => setResumes(data))
      .catch(getCatch());
  }, []);

  return (
    <ul className='wrapper flex flex-col items-center'>
      {resumes.map(res => (
        <li key={res._id} className='list container flex justify-between items-center'>
          <div className='flex flex-col justify-between'>
            <h2 className='title'>{res.name}</h2>
            <p className='text-sm'>created {moment(res.createdAt).format('YYYY-MM-DD HH:mm')}</p>
          </div>
          <div>
            <button onClick={() => handleGenerate(res._id)}>Generate</button>
            <button onClick={() => handleDelete(res._id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Resumes;