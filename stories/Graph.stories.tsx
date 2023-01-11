import { Meta, StoryFn } from '@storybook/react'

import PriceGraph from '@/components/chargingPlan/priceGraph'
import { createMockChargingPlan } from '@/src/charging/mockdata.service'
import { useState } from 'react'

export default {
    title: 'Examples/PriceGraph',
    component: PriceGraph,
} as Meta<typeof PriceGraph>

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
const data = createMockChargingPlan()

export const Primary = Template.bind({})
Primary.args = {
    width: 756,
    height: 756,
    data: data.priceEntries.slice(0, 24),
    windowSize: 1,
}
