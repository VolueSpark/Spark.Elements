import React, { useEffect } from 'react'
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Range from '../../src/components/UI/Range'

const meta: Meta<typeof Range> = {
    component: Range,
    decorators: [
        (Story, ctx) => {
            const [values, setValues] = useState<Array<number>>([10, 80])

            useEffect(() => {
                console.log(values)
            }, [values])

            ctx.args.value = values
            ctx.args.onChange = setValues
            return (
                <div>
                    <Story {...ctx.args} />
                </div>
            )
        },
    ],
}

export default meta
type Story = StoryObj<typeof Range>

export const Primary: Story = {
    args: {
        id: 'test',
        minValue: 0,
        maxValue: 100,
        value: [10, 80],
        labels: {
            left: '0%',
            center: '50%',
            right: '100%',
        },
    },
}
