const path = require('path')
module.exports = {
    stories: [
        '../stories/**/*.mdx',
        '../stories/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        'storybook-css-modules',
        {
            name: '@storybook/addon-postcss',
            options: {
                postcssLoaderOptions: {
                    implementation: require('postcss'),
                },
            },
        },
    ],
    docs: {
        autodocs: 'tag',
    },
    webpackFinal: async (config) => {
        config.module.rules.push({
            test: /\.(ts|tsx)$/,
            loader: require.resolve('babel-loader'),
            options: {
                presets: [
                    [
                        'react-app',
                        {
                            flow: false,
                            typescript: true,
                        },
                    ],
                ],
            },
        })
        config.resolve.extensions.push('.ts', '.tsx')
        return config
    },
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
}
