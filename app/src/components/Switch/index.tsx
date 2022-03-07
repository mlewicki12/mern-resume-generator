
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

  return (
    <>
      {childArray.find(child => child.props.name === component)}
    </>
  );
}

export { type ComponentProps, Component };
export default Switch;