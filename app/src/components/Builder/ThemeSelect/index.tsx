
import React, { useState, useEffect } from 'react';
import { GetThemes } from '../../../api/themes.api';
import Title from '../../Title';

type ThemeSelectProps = {
  onSelect: (value: string) => void;
}

const ThemeSelect = ({
  onSelect
}: ThemeSelectProps) => {
  const [themes, setThemes] = useState<string[]>([]);

  useEffect(() => {
    GetThemes()
      .then(data => {
        if(data.length >= 1) {
          onSelect(data[0]);
        }

        setThemes(data)
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <div className='row'>
        <Title title='Select a theme' />
        <select onChange={e => onSelect(e.target.value)}>
          {themes.map(theme => (
            <option value={theme} key={theme}>{theme}</option>
          ))}
        </select>
      </div>
      <p>there will be a theme preview here at some point</p>
    </>
  );
};

export default ThemeSelect;