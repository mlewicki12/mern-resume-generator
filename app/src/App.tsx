
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ThemeProvider } from '@mui/system';
import IFrame from 'react-iframe';
import theme from 'theme';

import { Container } from 'utilities/styled';
import ResumeInput from 'components/resume-input';

const ResumeBuilderDisplay = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`

const App = () => {
  const [generated, setGenerated] = useState<string>('');

  return (
    <ThemeProvider theme={theme}>
      <ResumeBuilderDisplay>
        <ResumeInput onGenerate={(data) => setGenerated(data)} />
        <Container>
          {generated !== '' &&
            <IFrame url={generated}
              width='100%'
              height='100%' />
          }
        </Container>
      </ResumeBuilderDisplay>
    </ThemeProvider>
  );
}

export default App;
