import { format, parseISO } from 'date-fns'
import React from 'react'
import { PriceTimeRangeAdvice } from '../types'

import style from './price-coin.module.css'

function getColorFromAdvice(advice?: 'now' | 'optimal' | 'avoid') {
    switch (advice) {
        case 'now':
            return style.now
        case 'optimal':
            return style.optimal
        case 'avoid':
            return style.avoid
        default:
            return style.now
    }
}

export type PriceCoinProps = {
    price: number
    priceUnit: string
    advice: PriceTimeRangeAdvice
    details: string
}

export default function PriceCoin({
    price,
    priceUnit,
    advice,
    details,
}: PriceCoinProps) {
    return (
        <div className={`${style.wrapper} ${getColorFromAdvice(advice.type)}`}>
            <div className={style.container}>
                <h3 className={style.price}>
                    {price.toString()} {priceUnit}
                </h3>
                <p className={style.time}>
                    {format(parseISO(advice.isoDateFrom), 'HH:mm')} -{' '}
                    {format(parseISO(advice.isoDateTill), 'HH:mm')}
                </p>
                <p className={style.details}>{details}</p>
            </div>
        </div>
    )
}
