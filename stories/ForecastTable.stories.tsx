import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import ForecastTable, {
    ForecastTableProps,
} from '../src/components/ForecastTable'
import { utcToZonedTime } from 'date-fns-tz'
import { createMockForecastAdvice } from './graph-mockdata'
import Locale from 'date-fns/locale/nb'

const data = createMockForecastAdvice()

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

const args: ForecastTableProps = {
    data: {
        ...data,
        forecastAdvice: data.forecastAdvice.map((s) => ({
            from: utcToZonedTime(s.from, 'Europe/Oslo').toISOString(),
            to: utcToZonedTime(s.to, 'Europe/Oslo').toISOString(),
            averagePrice: s.averagePrice * 100,
            loss: s.loss * 100,
            type: s.type,
            bestPrice:
                s.averagePrice ===
                Math.min(...data.forecastAdvice.map((s) => s.averagePrice)),
        })),
    },
    locale: Locale,
}

export const Default = Template.bind({})
Default.args = args
