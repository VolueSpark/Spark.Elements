import React, { useEffect, useState } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import Forecast, {
    ForecastEntry,
    ForecastProps,
} from '../src/components/Forecast'
import { add, startOfDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

export default {
    title: 'Forecast/Forcast Table',
    component: Forecast,
} as Meta<typeof Forecast>

const Template: StoryFn<ForecastProps> = (args) => {
    const [data, setData] = useState<ForecastEntry[] | null>(null)
    useEffect(() => {
        async function run() {
            const response = await fetchForecastAdvice(
                'NO1',
                'NOK',
                'kWh',
                1.25
            )

            setData(
                response.forecastAdvice.map((f) => ({
                    from: utcToZonedTime(f.from, 'Europe/Oslo').toISOString(),
                    to: utcToZonedTime(f.to, 'Europe/Oslo').toISOString(),
                    // from: s.from,
                    // to: s.to,
                    averagePrice: f.averagePrice * 100,
                    loss: f.loss * 100,
                    type: f.type,
                    bestPrice:
                        f.averagePrice ===
                        Math.min(
                            ...response.forecastAdvice.map(
                                (f) => f.averagePrice
                            )
                        ),
                }))
            )
        }

        run()
    }, [])

    return <div>{data && <Forecast data={data} />}</div>
}

async function fetchForecastAdvice(
    priceArea: string,
    currency: string,
    energyUnit: string,
    vatRate: number
) {
    // TODO: Move this URL into a .env file
    const azureUrl = 'https://api.sandbox.voluespark.com'
    const response = await fetch(
        `${azureUrl}/api/forecast/${priceArea}/advice`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currency: currency,
                energyUnit: energyUnit,
                vatRate: vatRate,
            }),
        }
    )

    return await response.json()
}

