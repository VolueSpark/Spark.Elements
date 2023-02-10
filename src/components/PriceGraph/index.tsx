import React, { useMemo, useRef } from 'react'
import { Bar } from '@visx/shape'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Text } from '@visx/text'

import style from './price-graph.module.css'
import useSize from '@react-hook/size'
import { Price, PriceTimeRangeAdvice, PriceTimeRangeAdviceType } from '../types'
import { parseISO } from 'date-fns/esm'
import { format, isWithinInterval } from 'date-fns'

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
}

export default function PriceGraph({
    initialWidth = 500,
    initialHeight = 400,
    data,
    advice,
    priceUnit,
    energyUnit,
    labels = true,
    timeFormat = 'hh',
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
                domain: data.map((x) => x.isoDate),
                paddingInner: 0.4,
            }),
        [xMax]
    )
    const yScale = useMemo(
        () =>
            scaleLinear<number>({
                range: [yMax, 0],
                round: true,
                domain: [0, Math.max(...data.map((x) => x.averagePrice)) + 0.5],
            }),
        [yMax]
    )

    const formatDate = (d: string) => {
        return format(parseISO(d), timeFormat?.length ? timeFormat : 'hh')
    }

    const formatPrice = (value: number) => {
        return (value * 100).toString()
    }

    const adviceIntervals = useMemo(() => {
        return advice?.map((a) => ({
            interval: {
                start: parseISO(a.isoDateFrom),
                end: parseISO(a.isoDateTill),
            },
            totalPrice: a.totalPrice,
            adviceType: a.type,
        }))
    }, [advice])

    const priceData = useMemo(() => {
        return data.map((p) => ({
            ...p,
            adviceType: adviceIntervals?.find((ai) =>
                isWithinInterval(parseISO(p.isoDate), ai.interval)
            )?.adviceType,
        }))
    }, [data, advice])

    function getBarStyle(adviceType?: PriceTimeRangeAdviceType) {
        switch (adviceType) {
            case 'now':
                return style.bar__now
            case 'optimal':
                return style.bar__optimal
            case 'avoid':
                return style.bar__avoid
            default:
                return style.bar
        }
    }

    return (
        <div ref={containerRef} className={style.container}>
            <svg width="100%" height="100%">
                <rect opacity={0} />
                <Group left={horizontalMargin} top={verticalMargin / 2}>
                    {priceData.map((d, idx) => {
                        const barWidth = xScale.bandwidth()
                        const barHeight = yMax - (yScale(d.averagePrice) ?? 0)
                        const barX = xScale(d.isoDate)
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
        </div>
    )
}
