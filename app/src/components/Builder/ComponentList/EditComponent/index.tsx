
import React from 'react';
import { ResumeComponent } from '../../../../api/resume.api';
import Title from '../../../Title';

type EditComponentProps = {
  children?: React.ReactNode;
  node: ResumeComponent;
  onUpdate: (value: ResumeComponent) => void;
  onClose: () => void;
  open?: boolean;
};

const EditComponent = ({
  children, node, onUpdate, onClose, open
}: EditComponentProps) => {
  const handleUpdate = (key: string, value: string) => {
    const comp = {
      component: node.component,
      variables: {
        ...node.variables,
        [key]: value
      }
    };

    onUpdate(comp);
  }

  // TODO: figure out animations in react so this looks nicer
  return (
    <div className='list container flex flex-col transition-all duration-150'>
      <div className='row'>
        <Title title={node.component} sm /> 
        <div>
          {children}
        </div>
      </div>
      {open && <>
        {Object.keys(node.variables).map(key => ( 
          <input type='text' placeholder={key} key={key} onChange={(e) => handleUpdate(key, e.target.value)}
            defaultValue={node.variables[key]} />
        ))}
        <button className='sm' onClick={() => onClose()}>Close</button>
      </>}
    </div>
  );
};

export default EditComponent;