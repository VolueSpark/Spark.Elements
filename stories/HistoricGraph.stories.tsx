import React, { useEffect } from 'react'
import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import PriceGraph, { PriceGraphProps } from '../src/components/PriceGraph'
import { formatISO, parseISO } from 'date-fns'
import { Price, PriceTimeRangeAdvice } from '../src/components/types'

export default {
    title: 'Examples/HistoricPriceGraph',
    component: PriceGraph,
} as Meta<typeof PriceGraph>

type HistoricDataArgs = {
    priceArea: string
    time: Date
    preferredCurrency: string
    chargingRate: number
    chargingLength: number
}

const Template: StoryFn<PriceGraphProps & HistoricDataArgs> = (args) => {
    const [[data, advice], setDataAndAdvice] = useState<
        [Price[]?, PriceTimeRangeAdvice[]?]
    >([undefined, undefined])
    useEffect(() => {
        async function run() {
            const response = await fetchSpotPricesAdvice(
                args.priceArea,
                args.time,
                args.preferredCurrency,
                args.chargingRate,
                args.chargingLength
            )

            setDataAndAdvice([response.spotPrices, response.advice])
        }

        run()
    }, [
        args.priceArea,
        args.time,
        args.preferredCurrency,
        args.chargingRate,
        args.chargingLength,
    ])

    return (
        <div style={{ flex: 1, height: 400 }}>
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
    time: parseISO('2023-01-05'),
    preferredCurrency: 'NOK',
    chargingRate: 3.6,
    chargingLength: 4,
    legend: {
        now: 'Nå',
        best: 'Beste tidspunkt',
        worst: 'Verste tidspunkt',
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
        `${azureUrl}/api/spot-prices/${priceArea}/advice/historic?PreferredCurrency=${preferredCurrency}&energyPriceUnit=kWh&vatrate=1.25&chargingRate=${chargingRate}&chargingLength=${chargingLength}&startFrom=${formatISO(
            time,
            { representation: 'date' }
        )}`,
        {
            method: 'GET',
        }
    )

    return await response.json()
}
