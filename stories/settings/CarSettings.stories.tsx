import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import Settings from '../../src/components/Settings'

const meta: Meta<typeof Settings> = {
    component: Settings,
    decorators: [
        (Story) => (
            <div style={{ maxWidth: '664px' }}>
                <Story />
            </div>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof Settings>

export const Default: Story = {
    args: {
        title: 'Edit car information',
        car: {
            brand: 'Polestar 2',
            model: 'Long Range Single Motor',
            batteryCapacity: 78,
            img: <img src="/exampleCar.png" alt="Image of car" />,
        },
        parameters: {
            chargingInterval: [10, 80],
            chargerCapacity: 3.7,
        },
        info: 'Car data is used to calculate charging plan',
        onItemClick: (key) => console.log('List item keys: ', key),
        buttonValue: 'Delete car',
        onButtonClick: () => console.log('Delete car clicked'),
    },
}
