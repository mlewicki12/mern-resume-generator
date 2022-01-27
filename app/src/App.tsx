
import React from 'react';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/system';

import theme from 'theme';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Button variant='contained'>Hello World</Button>
    </ThemeProvider>
  );
}

export default App;
