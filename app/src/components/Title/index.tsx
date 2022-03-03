
import React from 'react';

type TitleProps = {
  title: string;
  subtitle?: string;
  sm?: boolean;
  className?: string;
}

const Title = ({
  title, subtitle, sm, className
}: TitleProps) => {
  return (
    <div className='flex flex-col'>
      {sm
      ? <h3 className={`title sm ${className}`}>{title}</h3>
      : <h2 className={`title ${className}`}>{title}</h2>}
      {subtitle && <p className='-mt-1 text-sm'>{subtitle}</p>}
    </div>
  )
}

export default Title;