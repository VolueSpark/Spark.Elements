import React, { useMemo, useRef } from 'react'
import { Bar } from '@visx/shape'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Text } from '@visx/text'
import { LegendItem, LegendLabel } from '@visx/legend'

import style from './price-graph.module.css'
import useSize from '@react-hook/size'
import {
    LegendTranslation,
    Price,
    PriceTimeRangeAdvice,
    PriceTimeRangeAdviceType,
} from '../types'
import { format, isWithinInterval, parseISO } from 'date-fns'

const verticalMargin = 60
const horizontalMargin = 60
const PADDING = 16

export type PriceGraphProps = {
    initialWidth?: number
    initialHeight?: number
    data: Price[]
    advice: PriceTimeRangeAdvice[]
    priceUnit: string
    energyUnit: string
    labels?: boolean
    timeFormat?: string
    legend?: LegendTranslation
    legendGlyphSize?: number
}

export default function PriceGraph({
    initialWidth = 500,
    initialHeight = 400,
    data,
    advice,
    priceUnit,
    energyUnit,
    labels = true,
    timeFormat = 'HH',
    legend,
    legendGlyphSize = 12,
}: PriceGraphProps) {
    const containerRef = useRef(null)
    const [width, height] = useSize(containerRef, {
        initialWidth,
        initialHeight,
    })
    const xMax = width - horizontalMargin
    const yMax = height - verticalMargin - PADDING

    const xScale = useMemo(
        () =>
            scaleBand<string>({
                range: [0, xMax],
                round: true,
                domain: data.map((x) => x.time),
                paddingInner: 0.4,
            }),
        [xMax, data]
    )

    const yScale = useMemo(
        () =>
            scaleLinear<number>({
                range: [yMax, 0],
                round: true,
                domain: [0, Math.max(...data.map((x) => x.price)) + 0.5],
            }),
        [yMax, data]
    )

    const formatDate = (d: string) => {
        return format(parseISO(d), timeFormat?.length ? timeFormat : 'HH')
    }

    const formatPrice = (value: number) => {
        return (value * 100).toString()
    }

    const adviceIntervals = useMemo(() => {
        return advice?.map((a) => ({
            interval: {
                start: parseISO(a.from),
                end: parseISO(a.to),
            },
            cost: a.cost,
            adviceType: a.type,
        }))
    }, [advice])

    const adviceSet = useMemo(
        () => Array.from(new Set(advice.map((a) => a.type))),
        [advice]
    )

    const priceData = useMemo(() => {
        return data.map((p) => ({
            ...p,
            adviceType: adviceIntervals?.find((ai) =>
                isWithinInterval(parseISO(p.time), ai.interval)
            )?.adviceType,
        }))
    }, [data, advice])

    return (
        <div ref={containerRef} className={style.container}>
            <svg width="100%" height="100%">
                <rect opacity={0} />
                <Group left={horizontalMargin} top={verticalMargin / 2}>
                    {priceData.map((d, idx) => {
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
                                className={getBarStyle(d.adviceType)}
                            />
                        )
                    })}
                </Group>
                <Group
                    left={horizontalMargin / 2 + PADDING}
                    top={verticalMargin / 2}
                >
                    {labels && (
                        <>
                            <AxisLeft
                                hideAxisLine
                                hideTicks
                                scale={yScale}
                                tickFormat={(v) => formatPrice(v.valueOf())}
                                numTicks={5}
                                tickValues={yScale
                                    .ticks()
                                    .filter((_t, i) => i > 0 && i % 2 === 0)}
                                axisClassName={style.axis__left}
                                tickClassName={style.axis__text}
                            />
                            <Text
                                dy={-PADDING}
                                dx={-PADDING}
                                fontSize={10}
                                className={style.axis__text}
                            >
                                {`${priceUnit}/${energyUnit}`}
                            </Text>
                        </>
                    )}
                </Group>
                <Group
                    left={horizontalMargin}
                    top={yMax + verticalMargin / 2 + PADDING}
                >
                    {labels && (
                        <AxisBottom
                            hideAxisLine
                            hideTicks
                            scale={xScale}
                            tickFormat={formatDate}
                            tickLabelProps={() => {
                                return {}
                            }}
                            tickTransform={'translate(-9,8)'}
                            axisClassName={style.axis__bottom}
                            tickClassName={style.axis__text}
                        />
                    )}
                </Group>
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
                    <LegendItem key={`legend-quantile-${i}`} margin="0 5px">
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

function getBarStyle(adviceType?: PriceTimeRangeAdviceType) {
    switch (adviceType?.toLowerCase()) {
        case 'now':
            return style.bar__now
        case 'best':
            return style.bar__optimal
        case 'avoid':
            return style.bar__avoid
        case 'worst':
            return style.bar__worst
        default:
            return style.bar
    }
}
