import { apiHeaders, API_BASE_URL } from './services.helper'

export async function fetchChargingPlan(area: string) {
    const response = await fetch(
        `${API_BASE_URL}/chargingWindow/chargingPlan?region=${area}`,
        {
            headers: apiHeaders,
        }
    )
    console.log('$$FETCH CHARGING PLAN')
    console.log(response)
    return response
}
