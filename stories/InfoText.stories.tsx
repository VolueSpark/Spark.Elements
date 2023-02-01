import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import InfoText from '../src/components/infoText'

export default {
    title: 'Examples/InfoText',
    component: InfoText,
} as Meta<typeof InfoText>

const Template: StoryFn<typeof InfoText> = (args) => <InfoText {...args} />

export const Primary = Template.bind({})
Primary.args = {
    children: <p>Informasjon om ladeplan eller graf kan vedlegges her.</p>,
}
