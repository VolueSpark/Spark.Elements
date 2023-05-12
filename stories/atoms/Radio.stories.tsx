import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'

import { Radio } from '../../src/components/UI'

const meta: Meta<typeof Radio> = {
    component: Radio,
    decorators: [
        (Story, ctx) => {
            const [isChecked, setIsChecked] = useState(false)
            // TODO: replace with useArgs when we update Storybook to proper 7.x
            ctx.args.checked = isChecked
            ctx.args.onClick = () => setIsChecked(!isChecked)

            return (
                <div>
                    <Story {...ctx.args} />
                </div>
            )
        },
    ],
}

export default meta
type Story = StoryObj<typeof Radio>

export const Primary: Story = {
    args: {
        name: 'Test',
        label: 'Radio',
    },
}

export const List: Story = {
    render: () => {
        const [isChecked, setIsChecked] = useState<'3.7' | '11' | '22'>()
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <Radio
                    id="3.7"
                    name="3.7kW"
                    label="3.7 kW"
                    onClick={() => setIsChecked('3.7')}
                    checked={isChecked === '3.7'}
                />
                <Radio
                    id="11"
                    name="11kW"
                    label="11 kW"
                    onClick={() => setIsChecked('11')}
                    checked={isChecked === '11'}
                />
                <Radio
                    id="22"
                    name="22kW"
                    label="22 kW"
                    onClick={() => setIsChecked('22')}
                    checked={isChecked === '22'}
                />
            </div>
        )
    },
}
