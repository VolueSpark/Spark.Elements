import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import PriceGraph, { PriceGraphProps } from '../src/components/PriceGraph'
import { createMockChargingPlan } from './graph-mockdata'

export default {
    title: 'Examples/PriceGraph',
    component: PriceGraph,
} as Meta<typeof PriceGraph>

const data = createMockChargingPlan()

const Template: StoryFn<PriceGraphProps> = (args) => {
    const [chargeWindowStartIndex, setChargeWindowStartIndex] = useState(0)
    const chargeWindow = 8

    const isInChargeWindow = (value: number) =>
        value >= chargeWindowStartIndex &&
        value < chargeWindowStartIndex + chargeWindow
    const isInDataRange = (value: number) =>
        value + chargeWindow < args.data.length

    return (
        <div style={{ flex: 1, height: 400 }}>
            <PriceGraph
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

const args: Partial<PriceGraphProps> = {
    data: data.priceEntries,
    advice: data.advice,
    windowSize: 8,
    priceUnit: 'øre',
    energyUnit: 'kWh',
}

export const Primary = Template.bind({})
Primary.args = args
