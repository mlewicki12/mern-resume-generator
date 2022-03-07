
import React, { useState } from 'react';
import { Theme } from '../../../../../api/themes.api';
import Switch, { Component } from '../../../../Switch';
import Title from '../../../../Title';

type InputProps = {
  component: string;
  variable: string;
  defaultValue: string | string[];
  theme: Theme;

  onUpdate: (variable: string, value: string | string[]) => void;
};

const Input = ({
  component, variable, theme, defaultValue, onUpdate
}: InputProps) => {
  const [value, setValue] = useState<string | string[]>(defaultValue);

  const type = theme.components[component]?.variables.find(vars => vars.name === variable)?.type;
  if(!type) return (<p className='text-red-500'>invalid component {component}</p>);

  // todo separate type checking
  const display = type.endsWith('list') ? 'array' : 'text';

  const handleUpdate = (value: string) => {
    setValue(value);
    onUpdate(variable, value);
  }

  const handleArrayUpdate = (index: number, update: string) => {
    // todo error reporting for type mismatch?
    if(!Array.isArray(value)) return;

    if(index === value.length) {
      const newVal = [ ...value, update ];

      setValue(newVal);
      onUpdate(variable, newVal);
    } else {
      const newVal = [ ...value ];
      newVal[index] = update;

      setValue(newVal);
      onUpdate(variable, newVal);
    }
  }

  return (
    <Switch component={display}>
      <Component name='text' key='text'>
        <input type='text' placeholder={variable} key={variable}
          onChange={(e) => handleUpdate(e.target.value)} defaultValue={value} />
      </Component>

      <Component name='array' key='array'>
        <div className='container my-2'>
          <div className='row'>
            <Title title='Input' xs />
            <div>
              <button className='blue xs' disabled>Edit</button>
              <button className='green xs' onClick={(e) => handleArrayUpdate(value.length, '')}>Add</button>
            </div>
          </div>
          <div className='p-2'>
            {Array.isArray(value) && value.map((val, index) => (
              <input type='text' className='w-full' placeholder={variable} key={`variable-${index}`}
                onChange={(e) => handleArrayUpdate(index, e.target.value)} defaultValue={val} />
            ))}
          </div>
        </div>
      </Component>
    </Switch>
  );
}

export default Input;
