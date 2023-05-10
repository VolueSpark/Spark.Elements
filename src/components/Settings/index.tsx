import React from 'react'

import style from './settings.module.css'
import InfoText from '../InfoText'
import Button from '../UI/Button'
import ListItem from './listItem'
import DeleteIcon from './DeleteIcon'

type CarInfo = {
    brand: string
    model: string
    batteryCapacity: number
    // TODO: This could be a path to an image with alt text based on car brand and model
    img: React.ReactNode
}

type ChargingParameters = {
    chargingInterval?: Array<number>
    chargerCapacity?: number
}

export type SettingsProps = {
    title?: string
    car: CarInfo
    parameters?: ChargingParameters
    info?: string
    onItemClick?: (key: Array<keyof CarInfo | keyof ChargingParameters>) => void
    buttonValue: string | React.ReactNode
    onButtonClick: () => void
}

export default function Settings({
    title,
    car,
    parameters,
    info,
    onItemClick,
    buttonValue,
    onButtonClick,
}: SettingsProps) {
    return (
        <div className={style.container}>
            <div className={style.header}>
                {title && <h4 className={style.title}>{title}</h4>}
                <p className={style.brand}>{car.brand}</p>
                <div>{car.img}</div>
            </div>
            <div className={style.list}>
                <ListItem
                    title="Brand and model"
                    value={`${car.brand} - ${car.model}`}
                    isEditable={true}
                    onClick={() =>
                        typeof onItemClick === 'function' &&
                        onItemClick(['brand', 'model'])
                    }
                />
                <ListItem
                    title="Battery size"
                    value={`${car.batteryCapacity.toString()} kWh`}
                />
                {/* TODO: clean up in these, values should not passed in such a way */}
                {parameters && (
                    <>
                        <ListItem
                            title="Charging percentage"
                            value={
                                parameters.chargingInterval
                                    ? `${parameters.chargingInterval[0]} - ${parameters.chargingInterval[1]}%`
                                    : 'Undefined'
                            }
                            isEditable={true}
                            onClick={() =>
                                typeof onItemClick === 'function' &&
                                onItemClick(['chargingInterval'])
                            }
                        />
                        <ListItem
                            title="Charger capacity"
                            value={
                                parameters.chargerCapacity
                                    ? `${parameters.chargerCapacity.toString()} kW`
                                    : 'Undefined'
                            }
                            isEditable={true}
                            onClick={() =>
                                typeof onItemClick === 'function' &&
                                onItemClick(['chargerCapacity'])
                            }
                        />
                    </>
                )}
                {/* END */}
            </div>
            {info && <InfoText>{info}</InfoText>}
            <Button onClick={onButtonClick} variant="outlined">
                <DeleteIcon />
                {buttonValue}
            </Button>
        </div>
    )
}
