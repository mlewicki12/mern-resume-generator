
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import deepEqual from 'deep-equal';

import { Button, CircularProgress, IconButton } from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import ResumeComponent from 'components/resume-component';
import { Container, CenteredDiv } from 'utilities/styled';
import { Component, ResumeNode, KeyValues } from 'utilities/types';
import { Add } from '@mui/icons-material';

const ComponentList = styled.div`
  width: 100%;
  padding: 1rem;
`;

const Title = styled.h2`
  text-align: center;
`

type ResumeInput = {
  onGenerate?: (id: string) => void;
};

const ResumeInput = ({
  onGenerate
}: ResumeInput) => {
  const [componentList, setComponentList] = useState<Component[]>([]);
  const [components, setComponents] = useState<ResumeNode[]>([]);

  const [generatedValues, setGeneratedValues] = useState<ResumeNode[]>([]);

  // use a state variable to keep track of next assigned value
  const [componentId, setComponentId] = useState<number>(0);

  const addComponent = () => {
    const newComp = components.slice();

    const component = componentList.length >= 1
      ? componentList[0].name
      : ''; // error condition, but will be handled later

    const key = componentList.length >1
      ? componentList[0].key
      : ''; // error condition yadda yadda yadda

    const variables = componentList.length >= 1
      ? componentList[0].variables.reduce((prev, next) => {
        prev[next] = '';
        return prev;
      }, {} as KeyValues<string>)
      : {};

    newComp.push({
      component: key,
      name: component,
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
          key: key,
          variables: components[key].variables
        }));

        setComponentList(newData);
      })
      .catch(err => console.error(err));
  }, []);

  const handleGenerate = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/resume`, {
      theme: 'default',
      components: components
    })
      .then(response => {
        onGenerate && onGenerate(response.data);
      })
      .catch(err => console.error(err));
  }

  return (
    <Container>
      {componentList === undefined
      ? <CircularProgress />
      : <DragDropContext
          onDragEnd={({destination, source, draggableId}) => {
            if(!destination || destination.index === source.index) return;

            const newIds = components.map(item => item.id);
            newIds.splice(source.index, 1);
            newIds.splice(destination.index, 0, draggableId);

            // not a fan of the conversion here, but it tricks the type detection and nothing in there should be undefined anyways, sooo
            const newData = newIds.map(id => components.find(item => item.id === id)).filter(item => item !== undefined) as ResumeNode[];
            setComponents(newData);
          }}
        >
          <CenteredDiv style={{height: '100%', width: '100%',
            flexFlow: 'column nowrap', justifyContent: 'flex-start'}}>
            <Title>Resume Builder</Title>
            <Droppable droppableId='component-list'>
              {(provided) => ( 
                <ComponentList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {components.map((comp, index) => ( 
                    <ResumeComponent
                      component={comp.name}
                      variables={Object.keys(comp.variables)}
                      id={comp.id}
                      index={index}
                      key={comp.id}
                      components={componentList.map(comp => comp.name)}

                      onUpdateComponent={(id, name) => {
                        const index = components.findIndex(comp => comp.id === id);
                        const component = componentList.find(item => item.name === name);

                        const newComp = components.slice();

                        if(component === undefined) {
                          // error condition
                          newComp[index].variables = {};
                        } else {
                          newComp[index].name = name;
                          newComp[index].component = component.key;
                          newComp[index].variables = component.variables.reduce((prev, next) => {
                            prev[next] = '';
                            return prev;
                          }, {} as KeyValues<string>);
                        }

                        // force a re-render
                        setComponents(newComp);
                      }}

                      onUpdateVariable={(id, variable, value) => {
                        const index = components.findIndex(comp => comp.id === id);

                        const newComp = components.slice();
                        if(newComp[index].variables[variable] !== undefined) {
                          newComp[index].variables[variable] = value;
                        } else {
                          // error condition
                        }

                        setComponents(newComp);
                      }}

                      onDeleteComponent={(id) => setComponents(components.filter(comp => comp.id !== id))}
                    />
                  ))}
                  {provided.placeholder}
                </ComponentList>
              )}
            </Droppable>
            <IconButton color='primary' size='large'
              onClick={addComponent}>
              <Add />
            </IconButton>
            {components.length > 0 &&
              <CenteredDiv style={{width: '100%', justifyContent: 'space-between', marginTop: '2rem'}}>
                <Button size='large' variant='contained' sx={{margin: '0.25rem'}}>Save</Button>
                <Button size='large' variant='contained' sx={{margin: '0.25rem'}}>Export</Button>
                <Button onClick={handleGenerate}
                  size='large' variant='contained' sx={{margin: '0.25rem'}}>Generate</Button>
              </CenteredDiv>
            }
          </CenteredDiv>
        </DragDropContext>
      }
    </Container>
  );
}

export default ResumeInput;