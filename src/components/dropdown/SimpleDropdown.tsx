import React from 'react'
import { useTranslation } from '../../i18n'
import style from './simpleDropdown.module.css'
import SVGWrapper from '../svgWrapper'

const texts = {
    select: {
        nb: 'Velg',
        en: 'Select',
    },
}

type SimpleDropdownProps = {
    id: string
    name?: string
    value: string
    onChange: (value: string) => void
    label?: string
    icon?: React.ReactNode
    options: {
        value: string
        label: string
    }[]
    disabled?: boolean
}

export default function SimpleDropdown({
    id,
    name,
    value,
    onChange,
    label,
    icon,
    options,
    disabled,
}: SimpleDropdownProps) {
    const { t } = useTranslation()

    return (
        <div>
            <div className={style.container}>
                {icon && icon}
                {label && <label>{label}</label>}
                <select
                    aria-label={id}
                    name={name ?? id}
                    id={id}
                    className={style.select}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    disabled={disabled}
                >
                    <option disabled value="">
                        {t(texts.select)}
                    </option>
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
                <SVGWrapper width={12} height={8}>
                    <path
                        d="M5.99297 7.00168C5.86122 7.00168 5.72948 6.97821 5.59773 6.93129C5.46599 6.88437 5.34417 6.79503 5.23227 6.66329L0.240401 1.70119C0.0707562 1.5126 -0.00910299 1.29152 0.000823009 1.03796C0.00984664 0.784393 0.0991805 0.572789 0.268825 0.403144C0.475466 0.215453 0.691582 0.126119 0.917173 0.135142C1.14276 0.145068 1.34941 0.234402 1.5371 0.403144L5.99297 4.88744L10.4759 0.431569C10.6456 0.243877 10.8432 0.150031 11.0688 0.150031C11.2944 0.150031 11.5105 0.243877 11.7171 0.431569C11.9057 0.61926 12 0.835376 12 1.07992C12 1.32446 11.9057 1.53155 11.7171 1.70119L6.75366 6.66329C6.64177 6.79503 6.51995 6.88437 6.3882 6.93129C6.25646 6.97821 6.12471 7.00168 5.99297 7.00168Z"
                        fill="black"
                    />
                </SVGWrapper>
            </div>
        </div>
    )
}
