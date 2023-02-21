import React, { useEffect } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import PriceGraph, { PriceGraphProps } from '../src/components/PriceGraph'
import {
    addDays,
    format,
    parse,
    parseISO,
    setHours,
    setMinutes,
} from 'date-fns'
import { Price, PriceTimeRangeAdvice } from '../src/components/types'

export default {
    title: 'Examples/HistoricPriceGraph',
    component: PriceGraph,
} as Meta<typeof PriceGraph>

type HistoricDataArgs = {
    priceArea: string
    preferredCurrency: string
    chargingRate: number
    chargingLength: number
}

const Template: StoryFn<PriceGraphProps & HistoricDataArgs> = (args) => {
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
            <PriceGraph
                {...{
                    ...args,
                }}
                data={data ?? []}
                advice={advice ?? []}
            />
        </div>
    )
}

const args: Partial<PriceGraphProps & HistoricDataArgs> = {
    priceUnit: 'øre',
    energyUnit: 'kWh',
    priceArea: 'NO1',
    preferredCurrency: 'NOK',
    chargingRate: 3.6,
    chargingLength: 4,
    legend: {
        now: 'Nå',
        best: 'Beste ladeøkt',
        worst: 'Verste ladeøkt',
        avoid: 'Bør unngås',
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
    const azureUrl = 'https://sandbox-spark-smartcharging.azurewebsites.net'
    const response = await fetch(
        `${azureUrl}/api/spot-prices/${priceArea}/advice/historic?PreferredCurrency=${preferredCurrency}&energyPriceUnit=kWh&vatrate=1.25&chargingRate=${chargingRate}&chargingLength=${chargingLength}&startFrom=${format(
            time,
            'yyyy-MM-dd HH:mm'
        )}`,
        {
            method: 'GET',
        }
    )

    return await response.json()
}
