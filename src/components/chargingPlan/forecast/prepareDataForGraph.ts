import { add, getDate, startOfDay } from 'date-fns'
import { Forecast } from './forecast'

export function prepareDataForGraph(data: Forecast[]): Forecast[] {
    const result: Forecast[] = []
    data.forEach((d) => {
        const to = new Date(d.to)
        const from = new Date(d.from)
        if (getDate(from) !== getDate(to)) {
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
