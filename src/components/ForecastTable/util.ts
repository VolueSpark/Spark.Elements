import { isEqual, parseISO, startOfDay } from 'date-fns'
import { ForecastAdvice, ForecastAdviceData } from '../types'

// This creates a 4xn two dimensional array to properly format the data for the table
export function prepareDataForTable(data: ForecastAdviceData) {
    const result: Array<Array<ForecastAdvice>> = []

    let compareDate: Date | null = null
    data.forecastAdvice.forEach((entry) => {
        const from = startOfDay(parseISO(entry.from))
        if (result.length === 0) {
            compareDate = from
            result.push([entry])
        } else {
            if (compareDate && isEqual(from, compareDate)) {
                result[result.length - 1].push(entry)
            } else {
                compareDate = from
                result.push([entry])
            }
        }
    })
    return result
}
