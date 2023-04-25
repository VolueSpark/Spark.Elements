import React, { SyntheticEvent, useCallback, useEffect, useRef } from 'react'

import style from './Range.module.css'

interface RangeProps {
    id: string
    minValue: number
    maxValue: number
    value: Array<number>
    onChange: (value: Array<number>) => void
    hideDividers?: boolean
    labels?: {
        left?: string
        center?: string
        right?: string
    }
}

export default function Range({
    id,
    minValue,
    maxValue,
    value,
    onChange,
    hideDividers,
    labels,
}: RangeProps) {
    const rangeRef = useRef<HTMLDivElement>(null)

    // Need this to get a number between 0 and 100 to represent the interval
    // that needs a different color.
    const getRange = useCallback(
        (value: number) =>
            Math.round(((value - minValue) / (maxValue - minValue)) * 100),
        [minValue, maxValue]
    )

    const onStartChange = (event: React.FormEvent<HTMLInputElement>) =>
        onChange([
            Math.min(parseInt(event.currentTarget.value), value[1] - 1),
            value[1],
        ])

    const onEndChange = (event: React.FormEvent<HTMLInputElement>) =>
        onChange([
            value[0],
            Math.max(parseInt(event.currentTarget.value), value[0] + 1),
        ])

    const getDividers = useCallback(
        (value: Array<number>) => {
            const dividers = createDividers(value)

            return (
                <div className={style.divider__container}>
                    {dividers.map((divider) => divider)}
                </div>
            )
        },
        [minValue, maxValue]
    )

    useEffect(() => {
        const minRange = getRange(value[0])
        const maxRange = getRange(value[1])

        if (rangeRef.current) {
            rangeRef.current.style.left = `${minRange}%`
            // +1 for ensuring color is shown properly underneath right slider
            rangeRef.current.style.width = `${maxRange - minRange + 1}%`
        }
    }, [value, getRange])

    return (
        <div>
            <div className={style.input__number__container}>
                <label htmlFor="start">Start</label>
                <div>
                    {/* TODO: create proper validation on these two, maybe drop using input type number
                    and use a library for validating the input */}
                    <input
                        name="start"
                        type="number"
                        value={value[0]}
                        min={minValue}
                        max={value[1]}
                        onChange={onStartChange}
                    />
                </div>
                <label htmlFor="end">End</label>
                <div>
                    <input
                        name="end"
                        type="number"
                        value={value[1]}
                        min={value[0]}
                        max={maxValue}
                        onChange={onEndChange}
                    />
                </div>
            </div>
            <div className={style.container}>
                <input
                    type="range"
                    min={minValue}
                    max={maxValue}
                    value={value[0]}
                    onChange={onStartChange}
                    className={`${style.slider} ${style.slider_left}`}
                    id={`${id}-min`}
                />
                <input
                    type="range"
                    min={minValue}
                    max={maxValue}
                    value={value[1]}
                    onChange={onEndChange}
                    className={`${style.slider} ${style.slider_right}`}
                    id={`${id}-max`}
                />

                <div className={style.custom_slider}>
                    <span className={style.custom_slider__bar}></span>
                    <span
                        ref={rangeRef}
                        className={style.custom_slider__range}
                    ></span>
                </div>
            </div>
            {!hideDividers && getDividers(value)}
            {labels && (
                <div className={style.label_container}>
                    {labels.left && (
                        <p className={`${style.label} ${style.labelLeft}`}>
                            {labels.left}
                        </p>
                    )}
                    {labels.center && (
                        <p className={`${style.label} ${style.labelCenter}`}>
                            {labels.center}
                        </p>
                    )}
                    {labels.right && (
                        <p className={`${style.label} ${style.labelRight}`}>
                            {labels.right}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

// Helper functions
function isInInterval(value: number, min: number, max: number) {
    return value >= min && value <= max
}

function createDividers(value: Array<number>) {
    const dividers = []
    const numberOfDividers = 10
    const adjustedLower = Math.ceil(value[0] / numberOfDividers)
    const adjusterHigher = Math.floor(value[1] / numberOfDividers)
    for (let i = 0; i < numberOfDividers; i++) {
        // TODO: find cleaner way
        dividers.push(
            <Divider
                active={isInInterval(i, adjustedLower, adjusterHigher)}
                max={
                    i === numberOfDividers - 1 &&
                    adjusterHigher === numberOfDividers
                }
            />
        )
    }
    return dividers
}

function Divider({ active, max }: { active: boolean; max: boolean }) {
    // TODO: would like to drop divider_active_last class
    return (
        <span
            className={`${style.divider} ${
                active ? style.divider_active : style.divider_default
            } ${max ? style.divider_active_last : ''}`}
        />
    )
}
