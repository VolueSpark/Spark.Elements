import React from 'react'
import { render } from '@testing-library/react'
import InteractivePriceGraph, { PriceGraphProps } from './index'

describe('InteractivePriceGraph', () => {
    const renderComponent = (args: PriceGraphProps) =>
        render(<InteractivePriceGraph {...args} />)

    it('should render 24 bars when data contains 24 items', () => {
        const data: PriceGraphProps['data'] = createMockData()
        const priceUnit = 'kr'
        const energyUnit = 'kWh'
        const initialWidth = 100
        const initialHeight = 100
        const setChargeWindowStartIndex = jest.fn()
        const isInChargeWindow = jest.fn()
        const isInDataRange = jest.fn()
        const windowSize = 8

        const { getAllByTestId } = renderComponent({
            data,
            priceUnit,
            energyUnit,
            initialWidth,
            initialHeight,
            setChargeWindowStartIndex,
            isInChargeWindow,
            isInDataRange,
            windowSize,
        })

        const bars = getAllByTestId(
            'spark-elements__test-component_price-graph-bar'
        )

        expect(bars).toHaveLength(24)
    })
})

const createMockData = (): PriceGraphProps['data'] => {
    const result: PriceGraphProps['data'] = []
    for (let i = 0; i < 24; i++) {
        result.push({
            isoDate: `2023-01-01T${i}:00:00.000Z`,
            averagePrice: 1,
            standardDeviation: i,
        })
    }

    return result
}
