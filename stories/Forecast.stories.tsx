import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import Forecast, { ForecastProps } from '../src/components/ForecastGraph'
import { add } from 'date-fns'
import { prepareDataForGraph } from '../src/components/ForecastGraph/prepareDataForGraph'

export default {
    title: 'Examples/Forecast',
    component: Forecast,
} as Meta<typeof Forecast>

const Template: StoryFn<typeof Forecast> = (args) => <Forecast {...args} />

export const Primary = Template.bind({})
Primary.args = {
    data: prepareDataForGraph(createMockData()),
    width: 1000,
    height: 1000,
}

function createMockData() {
    const baseDate = new Date('2023-01-01T00:00:00.000Z')
    const ratings: Array<'ok' | 'good' | 'bad'> = ['good', 'ok', 'bad']
    const data: ForecastProps['data'] = []
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 4; j++) {
            data.push({
                from: add(new Date(baseDate), {
                    days: i,
                    hours: 6 * j - 1,
                }).toString(),
                to: add(new Date(baseDate), {
                    days: i,
                    // TODO: check, if this is correct
                    hours: 6 * (j + 1) - 1,
                }).toString(),
                rating: ratings[j % 3] as 'ok' | 'good' | 'bad',
            })
        }
    }
    return data
}
