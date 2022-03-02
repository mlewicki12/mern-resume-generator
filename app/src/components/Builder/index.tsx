
import React, { useState, useEffect } from 'react';
import ComponentList from './ComponentList';
import ThemeSelect from './ThemeSelect';

const Builder = () => {
  const [selected, setSelected] = useState<string>('');
  const [step, setStep] = useState<number>(0);

  const steps = [
    {
      name: 'theme-select',
      component: (<ThemeSelect onSelect={setSelected} />)
    },
    {
      name: 'component-picker',
      component: (<ComponentList theme={selected} />)
    }
  ];

  return (
    <div className='wrapper container h-full flex flex-col'>
      <div className='p-2'>
        {steps[step].component}
      </div>
        
      <div className='form-controls'>
        <button disabled={step === 0} onClick={() => setStep(step => step - 1)}>Back</button>
        <button disabled={step === steps.length - 1} onClick={() => setStep(step => step + 1)}>Continue</button>
      </div>
    </div>
  );
}

export default Builder;