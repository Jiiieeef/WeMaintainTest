import { format } from 'date-fns'
import React from 'react'

import { Hour } from './Hour'

export const Day: React.FC<{ date: Date; styleProps: React.CSSProperties }> = ({
  date,
  styleProps,
}) => {
  return (
    <div
      style={{
        ...styleProps,
        width: '300px',
        textAlign: 'center',
      }}
    >
      {format(date, 'MM/dd/yyyy')}
      <br />
      <ul>
        {Array.from({ length: 24 }, (_, index) => (
          <Hour key={index} hour={index} date={date} />
        ))}
      </ul>
    </div>
  )
}
