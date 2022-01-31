
import React, { useState, useEffect, useRef } from 'react';

import { Draggable } from 'react-beautiful-dnd';

import { Accordion, AccordionDetails, AccordionSummary, FormControl, FormGroup, FormHelperText,
  IconButton, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField } from '@mui/material';
import { Delete, ExpandMore } from '@mui/icons-material';

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
  
  const [expanded, setExpanded] = useState<boolean>(false);
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
        <Accordion sx={{padding: '0.5rem'}} expanded={expanded} onChange={(e, exp) => setExpanded(exp)}
          {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <FormGroup row
              sx={{width: '100%', display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-between', alignItems: 'center'}}>
              <FormControl variant='outlined'>
                <InputLabel id='component-type-label'>Component</InputLabel>
                <Select
                  labelId='component-type-label'
                  id='component-type-select'
                  value={compDisplay}
                  error={error !== undefined}
                  label='Component'
                  onChange={e => {
                    e.preventDefault();
                    e.stopPropagation();

                    updateComponent(e.target.value);
                  }}
                  sx={{display: 'flex', minWidth: '250px'}}
                >
                  {components.map(item => (
                    <MenuItem value={item} key={item}>{item}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{error}</FormHelperText>
              </FormControl>
              <IconButton onClick={() => onDeleteComponent(id)} color='error'
                sx={{padding: '0 0.5rem'}}>
                <Delete />
              </IconButton>
            </FormGroup>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component='div'>
              <Table>
                <TableBody>
                  {variables.map(name => (
                    <TableRow key={name} sx={{width: '100%'}}>
                      <TableCell sx={{width: '70%'}}>
                        <TextField id={`${name}-text-input`} label={name} variant='standard' />
                      </TableCell>
                      <TableCell align='right' sx={{width: '30%'}}>
                        actions go here
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}
    </Draggable>
  );
}

export default ResumeComponent;