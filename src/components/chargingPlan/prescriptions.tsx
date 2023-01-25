import React from 'react'
import { useTranslation } from '../../i18n'
import { chargingPlanTexts } from './texts'
import { ChargingPrescription } from '../../charging/charging.types'

import style from './prescriptions.module.css'

export type PrescriptionsProps = {
    data?: ChargingPrescription[]
    numberOfRows?: number
}

export default function Prescriptions({
    data,
    numberOfRows = 7,
}: PrescriptionsProps) {
    const { t } = useTranslation()

    function formatDate(date: string) {
        const dateString = new Date(date).toLocaleDateString(
            t(chargingPlanTexts.locale),
            {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
            }
        )

        return (
            dateString.charAt(0).toUpperCase() + // Capitalise weekday
            dateString.slice(1, dateString.length - 1) // Remove trailing dot "."
        )
    }

    function formatTime(date: string) {
        return new Date(date).toLocaleTimeString(t(chargingPlanTexts.locale), {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const currencyFormatter = new Intl.NumberFormat(
        t(chargingPlanTexts.locale),
        { style: 'currency', currency: 'NOK' }
    )

    return (
        <div
            data-testId="test-component__prescriptions__container"
            className={style.prescriptions__container}
        >
            <h3 className={style.prescriptions__title}>
                {t(chargingPlanTexts.prescriptions.header)}
            </h3>
            <table className={style.prescriptions__table}>
                <thead className={style.prescriptions__table__head}>
                    <tr>
                        <th></th>
                        <th>{t(chargingPlanTexts.prescriptions.table.time)}</th>
                        <th>{t(chargingPlanTexts.prescriptions.table.cost)}</th>
                        <th>
                            {t(chargingPlanTexts.prescriptions.table.deviation)}
                        </th>
                    </tr>
                </thead>
                <tbody
                    className={style.prescriptions__table__body}
                    data-testId="test-component__prescriptions__table"
                >
                    {data?.length ? (
                        data?.map((p, idx) => {
                            if (idx < numberOfRows)
                                return (
                                    <tr key={idx}>
                                        <td>{formatDate(p.from)}</td>
                                        <td>
                                            {formatTime(p.from)} -{' '}
                                            {formatTime(p.to)}
                                        </td>
                                        <td>
                                            {currencyFormatter.format(p.mean)}
                                        </td>
                                        <td>
                                            +/-{' '}
                                            {currencyFormatter.format(p.stdDev)}{' '}
                                        </td>
                                    </tr>
                                )
                            else return
                        })
                    ) : (
                        <tr>
                            <td>Missing data to populate table</td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}