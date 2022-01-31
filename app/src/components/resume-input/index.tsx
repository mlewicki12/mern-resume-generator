
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { Button, CircularProgress, IconButton } from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import ResumeComponent from 'components/resume-component';
import { Container, CenteredDiv } from 'utilities/styled';
import { Component, ResumeNode, KeyValues } from 'utilities/types';
import { Add } from '@mui/icons-material';

const ComponentList = styled.div`
  padding: 1rem;
`;

type ResumeInput = {

};

const ResumeInput = ({

}: ResumeInput) => {
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
    <CenteredDiv>
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
          <Container style={{width: '100%'}}>
            <Droppable droppableId='component-list'>
              {(provided) => ( 
                <ComponentList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {components.map((comp, index) => ( 
                    <ResumeComponent
                      component={comp.component}
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
                          newComp[index].component = component.name;
                          newComp[index].variables = component.variables.reduce((prev, next) => {
                            prev[next] = '';
                            return prev;
                          }, {} as KeyValues<string>);
                        }

                        // force a re-render
                        setComponents(newComp);
                      }}
                      onDeleteComponent={(id) => setComponents(components.filter(comp => comp.id !== id))}
                    />
                  ))}
                  {provided.placeholder}
                </ComponentList>
              )}
            </Droppable>
            <div style={{width: '100%', display: 'flex', flexFlow: 'row nowrap', justifyContent: 'center'}}>
              <IconButton color='primary' size='large'
                onClick={addComponent}>
                <Add />
              </IconButton>
            </div>
          </Container>
        </DragDropContext>
      }
    </CenteredDiv>
  );
}

export default ResumeInput;