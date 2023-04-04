import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import DailyOverview, {
    DailyOverviewProps,
} from '../src/components/DailyOverview'
import { createMockSpotPrices } from './graph-mockdata'

export default {
    title: 'Spot Price/Daily Overview',
    component: DailyOverview,
} as Meta<typeof DailyOverview>

const data = createMockSpotPrices()

const Template: StoryFn<DailyOverviewProps> = (args) => {
    return (
        <div>
            <DailyOverview {...args} />
        </div>
    )
}

const args: Partial<DailyOverviewProps> = {
    data: data,
    initialWidth: 500,
    initialHeight: 500,
}

export const Default = Template.bind({})
Default.args = args
