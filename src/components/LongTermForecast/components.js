import { format } from 'date-fns';
import React from 'react';
import Icon from '../../icons';
import style from './long-term-forecast.module.css';
export function Label() {
    return (React.createElement("div", { className: style.label },
        React.createElement("div", null,
            React.createElement(Icon, { name: "moon" }),
            React.createElement("p", null, "00 - 06")),
        React.createElement("div", null,
            React.createElement(Icon, { name: "sunset" }),
            React.createElement("p", null, "06 - 12")),
        React.createElement("div", null,
            React.createElement(Icon, { name: "sun" }),
            React.createElement("p", null, "12 - 18")),
        React.createElement("div", null,
            React.createElement(Icon, { name: "sunset" }),
            React.createElement("p", null, "18 - 00"))));
}
export function RowHeader(_a) {
    var day = _a.day, date = _a.date;
    return (React.createElement("p", { className: style.row_header }, day && "".concat(day, " ").concat(format(date, 'dd.MM'))));
}
export function Row(_a) {
    var data = _a.data;
    return (React.createElement("div", { className: style.row }, data.map(function (entry) { return (React.createElement("p", { key: entry.from, className: style.cell }, entry.averagePrice.toFixed(0).toString())); })));
}
export function Seperator() {
    return React.createElement("div", { className: style.seperator });
}
