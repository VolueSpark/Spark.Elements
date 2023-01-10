import { fetchChargingPlan } from '@/src/api/chargingPlans.service'
import type { NextApiRequest, NextApiResponse } from 'next'

export type ChargingPlanType = {
    priceEntries: Price[]
    prescriptions: ChargingPrescription[]
    chargingWindowSize: number
    chargingRate: number
}

export type Price = {
    time: string
    averagePrice: number
    standardDeviation: number
}

export type ChargingPrescription = {
    from: string
    to: string
    mean: number
    stdDev: number
    q1: number
    q3: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ChargingPlanType>
) {
    const area = req.query.area as string
    const response = await fetchChargingPlan(area)
    const data = (await response.json()) as ChargingPlanType
    res.status(200).json(data)
}
