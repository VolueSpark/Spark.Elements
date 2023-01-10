import { useTranslation } from '@/i18n'
import AnimatedNumber from '../animatedNumber'
import Dropdown from '../dropdown'
import Icon from '../icon'
import style from './priceInfoSelector.module.scss'
import { chargingPlanTexts } from './texts'
import { AND } from '@/src/utils/classNames.helper'
import { addHours } from 'date-fns'
import React, { useEffect, useState } from 'react'

// TODO: temp solution
const MAX_SELECTION_IF_OUTSIDE_RANGE = 24

type PriceInfoSelectorProps = {
    region: string
    setRegion: (arg0: string) => void
    price: number
    windowSize: number
    windowStartTime: number
    setWindowStartTime: (arg0: number) => void
    isInDataRange: (arg0: number) => boolean
}

export default function PriceInfoSelector({
    region,
    setRegion,
    price,
    windowSize,
    windowStartTime,
    setWindowStartTime,
    isInDataRange,
}: PriceInfoSelectorProps) {
    const { t } = useTranslation()
    const [windowEndTime, setWindowEndTime] = useState(0)

    function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
        const hours = parseInt(e.currentTarget.value.split(':')[0])
        const newStartTime = parseInt(e.currentTarget.value.split(':')[0])
        // TODO: temp disable selection if outside of data range
        if (isInDataRange(newStartTime)) {
            setWindowStartTime(newStartTime)
            setWindowEndTime(getWindowEndTime(hours))
        } else {
            setWindowStartTime(MAX_SELECTION_IF_OUTSIDE_RANGE - windowSize)
            setWindowEndTime(
                getWindowEndTime(MAX_SELECTION_IF_OUTSIDE_RANGE - windowSize)
            )
        }
    }

    function getWindowEndTime(windowStartTime: number) {
        const startDate = new Date().setHours(windowStartTime)
        const endDate = addHours(startDate, windowSize)

        return endDate.getHours()
    }

    function formatTime(hour: number) {
        return hour.toString().padStart(2, '0') + ':00'
    }

    useEffect(() => {
        setWindowEndTime(getWindowEndTime(windowStartTime))
    }, [windowStartTime])

    return (
        <>
            <div className={style.container}>
                <div className={AND(style.section, style.priceAreaSection)}>
                    <Icon iconName="norway" width={26} height={32} />
                    <div>
                        <h4>
                            {t(chargingPlanTexts.priceInfoSelector.my_area)}
                        </h4>
                        <Dropdown
                            id="region"
                            label={`${t(chargingPlanTexts.dropdown.label)}`}
                            value={region}
                            onChange={setRegion}
                            options={[
                                {
                                    value: 'NO1',
                                    label: `${t(
                                        chargingPlanTexts.dropdown.options.east
                                    )} (NO1)`,
                                },
                                {
                                    value: 'NO2',
                                    label: `${t(
                                        chargingPlanTexts.dropdown.options.south
                                    )} (NO2)`,
                                },
                                {
                                    value: 'NO3',
                                    label: `${t(
                                        chargingPlanTexts.dropdown.options
                                            .center
                                    )} (NO3)`,
                                },
                                {
                                    value: 'NO4',
                                    label: `${t(
                                        chargingPlanTexts.dropdown.options.north
                                    )} (NO4)`,
                                },
                                {
                                    value: 'NO5',
                                    label: `${t(
                                        chargingPlanTexts.dropdown.options.west
                                    )} (NO5)`,
                                },
                            ]}
                        />
                    </div>
                </div>
                <div
                    className={AND(style.section, style.chargingWindowSection)}
                >
                    <Icon iconName="electric_plug" width={32} height={32} />
                    <div>
                        <h4>{t(chargingPlanTexts.priceInfoSelector.window)}</h4>
                        <div>
                            <input
                                className={style.timeInput}
                                type="time"
                                value={formatTime(windowStartTime)}
                                onChange={handleTimeChange}
                            />
                            <span>
                                {t(chargingPlanTexts.priceInfoSelector.to)}{' '}
                                {formatTime(windowEndTime)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className={AND(style.section, style.priceSection)}>
                    <Icon iconName="calculate" width={32} height={32} />
                    <div>
                        <h4>{t(chargingPlanTexts.priceInfoSelector.cost)}</h4>
                        <AnimatedNumber value={price} currency />
                    </div>
                </div>
            </div>
        </>
    )
}
