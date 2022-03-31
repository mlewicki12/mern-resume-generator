
import React, { useState } from 'react';
import AnimateHeight from 'react-animate-height';

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
  const [open, setOpen] = useState<boolean>(true);

  const type = theme.components[component]?.variables.find(vars => vars.name === variable)?.type;
  if(!type) return (<p className='text-red-500'>invalid component {component}</p>);

  // todo separate type checking
  const display = type.endsWith('list') ? 'array' : 'text';

  const handleUpdate = (value: string) => {
    setValue(value);
    onUpdate(variable, value);
  }

  const handleArrayUpdate = (index: number, update?: string) => {
    // todo error reporting for type mismatch?
    if(!Array.isArray(value)) return;

    if(index === value.length) {
      const newVal = [ ...value, update! ];

      setValue(newVal);
      onUpdate(variable, newVal);
    } else {
      let newVal: string[];
      if(update === undefined) {
        newVal = value.filter((_, ind) => ind !== index);
      } else {
        newVal = [ ...value ];
        newVal[index] = update!;
      }

      setValue(newVal);
      onUpdate(variable, newVal);
    }
  }

  return (
    <Switch component={display}>
      <Component name='text' key={`switch-${component}-${variable}-text`}>
        <input type='text' placeholder={variable} key={variable}
          onChange={(e) => handleUpdate(e.target.value)} defaultValue={value} />
      </Component>

      <Component name='array' key={`switch-${component}-${variable}-array`}>
        <div className='flex flex-col container my-2 w-auto'>
          <div className={`row ${!open && 'pb-0'}`}>
            <Title title='Input' xs />
            <div>
              <button className='blue xs' disabled={open} onClick={() => setOpen(true)}>Edit</button>
              <button className='green xs' onClick={(e) => handleArrayUpdate(value.length, '')}>Add</button>
            </div>
          </div>
          <AnimateHeight height={open ? 'auto' : 0}>
            <div className='flex flex-col component-input p-2'>
              {Array.isArray(value) && value.map((val, index) => (
                <>
                  {value.length > 1
                  ? <div key={`${component}-${variable}-${index}`} className='row'>
                      <input type='text' className='basis-11/12' placeholder={`${variable} ${index + 1}`} key={`${component}-${variable}-input-${index}`}
                        onChange={(e) => handleArrayUpdate(index, e.target.value)} defaultValue={val} />
                      <button key={`${component}-${variable}-delete-${index}`} className='red xs basis-auto' onClick={(e) => handleArrayUpdate(index)}>Delete</button>
                    </div>
                  : <input type='text' placeholder={`${variable} ${index + 1}`} key={`${component}-${variable}-${index}`}
                      onChange={(e) => handleArrayUpdate(index, e.target.value)} defaultValue={val} />
                  }
                </>
              ))}
            </div>
          </AnimateHeight>
          {open && <button className='red sm' onClick={() => setOpen(false)}>Close</button>}
        </div>
      </Component>
    </Switch>
  );
}

export default Input;
