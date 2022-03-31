
import React from 'react';
import Component, { ComponentProps } from './Component';

type SwitchProps = {
  component: string;
  children: React.ReactElement<ComponentProps> | React.ReactElement<ComponentProps>[];
};

const Switch = ({
  component, children
}: SwitchProps) => {
  const childArray = Array.isArray(children) ? children : [ children ];
  const displayComponent = childArray.find(child => child.props.name === component)
    ?? childArray.find(child => !child.props.name);

  return (
    <>
      {displayComponent}
    </>
  );
}

export { type ComponentProps, Component };
export default Switch;