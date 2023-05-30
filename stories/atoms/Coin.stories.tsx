import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import Coin, { CoinProps } from '../../src/components/Coin'
import { add, formatISO } from 'date-fns'

export default {
    component: Coin,
} as Meta<typeof Coin>

const Template: StoryFn<CoinProps> = (args) => {
    return <Coin {...args} />
}

const PrimaryArgs: CoinProps = {
    price: 24,
    priceUnit: 'kr',
    advice: {
        from: formatISO(new Date()),
        to: formatISO(add(new Date(), { hours: 4 })),
        type: 'Now',
        cost: 24,
    },
    details: 'inkl. MVA',
}
export const Now = Template.bind({})
Now.args = PrimaryArgs
