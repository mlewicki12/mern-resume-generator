
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Draggable } from 'react-beautiful-dnd';

import { Container } from 'utilities/styled';
import { FormControl, FormGroup, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { Delete } from '@mui/icons-material';

const TitleWrapper = styled.div`
  border-bottom: 1px solid black
  padding: 0.25rem;
`;

const Title = styled.h2`
  margin: 0;
  margin-bottom: 0.5rem;
`;

type ResumeComponent = {
  component: string;
  variables: string[];
  id: string;
  index: number;
  components: string[];

  onUpdateComponent: (arg0: string, arg1: string) => void;
  onDeleteComponent: (arg0: string) => void;
}

const ResumeComponent = ({
  component, variables, id, index, components,
  onUpdateComponent, onDeleteComponent
}: ResumeComponent) => {
  const [compDisplay, setCompDisplay] = useState<string>(component);
  const [error, setError] = useState<string | undefined>(undefined);

  const updateComponent = (comp: string) => {
    setCompDisplay(comp);
    onUpdateComponent(id, comp);
  }

  useEffect(() => {
    if(compDisplay !== component) {
      setError('unable to process component name');
    }
  }, [component]);

  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <Container {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <FormGroup row
            sx={{display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between', alignItems: 'center'}}>
            <FormControl variant='outlined'>
              <InputLabel id='component-type-label'>Component</InputLabel>
              <Select
                labelId='component-type-label'
                id='component-type-select'
                value={compDisplay}
                error={error !== undefined}
                label='Component'
                onChange={e => updateComponent(e.target.value)}
                sx={{display: 'flex', minWidth: '250px'}}
              >
                {components.map(item => (
                  <MenuItem value={item} key={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton onClick={() => onDeleteComponent(id)} color='error'>
              <Delete />
            </IconButton>
          </FormGroup>
          <ul>
            {variables.map(name => ( 
              <li key={name}>{name}</li>
            ))}
          </ul>
        </Container>
      )}
    </Draggable>
  );
}

export default ResumeComponent;