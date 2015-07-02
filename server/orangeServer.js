var orangeArray = [];
var currentDay = 0;

export function returnOranges(day) {
    if (!orangeArray[day]) {
        orangeArray[day] = Math.floor(Math.random() * 11);
    }
    return orangeArray[day];
}
