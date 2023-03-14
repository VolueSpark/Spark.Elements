import React from 'react';
import Moon from './Moon';
import Sunrise from './Sunrise';
import Sun from './Sun';
import Sunset from './Sunset';
function iconProvider(name) {
    switch (name) {
        case 'moon':
            return React.createElement(Moon, null);
        case 'sunrise':
            return React.createElement(Sunrise, null);
        case 'sun':
            return React.createElement(Sun, null);
        case 'sunset':
            return React.createElement(Sunset, null);
        default:
            return React.createElement(React.Fragment, null);
    }
}
export default function Icon(_a) {
    var name = _a.name, _b = _a.width, width = _b === void 0 ? 24 : _b, _c = _a.height, height = _c === void 0 ? 24 : _c;
    return (React.createElement("svg", { width: width, height: height, viewBox: "0 0 ".concat(width, " ").concat(height), fill: "none", xmlns: "http://www.w3.org/2000/svg" }, iconProvider(name)));
}
