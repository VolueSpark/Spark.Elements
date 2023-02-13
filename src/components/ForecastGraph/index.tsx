import React, { useMemo } from 'react'
import { Bar } from '@visx/shape'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
import { differenceInHours, format, parseISO, startOfDay } from 'date-fns'
import VerticalLabel from './VerticalLabel'
import HorizontalLabel from './HorizontalLabel'

const margin = 120

// accessors
// TODO: can't we just return the string here? seems uneccessary to make new date and turn back into string
const getDate = (d: Forecast) => startOfDay(parseISO(d.from)).toString()
const getRating = (d: Forecast) => d.rating

export type Forecast = {
    from: string
    to: string
    rating: 'ok' | 'good' | 'bad'
}

export type ForecastProps = {
    data: Forecast[]
    width: number
    height: number
    events?: boolean
    verticalLabel?: React.ReactNode
    horizontalLabel?: React.ReactNode
    hideLabels?: boolean
}

// TODO: needs actual documentation
/**
 * @param   data: Forecast[]
 * @param   width: number
 * @param   height: number
 * @param   height: number
 * @returns React.ReactNode
 */
export default function Forecast({
    data,
    width,
    height,
    events = false,
    verticalLabel,
    horizontalLabel,
    hideLabels,
}: ForecastProps) {
    // bounds
    const xMax = width
    const yMax = height - margin

    // scales, memoize for performance
    const xScale = useMemo(
        () =>
            scaleBand<string>({
                // range will be today to 7 days from now
                range: [0, xMax],
                round: true,
                domain: data.map(getDate),
                paddingInner: 0.2,
            }),
        [xMax]
    )
    const yScale = useMemo(
        () =>
            scaleLinear<number>({
                range: [yMax, 0],
                round: true,
                domain: [0, 24],
            }),
        [yMax]
    )

    return width < 10 ? null : (
        <svg width={width} height={height}>
            <Group top={margin / 2} left={margin / 2}>
                {data.map((d) => {
                    const date = getDate(d)
                    const barWidth = xMax / 10
                    // TODO: this seems to be wrong
                    const barHeight =
                        (yMax / 24) *
                        differenceInHours(parseISO(d.to), parseISO(d.from))
                    const barX = xScale(date)
                    // TODO: this might also be the cause of the error
                    const barY = yScale(
                        24 -
                            differenceInHours(
                                parseISO(d.from),
                                startOfDay(parseISO(d.from))
                            )
                    )
                    return (
                        <Bar
                            key={`bar-${date}`}
                            x={barX}
                            y={barY}
                            width={barWidth}
                            height={barHeight}
                            fill={fillColor(getRating(d))}
                            onClick={() => {
                                if (events)
                                    alert(
                                        `clicked: ${JSON.stringify(
                                            Object.values(d)
                                        )}`
                                    )
                            }}
                        />
                    )
                })}
                {!hideLabels && (
                    <>
                        {!horizontalLabel && (
                            <HorizontalLabel
                                scale={xScale}
                                tickFormat={(date: string) => {
                                    return format(parseISO(date), 'dd.MM')
                                }}
                                numTicks={width > 520 ? 10 : 5}
                            />
                        )}
                        {!verticalLabel && (
                            <VerticalLabel
                                scale={yScale}
                                tickFormat={yAxisFormat}
                            />
                        )}
                    </>
                )}
            </Group>
        </svg>
    )
}

const GREEN = '#ddece6'
const YELLOW = '#fff2d9'
const RED = '#fad2d2'

const fillColor = (rating: Forecast['rating']): string => {
    switch (rating) {
        case 'good':
            return GREEN
        case 'ok':
            return YELLOW
        case 'bad':
            return RED
    }
}

const yAxisFormat = (v: number | { valueOf(): number }) =>
    typeof v === 'number'
        ? Math.abs(v - 24).toString()
        : Math.abs(v.valueOf() - 24).toString()
