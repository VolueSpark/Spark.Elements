import { AxisTop } from '@visx/axis'
import React from 'react'

// TODO: explicit type
export type HorizontalLabelProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scale: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tickFormat: any
    numTicks: number
}

/**
 * The default label for the x-axis made explicitly for the Forecast component
 * @returns {JSX.Element} - A horizontal label for the x-axis
 */
export default function HorizontalLabel({
    scale,
    tickFormat,
    numTicks,
}: HorizontalLabelProps) {
    return <AxisTop scale={scale} tickFormat={tickFormat} numTicks={numTicks} />
}
