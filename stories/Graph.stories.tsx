import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import PriceGraph from '../src/components/chargingPlan/priceGraph'
import { createMockChargingPlan } from '../src/charging/mockdata.service'

export default {
    title: 'Examples/PriceGraph',
    component: PriceGraph,
} as Meta<typeof PriceGraph>

const data = createMockChargingPlan()

const Template: StoryFn<typeof PriceGraph> = (args) => {
    const [chargeWindowStartIndex, setChargeWindowStartIndex] = useState(0)
    const [chargeWindow, setChargeWindow] = useState(8)

    const isInChargeWindow = (value: number) =>
        value >= chargeWindowStartIndex &&
        value < chargeWindowStartIndex + chargeWindow
    const isInDataRange = (value: number) =>
        value + chargeWindow < args.data.length

    return (
        <PriceGraph
            {...{
                ...args,
                setChargeWindowStartIndex,
                isInChargeWindow,
                isInDataRange,
            }}
        />
    )
}

export const Primary = Template.bind({})
Primary.args = {
    width: 1024,
    height: 1024,
    data: data.priceEntries.slice(0, 24),
    windowSize: 8,
}
