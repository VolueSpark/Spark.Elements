import { format } from 'date-fns'
import React from 'react'
import Icon from '../../icons'
import Locale from 'date-fns/locale/nb'
import { AdviceSegmentType, ForecastAdvice, LegendTranslation } from '../types'

import style from './forecast-table.module.css'

// TODO: same as in Coin, move to util
function getColorFromAdvice(adviceSegmentType?: AdviceSegmentType) {
    switch (adviceSegmentType) {
        case 'Best':
            return style.good
        case 'Good':
            return style.good
        case 'Worst':
            return style.avoid
        case 'Avoid':
            return style.avoid
        default:
            return style.default
    }
}

export function Label() {
    return (
        <div className={style.label}>
            <div>
                <Icon name="moon" />
                <p>00 - 06</p>
            </div>
            <div>
                <Icon name="sunrise" />
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

// TODO: this does not scale, can not be based on local in this way
export function RowHeader({ date, locale }: { date: Date; locale: Locale }) {
    return (
        <p className={style.row_header}>
            {toUpperCaseFirstLetter(
                `${format(date, 'E', {
                    locale,
                })}`
            )}
        </p>
    )
}

export function Row({
    data,
    hideStar,
}: {
    data: Array<ForecastAdvice>
    hideStar: boolean
}) {
    return (
        <div className={style.row}>
            {data.map((entry) => (
                <div
                    key={entry.from}
                    className={`${getColorFromAdvice(entry.type)}`}
                >
                    <p className={`${style.cell}`}>
                        {entry.averagePrice.toFixed(0).toString()}
                        <div className={style.icon_container}>
                            {entry.type === 'Best' && !hideStar && (
                                <Icon name="star" width={16} height={16} />
                            )}
                        </div>
                    </p>
                </div>
            ))}
        </div>
    )
}

export function Legend({ legend }: { legend: LegendTranslation }) {
    return (
        <div className={style.legend_container}>
            {legend.Good && (
                <span className={style.legend_item}>
                    <div
                        className={`${style.legend_circle} ${style.good}`}
                    ></div>
                    {legend.Good}
                </span>
            )}
            {legend.Avoid && (
                <span className={style.legend_item}>
                    <div
                        className={`${style.legend_circle} ${style.avoid}`}
                    ></div>
                    {legend.Avoid}
                </span>
            )}
        </div>
    )
}

function toUpperCaseFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
