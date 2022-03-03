
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GetResume, Resume } from '../../api/resume.api';
import ComponentList from './ComponentList';
import ThemeSelect from './ThemeSelect';

const Builder = () => {
  const [resume, setResume] = useState<Resume>({
    name: '',
    theme: 'default',
    components: []
  });
  const [selected, setSelected] = useState<string>('');
  const [step, setStep] = useState<number>(0);

  const { id } = useParams();

  const updateName = (value: string) => {
    const newRes = {...resume};
    newRes.name = value;

    setResume(newRes);
  }

  useEffect(() => {
    if(id) {
      GetResume(id)
        .then(res => setResume(res))
        .catch(console.error);
    }
  }, [id]);

  const steps = [
    {
      name: 'theme-select',
      component: (<ThemeSelect resume={resume} onSelectTheme={setSelected} onChangeName={name => updateName(name)} />)
    },
    {
      name: 'component-picker',
      component: (<ComponentList resume={resume} theme={selected} />)
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