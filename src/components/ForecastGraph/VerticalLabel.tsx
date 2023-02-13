import { AxisLeft } from '@visx/axis'
import React from 'react'

// TODO: explicit type
export type VerticalLabelProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scale: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tickFormat: any
}

/**
 * The default label for the y-axis made explicitly for the Forecast component
 * @returns {JSX.Element} - A vertical label for the y-axis
 */
export default function VerticalLabel({
    scale,
    tickFormat,
}: VerticalLabelProps) {
    return <AxisLeft scale={scale} tickFormat={tickFormat} />
}
