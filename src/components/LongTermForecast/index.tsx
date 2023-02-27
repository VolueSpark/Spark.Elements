import React from 'react'
import { parseISO } from 'date-fns'
import { Label, Row, RowHeader, Seperator } from './components'

import style from './long-term-forecast.module.css'
import { prepareDataForTable, prepareLabels } from './util'

export type ForecastEntry = {
    from: string
    to: string
    averagePrice: number
}

export type LongTermForecastProps = {
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
export default function LongTermForecast({
    data,
    days,
    hideLabel,
    hideDays,
}: LongTermForecastProps) {
    const preparedData = prepareDataForTable(data)
    const rowHeaders = hideDays
        ? []
        : prepareLabels(parseISO(data[0].from), days)

    return (
        <>
            <div className={style.container}>
                {!hideLabel && <Label />}
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
                                            day={rowHeaders.at(index) ?? ''}
                                            date={parseISO(row[0].from)}
                                        />
                                    )}
                                    <Row data={row} />
                                    <Seperator />
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
            </div>
        </>
    )
}
