import { DocsContainer } from '@storybook/blocks'

import './index.css'

// TODO: use this to add ToC and Github links
const CustomDocsContainer = ({ children, ...props }) => {
    return (
        <DocsContainer {...props}>
            <div>{children}</div>
        </DocsContainer>
    )
}

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    docs: {
        container: CustomDocsContainer,
    },
    options: {
        storySort: {
            order: [
                'Introduction',
                'atoms',
                'spotPrice',
                'historicPrices',
                'forecast',
                'settings',
            ],
        },
    },
}
