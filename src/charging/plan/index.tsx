import React from 'react'
import { daysLabelsMapper, getDays } from '../utils'

import style from './plan.module.css'

export default function Plan() {
    const days = getDays(new Date())
    const daysLabels = daysLabelsMapper(days)

    return (
        <div className={style.container}>
            {daysLabels.map((d, i) => (
                <div key={i} className={style.item}>
                    <p>{d}</p>
                    <p>Sett inn tid her</p>
                </div>
            ))}
        </div>
    )
}
