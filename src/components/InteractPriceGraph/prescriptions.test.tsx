import React from 'react'
import { render, within } from '@testing-library/react'
import { formatDate, formatTime } from '../../utils/dateFormatters'
import Prescriptions, { PrescriptionsProps } from './prescriptions'

describe('Prescriptions', () => {
    const renderComponent = (args: PrescriptionsProps) =>
        render(<Prescriptions {...args} />)

    it('should render error message when data is empty', () => {
        const data: PrescriptionsProps['data'] = []
        const numberOfRows = 7

        const { getByTestId } = renderComponent({ data, numberOfRows })
        const testComponent = getByTestId(
            'test-component__prescriptions__table'
        )

        expect(testComponent).toHaveTextContent(
            'Missing data to populate table'
        )
    })

    it('should render correct list content and length of prescriptions given data and numberofRows', () => {
        const data: PrescriptionsProps['data'] = MOCK_DATA
        const numberOfRows = 5

        const { getByTestId } = renderComponent({ data, numberOfRows })
        const testComponent = getByTestId(
            'test-component__prescriptions__table'
        )

        const rows = within(testComponent).getAllByRole('row')
        expect(rows).toHaveLength(numberOfRows)
        rows.forEach((row, idx) => {
            const [from, to, mean, stdDev] = within(row).getAllByRole('cell')

            expect(from).toHaveTextContent(formatDate(data![idx].from))
            expect(to).toHaveTextContent(
                `${formatTime(data![idx].from)} - ${formatTime(data![idx].to)}`
            )
            expect(mean).toHaveTextContent(data![idx].mean.toString())
            expect(stdDev).toHaveTextContent(data![idx].stdDev.toString())
        })
    })
})

const MOCK_DATA: PrescriptionsProps['data'] = [
    {
        from: '2023-01-01T00:00:00.000Z',
        to: '2023-01-01T01:00:00.000Z',
        mean: 5,
        stdDev: 1,
        q1: 1,
        q3: 5,
    },
    {
        from: '2023-01-01T01:00:00.000Z',
        to: '2023-01-01T02:00:00.000Z',
        mean: 1,
        stdDev: 1,
        q1: 1,
        q3: 1,
    },
    {
        from: '2023-01-01T02:00:00.000Z',
        to: '2023-01-01T03:00:00.000Z',
        mean: 3,
        stdDev: 0,
        q1: 1,
        q3: 3,
    },
    {
        from: '2023-01-01T03:00:00.000Z',
        to: '2023-01-01T04:00:00.000Z',
        mean: 5,
        stdDev: 1,
        q1: 1,
        q3: 5,
    },
    {
        from: '2023-01-01T04:00:00.000Z',
        to: '2023-01-01T05:00:00.000Z',
        mean: 5,
        stdDev: 1,
        q1: 1,
        q3: 5,
    },
    {
        from: '2023-01-01T05:00:00.000Z',
        to: '2023-01-01T06:00:00.000Z',
        mean: 3,
        stdDev: 1,
        q1: 1,
        q3: 3,
    },
    {
        from: '2023-01-01T06:00:00.000Z',
        to: '2023-01-01T07:00:00.000Z',
        mean: 4,
        stdDev: 2,
        q1: 1,
        q3: 4,
    },
]
