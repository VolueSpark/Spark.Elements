import React, { useMemo } from 'react'
import { Bar } from '@visx/shape'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
import { differenceInHours, format, startOfDay } from 'date-fns'
import { AxisLeft, AxisTop } from '@visx/axis'

const verticalMargin = 120

// accessors
const getDate = (d: Forecast) => startOfDay(new Date(d.from)).toString()
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
}

export default function Forecast({
    data,
    width,
    height,
    events = false,
}: ForecastProps) {
    // bounds
    const xMax = width
    const yMax = height - verticalMargin

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
            <Group top={verticalMargin / 2} left={verticalMargin / 2}>
                {data.map((d) => {
                    const date = getDate(d)
                    const barWidth = xMax / 10
                    const barHeight =
                        (yMax / 24) *
                        differenceInHours(new Date(d.to), new Date(d.from))
                    const barX = xScale(date)
                    const barY = yScale(
                        24 -
                            differenceInHours(
                                new Date(d.from),
                                startOfDay(new Date(d.from))
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
                <AxisTop
                    scale={xScale}
                    tickFormat={(date) => {
                        return format(new Date(date), 'dd.MM')
                    }}
                    numTicks={width > 520 ? 10 : 5}
                />
                <AxisLeft scale={yScale} tickFormat={yAxisFormat} />
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
