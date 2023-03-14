import React, { useMemo, useRef } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleBand, scaleLinear } from '@visx/scale';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Text } from '@visx/text';
import { localPoint } from '@visx/event';
import { Line } from '@visx/shape';
import style from './price-graph.module.css';
import useSize from '@react-hook/size';
var verticalMargin = 60;
var horizontalMargin = 60;
var PADDING = 16;
export default function InteractPriceGraph(_a) {
    var _b = _a.initialWidth, initialWidth = _b === void 0 ? 500 : _b, _c = _a.initialHeight, initialHeight = _c === void 0 ? 400 : _c, data = _a.data, priceUnit = _a.priceUnit, energyUnit = _a.energyUnit, setChargeWindowStartIndex = _a.setChargeWindowStartIndex, isInChargeWindow = _a.isInChargeWindow, isInDataRange = _a.isInDataRange, windowSize = _a.windowSize, _d = _a.seperators, seperators = _d === void 0 ? true : _d, _e = _a.labels, labels = _e === void 0 ? true : _e;
    var containerRef = useRef(null);
    var _f = useSize(containerRef, {
        initialWidth: initialWidth,
        initialHeight: initialHeight,
    }), width = _f[0], height = _f[1];
    var xMax = width - horizontalMargin;
    var yMax = height - verticalMargin - PADDING;
    // Rougly the area given to each bar in the graph (including padding)
    var barWidth = xMax / data.length;
    var xScale = useMemo(function () {
        return scaleBand({
            range: [0, xMax],
            round: true,
            domain: data.map(function (x) { return x.time; }),
            paddingInner: 0.4,
        });
    }, [xMax]);
    var yScale = useMemo(function () {
        return scaleLinear({
            range: [yMax, 0],
            round: true,
            domain: [0, Math.max.apply(Math, data.map(function (x) { return x.price; })) + 0.5],
        });
    }, [yMax]);
    var formatDate = function (d) {
        return new Date(d).getHours().toString().padStart(2, '0');
    };
    var formatPrice = function (value) {
        return (value * 100).toString();
    };
    var onClick = function (event) {
        var point = localPoint(event);
        if (point) {
            var index = Math.floor(((point === null || point === void 0 ? void 0 : point.x) - horizontalMargin) / barWidth);
            if (index < 0 || index > data.length - 1) {
                setChargeWindowStartIndex(0);
                return;
            }
            if (isInDataRange(index)) {
                setChargeWindowStartIndex(index);
            }
            else {
                setChargeWindowStartIndex(data.length - windowSize);
            }
        }
    };
    return (React.createElement("div", { ref: containerRef, className: style.container },
        React.createElement("svg", { width: "100%", height: "100%", onMouseDown: function (event) { return onClick(event); } },
            React.createElement("rect", { opacity: 0 }),
            React.createElement(Group, { left: horizontalMargin, top: verticalMargin / 2 }, data.map(function (d, idx) {
                var _a;
                var barWidth = xScale.bandwidth();
                var barHeight = yMax - ((_a = yScale(d.price)) !== null && _a !== void 0 ? _a : 0);
                var barX = xScale(d.time);
                var barY = yMax - barHeight;
                return (React.createElement(Bar, { "data-testid": "spark-elements__chart-bar-".concat(idx), key: "bar-".concat(idx), rx: 4, x: barX, y: barY, width: barWidth, height: barHeight, className: "".concat(style.bar, " ").concat(isInChargeWindow(idx) && style.bar__active), 
                    // TODO: temp disable onclick if outside of data range
                    onClick: function () {
                        if (isInDataRange(idx))
                            setChargeWindowStartIndex(idx);
                        else
                            setChargeWindowStartIndex(data.length - windowSize);
                    } }));
            })),
            React.createElement(Group, { left: horizontalMargin / 2 + PADDING, top: verticalMargin / 2 },
                labels && (React.createElement(React.Fragment, null,
                    React.createElement(AxisLeft, { hideAxisLine: true, hideTicks: true, scale: yScale, tickFormat: function (v) { return formatPrice(v.valueOf()); }, numTicks: 5, tickValues: yScale
                            .ticks()
                            .filter(function (_t, i) { return i > 0 && i % 2 === 0; }) }),
                    React.createElement(Text, { dy: -PADDING, dx: -PADDING, fontSize: 10, className: style.axis__text }, "".concat(priceUnit, "/").concat(energyUnit)))),
                seperators && (React.createElement(Line, { from: { x: 0, y: PADDING }, to: { x: 0, y: yMax }, className: style.axis__line }))),
            React.createElement(Group, { left: horizontalMargin, top: yMax + verticalMargin / 2 + PADDING },
                labels && (React.createElement(AxisBottom, { hideAxisLine: true, hideTicks: true, scale: xScale, tickFormat: formatDate, tickLabelProps: function () {
                        return {};
                    }, tickTransform: 'translate(-9,8)', axisClassName: style.axis__bottom, tickClassName: style.axis__text })),
                seperators && (React.createElement(Line, { from: { x: 0, y: 0 }, to: { x: width, y: 0 }, className: style.axis__line }))))));
}
