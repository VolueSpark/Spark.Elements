import {
    addHours,
    addDays,
    getHours,
    formatISO,
    startOfDay,
    nextDay,
    getDay,
} from 'date-fns'
import {
    Price,
    ChargingPrescription,
    ChargingPlanType,
    PriceTimeRangeAdvice,
    SpotPrice,
    SpotPriceAdviceData,
    SpotPriceAdvice,
    SpotPriceData,
    PriceRecord,
    ForecastAdvice,
    ForecastAdviceData,
<<<<<<< HEAD
=======
    AdviceSegmentType,
>>>>>>> 2628d8a (add new methods for generating forecast)
    ForecastBlockType,
} from '../src/components/types'
import { forecastAdviceData } from './mock/ForecastAdviceData'

// OLD
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

// NEW
function createNewTargetPrice(
    basePrice: number,
    isDayTime: boolean,
    maxTargerPriceDelta: number,
    maxNightDivisor: number,
    minNightDivisor: number
) {
    const newPrice = randomNumber(basePrice, basePrice + maxTargerPriceDelta)
    if (!isDayTime) {
        return newPrice / randomNumber(minNightDivisor, maxNightDivisor)
    }
    return newPrice
}
function calculateNewCurrentPrice(
    current: number,
    target: number,
    maxCurrentPriceDelta: number,
    maxPriceWiggle: number
) {
    let difference = target - current

    if (difference > maxCurrentPriceDelta) {
        difference = maxCurrentPriceDelta
    } else if (difference < -maxCurrentPriceDelta) {
        difference = -maxCurrentPriceDelta
    }

    const delta = randomNumber(0, difference)

    const wiggle = randomNumber(-maxPriceWiggle, maxPriceWiggle)

    return current + delta + wiggle
}

function getAdviceFromPrice(
    price: number,
    max: number,
    min: number
): ForecastBlockType {
    const fraction = (max - min) / 10
    if (price < min + 3 * fraction) {
        return 'Good'
    } else if (price > max - fraction * 3) {
        return 'Avoid'
    }
    return 'Normal'
}

function generateRandomSpotPrices(
    numberOfPriceEntries: number,
    start?: Date
): Price[] {
    const priceEntries: SpotPrice[] = []

    const MAX_TARGET_PRICE_DELTA = 5
    const MAX_CURRENT_PRICE_DELTA = 1
    const MIN_STARTING_PRICE = 0.2
    const MAX_STARTING_PRICE = 3
    const MAX_PRICE_WIGGLE = 0.1

    const MIN_NIGHT_DIVISOR = 2
    const MAX_NIGHT_DIVISOR = 5

    const startingDate = start ?? new Date()
    let wasDayTime = isDayTime(startingDate)

    let currentPrice = randomNumber(MIN_STARTING_PRICE, MAX_STARTING_PRICE)
    let targetPrice = createNewTargetPrice(
        currentPrice,
        wasDayTime,
        MAX_TARGET_PRICE_DELTA,
        MAX_NIGHT_DIVISOR,
        MIN_NIGHT_DIVISOR
    )

    let periodTime = 4

    for (let i = 0; i < numberOfPriceEntries; i++) {
        const currentTime = addHours(startingDate, i)

        const isCurrentDayTime = isDayTime(currentTime)

        if (wasDayTime != isCurrentDayTime) {
            targetPrice = createNewTargetPrice(
                currentPrice,
                isCurrentDayTime,
                MAX_TARGET_PRICE_DELTA,
                MAX_NIGHT_DIVISOR,
                MIN_NIGHT_DIVISOR
            )
        }

        if (periodTime <= 0 && isCurrentDayTime) {
            periodTime = 4
            targetPrice = createNewTargetPrice(
                currentPrice,
                isCurrentDayTime,
                MAX_TARGET_PRICE_DELTA,
                MAX_NIGHT_DIVISOR,
                MIN_NIGHT_DIVISOR
            )
        } else if (isCurrentDayTime) {
            periodTime -= 1
        }

        wasDayTime = isCurrentDayTime

        currentPrice = calculateNewCurrentPrice(
            currentPrice,
            targetPrice,
            MAX_CURRENT_PRICE_DELTA,
            MAX_PRICE_WIGGLE
        )

        priceEntries.push({
            time: formatISO(currentTime),
            price: currentPrice,
        })
    }

    return priceEntries
}

