import { AxisTop } from '@visx/axis'
import React from 'react'

export type HorizontalLabelProps = {
    scale: any
    tickFormat: any
    numTicks: number
}

export default function HorizontalLabel({
    scale,
    tickFormat,
    numTicks,
}: HorizontalLabelProps) {
    return <AxisTop scale={scale} tickFormat={tickFormat} numTicks={numTicks} />
}
