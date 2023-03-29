import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import DailyOverview, {
    DailyOverviewProps,
} from '../src/components/DailyOverview'
import { spotPriceData } from './mock/spotPriceData'

export default {
    title: 'Spot Price/Daily Overview',
    component: DailyOverview,
} as Meta<typeof DailyOverview>

const Template: StoryFn<DailyOverviewProps> = (args) => {
    return (
        <div>
            <DailyOverview {...args} />
        </div>
    )
}

export const Default = Template.bind({})
Default.args = {
    data: spotPriceData,
    width: 500,
    height: 500,
    numberOfIntervals: 4,
}
