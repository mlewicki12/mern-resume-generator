
import React from 'react';
import styled from 'styled-components';

import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
  margin: 0.5rem;
  padding: 0.5rem;
  border: 1px solid black;
  borderRadius: 16px;
  background-color: white;
`;

const Title = styled.h1`
  margin: 0;
`;

type ResumeComponent = {
  title: string;
  variables: string[];
  id: string;
  index: number;
}

const ResumeComponent = ({
  title, variables, id, index
}: ResumeComponent) => {
  return (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <Container {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          <Title>{title}</Title>
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