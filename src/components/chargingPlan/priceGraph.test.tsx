import React from 'react'
import { render } from '@testing-library/react'
import PriceGraph, { PriceGraphProps } from './priceGraph'

describe('PriceGraph', () => {
    const renderComponent = (args: PriceGraphProps) =>
        render(<PriceGraph {...args} />)

    it('should render 24 bars when data contains 24 items', () => {
        const data: PriceGraphProps['data'] = createMockData()
        const width = 100
        const height = 100
        const setChargeWindowStartIndex = jest.fn()
        const isInChargeWindow = jest.fn()
        const isInDataRange = jest.fn()
        const windowSize = 8

        const { getAllByTestId } = renderComponent({
            data,
            width,
            height,
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
            time: `2023-01-01T${i}:00:00.000Z`,
            averagePrice: 1,
            standardDeviation: i,
        })
    }

    return result
}
