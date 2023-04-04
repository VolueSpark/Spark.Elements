import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import Coin, { CoinProps } from '../src/components/Coin'
import { createMockActualPricesAdvice } from './graph-mockdata'

const data = createMockActualPricesAdvice()

export default {
    title: 'Misc/Coin',
    component: Coin,
} as Meta<typeof Coin>

const Template: StoryFn<CoinProps> = (args) => {
    return <Coin {...args} />
}

const PrimaryArgs = (dataIndex: number): CoinProps => ({
    totalPrice: Math.round(data.advice[dataIndex].cost),
    advice: data.advice[dataIndex],
    currency: 'kr',
    details: 'inkl. MVA',
})
export const Now = Template.bind({})
Now.args = PrimaryArgs(0)

export const Avoid = Template.bind({})
Avoid.args = PrimaryArgs(1)

export const Good = Template.bind({})
Good.args = PrimaryArgs(2)
