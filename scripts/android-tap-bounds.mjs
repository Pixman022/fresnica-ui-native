export function parseTapPoint(node, label) {
    const bounds = node.match(/\bbounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
    if (!bounds) throw new Error(`Accessibility node has no bounds: ${label}`);
    const [, left, top, right, bottom] = bounds.map(Number);
    if (left >= right || top >= bottom) {
        throw new Error(`Accessibility node has empty or clipped bounds: ${label}`);
    }
    return { x: Math.round((left + right) / 2), y: Math.round((top + bottom) / 2) };
}
