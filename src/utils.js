export function range(n) { return Array.apply(0, Array(n)); }
export function forRange(n, f) { return range(n).map((x, i) => f(i)); }

export function subscribeToFirebaseList(ref, callbacks) {
    ref.on("child_added", snapshot => callbacks.itemAdded(snapshot.val()));
    ref.on("value", snapshot => callbacks.itemsLoaded(snapshot.val()));
}
