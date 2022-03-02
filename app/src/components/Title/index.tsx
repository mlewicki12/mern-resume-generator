
import React from 'react';

type TitleProps = {
  title: string;
  subtitle?: string;
  sm?: boolean;
}

const Title = ({
  title, subtitle, sm
}: TitleProps) => {
  return (
    <div className='flex flex-col'>
      {sm
      ? <h3 className='title sm'>{title}</h3>
      : <h2 className='title'>{title}</h2>}
      {subtitle && <p className='-mt-1 text-sm'>{subtitle}</p>}
    </div>
  )
}

export default Title;