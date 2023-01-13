import InfoText from '@/components/infoText'
import { Meta, StoryFn } from '@storybook/react'

export default {
    title: 'Examples/InfoText',
    component: InfoText,
} as Meta<typeof InfoText>

const Template: StoryFn<typeof InfoText> = (args) => <InfoText {...args} />

export const Primary = Template.bind({})
Primary.args = {
    children: <p>Informasjon om ladeplan eller graf kan vedlegges her.</p>,
}
