export type ChargingPlanType = {
    priceEntries: Price[]
    advice: PriceTimeRangeAdvice[]
    prescriptions: ChargingPrescription[]
    chargingWindowSize: number
    chargingRate: number
}

export type Price = {
    time: string
    price: number
}

export type PriceTimeRangeAdviceType = 'now' | 'optimal' | 'avoid'

export type PriceTimeRangeAdvice = {
    from: string
    to: string
    type: PriceTimeRangeAdviceType
    cost: number
}

export type ChargingPrescription = {
    from: string
    to: string
    mean: number
    stdDev: number
    q1: number
    q3: number
}

export type LegendTranslation = {
    now: string
    optimal: string
    avoid: string
}
