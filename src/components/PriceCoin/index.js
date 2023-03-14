import { format, parseISO } from 'date-fns';
import React from 'react';
import style from './price-coin.module.css';
function getColorFromAdvice(advice) {
    switch (advice) {
        case 'Now':
            return style.now;
        case 'Best':
            return style.optimal;
        case 'Worst':
            return style.avoid;
        case 'Avoid':
            return style.avoid;
        default:
            return style.now;
    }
}
export default function PriceCoin(_a) {
    var price = _a.price, priceUnit = _a.priceUnit, advice = _a.advice, details = _a.details;
    return (React.createElement("div", { className: "".concat(style.wrapper, " ").concat(getColorFromAdvice(advice.type)) },
        React.createElement("div", { className: style.container },
            React.createElement("h3", { className: style.price },
                price.toString(),
                " ",
                priceUnit),
            React.createElement("p", { className: style.time },
                format(parseISO(advice.from), 'HH:mm'),
                " -",
                ' ',
                format(parseISO(advice.to), 'HH:mm')),
            React.createElement("p", { className: style.details }, details))));
}
