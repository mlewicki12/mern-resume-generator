
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { ThemeProvider } from '@mui/system';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import ResumeComponent from 'components/resume-component';
import { Component } from 'utilities/types';
import theme from 'theme';
import { CircularProgress } from '@mui/material';

const Container = styled.div`
  margin: 1rem;
  border: 1px solid lightgrey;
  border-radius: 16px;
`;

const ComponentList = styled.div`
  padding: 1rem;
`;

const App = () => {
  const [data, setData] = useState<Component[] | undefined>(undefined);

  useEffect(() => {
    // TODO: learn how to type axios responses
    axios.get(`${process.env.REACT_APP_API_URL}/api/themes/default`)
      .then(response => {
        const components = response.data.components;
        const newData = Object.keys(components).map(key => ({
          id: key,
          component: components[key].name,
          variables: components[key].variables
        }));

        setData(newData);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {data === undefined
      ? <CircularProgress />
      : <DragDropContext
          onDragEnd={({destination, source, draggableId}) => {
            if(!destination || destination.index === source.index) return;

            const newIds = data.map(item => item.id);
            newIds.splice(source.index, 1);
            newIds.splice(destination.index, 0, draggableId);

            // not a fan of the conversion here, but it tricks the type detection and nothing in there should be undefined anyways, sooo
            const newData = newIds.map(id => data.find(item => item.id === id)).filter(item => item !== undefined) as Component[];
            setData(newData);
          }}
        >
          <Container>
            <Droppable droppableId='component-list'>
              {(provided) => ( 
                <ComponentList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {data.map((comp, index) => ( 
                    <ResumeComponent title={comp.component} variables={comp.variables} id={comp.id} index={index} key={comp.id} />
                  ))}
                  {provided.placeholder}
                </ComponentList>
              )}
            </Droppable>
          </Container>
        </DragDropContext>
      }
    </ThemeProvider>
  );
}

export default App;
