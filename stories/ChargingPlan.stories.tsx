import { Meta, StoryFn } from '@storybook/react'

import ChargingPlan from '@/src/charging/form'
import { PriceArea } from '@/src/charging/priceArea'
import { createMockChargingPlan } from '@/src/charging/mockdata.service'

export default {
    title: 'Examples/ChargingPlan',
    component: ChargingPlan,
} as Meta<typeof ChargingPlan>

const Template: StoryFn<typeof ChargingPlan> = (args) => (
    <ChargingPlan {...args} />
)

export const Primary = Template.bind({})
Primary.args = {
    area: 'NO3' as PriceArea,
    data: createMockChargingPlan(),
    isLoading: false,
}
