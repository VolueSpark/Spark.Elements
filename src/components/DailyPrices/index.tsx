import React, { useMemo } from 'react'
import { Price } from '../types'
import { scaleTime, scaleLinear } from '@visx/scale'
import { add, endOfDay, getHours, parseISO, startOfDay } from 'date-fns'
import { Area } from '@visx/shape'
import { GridRows, GridColumns } from '@visx/grid'
import { curveMonotoneX } from '@visx/curve'
import { Group } from '@visx/group'
import { TooltipWithBounds } from '@visx/tooltip'
import { Threshold } from '@visx/threshold'
import { AxisBottom } from '@visx/axis'

import style from './daily-prices.module.css'
import { isWithinInterval } from 'date-fns/esm'

const getTime = (d: Price) => parseISO(d.time)
const getPrice = (d: Price) => d.price

const margin = 20

export type DailyPricesProps = {
    data: Price[]
    width: number
    height: number
    // Reflects the resolution to be rendered in a 24h period, i.e. 4 means 4 x 6 hour intervals
    hideLabel: string
}

export default function DailyPrices({
    data,
    width,
    height,
    hideLabel,
}: DailyPricesProps) {
    const today = new Date()
    if (width < 10) return null
    if (!validateData(data, today)) return null

    const xMax = width
    const yMax = height - margin

    const xScale = useMemo(() => {
        return scaleTime({
            range: [0, xMax],
            domain: [startOfDay(today), endOfDay(today)],
        })
    }, [xMax])

    const yScale = useMemo(
        () =>
            scaleLinear<number>({
                range: [yMax, 0],
                // Adding 1 to the max value to stop the graph from being cut off at the top
                domain: [0, Math.max(...data.map(getPrice)) + 1],
            }),
        [yMax]
    )

    const toolTipData = useMemo(() => prepareTooltipData(data), [data])

    return (
        <div className={style.container}>
            <svg width={width} height={height}>
                <Group width={xMax} height={yMax}>
                    <GridRows
                        scale={yScale}
                        width={xMax}
                        strokeDasharray="1,3"
                        stroke={'#000'}
                        strokeOpacity={0}
                        pointerEvents="none"
                    />
                    <GridColumns
                        scale={xScale}
                        height={yMax}
                        strokeDasharray="1,3"
                        stroke={'#000'}
                        strokeOpacity={0.2}
                        pointerEvents="none"
                        numTicks={4}
                        left={xMax / 4 / 2}
                    />
                    <Threshold<Price>
                        id="spark-elements-threshold"
                        data={data}
                        x={(d) => xScale(getTime(d)) ?? 0}
                        y0={yMax}
                        y1={(d) => yScale(getPrice(d)) ?? 0}
                        clipAboveTo={0}
                        clipBelowTo={yMax}
                        curve={curveMonotoneX}
                        belowAreaProps={{
                            fill: '#D4E7E0',
                            fillOpacity: 1,
                        }}
                    />
                    <Area<Price>
                        data={data}
                        x={(d) => xScale(getTime(d)) ?? 0}
                        y={(d) => yScale(getPrice(d)) ?? 0}
                        strokeWidth={2}
                        stroke="#62A39E"
                        curve={curveMonotoneX}
                    />
                </Group>
                <Group width={xMax} height={yMax}>
                    {toolTipData.map((entry, idx) => (
                        <circle
                            key={`spark-elements-graph-circle-${idx}`}
                            cx={xScale(getTime(entry.priceUsedToPosition))}
                            cy={yScale(getPrice(entry.priceUsedToPosition))}
                            r={8}
                            fill="#62A39E"
                            stroke="#fff"
                            strokeWidth={2}
                            pointerEvents="none"
                        />
                    ))}
                </Group>
                {!hideLabel && (
                    <>
                        <AxisBottom
                            hideAxisLine
                            hideTicks
                            scale={xScale}
                            tickFormat={(d) => xAxisFormat(d as Date, 6)}
                            top={yMax}
                            // width divided by number of intervals (4) divided by the intervals center (6 / 2)
                            left={xMax / 4 / (6 / 2)}
                            numTicks={4}
                            axisClassName={style.axis__bottom}
                            tickClassName={style.axis__text}
                            tickLabelProps={() => ({})}
                        />
                    </>
                )}
            </svg>
            <div>
                {toolTipData.map((entry, idx) => (
                    <TooltipWithBounds
                        key={`spark-elements-graph-tooltip-${idx}`}
                        top={yScale(getPrice(entry.priceUsedToPosition))}
                        offsetTop={-60}
                        left={xScale(getTime(entry.priceUsedToPosition))}
                        offsetLeft={-26}
                        className={style.tooltip}
                    >
                        <div className={style.tooltip_container}>
                            <div>
                                {`${entry.averageOfInterval.toFixed(0)} øre`}
                            </div>
                            <span className={style.triangle}></span>
                        </div>
                    </TooltipWithBounds>
                ))}
            </div>
        </div>
    )
}

type ToolTipData = {
    // Price is purely used for properly positioning the tooltip based on the data shown in graph
    priceUsedToPosition: Price
    averageOfInterval: number
}

const prepareTooltipData = (data: Price[]) => {
    const numberOfIntervals = 4
    const intervalSize = 6

    const tooltipData: ToolTipData[] = []

    // Push the average of each interval to tooltipData
    for (let i = 0; i < numberOfIntervals; i++) {
        let accumulatedCost = 0
        for (let j = 0; j < intervalSize; j++) {
            accumulatedCost += data[i * intervalSize + j].price
        }
        tooltipData.push({
            priceUsedToPosition: {
                time: data[i * intervalSize + intervalSize / 2].time,
                price: data[i * intervalSize + intervalSize / 2].price,
            },

            averageOfInterval: accumulatedCost / intervalSize,
        })
    }

    return tooltipData
}

function xAxisFormat(date: Date, intervalSize: number) {
    return `${getHours(date)} - ${getHours(add(date, { hours: intervalSize }))}`
}

function validateData(data: Price[], today: Date) {
    if (data.length === 0) {
        console.error('DailyPrices component must have data.')
        return false
    } else if (
        !data.every((entry) =>
            isWithinInterval(parseISO(entry.time), {
                start: startOfDay(today),
                end: endOfDay(today),
            })
        )
    ) {
        console.error(
            'DailyPrices component must have valid data. All entries must be within the current day'
        )
        return false
    }
    return true
}
