import React, { useCallback, useEffect, useRef } from 'react'

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
    const startRef = useRef<HTMLInputElement>(null)
    const endRef = useRef<HTMLInputElement>(null)

    // Need this to get a number between 0 and 100 to represent the interval
    // that needs a different color.
    const getRange = useCallback(
        (value: number) =>
            Math.round(((value - minValue) / (maxValue - minValue)) * 100),
        [minValue, maxValue]
    )

    const onStartChange = (event: React.FormEvent<HTMLInputElement>) => {
        let validatedValue = value[0]
        if (event.currentTarget.value !== '') {
            validatedValue = parseInt(event.currentTarget.value)
        }
        if (validatedValue < 0) {
            validatedValue = 0
        }
        if (startRef && startRef.current)
            startRef.current.value = Math.min(
                validatedValue,
                value[1] - 1
            ).toString()

        onChange([Math.min(validatedValue, value[1] - 1), value[1]])
    }

    const onEndChange = (event: React.FormEvent<HTMLInputElement>) => {
        let validatedValue = value[1]
        if (event.currentTarget.value !== '') {
            validatedValue = parseInt(event.currentTarget.value)
        }
        if (validatedValue > 100) {
            validatedValue = 100
        }
        onChange([value[0], Math.max(validatedValue, value[0] + 1)])

        if (endRef && endRef.current)
            endRef.current.value = Math.max(
                validatedValue,
                value[0] + 1
            ).toString()
    }

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
            <div className={style.input__container}>
                <div className={style.input__number__container}>
                    <label htmlFor="start">Start</label>
                    <div className={style.input__number__wrapper}>
                        <input
                            name="start"
                            type="number"
                            defaultValue={value[0]}
                            min={minValue}
                            max={value[1]}
                            onBlur={onStartChange}
                            className={style.input__number}
                            ref={startRef}
                        />
                        %
                    </div>
                </div>
                <div className={style.input__number__container}>
                    <label htmlFor="end">End</label>
                    <div className={style.input__number__wrapper}>
                        <input
                            name="end"
                            type="number"
                            defaultValue={value[1]}
                            min={value[0]}
                            max={maxValue}
                            onBlur={onEndChange}
                            className={style.input__number}
                            ref={endRef}
                        />
                        %
                    </div>
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
                        <p className={`${style.label}`}>{labels.left}</p>
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
