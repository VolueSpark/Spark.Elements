import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Bar } from '@visx/shape'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Text } from '@visx/text'
import { LegendItem, LegendLabel } from '@visx/legend'

import style from './advice-graph.module.css'
import useSize from '@react-hook/size'
import {
    LegendTranslation,
    AdviceSegmentType,
    SpotPriceAdviceData,
    SpotPrice,
    SpotPriceAdvice,
} from '../types'
import {
    format,
    isEqual,
    isWithinInterval,
    parseISO,
    startOfDay,
} from 'date-fns'

// Format
const formatDate = (d: string, timeFormat: string) => {
    return format(parseISO(d), timeFormat?.length ? timeFormat : 'HH')
}

const formatPrice = (value: number) => {
    return (value * 100).toString()
}

// Accessors
const getSpotPriceTime = (s: SpotPrice) => s.time
const getSpotPrice = (s: SpotPrice) => s.price

// TODO: needs proper testing
const findAdviceTypeFromSpotPrice = (
    s: SpotPrice,
    a: SpotPriceAdvice[]
): AdviceSegmentType => {
    if (a.length === 0) return 'Unknown'
    const advice = a.find((advice) =>
        isWithinInterval(parseISO(s.time), {
            start: parseISO(advice.from),
            end: parseISO(advice.to),
        })
    )
    if (advice) return advice.type
    else return 'Unknown'
}

// Styles
function getBarStyle(adviceSegmentType?: AdviceSegmentType) {
    switch (adviceSegmentType) {
        case 'Now':
            return style.bar__now
        case 'Best':
            return style.bar__optimal
        case 'Good':
            return style.bar__optimal
        case 'Avoid':
            return style.bar__avoid
        case 'Worst':
            return style.bar__avoid
        default:
            return style.bar
    }
}

const marginTop = 90
const marginBottom = 16
const horizontalMargin = 60
const PADDING = 16

export type AdviceGraphProps = {
    initialWidth?: number
    initialHeight?: number
    data: SpotPriceAdviceData
    axisLeftText?: string
    hideAxisLabels?: boolean
    timeFormat?: string
    legend?: LegendTranslation
    legendGlyphSize?: number
    hideDaysLabel?: boolean
    daysLabelText?: {
        today: string
        tomorrow: string
    }
}

