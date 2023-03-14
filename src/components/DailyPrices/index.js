import React, { useMemo } from 'react';
import { scaleTime, scaleLinear } from '@visx/scale';
import { add, endOfDay, getHours, parseISO, startOfDay } from 'date-fns';
import { Area } from '@visx/shape';
import { GridRows, GridColumns } from '@visx/grid';
import { curveMonotoneX } from '@visx/curve';
import { Group } from '@visx/group';
import { TooltipWithBounds } from '@visx/tooltip';
import { Threshold } from '@visx/threshold';
import { AxisBottom } from '@visx/axis';
import style from './daily-prices.module.css';
import { isWithinInterval } from 'date-fns/esm';
var getTime = function (d) { return parseISO(d.time); };
var getPrice = function (d) { return d.price; };
var margin = 20;
export default function DailyPrices(_a) {
    var data = _a.data, width = _a.width, height = _a.height, hideLabel = _a.hideLabel;
    var today = new Date();
    if (width < 10)
        return null;
    if (!validateData(data, today))
        return null;
    var xMax = width;
    var yMax = height - margin;
    var xScale = useMemo(function () {
        return scaleTime({
            range: [0, xMax],
            domain: [startOfDay(today), endOfDay(today)],
        });
    }, [xMax]);
    var yScale = useMemo(function () {
        return scaleLinear({
            range: [yMax, 0],
            // Adding 1 to the max value to stop the graph from being cut off at the top
            domain: [0, Math.max.apply(Math, data.map(getPrice)) + 1],
        });
    }, [yMax]);
    var toolTipData = useMemo(function () { return prepareTooltipData(data); }, [data]);
    return (React.createElement("div", null,
        React.createElement("svg", { width: width, height: height },
            React.createElement(Group, { width: xMax, height: yMax },
                React.createElement(GridRows, { scale: yScale, width: xMax, strokeDasharray: "1,3", stroke: '#000', strokeOpacity: 0, pointerEvents: "none" }),
                React.createElement(GridColumns, { scale: xScale, height: yMax, strokeDasharray: "1,3", stroke: '#000', strokeOpacity: 0.2, pointerEvents: "none", numTicks: 4, left: xMax / 4 / 2 }),
                React.createElement(Threshold, { id: "spark-elements-threshold", data: data, x: function (d) { var _a; return (_a = xScale(getTime(d))) !== null && _a !== void 0 ? _a : 0; }, y0: yMax, y1: function (d) { var _a; return (_a = yScale(getPrice(d))) !== null && _a !== void 0 ? _a : 0; }, clipAboveTo: 0, clipBelowTo: yMax, curve: curveMonotoneX, belowAreaProps: {
                        fill: '#D4E7E0',
                        fillOpacity: 1,
                    } }),
                React.createElement(Area, { data: data, x: function (d) { var _a; return (_a = xScale(getTime(d))) !== null && _a !== void 0 ? _a : 0; }, y: function (d) { var _a; return (_a = yScale(getPrice(d))) !== null && _a !== void 0 ? _a : 0; }, strokeWidth: 2, stroke: "#62A39E", curve: curveMonotoneX })),
            React.createElement(Group, { width: xMax, height: yMax }, toolTipData.map(function (entry, idx) { return (React.createElement("circle", { key: "spark-elements-graph-circle-".concat(idx), cx: xScale(getTime(entry.priceUsedToPosition)), cy: yScale(getPrice(entry.priceUsedToPosition)), r: 8, fill: "#62A39E", stroke: "#fff", strokeWidth: 2, pointerEvents: "none" })); })),
            !hideLabel && (React.createElement(React.Fragment, null,
                React.createElement(AxisBottom, { hideAxisLine: true, hideTicks: true, scale: xScale, tickFormat: function (d) { return xAxisFormat(d, 6); }, top: yMax, 
                    // width divided by number of intervals (4) divided by the intervals center (6 / 2)
                    left: xMax / 4 / (6 / 2), numTicks: 4, axisClassName: style.axis__bottom, tickClassName: style.axis__text, tickLabelProps: function () { return ({}); } })))),
        React.createElement("div", null, toolTipData.map(function (entry, idx) { return (React.createElement(TooltipWithBounds, { key: "spark-elements-graph-tooltip-".concat(idx), top: yScale(getPrice(entry.priceUsedToPosition)), offsetTop: -40, left: xScale(getTime(entry.priceUsedToPosition)), offsetLeft: -10, className: style.tooltip },
            React.createElement("div", { className: style.tooltip_container },
                React.createElement("div", null, "".concat(entry.averageOfInterval.toFixed(0), " \u00F8re")),
                React.createElement("span", { className: style.triangle })))); }))));
}
var prepareTooltipData = function (data) {
    var numberOfIntervals = 4;
    var intervalSize = 6;
    var tooltipData = [];
    // Push the average of each interval to tooltipData
    for (var i = 0; i < numberOfIntervals; i++) {
        var accumulatedCost = 0;
        for (var j = 0; j < intervalSize; j++) {
            accumulatedCost += data[i * intervalSize + j].price;
        }
        tooltipData.push({
            priceUsedToPosition: {
                time: data[i * intervalSize + intervalSize / 2].time,
                price: data[i * intervalSize + intervalSize / 2].price,
            },
            averageOfInterval: accumulatedCost / intervalSize,
        });
    }
    return tooltipData;
};
function xAxisFormat(date, intervalSize) {
    return "".concat(getHours(date), " - ").concat(getHours(add(date, { hours: intervalSize })));
}
function validateData(data, today) {
    if (data.length === 0) {
        console.error('DailyPrices component must have data.');
        return false;
    }
    else if (!data.every(function (entry) {
        return isWithinInterval(parseISO(entry.time), {
            start: startOfDay(today),
            end: endOfDay(today),
        });
    })) {
        console.error('DailyPrices component must have valid data. All entries must be within the current day');
        return false;
    }
    return true;
}
