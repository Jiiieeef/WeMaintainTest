import { checkDatesIntersection } from './utils'

describe('checkDatesIntersection', () => {
  const octoberFirst = new Date('10/01/2021 12:00')
  const octoberFifteen = new Date('10/15/2021 12:00')

  const novemberFirst = new Date('11/01/2021 12:00')
  const novemberFifteen = new Date('11/15/2021 12:00')

  describe('it should return true when', () => {
    test('[startDate, startNewDate, endNewDate, endDate]', () => {
      expect(
        checkDatesIntersection(
          octoberFirst,
          novemberFirst,
          novemberFifteen,
          octoberFifteen
        )
      ).toBe(true)
    })

    test('[startDate, startNewDate, endDate, endNewDate]', () => {
      expect(
        checkDatesIntersection(
          octoberFirst,
          novemberFirst,
          octoberFifteen,
          novemberFifteen
        )
      ).toBe(true)
    })

    test('[startNewDate, startDate, endDate, endNewDate]', () => {
      expect(
        checkDatesIntersection(
          novemberFirst,
          octoberFirst,
          octoberFifteen,
          novemberFifteen
        )
      ).toBe(true)
    })

    test('[startNewDate, startDate, endDate, endNewDate]', () => {
      expect(
        checkDatesIntersection(
          novemberFirst,
          octoberFirst,
          octoberFifteen,
          novemberFifteen
        )
      ).toBe(true)
    })
  })

  describe('it should return false when', () => {
    test('[startDate, endDate = startNewDate, endNewDate]', () => {
      expect(
        checkDatesIntersection(
          octoberFirst,
          octoberFifteen,
          octoberFifteen,
          novemberFifteen
        )
      ).toBe(false)
    })

    test('[startNewDate, endNewDate = startDate, endDate]', () => {
      expect(
        checkDatesIntersection(
          novemberFirst,
          novemberFifteen,
          octoberFifteen,
          novemberFirst
        )
      ).toBe(false)
    })

    test('[startNewDate, endNewDate, startDate, endDate]', () => {
      expect(
        checkDatesIntersection(
          novemberFirst,
          novemberFifteen,
          octoberFirst,
          octoberFifteen
        )
      ).toBe(false)
    })

    test('[startDate, endDate, startNewDate, endNewDate]', () => {
      expect(
        checkDatesIntersection(
          octoberFirst,
          octoberFifteen,
          novemberFirst,
          novemberFifteen
        )
      ).toBe(false)
    })
  })
})
