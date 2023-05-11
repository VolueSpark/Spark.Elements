import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import DailyOverview, {
    DailyOverviewProps,
} from '../../src/components/DailyOverview'
import { createMockPriceDataForCurrentDay } from '../graph-mockdata'

export default {
    component: DailyOverview,
} as Meta<typeof DailyOverview>

const data = createMockPriceDataForCurrentDay()

const Template: StoryFn<DailyOverviewProps> = (args) => {
    return (
        <div>
            <DailyOverview {...args} />
        </div>
    )
}

export const Default = Template.bind({})
Default.args = {
    data: data,
    width: 500,
    height: 500,
    numberOfIntervals: 4,
}
