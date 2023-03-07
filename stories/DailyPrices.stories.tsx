import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import DailyPrices, { DailyPricesProps } from '../src/components/DailyPrices'
import { createMockPriceDataForCurrentDay } from './graph-mockdata'

export default {
    title: 'Long Term Forecast/DailyPrices',
    component: DailyPrices,
} as Meta<typeof DailyPrices>

const data = createMockPriceDataForCurrentDay()
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
    data: data,
    width: 500,
    height: 500,
    numberOfIntervals: 4,
}
