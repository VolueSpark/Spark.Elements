import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import InteractivePriceGraph, {
    InteractivePriceGraphProps,
} from '../src/components/InteractivePriceGraph'
import { createMockChargingPlan } from './graph-mockdata'

export default {
    title: 'Spot Price/InteractPriceGraph',
    component: InteractivePriceGraph,
} as Meta<typeof InteractivePriceGraph>

const data = createMockChargingPlan()

const Template: StoryFn<InteractivePriceGraphProps> = (args) => {
    const [chargeWindowStartIndex, setChargeWindowStartIndex] = useState(0)
    const chargeWindow = 8

    const isInChargeWindow = (value: number) =>
        value >= chargeWindowStartIndex &&
        value < chargeWindowStartIndex + chargeWindow
    const isInDataRange = (value: number) =>
        value + chargeWindow < args.data.length

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
    data: data.priceEntries.slice(0, 24),
    windowSize: 8,
    priceUnit: 'øre',
    energyUnit: 'kWh',
}

export const Default = Template.bind({})
Default.args = args
