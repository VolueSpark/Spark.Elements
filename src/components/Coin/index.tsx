import React from 'react'
import { format, parseISO } from 'date-fns'
import { AdviceSegmentType, SpotPriceAdvice } from '../types'

import style from './coin.module.css'

// Helpers
function getColorFromAdvice(adviceSegmentType?: AdviceSegmentType) {
    switch (adviceSegmentType) {
        case 'Now':
            return style.now
        case 'Best':
            return style.optimal
        case 'Good':
            return style.optimal
        case 'Worst':
            return style.avoid
        case 'Avoid':
            return style.avoid
        default:
            return style.now
    }
}

export type CoinProps = {
    totalPrice: number
    advice: SpotPriceAdvice
    currency: string
    details: string
}

export default function Coin({
    totalPrice,
    advice,
    currency,
    details,
}: CoinProps) {
    if (!totalPrice && !advice && !currency && !details) {
        console.error('Coin component is missing props')
        return <></>
    }
    return (
        <div className={`${style.wrapper} ${getColorFromAdvice(advice.type)}`}>
            <div className={style.container}>
                <h3 className={style.price}>
                    {totalPrice.toString()} {currency}
                </h3>
                <p className={style.time}>
                    {format(parseISO(advice.from), 'HH:mm')} -{' '}
                    {format(parseISO(advice.to), 'HH:mm')}
                </p>
                <p className={style.details}>{details}</p>
            </div>
        </div>
    )
}
