export const chargingPlanTexts = {
    locale: {
        nb: 'nb-NO',
        en: 'en-US',
    },
    dropdown: {
        label: {
            nb: 'Vis beste ladetidspunkt for',
            en: 'Show optimal charging timeperiod',
        },
        options: {
            east: {
                nb: 'øst',
                en: 'east',
            },
            south: {
                nb: 'sør',
                en: 'south',
            },
            center: {
                nb: 'midt',
                en: 'center',
            },
            north: {
                nb: 'nord',
                en: 'north',
            },
            west: {
                nb: 'vest',
                en: 'west',
            },
        },
    },
    location: {
        useLocation: {
            nb: 'Bruk min lokasjon',
            en: 'Use my location',
        },
        error: {
            nb: 'Det skjedde en feil når vi prøvde å hente lokasjonen din! Kunne du valgt i nedtrekkslisten istedenfor?',
            en: 'An error occured while trying to get your location. Please select from the dropdown instead.',
        },
    },
    sections: {
        priceRegion: {
            nb: 'Mitt prisområde',
            en: 'My pricing region',
        },
        chargingWindow: {
            title: {
                nb: 'Ladevindu',
                en: 'Charging window',
            },
            to: {
                nb: 'til',
                en: 'to',
            },
        },
        estimatedCost: {
            nb: 'Estimert beløp',
            en: 'Estimated cost',
        },
    },
    prescriptions: {
        header: {
            nb: 'Det blir bedre!',
            en: 'It gets better!',
        },
        table: {
            time: {
                nb: 'Tidspunkt',
                en: 'Time',
            },
            cost: {
                nb: 'Estimert beløp',
                en: 'Estimated cost',
            },
            deviation: {
                nb: 'Beløpsavvik',
                en: 'Deviation',
            },
        },
    },
    info: {
        estimation: {
            nb: 'Beregning er basert på lading av en elbil med 64kWt batterikapasitet, en lader på 3.6kW, og lading fra 50-90% batterinivå, som gir et ladevindu på 9 timer. Ved å lage bruker og koble til bilen din kan vi bruke live data for mer nøyaktige estimater.',
            en: 'Calculation is based on an electriv vehicle with a battery capacity of 64kWh, a charger with an effect of 3.6kW, and charging from 50% to 90% battery level which gives a charging time of 9 hours. By signing up for an account and registering your own vehicle we can use live data to make better estimates.',
        },
        deviation: {
            nb: 'Prisanalysene oppdateres hver andre time. Potensielt beløpsavvik er gjeldende frem til spotprisen settes av Nord Pool.',
            en: 'Prices update every other hour. There may be deviations up until the price is set by Nord Pool.',
        },
    },
    priceInfoSelector: {
        my_area: {
            nb: 'Mitt prisområde',
            en: 'My price region',
        },
        window: {
            nb: 'Ladevindu',
            en: 'Charging window',
        },
        cost: {
            nb: 'Estimert beløp',
            en: 'Estimated cost',
        },
        to: {
            nb: 'til',
            en: 'to',
        },
    },
}
