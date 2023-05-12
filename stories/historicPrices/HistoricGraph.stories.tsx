import React, { useEffect } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import AdviceGraph, { AdviceGraphProps } from '../../src/components/AdviceGraph'
import {
    addDays,
    format,
    formatISO,
    parse,
    parseISO,
    setHours,
    setMinutes,
} from 'date-fns'
import { Price, PriceTimeRangeAdvice } from '../../src/components/types'

export default {
    component: AdviceGraph,
} as Meta<typeof AdviceGraph>

type HistoricDataArgs = {
    priceArea: string
    preferredCurrency: string
    chargingRate: number
    chargingLength: number
}

const Template: StoryFn<AdviceGraphProps & HistoricDataArgs> = (args) => {
    const [date, setDate] = useState<Date>(parseISO('2023-01-05'))
    const [time, setTime] = useState<string>('11:00')
    const hours = parseInt(time.split(':')[0])
    const minutes = parseInt(time.split(':')[1])

    const [[data, advice], setDataAndAdvice] = useState<
        [Price[]?, PriceTimeRangeAdvice[]?]
    >([undefined, undefined])
    useEffect(() => {
        async function run() {
            const response = await fetchSpotPricesAdvice(
                args.priceArea,
                setMinutes(setHours(date, hours), minutes),
                args.preferredCurrency,
                args.chargingRate,
                args.chargingLength
            )

            setDataAndAdvice([response.spotPrices, response.advice])
        }

        run()
    }, [
        args.priceArea,
        date,
        time,
        args.preferredCurrency,
        args.chargingRate,
        args.chargingLength,
    ])
    console.log(format(date, 'yyyy-MM-dd'))
    console.log()
    return (
        <div style={{ flex: 1, height: 400 }}>
            Spot price date:{' '}
            <span
                onClick={() => setDate(addDays(date, -1))}
                style={{ cursor: 'pointer' }}
            >
                ⏪{' '}
            </span>
            <input
                type="date"
                min="2022-01-01" // at the moment we have a cached file of historic data which starts at 2022-01-01
                max="2023-01-31"
                value={format(date, 'yyyy-MM-dd')}
                onChange={(ev) => {
                    setDate(parse(ev.target.value, 'yyyy-MM-dd', new Date()))
                    console.log(
                        parse(ev.target.value, 'yyyy-MM-dd', new Date())
                    )
                }}
                style={{ marginBottom: '10px' }}
            />
            <span
                onClick={() => setDate(addDays(date, 1))}
                style={{ cursor: 'pointer' }}
            >
                {' '}
                ⏩
            </span>
            <span> Time: </span>
            <input
                type="time"
                value={time}
                onChange={(ev) => setTime(ev.target.value)}
            />
            <AdviceGraph
                {...{
                    ...args,
                }}
                data={data ?? []}
                advice={advice ?? []}
            />
        </div>
    )
}

const args: Partial<AdviceGraphProps & HistoricDataArgs> = {
    priceUnit: 'øre',
    energyUnit: 'kWh',
    priceArea: 'NO1',
    preferredCurrency: 'NOK',
    chargingRate: 3.6,
    chargingLength: 4,
    legend: {
        Now: 'Nå',
        Best: 'Beste ladeøkt',
        Worst: 'Verste ladeøkt',
        Avoid: 'Bør unngås',
    },
    daysLabelText: {
        today: 'I dag',
        tomorrow: 'I morgen',
    },
}

export const Primary = Template.bind({})
Primary.args = args

async function fetchSpotPricesAdvice(
    priceArea: string,
    time: Date,
    preferredCurrency: string,
    chargingRate: number,
    chargingLength: number
) {
    // TODO: Move this URL into a .env file
    const azureUrl = 'https://api.sandbox.voluespark.com'
    const response = await fetch(
        `${azureUrl}/api/spot-prices/${priceArea}/advice/historic`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceUnitParameters: {
                    currency: preferredCurrency,
                    energyUnit: 'kWh',
                    vatRate: 1.25,
                },
                chargingSessionParameters: {
                    powerInKiloWatts: chargingRate,
                    duration: `${chargingLength
                        .toString()
                        .padStart(2, '0')}:00:00`,
                },
                startFrom: formatISO(time),
            }),
        }
    )

    return await response.json()
}
