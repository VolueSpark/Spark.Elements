import { add, getDay, parseISO, startOfDay } from 'date-fns';
export function prepareDataForTable(data) {
    var result = [];
    var compareDate = null;
    data.forEach(function (entry) {
        var from = startOfDay(parseISO(entry.from));
        if (result.length === 0) {
            compareDate = from;
            result.push([entry]);
        }
        else {
            if (from.toISOString() === (compareDate === null || compareDate === void 0 ? void 0 : compareDate.toISOString())) {
                result[result.length - 1].push(entry);
            }
            else {
                compareDate = from;
                result.push([entry]);
            }
        }
    });
    return result;
}
export function prepareLabels(now, days) {
    if (days === void 0) { days = [
        'Søndag',
        'Mandag',
        'Tirsdag',
        'Onsdag',
        'Torsdag',
        'Fredag',
        'Lørdag',
    ]; }
    var result = [];
    for (var i = 0; i < days.length; i++) {
        var day = getDay(add(now, { days: i }));
        result.push(days[day]);
    }
    return result;
}
