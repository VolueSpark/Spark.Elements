import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import DailyPrices, { DailyPricesProps } from '../src/components/DailyPrices'
import { createMockChargingPlan } from './graph-mockdata'

export default {
    title: 'Long Term Forecast/DailyPrices',
    component: DailyPrices,
} as Meta<typeof DailyPrices>

const data = createMockChargingPlan()
console.log(data)

const Template: StoryFn<DailyPricesProps> = (args) => {
    return (
        <div>
            <DailyPrices {...args} />
        </div>
    )
}

export const Primary = Template.bind({})
Primary.args = {
    data: data.priceEntries,
    width: 500,
    height: 500,
    numberOfIntervals: 4,
}
