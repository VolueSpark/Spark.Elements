import React from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useMemo, useRef } from 'react'

type AnimatedNumberProps = {
    value: number
    currency: boolean
    testId?: string
}

export default function AnimatedNumber({
    value,
    currency,
    testId,
}: AnimatedNumberProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const motionValue = useMotionValue(0)
    const springValue = useSpring(motionValue)

    const formatter = useMemo(() => {
        if (currency) {
            return new Intl.NumberFormat('nb-NO', {
                style: 'currency',
                currency: 'NOK',
            })
        }
        return new Intl.NumberFormat('nb-NO')
    }, [currency])

    useEffect(() => {
        motionValue.set(value)
    }, [motionValue, value])

    useEffect(
        () =>
            springValue.onChange((latest) => {
                if (ref.current) {
                    ref.current.textContent = formatter.format(latest)
                }
            }),
        [springValue, formatter]
    )

    return <span ref={ref} data-testid={testId} />
}
