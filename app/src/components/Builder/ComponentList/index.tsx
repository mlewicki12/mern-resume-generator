
import React, { useState, useEffect } from 'react';
import { Resume, ResumeComponent } from '../../../api/resume.api';
import { LoadTheme, Theme } from '../../../api/themes.api';
import { KeyValues } from '../../../utils/types';
import Title from '../../Title';
import EditComponent from './EditComponent';

type ComponentListProps = {
  resume: Resume;
  theme: string;
}

const ComponentList = ({
  resume, theme
}: ComponentListProps) => {
  const [loaded, setLoaded] = useState<Theme | undefined>();
  const [selected, setSelected] = useState<string>('');
  const [components, setComponents] = useState<ResumeComponent[]>(resume.components);

  const [editing, setEditing] = useState<number | undefined>(undefined);

  const handleAdd = () => {
    // the button is only loaded if loaded exists, so this will never be undefined
    const component = loaded!.components[selected];

    // that being said, maybe there's an edge case in there
    // somewhere where somehow this is called with selected not existing on the object
    // idk there shouldn't be, so im not too concerned about doing anything in response
    if(!component) return;

    setComponents(comps => [...comps, {
      component: component.name,
      variables: component.variables.reduce((prev, next) => {
        prev[next.name] = '';
        return prev;
      }, {} as KeyValues<string>)
    }]);

    setEditing(components.length);
  };

  const handleDelete = (remove: number) => {
    setComponents(comps => comps.filter((item, index) => index !== remove));
  }

  const updateComponent = (index: number, value: ResumeComponent) => {
    const newComp = components.slice();
    newComp[index] = value;

    setComponents(newComp);
  }

  useEffect(() => {
    if(loaded?.name === theme) return;

    // will use this for loading indicator eventually
    setLoaded(undefined);
    LoadTheme(theme)
      .then(res => {
        setLoaded(res);

        // not the best, but just pick the first key as the selected component
        const selected = Object.keys(res.components)[0];
        setSelected(selected);
      })
      .catch(_ => {});
  }, [theme]);

  return (
    <>
      <div className='row border-b pb-2 mb-2 border-black' key='header'>
        <Title title='Build your resume' subtitle='Pick a component from the list' />
        {loaded &&
          <div>
            <select onChange={e => setSelected(e.target.value)}>
              {Object.keys(loaded.components).map(key => (
                <option value={key} key={key}>{loaded.components[key].name}</option>
              ))}
            </select>
            <button onClick={handleAdd} className='green'>Add</button>
          </div>
        }
      </div>
      <div className='p-2' key='component-list'>
        {components.map((comp, index) => (
          <EditComponent 
            open={index === editing}
            node={comp}
            onUpdate={(value) => updateComponent(index, value)}
            onClose={() => setEditing(undefined)}
          >
            <button className='blue sm' onClick={() => setEditing(index)} disabled={index === editing}>Edit</button>
            <button className='red sm' onClick={() => handleDelete(index)}>Delete</button>
          </EditComponent>
        ))}
      </div>
    </>
  );
}

export default ComponentList;