function generateRandomForecast(
    numberOfPriceEntries: number,
    start?: Date
): ForecastAdvice[] {
    const forecast: ForecastAdvice[] = []

    const MAX_TARGET_PRICE_DELTA = 5
    const MAX_CURRENT_PRICE_DELTA = 1
    const MIN_STARTING_PRICE = 0.2
    const MAX_STARTING_PRICE = 3
    const MAX_PRICE_WIGGLE = 0.1

    const MIN_NIGHT_DIVISOR = 2
    const MAX_NIGHT_DIVISOR = 5

    const date = start ?? new Date()
    // TODO: test if nextDay method is used correctly
    const startingDate = nextDay(startOfDay(date), getDay(date))
    let wasDayTime = isDayTime(startingDate)

    let currentPrice = randomNumber(MIN_STARTING_PRICE, MAX_STARTING_PRICE)
    let targetPrice = createNewTargetPrice(
        currentPrice,
        wasDayTime,
        MAX_TARGET_PRICE_DELTA,
        MAX_NIGHT_DIVISOR,
        MIN_NIGHT_DIVISOR
    )

    // TODO: find out what this is for
    let periodTime = 4

    const interval = 6

    let from = startingDate
    for (let i = 0; i < numberOfPriceEntries; i++) {
        const to = addHours(from, interval)

        const isCurrentDayTime = isDayTime(from)

        if (wasDayTime != isCurrentDayTime) {
            targetPrice = createNewTargetPrice(
                currentPrice,
                isCurrentDayTime,
                MAX_TARGET_PRICE_DELTA,
                MAX_NIGHT_DIVISOR,
                MIN_NIGHT_DIVISOR
            )
        }

        if (periodTime <= 0 && isCurrentDayTime) {
            periodTime = 4
            targetPrice = createNewTargetPrice(
                currentPrice,
                isCurrentDayTime,
                MAX_TARGET_PRICE_DELTA,
                MAX_NIGHT_DIVISOR,
                MIN_NIGHT_DIVISOR
            )
        } else if (isCurrentDayTime) {
            periodTime -= 1
        }

        wasDayTime = isCurrentDayTime

        currentPrice = calculateNewCurrentPrice(
            currentPrice,
            targetPrice,
            MAX_CURRENT_PRICE_DELTA,
            MAX_PRICE_WIGGLE
        )

        forecast.push({
            from: from.toISOString(),
            to: to.toISOString(),
            averagePrice: currentPrice,
            // TODO: type has to be set based on how far away from min/max price, make it 0-30, 30-80, 80-100
            type: getAdviceFromPrice(
                currentPrice,
                MAX_STARTING_PRICE,
                MIN_STARTING_PRICE
            ),
            loss: 0,
        })

        from = to
    }

    return forecast
}

function generateActualPricesAdvice(
    priceEntries: Price[],
    chargingWindowSize: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _chargingRate: number
): SpotPriceAdvice[] {
    // Max variables
    const maxPrice = Math.max(...priceEntries.map((p) => p.price))
    const maxPriceIndex = priceEntries.findIndex((p) => p.price === maxPrice)
    const maxFromIndex = Math.max(maxPriceIndex - chargingWindowSize, 0)
    const maxToIndex = Math.min(
        maxFromIndex + chargingWindowSize,
        priceEntries.length - 1
    )
    // Min variables
    const minPrice = Math.min(...priceEntries.map((p) => p.price))
    const minPriceIndex = priceEntries.findIndex((p) => p.price === minPrice)
    const minFromIndex = Math.max(minPriceIndex - chargingWindowSize, 0)
    const minToIndex = Math.min(
        minFromIndex + chargingWindowSize,
        priceEntries.length - 1
    )

    const nowCost = priceEntries
        .slice(0, chargingWindowSize)
        .reduce((acc, it) => (acc += it.price), 0)
    const maxCost = priceEntries
        .slice(maxFromIndex, maxToIndex)
        .reduce((acc, it) => (acc += it.price), 0)
    const minCost = priceEntries
        .slice(minFromIndex, minToIndex)
        .reduce((acc, it) => (acc += it.price), 0)
    return [
        {
            from: priceEntries[0].time,
            to: priceEntries[chargingWindowSize].time,
            cost: nowCost,
            averagePrice: nowCost / chargingWindowSize,
            type: 'Now',
        },
        {
            from: priceEntries[maxFromIndex].time,
            to: priceEntries[maxToIndex].time,
            cost: maxCost,
            averagePrice: maxCost / chargingWindowSize,
            type: 'Avoid',
        },
        {
            from: priceEntries[minFromIndex].time,
            to: priceEntries[minToIndex].time,
            cost: minCost,
            averagePrice: minCost / chargingWindowSize,
            type: 'Good',
        },
    ]
}

export function createMockActualPricesAdvice(
    numberOfPriceEntries = 24
): SpotPriceAdviceData {
    const powerInKiloWatts = 3.6
    const duration = 4

    const spotPrices = generateRandomSpotPrices(numberOfPriceEntries)

    const advice = generateActualPricesAdvice(
        spotPrices,
        duration,
        powerInKiloWatts
    )

    return {
        advice,
        spotPrices,
        priceArea: 'NO1',
        priceUnits: {
            currency: 'NOK',
            vat: {
                rate: 1.25,
                hasVAT: true,
            },
            energyUnit: 'kWh',
        },
        chargingSession: {
            powerInKiloWatts,
            duration: `${duration > 9 ? duration : '0' + duration}:00:00`,
        },
    }
}

export function createMockSpotPrices(numberOfPriceEntries = 24): SpotPriceData {
    const spotPrices = generateRandomSpotPrices(
        numberOfPriceEntries,
        new Date(startOfDay(Date.now()))
    )
    const spotPriceRecord: PriceRecord = spotPrices.reduce((acc, it) => {
        acc[it.time] = it.price
        return acc
    }, {})

    return {
        prices: spotPriceRecord,
        priceArea: 'NO1',
        priceUnits: {
            currency: 'NOK',
            vat: {
                rate: 1.25,
                hasVAT: true,
            },
            energyUnit: 'kWh',
        },
    }
}

export function createMockForecastAdvice(): ForecastAdviceData {
    // 24 is 6 days
    const forecastAdvice = generateRandomForecast(24)
    return {
        priceArea: 'NO1',
        priceUnits: {
            currency: 'NOK',
            vat: {
                rate: 1.25,
                hasVAT: true,
            },
            energyUnit: 'kWh',
        },
        segmentOptions: {
            segmentSize: 6,
        },
        forecastAdvice,
    }
}

export function createMockPriceDataForCurrentDay(): Price[] {
    return generateRandomPriceEntries(24, startOfDay(new Date()))
}
