import _ from 'lodash';

export function trimString(s) {  // Strip whitespace
      return (s || '').replace(/^\s+|\s+$/g, '');
}

export function deepDifference(set1, set2) {
    return _.filter(set1, i1 => !_.some(set2, i2 => _.isEqual(i1, i2)));
}

export function deepIndexOf(array, item) {
    var index = -1;
    _.each(array, function(data, idx) {
       if (_.isEqual(data, item)) {
          index = idx;
       }
   });
   if (index > -1) {
       return index;
   }
}
