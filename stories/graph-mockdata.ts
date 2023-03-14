import { addHours, addDays, getHours, formatISO, startOfDay } from 'date-fns'
import {
    Price,
    ChargingPrescription,
    ChargingPlanType,
    PriceTimeRangeAdvice,
} from '../src/components/types'

function randomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min
}

function randomPrescription(daysToAdd: number): ChargingPrescription {
    const mean = randomNumber(30, 70)
    return {
        from: addDays(new Date(), daysToAdd).toString(),
        to: addDays(new Date(), daysToAdd).toString(),
        q1: mean * 0.75,
        mean: mean,
        q3: mean * 1.25,
        stdDev: randomNumber(0, 20),
    }
}

function isDayTime(date: Date) {
    const hours = getHours(date)
    return hours > 6 && hours < 22
}

function generateRandomPriceEntries(
    numberOfPriceEntries: number,
    start?: Date
): Price[] {
    const priceEntries: Price[] = []

    const MAX_TARGET_PRICE_DELTA = 5
    const MAX_CURRENT_PRICE_DELTA = 1
    const MIN_STARTING_PRICE = 0.2
    const MAX_STARTING_PRICE = 3
    const MAX_PRICE_WIGGLE = 0.1

    const MIN_NIGHT_DIVISOR = 2
    const MAX_NIGHT_DIVISOR = 5

    const createNewTargetPrice = (basePrice: number, isDayTime: boolean) => {
        const newPrice = randomNumber(
            basePrice,
            basePrice + MAX_TARGET_PRICE_DELTA
        )
        if (!isDayTime) {
            return newPrice / randomNumber(MIN_NIGHT_DIVISOR, MAX_NIGHT_DIVISOR)
        }
        return newPrice
    }

    const calculateNewCurrentPrice = (current: number, target: number) => {
        let difference = target - current

        if (difference > MAX_CURRENT_PRICE_DELTA) {
            difference = MAX_CURRENT_PRICE_DELTA
        } else if (difference < -MAX_CURRENT_PRICE_DELTA) {
            difference = -MAX_CURRENT_PRICE_DELTA
        }

        const delta = randomNumber(0, difference)

        const wiggle = randomNumber(-MAX_PRICE_WIGGLE, MAX_PRICE_WIGGLE)

        return current + delta + wiggle
    }

    const startingDate = start ?? new Date()
    let wasDayTime = isDayTime(startingDate)

    let currentPrice = randomNumber(MIN_STARTING_PRICE, MAX_STARTING_PRICE)
    let targetPrice = createNewTargetPrice(currentPrice, wasDayTime)

    let periodTime = 4

    for (let i = 0; i < numberOfPriceEntries; i++) {
        const currentTime = addHours(startingDate, i)

        const isCurrentDayTime = isDayTime(currentTime)

        if (wasDayTime != isCurrentDayTime) {
            targetPrice = createNewTargetPrice(currentPrice, isCurrentDayTime)
        }

        if (periodTime <= 0 && isCurrentDayTime) {
            periodTime = 4
            targetPrice = createNewTargetPrice(currentPrice, isCurrentDayTime)
        } else if (isCurrentDayTime) {
            periodTime -= 1
        }

        wasDayTime = isCurrentDayTime

        currentPrice = calculateNewCurrentPrice(currentPrice, targetPrice)

        priceEntries.push({
            time: formatISO(currentTime),
            price: currentPrice,
        })
    }

    return priceEntries
}

function generateAdvice(
    priceEntries: Price[],
    chargingWindowSize: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _chargingRate: number
): PriceTimeRangeAdvice[] {
    const maxPrice = Math.max(...priceEntries.map((p) => p.price))
    const maxPriceIndex = priceEntries.findIndex((p) => p.price === maxPrice)

    return [
        {
            from: priceEntries[0].time,
            to: priceEntries[chargingWindowSize - 1].time,
            cost: 0,
            type: 'Now',
        },
        {
            from: priceEntries[Math.max(maxPriceIndex - chargingWindowSize, 0)]
                .time,
            to: priceEntries[
                Math.min(
                    maxPriceIndex + chargingWindowSize,
                    priceEntries.length - 1
                )
            ].time,
            cost: 0,
            type: 'Avoid',
        },
    ]
}

export function createMockChargingPlan(
    numberOfPriceEntries = 168
): ChargingPlanType {
    const chargingRate = 3.6
    const chargingWindowSize = 4

    const prescriptions: ChargingPrescription[] = Array.from(new Array(7)).map(
        (_, idx) => randomPrescription(idx)
    )

    const priceEntries = generateRandomPriceEntries(numberOfPriceEntries).slice(
        0,
        24
    )

    const advice = generateAdvice(
        priceEntries,
        chargingWindowSize,
        chargingRate
    )

    return {
        chargingRate,
        chargingWindowSize,
        prescriptions,
        priceEntries,
        advice,
    }
}

export function createMockPriceDataForCurrentDay(): Price[] {
    return generateRandomPriceEntries(24, startOfDay(new Date()))
}
