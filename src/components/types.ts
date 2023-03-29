export type AdviceSegmentType =
    | 'Now'
    | 'Best'
    | 'Good'
    | 'Avoid'
    | 'Worst'
    | 'Unknown'

export type ForecastBlockType = 'Normal' | 'Good' | 'Avoid'

export type VAT = {
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

export type ForecastAdvice = Segment & {
    type: ForecastBlockType
    loss: number
}

export type SpotPriceAdvice = Segment & {
    type: AdviceSegmentType
    cost: number
}

export type SpotPrice = {
    time: string
    price: number
}

export type PriceRecord = Record<string, number>

export type SpotPriceData = {
    priceArea: string
    priceUnits: PriceUnits
    prices: PriceRecord
}

export type SpotPriceAdviceData = {
    advice: Array<SpotPriceAdvice>
    spotPrices: Array<SpotPrice>
    priceArea: {
        code: string
    }
    priceUnits: PriceUnits
}

export type ForecastAdviceData = {
    priceArea: string
    priceUnits: PriceUnits
    segmentOptions: {
        segmentSize: number
    }
    forecastAdvice: Array<ForecastAdvice>
}

export type LegendTranslation = { [key in AdviceSegmentType]?: string }
