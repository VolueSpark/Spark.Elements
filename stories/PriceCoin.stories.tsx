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
        isoDateFrom: formatISO(new Date()),
        isoDateTill: formatISO(add(new Date(), { hours: 4 })),
        type: 'now',
        totalPrice: 24,
    },
    details: 'inkl. MVA',
}
export const Primary = Template.bind({})
Primary.args = PrimaryArgs
