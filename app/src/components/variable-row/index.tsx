
import React, { useState } from 'react';
import { TableRow, TableCell, TextField, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

type VariableRow = {
  componentId: string;
  variableName: string;

  defaultValue?: string;
  onChange?: (id: string, name: string, value: string | string[]) => void;
};

const VariableRow = ({
  componentId, variableName, defaultValue, onChange
}: VariableRow) => {
  const [value, setValue] = useState<string | string[]>(defaultValue ?? '');

  const array = Array.isArray(value) ? value : [ value ];

  return (
    <>
      {array.map((item, index) => ( 
        <TableRow key={`${variableName}-${index}`} sx={{width: '100%'}}>
          <TableCell sx={{width: '70%'}}>
            <TextField id={`${variableName}-text-input`} label={variableName} variant='standard'
              onChange={e => {
                if(Array.isArray(value)) {
                  const newVal = value.slice();
                  newVal[index] = e.target.value;

                  setValue(newVal);
                  onChange && onChange(componentId, variableName, newVal);
                } else {
                  onChange && onChange(componentId, variableName, e.target.value)
                }
              }} />
          </TableCell>
          <TableCell align='right' sx={{width: '30%'}}>
            {Array.isArray(value) && value.length > 1 &&
              <IconButton onClick={() => setValue(value.splice(index, 1))} color='error' size='small'>
                <Delete />
              </IconButton>
            }
            <IconButton onClick={() => Array.isArray(value) ? setValue([...value, '']) : setValue([value, ''])} color='primary' size='small'>
              <Add />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default VariableRow;