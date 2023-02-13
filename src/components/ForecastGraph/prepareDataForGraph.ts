import { add, getDate, parseISO, startOfDay } from 'date-fns'
import { Forecast } from './index'

export function prepareDataForGraph(data: Forecast[]): Forecast[] {
    const result: Forecast[] = []
    data.forEach((d, idx) => {
        const to = parseISO(d.to)
        const from = parseISO(d.from)
        if (getDate(from) !== getDate(to) && idx !== data.length - 1) {
            result.push({
                from: from.toString(),
                to: add(from, {
                    hours:
                        23 -
                        from.getHours() -
                        Math.floor(from.getTimezoneOffset() / 60),
                }).toString(),
                rating: d.rating,
            })
            result.push({
                from: startOfDay(to).toString(),
                to: to.toString(),
                rating: d.rating,
            })
        } else {
            result.push(d)
        }
    })
    return result
}
