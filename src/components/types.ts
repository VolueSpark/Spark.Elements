export type ChargingPlanType = {
    priceEntries: Price[]
    prescriptions: ChargingPrescription[]
    chargingWindowSize: number
    chargingRate: number
}

export type Price = {
    time: string
    averagePrice: number
    standardDeviation: number
}

export type ChargingPrescription = {
    from: string
    to: string
    mean: number
    stdDev: number
    q1: number
    q3: number
}
