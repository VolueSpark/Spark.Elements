import type { Meta, StoryObj } from '@storybook/react'

import Button from '../../src/components/UI/Button'

const meta: Meta<typeof Button> = {
    component: Button,
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
    args: {
        children: 'Click me',
        onClick: () => console.log('Button clicked'),
        variant: 'default',
    },
}

export const Warning: Story = {
    args: {
        children: 'Click me',
        onClick: () => console.log('Button clicked'),
        variant: 'warning',
    },
}

export const Outlined: Story = {
    args: {
        children: 'Click me',
        onClick: () => console.log('Button clicked'),
        variant: 'outlined',
    },
}
