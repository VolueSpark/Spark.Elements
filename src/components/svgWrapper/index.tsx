import React from 'react'

type SVGWrapperProps = {
    children: React.ReactNode
    width?: number
    height?: number
    flip?: boolean
    className?: string
}

export default function SVGWrapper({
    children,
    width = 24,
    height = 24,
    flip = false,
    className,
}: SVGWrapperProps) {
    return (
        <svg
            width={width}
            height={height}
            style={flip ? { transform: 'rotate(180deg)' } : undefined}
            className={className}
        >
            {children}
        </svg>
    )
}
