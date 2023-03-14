import React from 'react';
export default function Moon() {
    return (React.createElement(React.Fragment, null,
        React.createElement("circle", { opacity: "0.7", cx: "7", cy: "16", r: "4", fill: "#D3FFFF" }),
        React.createElement("circle", { opacity: "0.7", cx: "11", cy: "11", r: "4", fill: "#AEFFEC" }),
        React.createElement("circle", { opacity: "0.7", cx: "13", cy: "16", r: "4", fill: "#BCDFFF" }),
        React.createElement("path", { d: "M5 12C5 16.4183 8.36163 20 12.5084 20C13.3758 20 14.2088 19.8433 14.9838 19.555C12.0533 18.4651 9.95086 15.4941 9.95086 12C9.95086 8.50586 12.0533 5.53492 14.9838 4.44497C14.2088 4.1567 13.3758 4 12.5084 4C8.36163 4 5 7.58172 5 12Z", stroke: "black", strokeWidth: "0.5", strokeLinejoin: "round" }),
        React.createElement("path", { d: "M16.5065 12.2238L17.0951 14.1541H19L17.4589 15.347L18.0476 17.2772L16.5065 16.0843L14.9655 17.2772L15.5541 15.347L14.013 14.1541H15.9179L16.5065 12.2238Z", stroke: "black", strokeWidth: "0.5", strokeLinejoin: "round" }),
        React.createElement("path", { d: "M15.5474 6.98789L15.8838 8.0911H16.9725L16.0917 8.77292L16.4282 9.87614L15.5474 9.19431L14.6666 9.87614L15.003 8.77292L14.1223 8.0911H15.211L15.5474 6.98789Z", stroke: "black", strokeWidth: "0.5", strokeLinejoin: "round" })));
}
