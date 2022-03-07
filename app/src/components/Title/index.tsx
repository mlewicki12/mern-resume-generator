
import React from 'react';

type TitleProps = {
  title: string;
  subtitle?: string;
  sm?: boolean;
  xs?: boolean;
  className?: string;
}

const Title = ({
  title, subtitle, sm, xs, className
}: TitleProps) => {
  return (
    <div className='flex flex-col'>
      {xs
      ? <h4 className={`title xs ${className}`}>{title}</h4>
      : sm
        ? <h3 className={`title sm ${className}`}>{title}</h3>
        : <h2 className={`title ${className}`}>{title}</h2>
      }
      {subtitle && <p className='-mt-1 text-sm'>{subtitle}</p>}
    </div>
  )
}

export default Title;