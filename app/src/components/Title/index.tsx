
import React from 'react';

type TitleProps = {
  title: string;
  subtitle?: string;
}

const Title = ({
  title, subtitle
}: TitleProps) => {
  return (
    <div className='flex flex-col'>
      <h2 className='title'>{title}</h2>
      {subtitle && <p className='-mt-1 text-sm'>{subtitle}</p>}
    </div>
  )
}

export default Title;