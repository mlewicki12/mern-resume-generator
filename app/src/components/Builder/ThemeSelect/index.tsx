
import React, { useState, useEffect } from 'react';
import resumeApi, { Resume } from '../../../api/resume.api';
import { GetThemes } from '../../../api/themes.api';
import Title from '../../Title';

type ThemeSelectProps = {
  resume: Resume;
  onChangeName: (value: string) => void;
  onSelectTheme: (value: string) => void;
}

const ThemeSelect = ({
  resume, onChangeName, onSelectTheme
}: ThemeSelectProps) => {
  const [themes, setThemes] = useState<string[]>([]);

  useEffect(() => {
    GetThemes()
      .then(data => {
        if(data.length >= 1) {
          onSelectTheme(data[0]);
        }

        setThemes(data)
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <div className='row' key='name'>
        <Title title='Name the resume' subtitle='This will help you identify it in the future' />
        <input type='text' placeholder='resume' value={resume.name} onChange={(e) => onChangeName(e.target.value)}></input>
      </div>

      <div className='row' key='theme'>
        <Title title='Select a theme' subtitle='This controls what the resume looks like' />
        <select onChange={e => onSelectTheme(e.target.value)}>
          {themes.map(theme => (
            <option value={theme} key={theme}>{theme}</option>
          ))}
        </select>
      </div>

      <div className='row' key='preview'>
        <p>there will be a theme preview here at some point</p>
      </div>
    </>
  );
};

export default ThemeSelect;