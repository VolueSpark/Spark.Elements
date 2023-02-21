import React, { useMemo } from 'react'
import { Price } from '../types'
import { scaleTime, scaleLinear } from '@visx/scale'
import { add, getHours, parseISO } from 'date-fns'
import { Area } from '@visx/shape'
import { GridRows, GridColumns } from '@visx/grid'
import { curveMonotoneX } from '@visx/curve'
import { Group } from '@visx/group'
import { TooltipWithBounds } from '@visx/tooltip'
import { Threshold } from '@visx/threshold'
import { AxisTop } from '@visx/axis'

import style from './daily-prices.module.css'

const getTime = (d: Price) => parseISO(d.time)
const getPrice = (d: Price) => d.price

const margin = 20

export type DailyPricesProps = {
    data: Price[]
    width: number
    height: number
    // Reflects the resolution to be rendered in a 24h period, i.e. 4 means 4 x 6 hour intervals
    numberOfIntervals: number
    hideLabel: string
}

export default function DailyPrices({
    data,
    width,
    height,
    numberOfIntervals = 0,
    hideLabel,
}: DailyPricesProps) {
    if (width < 10) return null

    const xMax = width
    const yMax = height - margin

    const xScale = useMemo(() => {
        return scaleTime({
            range: [0, xMax],
            domain: [getTime(data[0]), getTime(data[data.length - 1])],
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

    const intervalSize = useMemo(
        () => Math.floor(data.length / numberOfIntervals),
        [data, numberOfIntervals]
    )

    const toolTipData = useMemo(
        () => prepareTooltipData(data, numberOfIntervals, intervalSize),
        [data, numberOfIntervals]
    )

    const tickPosition = useMemo(
        () => parseTickPosition(data, intervalSize, numberOfIntervals),
        [data, numberOfIntervals]
    )

    const tickValues = useMemo(
        () => parseTickValues(data, intervalSize),
        [data, numberOfIntervals]
    )

    return (
        <div>
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
                        // TODO: tweak these, tickvalues needs to match up with circles
                        tickValues={tickPosition.slice(0, -1)}
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
                        <AxisTop
                            hideAxisLine
                            hideTicks
                            scale={xScale}
                            tickFormat={(d) =>
                                xAxisFormat(d as Date, intervalSize)
                            }
                            tickValues={tickValues.slice(0, -1)}
                            top={24}
                            left={xMax / numberOfIntervals / 2}
                        />
                    </>
                )}
            </svg>
            <div>
                {toolTipData.map((entry, idx) => (
                    <TooltipWithBounds
                        key={`spark-elements-graph-tooltip-${idx}`}
                        top={yScale(getPrice(entry.priceUsedToPosition))}
                        offsetTop={-40}
                        left={xScale(getTime(entry.priceUsedToPosition))}
                        // TODO: this has to be dynamic based on the size of the tooltip
                        offsetLeft={-10}
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

const prepareTooltipData = (
    data: Price[],
    numberOfIntervals: number,
    intervalSize: number
) => {
    // Number of intervals can not be greater than amount of entries
    if (data.length === 0 || numberOfIntervals > data.length) {
        console.error(
            'Number of intervals can not be greater than amount of entries in the DailyPrices component.'
        )
        return []
    }

    // Don't display interval unless specified
    if (numberOfIntervals === 0) return []

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

function parseTickPosition(
    data: Price[],
    intervalSize: number,
    numberOfIntervals: number
) {
    const result: Date[] = []
    for (let i = 0; i < numberOfIntervals; i++) {
        result.push(parseISO(data[i * intervalSize + intervalSize / 2].time))
    }
    result.push(parseISO(data[data.length - 1].time))
    return result
}

function parseTickValues(data: Price[], intervalSize: number) {
    const result = data.map(getTime).filter((_, i) => i % intervalSize === 0)
    result.push(parseISO(data[data.length - 1].time))
    return result
}

function xAxisFormat(date: Date, intervalSize: number) {
    return `${getHours(date)} - ${getHours(add(date, { hours: intervalSize }))}`
}
