
import React from 'react';
import AnimateHeight from 'react-animate-height';
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
      <AnimateHeight height={open ? 'auto' : 0}>
        {/* react-animate-height puts a random empty div in their so this makes flex actually work */}
        <div className='flex flex-col'>
          {Object.keys(node.variables).map(key => ( 
            <input type='text' placeholder={key} key={key} onChange={(e) => handleUpdate(key, e.target.value)}
              defaultValue={node.variables[key]} />
          ))}
          <button className='red sm' onClick={() => onClose()}>Close</button>
        </div>
      </AnimateHeight>
    </div>
  );
};

export default EditComponent;