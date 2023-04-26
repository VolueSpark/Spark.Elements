import React from 'react'

import style from './Radio.module.css'

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    checked?: boolean
}

export default function Radio({
    name,
    label,
    checked,
    onClick,
    onChange,
}: RadioProps) {
    return (
        <div
            className={`${style.container} ${
                checked ? style.checked : style.default
            }`}
            onClick={onClick}
            onChange={onChange}
        >
            <div className={style.radio_label}>
                <input
                    className={style.radio_input}
                    type="radio"
                    name={name ?? label}
                    checked={checked}
                    onChange={() => null}
                />
                <span className={style.radio_checkmark_bounding}></span>
                <span className={style.radio_checkmark_border}></span>
                <span className={style.radio_checkmark}></span>
            </div>
            <label htmlFor={name ?? label}>{label} </label>
        </div>
    )
}
