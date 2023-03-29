import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import Coin, { CoinProps } from '../src/components/Coin'
import { add, formatISO } from 'date-fns'

export default {
    title: 'Misc/Coin',
    component: Coin,
} as Meta<typeof Coin>

const Template: StoryFn<CoinProps> = (args) => {
    return <Coin {...args} />
}

const PrimaryArgs: CoinProps = {
    totalPrice: 24,
    advice: {
        from: formatISO(new Date()),
        to: formatISO(add(new Date(), { hours: 4 })),
        type: 'Now',
        cost: 24,
        averagePrice: 6,
    },
    currency: 'kr',
    details: 'inkl. MVA',
}
export const Now = Template.bind({})
Now.args = PrimaryArgs
