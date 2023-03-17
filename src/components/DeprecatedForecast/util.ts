import { add, getDay, parseISO, startOfDay } from 'date-fns'
import { ForecastEntry } from '.'

export function prepareDataForTable(data: ForecastEntry[]) {
    const result: ForecastEntry[][] = []

    let compareDate: Date | null = null
    data.forEach((entry) => {
        const from = startOfDay(parseISO(entry.from))
        if (result.length === 0) {
            compareDate = from
            result.push([entry])
        } else {
            if (from.toISOString() === compareDate?.toISOString()) {
                result[result.length - 1].push(entry)
            } else {
                compareDate = from
                result.push([entry])
            }
        }
    })

    return result
}

export function prepareLabels(
    now: Date,
    days: string[] = [
        'Søndag',
        'Mandag',
        'Tirsdag',
        'Onsdag',
        'Torsdag',
        'Fredag',
        'Lørdag',
    ]
) {
    const result: string[] = []
    for (let i = 0; i < days.length; i++) {
        const day = getDay(add(now, { days: i }))
        result.push(days[day])
    }

    return result
}
