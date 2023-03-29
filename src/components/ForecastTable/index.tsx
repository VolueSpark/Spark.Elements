import React from 'react'
import { Locale, parseISO } from 'date-fns'
import { Label, Legend, Row, RowHeader } from './components'
import { prepareDataForTable } from './util'
import { ForecastAdviceData, LegendTranslation } from '../types'

import style from './forecast-table.module.css'

export type ForecastTableProps = {
    data: ForecastAdviceData
    width?: number
    height?: number
    hideLabel?: boolean
    hideDays?: boolean
    locale: Locale
    legend?: LegendTranslation
    hideStar?: boolean
}

export default function ForecastTable({
    data,
    // width,
    // height,
    hideLabel,
    hideDays,
    locale,
    legend,
    hideStar = false,
}: ForecastTableProps) {
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
                                            locale={locale}
                                        />
                                    )}
                                    <Row data={row} hideStar={hideStar} />
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
                {legend && <Legend legend={legend} />}
            </div>
        </>
    )
}
