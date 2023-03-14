import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import PriceCoin, { PriceCoinProps } from '../src/components/PriceCoin'
import { add, formatISO } from 'date-fns'

export default {
    title: 'Examples/PriceCoin',
    component: PriceCoin,
} as Meta<typeof PriceCoin>

const Template: StoryFn<PriceCoinProps> = (args) => {
    return <PriceCoin {...args} />
}

const PrimaryArgs: PriceCoinProps = {
    price: 24,
    priceUnit: 'kr',
    advice: {
        from: formatISO(new Date()),
        to: formatISO(add(new Date(), { hours: 4 })),
        type: 'now',
        cost: 24,
    },
    details: 'inkl. MVA',
}
export const Primary = Template.bind({})
Primary.args = PrimaryArgs
