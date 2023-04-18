import React from 'react'

import style from './infoText.module.css'
import InfoIcon from './InfoIcon'

type InfoTextProps = { children: React.ReactNode }

export default function InfoText({ children }: InfoTextProps) {
    return (
        <span className={style.info}>
            <InfoIcon />
            <span>{children}</span>
        </span>
    )
}
