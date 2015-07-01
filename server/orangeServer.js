var exports = module.exports = {}

var orangeArray = [];
var currentDay = 0;

exports.returnOranges = function(day){
    if (!orangeArray[day]) {
        orangeArray[day] = Math.floor(Math.random() * 11);
    }
    return orangeArray[day];
}
