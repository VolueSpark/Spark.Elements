import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import AdviceGraph, { AdviceGraphProps } from '../src/components/AdviceGraph'
import { createMockActualPricesAdvice } from './graph-mockdata'

export default {
    title: 'Spot Price/Advice Graph',
    component: AdviceGraph,
} as Meta<typeof AdviceGraph>

const data = createMockActualPricesAdvice()

const Template: StoryFn<AdviceGraphProps> = (args) => {
    const [chargeWindowStartIndex, setChargeWindowStartIndex] = useState(0)
    const chargeWindow = 4

    const isInChargeWindow = (value: number) =>
        value >= chargeWindowStartIndex &&
        value < chargeWindowStartIndex + chargeWindow
    const isInDataRange = (value: number) =>
        value + chargeWindow < args.data.spotPrices.length

    return (
        <div style={{ flex: 1, height: 400 }}>
            <AdviceGraph
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

const args: Partial<AdviceGraphProps> = {
    data: data,
    axisLeftText: 'øre/kWh',
    legend: {
        Now: 'Nå',
        Best: 'Beste tidspunkt',
        Good: 'Godt tidspunkt',
        Worst: 'Verste tidspunkt',
        Avoid: 'Bør unngås',
    },
    daysLabelText: {
        today: 'I dag',
        tomorrow: 'I morgen',
    },
}

export const Default = Template.bind({})
Default.args = args
