import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import InfoText from '../../src/components/InfoText'

const meta: Meta<typeof InfoText> = {
    component: InfoText,
}

export default meta
type Story = StoryObj<typeof InfoText>

export const Default: Story = {
    render: () => (
        <InfoText>
            This text can be used to give extra information the the user
        </InfoText>
    ),
}
