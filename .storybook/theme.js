import { create } from '@storybook/theming/create'
import logo from '../stories/assets/spark-volue-logo.svg'

export default create({
    base: 'light',
    // Manager does not support .ttf files atm
    // fontBase: 'Nunito-Sans',
    brandTitle: 'Spark Elements',
    brandUrl: 'https://storybook.sandbox.ladeassistent.no/',
    brandImage: logo,
    brandTarget: '_self',

    // UI
    appBg: '#1B1B1D',
    // appContentBg: 'red',
    // appBorderColor: 'blue',
    // appBorderRadius: 4,

    // Text colors
    textColor: '#ffffff',
    textInverseColor: '#ffffff',

    // Toolbar
    // barBg: '#1B1B1D',
    // barTextColor: "#FFFFFF",
    // barSelectedColor: "#FFFFFF",
})
