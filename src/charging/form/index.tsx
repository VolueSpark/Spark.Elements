import React, { useEffect, useState } from 'react'
import { ChargingPlanType } from '@/pages/api/chargingPlan'
import useResize from '@/hooks/useResize'

import style from './form.module.css'
import useFetchChargingPlan from '../hooks/useFetchArea'
import { PriceArea } from '../priceArea'
import useLocalStorage from 'use-local-storage'
import PriceGraph from '@/components/chargingPlan/priceGraph'
import PriceInfoSelector from '@/components/chargingPlan/priceInfoSelector'
import Prescriptions from '@/components/chargingPlan/prescriptions'
import { useTranslation } from '@/i18n'
import { chargingPlanTexts } from '@/components/chargingPlan/texts'
import InfoText from '@/components/infoText'
import usePriceArea from '@/src/hooks/usePriceArea'

const MAX_CONTENT_WIDTH = 824

type FormProps = {
    area?: PriceArea
    controls?: boolean
}

export default function ChargingPlan({ area }: FormProps) {
    const submit = useFetchChargingPlan()
    const [region, setRegion] = useLocalStorage<string>('region', '')
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<ChargingPlanType>()
    const { width, height } = useResize()

    const [price, setPrice] = useState(0)
    const [windowSize, setWindowSize] = useState(11)
    const [windowStartTime, setWindowStartTime] = useState(14)

    const isInChargeWindow = (idx: number) => {
        return idx >= windowStartTime && idx < windowStartTime + windowSize
    }

    // TODO: temp fix to disable onclick events outside data range
    const isInDataRange = (idx: number) =>
        idx + windowSize <= (data?.priceEntries.length || 0)

    useEffect(() => {
        let newPrice = 0

        for (
            let i = windowStartTime;
            // TODO: temp limit count outside of data range
            i <
            Math.min(
                windowStartTime + windowSize,
                data?.priceEntries.length ?? 24
            );
            i++
        ) {
            newPrice +=
                (data?.priceEntries[i].averagePrice ?? 0) *
                (data?.chargingRate ?? 0)
        }

        setPrice(newPrice)

        // TODO: temp fix for displaying correct price when outside data range
        if (!isInDataRange(windowStartTime))
            setPrice(data?.prescriptions[0]?.mean || 0)
    }, [windowStartTime, data, windowSize])

    const { getGeolocation, locationError } = usePriceArea(setRegion)
    useEffect(() => {
        if (!locationError) {
            getGeolocation()
        } else {
            console.error(locationError)
        }
    }, [])

    const handleSubmit = async () => {
        const data = await submit(region)
        setIsLoading(false)
        setData(data)
        setWindowSize(data.chargingWindowSize)
        let startHour = new Date(data.prescriptions[0].from).getHours()
        setWindowStartTime(startHour)
    }

    useEffect(() => {
        if (area) setRegion(area)
    }, [area])

    useEffect(() => {
        if (region) {
            setIsLoading(true)
            handleSubmit()
        }
    }, [region])

    const { t } = useTranslation()

    return (
        <div className={style.container}>
            <PriceInfoSelector
                region={region}
                setRegion={setRegion}
                price={price}
                windowSize={windowSize}
                windowStartTime={windowStartTime}
                setWindowStartTime={setWindowStartTime}
                isInDataRange={isInDataRange}
            />
            {!isLoading && (
                <>
                    <PriceGraph
                        data={(data?.priceEntries ?? []).slice(0, 24)}
                        width={
                            width > MAX_CONTENT_WIDTH
                                ? MAX_CONTENT_WIDTH
                                : width
                        }
                        height={height / 4}
                        setChargeWindowStartIndex={setWindowStartTime}
                        isInChargeWindow={isInChargeWindow}
                        isInDataRange={isInDataRange}
                        windowSize={windowSize}
                    />
                </>
            )}
            <InfoText>{t(chargingPlanTexts.info.estimation)}</InfoText>
            <Prescriptions data={data?.prescriptions} />
            <InfoText>{t(chargingPlanTexts.info.deviation)}</InfoText>
        </div>
    )
}
