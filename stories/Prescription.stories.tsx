import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import Prescriptions from '../src/components/chargingPlan/prescriptions'
import { createMockChargingPlan } from '../src/charging/mockdata.service'

export default {
    title: 'Examples/Prescriptions',
    component: Prescriptions,
} as Meta<typeof Prescriptions>

const Template: StoryFn<typeof Prescriptions> = (args) => (
    <Prescriptions {...args} />
)
const data = createMockChargingPlan()

export const Primary = Template.bind({})
Primary.args = {
    data: data.prescriptions,
}
