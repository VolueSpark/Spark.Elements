import React from 'react'
import { parseISO } from 'date-fns'
import { Label, Legend, Row, RowHeader } from './components'

import style from './long-term-forecast.module.css'
import { prepareDataForTable } from './util'

export type ForecastEntry = {
    from: string
    to: string
    averagePrice: number
    loss: number
    type: 'Normal' | 'Avoid' | 'Good'
    bestPrice?: boolean
}

export type ForecastProps = {
    data: ForecastEntry[]
    days?: string[]
    width?: number
    height?: number
    hideLabel?: boolean
    hideDays?: boolean
}

/**
 * @param  days list of days to include in each row, sunday to saturday, fallback is norwegian language
 * @param hideLabel optional parameter to hide the label rendered above the table
 * @param hideDays optional parameter to hide the days in the row header
 * @returns
 */
export default function Forecast({ data, hideLabel, hideDays }: ForecastProps) {
    const preparedData = prepareDataForTable(data)

    return (
        <>
            <div className={style.container}>
                <div className={style.label_wrapper}>
                    {!hideLabel && <Label />}
                </div>
                <div className={style.table}>
                    {data && preparedData ? (
                        <>
                            {preparedData.map((row, index) => (
                                <div
                                    key={`spark-elements-table-row-${index}`}
                                    className={style.row_container}
                                >
                                    {!hideDays && (
                                        <RowHeader
                                            date={parseISO(row[0].from)}
                                        />
                                    )}
                                    <Row data={row} />
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className={style.row}>
                            <p className={style.cell}>No valid data</p>
                            <p className={style.cell}></p>
                            <p className={style.cell}></p>
                            <p className={style.cell}></p>
                        </div>
                    )}
                </div>
                <Legend />
            </div>
        </>
    )
}