export default function AdviceGraph({
    // TODO: check why initialWidth and initialHeight are not working
    initialWidth = 500,
    initialHeight = 400,
    data,
    axisLeftText = '',
    hideAxisLabels = false,
    timeFormat = 'HH',
    legend,
    legendGlyphSize = 12,
    hideDaysLabel = false,
    daysLabelText,
}: AdviceGraphProps) {
    // TODO: has to check if data also is the correct format
    if (!data) {
        console.error('No data provided to AdviceGraph')
        return <></>
    }

    const containerRef = useRef(null)
    const [width, height] = useSize(containerRef, {
        initialWidth,
        initialHeight,
    })
    const [isMultipleDays, setMultipleDays] = useState(false)
    const [shouldRenderBothDaysLabels, setRenderBothDaysLabels] =
        useState(false)
    const [indexOfTomorrow, setIndexOfTomorrow] = useState(0)

    const xMax = width - horizontalMargin
    const yMax = height - marginBottom - marginTop - PADDING

    const xScale = useMemo(
        () =>
            scaleBand<string>({
                range: [0, xMax],
                round: true,
                domain: data.spotPrices.map(getSpotPriceTime),
                paddingOuter: 0.3,
                paddingInner: 0.3,
            }),
        [xMax, data]
    )

    const yScale = useMemo(
        () =>
            scaleLinear<number>({
                range: [yMax, 0],
                round: true,
                domain: [
                    0,
                    Math.max(...data.spotPrices.map(getSpotPrice)) + 0.5,
                ],
            }),
        [yMax, data]
    )

    // const adviceIntervals = useMemo(() => {
    //     return data.advice?.map((a) => ({
    //         interval: {
    //             start: parseISO(a.from),
    //             end: parseISO(a.to),
    //         },
    //         cost: a.cost,
    //         adviceType: a.type,
    //     }))
    // }, [data.advice])

    const adviceSet = useMemo(
        () => Array.from(new Set(data.advice.map((a) => a.type))),
        [data.advice]
    )

    // const priceData = useMemo(() => {
    //     return data.spotPrices.map((p) => ({
    //         ...p,
    //         adviceType: adviceIntervals?.find((ai) =>
    //             isWithinInterval(parseISO(p.time), ai.interval)
    //         )?.adviceType,
    //     }))
    // }, [data])

    // Check if there are multiple days in the data, used for labels so only run if they are not hidden
    useEffect(() => {
        if (!hideDaysLabel)
            if (data.spotPrices.length > 1) {
                const days = data.spotPrices.map((d) => parseISO(d.time))
                const firstDay = days[0]
                const nextDay = days
                    .slice(1, -1)
                    .find((d) => !isEqual(startOfDay(d), startOfDay(firstDay)))
                if (nextDay) {
                    setMultipleDays(true)
                    // TODO: tweak this, number is there to avoid rendered text overlapping
                    setRenderBothDaysLabels(days.indexOf(nextDay) >= 5)
                    setIndexOfTomorrow(days.indexOf(nextDay))
                } else {
                    setMultipleDays(false)
                }
            } else setMultipleDays(false)
    }, [data])

    // TODO: I don't like findAdviceTypeFromSpotPrice the way it works now, runs too many times
    // Optimise it by merging advice and spotprices prior to rendering
    return (
        <div ref={containerRef} className={style.container}>
            <svg width="100%" height="100%">
                <rect opacity={0} />
                <Group left={horizontalMargin} top={marginTop}>
                    {data.spotPrices.map((d, idx) => {
                        const barWidth = xScale.bandwidth()
                        const barHeight = yMax - (yScale(d.price) ?? 0)
                        const barX = xScale(d.time)

                        const barY = yMax - barHeight
                        return (
                            <Bar
                                data-testid={`spark-elements__chart-bar-${idx}`}
                                key={`bar-${idx}`}
                                rx={4}
                                x={barX}
                                y={barY}
                                width={barWidth}
                                height={barHeight}
                                className={getBarStyle(
                                    findAdviceTypeFromSpotPrice(d, data.advice)
                                )}
                            />
                        )
                    })}
                </Group>
                {!hideAxisLabels && (
                    <>
                        <Group
                            left={horizontalMargin / 2 + PADDING}
                            top={marginTop}
                        >
                            <>
                                <AxisLeft
                                    hideAxisLine
                                    hideTicks
                                    scale={yScale}
                                    tickFormat={(v) => formatPrice(v.valueOf())}
                                    numTicks={5}
                                    tickValues={yScale
                                        .ticks()
                                        .filter(
                                            (_t, i) => i > 0 && i % 2 === 0
                                        )}
                                    tickLabelProps={() => {
                                        return {}
                                    }}
                                    axisClassName={style.axis}
                                    tickClassName={style.axis__text}
                                />
                                <Text
                                    dy={-marginTop + PADDING}
                                    dx={-PADDING}
                                    fontSize={10}
                                    className={style.axis__text}
                                >
                                    {axisLeftText}
                                </Text>
                            </>
                        </Group>
                        <Group left={horizontalMargin} top={yMax + marginTop}>
                            <AxisBottom
                                hideAxisLine
                                hideTicks
                                scale={xScale}
                                tickFormat={(t) => formatDate(t, timeFormat)}
                                tickLabelProps={() => {
                                    return {}
                                }}
                                tickTransform={'translate(-9, 8)'}
                                axisClassName={style.axis}
                                tickClassName={style.axis__text}
                            />
                        </Group>
                    </>
                )}
                {!hideDaysLabel && isMultipleDays && (
                    <>
                        {shouldRenderBothDaysLabels && (
                            <Group
                                left={
                                    (xScale(data.spotPrices[0].time) ?? 0) +
                                    horizontalMargin
                                }
                                top={marginTop}
                            >
                                <Text>{daysLabelText?.today}</Text>
                            </Group>
                        )}
                        <Group
                            left={
                                (xScale(
                                    data.spotPrices[indexOfTomorrow].time
                                ) ?? 0) + horizontalMargin
                            }
                            top={marginTop}
                        >
                            <Text>{daysLabelText?.tomorrow}</Text>
                        </Group>
                    </>
                )}
            </svg>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    // Align with graph
                    marginLeft: horizontalMargin,
                }}
            >
                {adviceSet.map((le, i) => (
                    <LegendItem key={`legend-quantile-${i}`} margin="0 24px">
                        <svg
                            width={legendGlyphSize}
                            height={legendGlyphSize}
                            style={{ margin: '2px 0' }}
                        >
                            <circle
                                className={getBarStyle(le)}
                                r={legendGlyphSize / 2}
                                cx={legendGlyphSize / 2}
                                cy={legendGlyphSize / 2}
                            />
                        </svg>
                        <LegendLabel align="left" margin="0 0 0 4px">
                            {legend ? legend[le] : le}
                        </LegendLabel>
                    </LegendItem>
                ))}
            </div>
        </div>
    )
}
