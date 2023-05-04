import React from 'react'

import style from './ListItem.module.css'
import EditIcon from './EditIcon'

type ListItemProps = {
    title: string
    value: string
    isEditable?: boolean
    onClick?: () => void
}

export default function ListItem({
    title,
    value,
    isEditable,
    onClick,
}: ListItemProps) {
    return (
        <div className={style.container} onClick={onClick}>
            <div className={style.list_item__header}>
                <p>{title}</p>
                <div className={style.icon}>{isEditable && <EditIcon />}</div>
            </div>
            <p>{value}</p>
        </div>
    )
}
