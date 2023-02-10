export type ChargingPlanType = {
    priceEntries: Price[]
    advice: PriceTimeRangeAdvice[]
    prescriptions: ChargingPrescription[]
    chargingWindowSize: number
    chargingRate: number
}

export type Price = {
    isoDate: string
    averagePrice: number
    standardDeviation: number
}

export type PriceTimeRangeAdviceType = 'now' | 'optimal' | 'avoid'

export type PriceTimeRangeAdvice = {
    isoDateFrom: string
    isoDateTill: string
    type: PriceTimeRangeAdviceType
    totalPrice: number
}

export type ChargingPrescription = {
    from: string
    to: string
    mean: number
    stdDev: number
    q1: number
    q3: number
}
