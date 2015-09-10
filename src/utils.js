export function trimString(s) {  // Strip whitespace
      return (s || '').replace(/^\s+|\s+$/g, '');
}
