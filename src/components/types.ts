export type AdviceSegmentType =
    | 'Now'
    | 'Best'
    | 'Good'
    | 'Avoid'
    | 'Worst'
    | 'Unknown'
    
export type ForecastBlockType = "Normal" | "Good" | "Avoid"

export type LegendTranslation = { [key in AdviceSegmentType]?: string }

// SpotPrice
export type Price = {
    time: string
    price: number
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