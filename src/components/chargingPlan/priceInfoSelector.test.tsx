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

        const dropdown = getByTestId('spark-elements__price-region-dropdown')
        expect(dropdown).toHaveTextContent(region)

        const timeInput = getByTestId(
            'spark-elements__price-info-selector_time-input'
        )
        expect(timeInput).toHaveValue(formatTime(windowStartTime))

        // Temp solution as we need to wait for the framer-motion animation to finish
        setTimeout(() => {
            const totalCost = getByTestId(
                'spark-elements__price-info-selector_price'
            )
            expect(totalCost).toBeInTheDocument()
        }, 1000)
    })
})
