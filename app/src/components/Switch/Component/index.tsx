
import React from 'react';

export type ComponentProps = {
  name: string
  children?: React.ReactNode;
};

const Component = ({
  name, children
}: ComponentProps) => {
  return (
    <>
      {children}
    </>
  );
}

export default Component;