import React from 'react'

import style from './button.module.css'

type ButtonVariant = 'default' | 'warning' | 'outlined'

type ButtonProps = {
    children: React.ReactNode
    onClick: () => void
    variant: ButtonVariant
}

export default function Button({ children, onClick, variant }: ButtonProps) {
    return (
        <button
            className={`${style.button} ${style[variant]}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
