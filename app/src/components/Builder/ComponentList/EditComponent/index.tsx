
import React from 'react';
import AnimateHeight from 'react-animate-height';
import { ResumeComponent } from '../../../../api/resume.api';
import { Theme } from '../../../../api/themes.api';
import Title from '../../../Title';
import Input from './Input';

type EditComponentProps = {
  children?: React.ReactNode;
  node: ResumeComponent;
  theme: Theme;
  onUpdate: (value: ResumeComponent) => void;
  onClose: () => void;
  open?: boolean;
};

const EditComponent = ({
  children, node, theme, onUpdate, onClose, open
}: EditComponentProps) => {
  const handleUpdate = (key: string, value: string | string[]) => {
    const comp = {
      component: node.component,
      variables: {
        ...node.variables,
        [key]: value
      }
    };

    onUpdate(comp);
  }

  return (
    <div className='list container flex flex-col transition-all duration-150'>
      <div className={`row ${!open && 'closed'}`}>
        <Title className='capitalize' title={node.component} sm /> 
        <div>
          {children}
        </div>
      </div>
      <AnimateHeight height={open ? 'auto' : 0}>
        {/* react-animate-height puts a random empty div in their so this makes flex actually work */}
        <div className='flex flex-col'>
          {Object.keys(node.variables).map(key => ( 
            <Input component={node.component} variable={key} theme={theme} onUpdate={handleUpdate} defaultValue={node.variables[key]} />
          ))}
          <button className='red sm' onClick={() => onClose()}>Close</button>
        </div>
      </AnimateHeight>
    </div>
  );
};

export default EditComponent;