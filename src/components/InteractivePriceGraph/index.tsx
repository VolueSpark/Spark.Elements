import React, { useMemo, useRef } from 'react'
import { Bar } from '@visx/shape'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Text } from '@visx/text'
import { localPoint } from '@visx/event'
import { Line } from '@visx/shape'
import useSize from '@react-hook/size'
import { Price } from '../types'

import style from './interactive-price-graph.module.css'

const verticalMargin = 60
const horizontalMargin = 60
const PADDING = 16

export type InteractivePriceGraphProps = {
    initialWidth?: number
    initialHeight?: number
    data: Price[]
    priceUnit: string
    energyUnit: string
    setChargeWindowStartIndex: (arg0: number) => void
    isInChargeWindow: (arg0: number) => boolean
    isInDataRange: (arg0: number) => boolean
    windowSize: number
    seperators?: boolean
    labels?: boolean
}

export default function InteractivePriceGraph({
    initialWidth = 500,
    initialHeight = 400,
    data,
    priceUnit,
    energyUnit,
    setChargeWindowStartIndex,
    isInChargeWindow,
    isInDataRange,
    windowSize,
    seperators = true,
    labels = true,
}: InteractivePriceGraphProps) {
    const containerRef = useRef(null)
    const [width, height] = useSize(containerRef, {
        initialWidth,
        initialHeight,
    })
    const xMax = width - horizontalMargin
    const yMax = height - verticalMargin - PADDING
    // Rougly the area given to each bar in the graph (including padding)
    const barWidth = xMax / data.length

    const xScale = useMemo(
        () =>
            scaleBand<string>({
                range: [0, xMax],
                round: true,
                domain: data.map((x) => x.time),
                paddingInner: 0.4,
            }),
        [xMax]
    )
    const yScale = useMemo(
        () =>
            scaleLinear<number>({
                range: [yMax, 0],
                round: true,
                domain: [0, Math.max(...data.map((x) => x.price)) + 0.5],
            }),
        [yMax]
    )

    const formatDate = (d: string) => {
        return new Date(d).getHours().toString().padStart(2, '0')
    }

    const formatPrice = (value: number) => {
        return (value * 100).toString()
    }

    const onClick = (event: React.MouseEvent) => {
        const point = localPoint(event)
        if (point) {
            const index = Math.floor((point?.x - horizontalMargin) / barWidth)
            if (index < 0 || index > data.length - 1) {
                setChargeWindowStartIndex(0)
                return
            }

            if (isInDataRange(index)) {
                setChargeWindowStartIndex(index)
            } else {
                setChargeWindowStartIndex(data.length - windowSize)
            }
        }
    }

    return (
        <div ref={containerRef} className={style.container}>
            <svg
                width="100%"
                height="100%"
                onMouseDown={(event: React.MouseEvent) => onClick(event)}
            >
                <rect opacity={0} />
                <Group left={horizontalMargin} top={verticalMargin / 2}>
                    {data.map((d, idx) => {
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
                                className={`${style.bar} ${
                                    isInChargeWindow(idx) && style.bar__active
                                }`}
                                // TODO: temp disable onclick if outside of data range
                                onClick={() => {
                                    if (isInDataRange(idx))
                                        setChargeWindowStartIndex(idx)
                                    else
                                        setChargeWindowStartIndex(
                                            data.length - windowSize
                                        )
                                }}
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
                    {seperators && (
                        <Line
                            from={{ x: 0, y: PADDING }}
                            to={{ x: 0, y: yMax }}
                            className={style.axis__line}
                        />
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
                    {seperators && (
                        <Line
                            from={{ x: 0, y: 0 }}
                            to={{ x: width, y: 0 }}
                            className={style.axis__line}
                        />
                    )}
                </Group>
            </svg>
        </div>
    )
}
