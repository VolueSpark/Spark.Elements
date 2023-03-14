var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useMemo, useRef } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Text } from '@visx/text';
import { LegendItem, LegendLabel } from '@visx/legend';
import style from './price-graph.module.css';
import useSize from '@react-hook/size';
import { format, isWithinInterval, parseISO } from 'date-fns';
var verticalMargin = 60;
var horizontalMargin = 60;
var PADDING = 16;
export default function PriceGraph(_a) {
    var _b = _a.initialWidth, initialWidth = _b === void 0 ? 500 : _b, _c = _a.initialHeight, initialHeight = _c === void 0 ? 400 : _c, data = _a.data, advice = _a.advice, priceUnit = _a.priceUnit, energyUnit = _a.energyUnit, _d = _a.labels, labels = _d === void 0 ? true : _d, _e = _a.timeFormat, timeFormat = _e === void 0 ? 'HH' : _e, legend = _a.legend, _f = _a.legendGlyphSize, legendGlyphSize = _f === void 0 ? 12 : _f;
    var containerRef = useRef(null);
    var _g = useSize(containerRef, {
        initialWidth: initialWidth,
        initialHeight: initialHeight,
    }), width = _g[0], height = _g[1];
    var xMax = width - horizontalMargin;
    var yMax = height - verticalMargin - PADDING;
    var xScale = useMemo(function () {
        return scaleBand({
            range: [0, xMax],
            round: true,
            domain: data.map(function (x) { return x.time; }),
            paddingInner: 0.4,
        });
    }, [xMax, data]);
    var yScale = useMemo(function () {
        return scaleLinear({
            range: [yMax, 0],
            round: true,
            domain: [0, Math.max.apply(Math, data.map(function (x) { return x.price; })) + 0.5],
        });
    }, [yMax, data]);
    var formatDate = function (d) {
        return format(parseISO(d), (timeFormat === null || timeFormat === void 0 ? void 0 : timeFormat.length) ? timeFormat : 'HH');
    };
    var formatPrice = function (value) {
        return (value * 100).toString();
    };
    var adviceIntervals = useMemo(function () {
        return advice === null || advice === void 0 ? void 0 : advice.map(function (a) { return ({
            interval: {
                start: parseISO(a.from),
                end: parseISO(a.to),
            },
            cost: a.cost,
            adviceType: a.type,
        }); });
    }, [advice]);
    var adviceSet = useMemo(function () { return Array.from(new Set(advice.map(function (a) { return a.type; }))); }, [advice]);
    var priceData = useMemo(function () {
        return data.map(function (p) {
            var _a;
            return (__assign(__assign({}, p), { adviceType: (_a = adviceIntervals === null || adviceIntervals === void 0 ? void 0 : adviceIntervals.find(function (ai) {
                    return isWithinInterval(parseISO(p.time), ai.interval);
                })) === null || _a === void 0 ? void 0 : _a.adviceType }));
        });
    }, [data, advice]);
    return (React.createElement("div", { ref: containerRef, className: style.container },
        React.createElement("svg", { width: "100%", height: "100%" },
            React.createElement("rect", { opacity: 0 }),
            React.createElement(Group, { left: horizontalMargin, top: verticalMargin / 2 }, priceData.map(function (d, idx) {
                var _a;
                var barWidth = xScale.bandwidth();
                var barHeight = yMax - ((_a = yScale(d.price)) !== null && _a !== void 0 ? _a : 0);
                var barX = xScale(d.time);
                var barY = yMax - barHeight;
                return (React.createElement(Bar, { "data-testid": "spark-elements__chart-bar-".concat(idx), key: "bar-".concat(idx), rx: 4, x: barX, y: barY, width: barWidth, height: barHeight, className: getBarStyle(d.adviceType) }));
            })),
            React.createElement(Group, { left: horizontalMargin / 2 + PADDING, top: verticalMargin / 2 }, labels && (React.createElement(React.Fragment, null,
                React.createElement(AxisLeft, { hideAxisLine: true, hideTicks: true, scale: yScale, tickFormat: function (v) { return formatPrice(v.valueOf()); }, numTicks: 5, tickValues: yScale
                        .ticks()
                        .filter(function (_t, i) { return i > 0 && i % 2 === 0; }), axisClassName: style.axis__left, tickClassName: style.axis__text }),
                React.createElement(Text, { dy: -PADDING, dx: -PADDING, fontSize: 10, className: style.axis__text }, "".concat(priceUnit, "/").concat(energyUnit))))),
            React.createElement(Group, { left: horizontalMargin, top: yMax + verticalMargin / 2 + PADDING }, labels && (React.createElement(AxisBottom, { hideAxisLine: true, hideTicks: true, scale: xScale, tickFormat: formatDate, tickLabelProps: function () {
                    return {};
                }, tickTransform: 'translate(-9,8)', axisClassName: style.axis__bottom, tickClassName: style.axis__text })))),
        React.createElement("div", { style: {
                display: 'flex',
                flexDirection: 'row',
                // Align with graph
                marginLeft: horizontalMargin,
            } }, adviceSet.map(function (le, i) { return (React.createElement(LegendItem, { key: "legend-quantile-".concat(i), margin: "0 5px" },
            React.createElement("svg", { width: legendGlyphSize, height: legendGlyphSize, style: { margin: '2px 0' } },
                React.createElement("circle", { className: getBarStyle(le), r: legendGlyphSize / 2, cx: legendGlyphSize / 2, cy: legendGlyphSize / 2 })),
            React.createElement(LegendLabel, { align: "left", margin: "0 0 0 4px" }, legend ? legend[le] : le))); }))));
}
function getBarStyle(adviceType) {
    switch (adviceType) {
        case 'Now':
            return style.bar__now;
        case 'Best':
            return style.bar__optimal;
        case 'Avoid':
            return style.bar__avoid;
        case 'Worst':
            return style.bar__worst;
        default:
            return style.bar;
    }
}
