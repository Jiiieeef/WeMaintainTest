import { startOfWeek } from 'date-fns'
import React, { useState } from 'react'

import { SelectWeek } from './SelectWeek'

export const Calendar: React.FC = () => {
  const [activeDate, setActiveDate] = useState<Date>(() => {
    const today = new Date()

    return startOfWeek(today)
  })

  return <SelectWeek activeDate={activeDate} setActiveDate={setActiveDate} />
}
