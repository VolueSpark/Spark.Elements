import React from 'react'
import Icon from '../icon'
import style from './infoText.module.scss'

type InfoTextProps = { children: React.ReactNode }

export default function InfoText({ children }: InfoTextProps) {
    return (
        <span className={style.info}>
            <Icon iconName="info" width={16} height={16} />
            <span>{children}</span>
        </span>
    )
}
