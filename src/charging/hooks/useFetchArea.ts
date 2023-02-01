import { useCallback } from 'react'
import { ChargingPlanType } from '../charging.types'

export default function useFetchChargingPlan() {
    return useCallback(async function useFetchChargingPlan(
        area: string
    ): Promise<ChargingPlanType> {
        const response = await fetch(`/api/chargingPlan?area=${area}`)
        const data = await response.json()
        return data
    },
    [])
}
