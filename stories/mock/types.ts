type VAT = {
    rate: number
    hasVAT: boolean
}

export type PriceUnits = {
    currency: string
    vat: VAT
    energyUnit: string
}

export type Segment = {
    from: string
    to: string
    averagePrice: number
}

type BaseAdvice = Segment & {
    type: string
}

export type ForecastAdvice = BaseAdvice & {
    loss: number
}

export type SpotPriceAdvice = BaseAdvice & {
    cost: number
}

export type SpotPrice = {
    time: string,
    price: number
}

export type PriceRecord = Record<string, number>