// const data = {
//     priceArea: {
//         code: 'NO1',
//     },
//     priceUnits: {
//         currency: 'NOK',
//         vat: {
//             rate: 1.25,
//             hasVAT: true,
//         },
//         energyUnit: 'kWh',
//     },
//     forecastAdvice: [
//         {
//             from: '2023-03-18T00:00:00+00:00',
//             to: '2023-03-18T06:00:00+00:00',
//             averagePrice: 1.2644790239583334,
//             loss: 0,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-18T06:00:00+00:00',
//             to: '2023-03-18T12:00:00+00:00',
//             averagePrice: 1.2628371833333334,
//             loss: -0.0016418406250000572,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-18T12:00:00+00:00',
//             to: '2023-03-18T18:00:00+00:00',
//             averagePrice: 1.2329747197916667,
//             loss: -0.03150430416666672,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-18T18:00:00+00:00',
//             to: '2023-03-18T00:00:00+00:00',
//             averagePrice: 1.4306618489583334,
//             loss: 0.16618282499999992,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-19T00:00:00+00:00',
//             to: '2023-03-19T06:00:00+00:00',
//             averagePrice: 1.2548183385416667,
//             loss: 0,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-19T06:00:00+00:00',
//             to: '2023-03-19T12:00:00+00:00',
//             averagePrice: 1.217174978125,
//             loss: -0.037643360416666605,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-19T12:00:00+00:00',
//             to: '2023-03-19T18:00:00+00:00',
//             averagePrice: 1.2039926635416667,
//             loss: -0.050825675000000015,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-19T18:00:00+00:00',
//             to: '2023-03-19T00:00:00+00:00',
//             averagePrice: 1.338813953125,
//             loss: 0.08399561458333338,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-20T00:00:00+00:00',
//             to: '2023-03-20T06:00:00+00:00',
//             averagePrice: 1.2012086729166667,
//             loss: 0,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-20T06:00:00+00:00',
//             to: '2023-03-20T12:00:00+00:00',
//             averagePrice: 1.4343024520833332,
//             loss: 0.23309377916666651,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-20T12:00:00+00:00',
//             to: '2023-03-20T18:00:00+00:00',
//             averagePrice: 1.39956205625,
//             loss: 0.1983533833333333,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-20T18:00:00+00:00',
//             to: '2023-03-20T00:00:00+00:00',
//             averagePrice: 1.4131488822916667,
//             loss: 0.21194020937500002,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-21T00:00:00+00:00',
//             to: '2023-03-21T06:00:00+00:00',
//             averagePrice: 1.2687144968750002,
//             loss: 0,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-21T06:00:00+00:00',
//             to: '2023-03-21T12:00:00+00:00',
//             averagePrice: 1.385999025,
//             loss: 0.1172845281249999,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-21T12:00:00+00:00',
//             to: '2023-03-21T18:00:00+00:00',
//             averagePrice: 1.2446817572916666,
//             loss: -0.024032739583333518,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-21T18:00:00+00:00',
//             to: '2023-03-21T00:00:00+00:00',
//             averagePrice: 1.3022175635416666,
//             loss: 0.03350306666666647,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-22T00:00:00+00:00',
//             to: '2023-03-22T06:00:00+00:00',
//             averagePrice: 1.0003330416666667,
//             loss: 0,
//             type: 'Good',
//         },
//         {
//             from: '2023-03-22T06:00:00+00:00',
//             to: '2023-03-22T12:00:00+00:00',
//             averagePrice: 1.2937228229166666,
//             loss: 0.2933897812499999,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-22T12:00:00+00:00',
//             to: '2023-03-22T18:00:00+00:00',
//             averagePrice: 1.2282871458333333,
//             loss: 0.22795410416666662,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-22T18:00:00+00:00',
//             to: '2023-03-22T00:00:00+00:00',
//             averagePrice: 1.29334210625,
//             loss: 0.2930090645833332,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-23T00:00:00+00:00',
//             to: '2023-03-23T06:00:00+00:00',
//             averagePrice: 0.7611002062500001,
//             loss: 0,
//             type: 'Good',
//         },
//         {
//             from: '2023-03-23T06:00:00+00:00',
//             to: '2023-03-23T12:00:00+00:00',
//             averagePrice: 1.166920378125,
//             loss: 0.40582017187499986,
//             type: 'Normal',
//         },
//         {
//             from: '2023-03-23T12:00:00+00:00',
//             to: '2023-03-23T18:00:00+00:00',
//             averagePrice: 1.1623279833333333,
//             loss: 0.40122777708333324,
//             type: 'Normal',
//         },
//         {
//             from: '2023-03-23T18:00:00+00:00',
//             to: '2023-03-23T00:00:00+00:00',
//             averagePrice: 1.264145896875,
//             loss: 0.5030456906249998,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-24T00:00:00+00:00',
//             to: '2023-03-24T06:00:00+00:00',
//             averagePrice: 0.6375814427083334,
//             loss: 0,
//             type: 'Good',
//         },
//         {
//             from: '2023-03-24T06:00:00+00:00',
//             to: '2023-03-24T12:00:00+00:00',
//             averagePrice: 1.19197629375,
//             loss: 0.5543948510416666,
//             type: 'Avoid',
//         },
//         {
//             from: '2023-03-24T12:00:00+00:00',
//             to: '2023-03-24T18:00:00+00:00',
//             averagePrice: 1.1010563947916667,
//             loss: 0.46347495208333334,
//             type: 'Good',
//         },
//         {
//             from: '2023-03-24T18:00:00+00:00',
//             to: '2023-03-24T00:00:00+00:00',
//             averagePrice: 1.1219006322916667,
//             loss: 0.4843191895833333,
//             type: 'Good',
//         },
//         {
//             from: '2023-03-25T00:00:00+00:00',
//             to: '2023-03-25T06:00:00+00:00',
//             averagePrice: 0.7170798416666667,
//             loss: 0,
//             type: 'Good',
//         },
//         {
//             from: '2023-03-25T06:00:00+00:00',
//             to: '2023-03-25T12:00:00+00:00',
//             averagePrice: 0.9280682593749999,
//             loss: 0.2109884177083332,
//             type: 'Good',
//         },
//         {
//             from: '2023-03-25T12:00:00+00:00',
//             to: '2023-03-25T18:00:00+00:00',
//             averagePrice: 1.0223432239583332,
//             loss: 0.3052633822916665,
//             type: 'Good',
//         },
//         {
//             from: '2023-03-25T18:00:00+00:00',
//             to: '2023-03-25T00:00:00+00:00',
//             averagePrice: 1.1437204562499999,
//             loss: 0.42664061458333313,
//             type: 'Normal',
//         },
//     ],
// }

// export const Primary = Template.bind({})
// Primary.args = {
//     // data: createMockForecastEntries(),
//     data: data.forecastAdvice.map((s) => ({
//         from: utcToZonedTime(s.from, 'Europe/Oslo').toISOString(),
//         to: utcToZonedTime(s.to, 'Europe/Oslo').toISOString(),
//         // from: s.from,
//         // to: s.to,
//         averagePrice: s.averagePrice * 100,
//         loss: s.loss * 100,
//         type: s.type,
//         bestPrice:
//             s.averagePrice ===
//             Math.min(...data.forecastAdvice.map((s) => s.averagePrice)),
//     })),
// }

export const FromAPI = Template.bind({})

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
                loss: 0,
                type: ['Normal', 'Good', 'Avoid'][
                    Math.floor(
                        Math.random() * 3
                    ) as unknown as ForecastEntry['type']
                ],
            })
        }
    }
    return result
}
