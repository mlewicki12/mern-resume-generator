
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { ThemeProvider } from '@mui/system';
import theme from 'theme';

import { Button, CircularProgress, IconButton } from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import ResumeComponent from 'components/resume-component';
import { Container, CenteredDiv } from 'utilities/styled';
import { Component, ResumeNode, KeyValues } from 'utilities/types';
import { Add } from '@mui/icons-material';
import ResumeInput from 'components/resume-input';

const ComponentList = styled.div`
  padding: 1rem;
`;

const App = () => {
  const [componentList, setComponentList] = useState<Component[]>([]);
  const [components, setComponents] = useState<ResumeNode[]>([]);

  // use a state variable to keep track of next assigned value
  const [componentId, setComponentId] = useState<number>(0);

  const addComponent = () => {
    const newComp = components.slice();

    const component = componentList.length >= 1
      ? componentList[0].name
      : ''; // error condition, but will be handled later

    const variables = componentList.length >= 1
      ? componentList[0].variables.reduce((prev, next) => {
        prev[next] = '';
        return prev;
      }, {} as KeyValues<string>)
      : {};

    newComp.push({
      component: component,
      variables: variables,
      id: `component-${componentId}`
    });

    // iterate on component id so the next one is unique
    setComponentId(componentId + 1);
    setComponents(newComp);
  }

  useEffect(() => {
    // TODO: learn how to type axios responses
    axios.get(`${process.env.REACT_APP_API_URL}/api/themes/default`)
      .then(response => {
        const components = response.data.components;
        const newData = Object.keys(components).map(key => ({
          name: components[key].name,
          variables: components[key].variables
        }));

        setComponentList(newData);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <ResumeInput />
    </ThemeProvider>
  );
}

export default App;
