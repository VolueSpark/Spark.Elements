import React from 'react';
import { parseISO } from 'date-fns';
import { Label, Row, RowHeader, Seperator } from './components';
import style from './long-term-forecast.module.css';
import { prepareDataForTable, prepareLabels } from './util';
/**
 * @param  days list of days to include in each row, sunday to saturday, fallback is norwegian language
 * @param hideLabel optional parameter to hide the label rendered above the table
 * @param hideDays optional parameter to hide the days in the row header
 * @returns
 */
export default function LongTermForecast(_a) {
    var data = _a.data, days = _a.days, hideLabel = _a.hideLabel, hideDays = _a.hideDays;
    var preparedData = prepareDataForTable(data);
    var rowHeaders = hideDays
        ? []
        : prepareLabels(parseISO(data[0].from), days);
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: style.container },
            !hideLabel && React.createElement(Label, null),
            React.createElement("div", { className: style.table }, data && preparedData ? (React.createElement(React.Fragment, null, preparedData.map(function (row, index) {
                var _a;
                return (React.createElement("div", { key: "spark-elements-table-row-".concat(index), className: style.row_container },
                    !hideDays && (React.createElement(RowHeader, { day: (_a = rowHeaders.at(index)) !== null && _a !== void 0 ? _a : '', date: parseISO(row[0].from) })),
                    React.createElement(Row, { data: row }),
                    React.createElement(Seperator, null)));
            }))) : (React.createElement("div", { className: style.row },
                React.createElement("p", { className: style.cell }, "No valid data"),
                React.createElement("p", { className: style.cell }),
                React.createElement("p", { className: style.cell }),
                React.createElement("p", { className: style.cell })))))));
}
