import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import InteractivePriceGraph, {
    InteractivePriceGraphProps,
} from '../src/components/InteractivePriceGraph'
import { createMockSpotPrices } from './graph-mockdata'

const data = createMockSpotPrices()

export default {
    title: 'Spot Price/InteractPriceGraph',
    component: InteractivePriceGraph,
} as Meta<typeof InteractivePriceGraph>

const Template: StoryFn<InteractivePriceGraphProps> = (args) => {
    const [chargeWindowStartIndex, setChargeWindowStartIndex] = useState(0)
    const chargeWindow = 8

    const isInChargeWindow = (value: number) =>
        value >= chargeWindowStartIndex &&
        value < chargeWindowStartIndex + chargeWindow
    const isInDataRange = (value: number) =>
        value + chargeWindow < Object.keys(args.data.prices).length

    return (
        <div style={{ flex: 1, height: 400 }}>
            <InteractivePriceGraph
                {...{
                    ...args,
                    setChargeWindowStartIndex,
                    isInChargeWindow,
                    isInDataRange,
                }}
            />
        </div>
    )
}

const args: Partial<InteractivePriceGraphProps> = {
    data: data,
    windowSize: 8,
    axisLeftText: 'øre/kWh',
}

export const Default = Template.bind({})
Default.args = args
