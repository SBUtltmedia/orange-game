export function range(n) { return Array.apply(0, Array(n)); }
export function forRange(n, f) { return range(n).map((x, i) => f(i)); }

export function subscribeToFirebaseList(ref, callbacks) {
    const itemsLoaded = callbacks.itemsLoaded || function() {};
    const itemAdded = callbacks.itemAdded || function() {};
    const itemChanged = callbacks.itemChanged || function() {};
    const itemRemoved = callbacks.itemRemoved || function() {};
    ref.on("value", snapshot => itemsLoaded(snapshot.val()));
    ref.on("child_added", snapshot => itemAdded(snapshot.val()));
    ref.on("child_changed", snapshot => itemChanged(snapshot.val()));
    ref.on("child_removed", snapshot => itemRemoved(snapshot.val()));
}
