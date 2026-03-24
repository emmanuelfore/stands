import { addMonths, startOfMonth, format } from 'date-fns'

export interface ScheduleItem {
  due_date: string
  amount_due: number
  status: 'pending'
}

export function generatePaymentSchedule(
  totalAmount: number,
  deposit: number,
  months: number,
  startDate: string | Date = new Date()
): ScheduleItem[] {
  const balance = totalAmount - deposit
  const monthlyInstalment = balance / months
  
  const schedule: ScheduleItem[] = []
  let currentDate = new Date(startDate)

  // First instalment is usually 1 month after start/deposit
  for (let i = 0; i < months; i++) {
    currentDate = addMonths(currentDate, 1)
    schedule.push({
      due_date: format(currentDate, 'yyyy-MM-dd'),
      amount_due: Number(monthlyInstalment.toFixed(2)),
      status: 'pending'
    })
  }

  return schedule
}
