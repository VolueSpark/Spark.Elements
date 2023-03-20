import React from 'react'
import { Meta, StoryFn } from '@storybook/react'
import Forecast, {
    ForecastEntry,
    ForecastProps,
} from '../src/components/DeprecatedForecast'
import { add, startOfDay } from 'date-fns'

export default {
    title: 'Forecast/Deprecated Forecast Table',
    component: Forecast,
} as Meta<typeof Forecast>

const Template: StoryFn<ForecastProps> = (args) => {
    return (
        <div>
            <Forecast {...args} />
        </div>
    )
}

export const Default = Template.bind({})
Default.args = {
    data: createMockForecastEntries(),
}

function createMockForecastEntries() {
    const result: ForecastEntry[] = []
    const days = 7
    const hoursInDay = 24
    const windowInHours = 6
    for (let i = 0; i < days; i++) {
        for (let j = 0; j < hoursInDay / windowInHours; j++) {
            result.push({
                from: add(startOfDay(new Date()), {
                    days: i,
                    hours: j * windowInHours,
                }).toISOString(),
                to: add(startOfDay(new Date()), {
                    days: i,
                    hours: (j + 1) * windowInHours,
                }).toISOString(),
                averagePrice: Math.random() * 100,
            })
        }
    }
    return result
}
