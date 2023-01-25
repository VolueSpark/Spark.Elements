import React from 'react'
import { render } from '@testing-library/react'
import PriceInfoSelector, {
    formatTime,
    PriceInfoSelectorProps,
} from './priceInfoSelector'

describe('PriceInfoSelector', () => {
    const renderComponent = (args: PriceInfoSelectorProps) =>
        render(<PriceInfoSelector {...args} />)

    it('should render the component given proper args', () => {
        let region = 'NO1'
        const setRegion = (value: string) => (region = value)
        const price = 20
        const windowSize = 8
        let windowStartTime = 1
        const setWindowStartTime = (value: number) => (windowStartTime = value)
        const isInDataRange = (value: number) => value + windowSize < 24

        const { getByTestId } = renderComponent({
            region,
            setRegion,
            price,
            windowSize,
            windowStartTime,
            setWindowStartTime,
            isInDataRange,
        })

        const dropdown = getByTestId(
            'test-component__priceInfoSelector__dropdown'
        )
        expect(dropdown).toHaveTextContent(region)

        const timeInput = getByTestId(
            'test-component__priceInfoSelector__timeInput'
        )
        expect(timeInput).toHaveValue(formatTime(windowStartTime))

        // Temp solution as we need to wait for the framer-motion animation to finish
        setTimeout(() => {
            const totalCost = getByTestId(
                'test__component-priceInfoSelector__price'
            )
            expect(totalCost).toBeInTheDocument()
        }, 1000)
    })
})
