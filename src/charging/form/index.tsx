import React, { useEffect, useState } from 'react'
import useResize from '../../hooks/useResize'

import style from './form.module.css'
import { PriceArea } from '../priceArea'
import useLocalStorage from 'use-local-storage'
import PriceGraph from '../../components/chargingPlan/priceGraph'
import PriceInfoSelector from '../../components/chargingPlan/priceInfoSelector'
import Prescriptions from '../../components/chargingPlan/prescriptions'
import { useTranslation } from '../../i18n'
import { chargingPlanTexts } from '../..//components/chargingPlan/texts'
import InfoText from '../..//components/infoText'
import { ChargingPlanType } from '../charging.types'

const MAX_CONTENT_WIDTH = 824

type FormProps = {
    area: PriceArea
    data: ChargingPlanType
    isLoading: boolean
}

export default function ChargingPlan({ area, data, isLoading }: FormProps) {
    const [region, setRegion] = useLocalStorage<string>('region', '')
    const { width, height } = useResize()

    const [price, setPrice] = useState(10)
    const [windowStartTime, setWindowStartTime] = useState(14)

    const isInChargeWindow = (idx: number) => {
        return (
            idx >= windowStartTime &&
            idx < windowStartTime + data.chargingWindowSize
        )
    }

    // TODO: temp fix to disable onclick events outside data range
    const isInDataRange = (idx: number) =>
        idx + data.chargingWindowSize <= (data?.priceEntries.length || 0)

    useEffect(() => {
        let newPrice = 1

        if (!data) {
            return
        }

        for (
            let i = windowStartTime;
            // TODO: temp limit count outside of data range
            i <
            Math.min(
                windowStartTime + data.chargingWindowSize,
                data?.priceEntries.length ?? 24
            );
            i++
        ) {
            newPrice +=
                (data.priceEntries[i].averagePrice ?? 0) *
                (data?.chargingRate ?? 0)
        }

        setPrice(newPrice)

        // TODO: temp fix for displaying correct price when outside data range
        if (!isInDataRange(windowStartTime))
            setPrice(data?.prescriptions[0]?.mean ?? 0)
    }, [windowStartTime, data])

    const { t } = useTranslation()

    return (
        <div className={style.container}>
            <PriceInfoSelector
                region={region}
                setRegion={setRegion}
                price={price}
                windowSize={data.chargingWindowSize}
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
                        windowSize={data.chargingWindowSize}
                    />
                </>
            )}
            <InfoText>{t(chargingPlanTexts.info.estimation)}</InfoText>
            <Prescriptions data={data?.prescriptions} />
            <InfoText>{t(chargingPlanTexts.info.deviation)}</InfoText>
        </div>
    )
}
