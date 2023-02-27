import { format } from 'date-fns'
import React from 'react'
import { ForecastEntry } from '.'
import Icon from '../../icons'

import style from './long-term-forecast.module.css'

export function Label() {
    return (
        <div className={style.label}>
            <div>
                <Icon name="moon" />
                <p>00 - 06</p>
            </div>
            <div>
                <Icon name="sunset" />
                <p>06 - 12</p>
            </div>
            <div>
                <Icon name="sun" />
                <p>12 - 18</p>
            </div>
            <div>
                <Icon name="sunset" />
                <p>18 - 00</p>
            </div>
        </div>
    )
}

export function RowHeader({ day, date }: { day: string; date: Date }) {
    return (
        <p className={style.row_header}>
            {day && `${day} ${format(date, 'dd.MM')}`}
        </p>
    )
}

export function Row({ data }: { data: ForecastEntry[] }) {
    return (
        <div className={style.row}>
            {data.map((entry) => (
                <p key={entry.from} className={style.cell}>
                    {entry.averagePrice.toFixed(0).toString()}
                </p>
            ))}
        </div>
    )
}

export function Seperator() {
    return <div className={style.seperator}></div>
}
