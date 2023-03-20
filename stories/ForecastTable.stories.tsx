import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import ForecastTable, {
    ForecastTableProps,
} from '../src/components/ForecastTable'
import { utcToZonedTime } from 'date-fns-tz'
import { forecastAdviceData } from './mock/ForecastAdviceData'

export default {
    title: 'Forecast/Forcast Table',
    component: ForecastTable,
} as Meta<typeof ForecastTable>

const Template: StoryFn<ForecastTableProps> = (args) => {
    return (
        <div>
            <ForecastTable {...args} />
        </div>
    )
}

export const Default = Template.bind({})
Default.args = {
    data: forecastAdviceData.forecastAdvice.map((s) => ({
        from: utcToZonedTime(s.from, 'Europe/Oslo').toISOString(),
        to: utcToZonedTime(s.to, 'Europe/Oslo').toISOString(),
        averagePrice: s.averagePrice * 100,
        loss: s.loss * 100,
        type: s.type,
        bestPrice:
            s.averagePrice ===
            Math.min(
                ...forecastAdviceData.forecastAdvice.map((s) => s.averagePrice)
            ),
    })),
}
