import { spawnSync } from 'node:child_process';

const adb = process.platform === 'win32' ? 'adb.exe' : 'adb';
const remoteHierarchyPath = '/sdcard/fresnica-tap-window.xml';

function run(args, optional = false) {
    const result = spawnSync(adb, args, {
        encoding: 'utf8',
        shell: false,
    });

    if (result.error || result.status !== 0) {
        if (optional) {
            return null;
        }
        throw new Error(result.error?.message || result.stderr.trim() || `adb ${args.join(' ')} failed`);
    }

    return result.stdout.trim();
}

function usage() {
    console.log('Usage: node scripts/android-tap-accessibility-label.mjs <accessibility label>');
}

function decodeXml(value) {
    return value
        .replaceAll('&quot;', '"')
        .replaceAll('&apos;', "'")
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&amp;', '&');
}

const args = process.argv.slice(2);
if (args.length === 1 && args[0] === '--help') {
    usage();
    process.exit(0);
}

const label = args.join(' ').trim();
if (!label) {
    usage();
    process.exit(1);
}

const state = run(['get-state']);
if (state !== 'device') {
    throw new Error(`Expected one ready Android device, received adb state: ${state}`);
}

try {
    run(['shell', 'uiautomator', 'dump', remoteHierarchyPath]);
    const xml = run(['exec-out', 'cat', remoteHierarchyPath]);
    const nodes = xml.match(/<node\b[^>]*>/g) ?? [];

    for (const node of nodes) {
        const description = node.match(/\bcontent-desc="([^"]*)"/)?.[1];
        if (description === undefined || decodeXml(description) !== label) {
            continue;
        }

        const bounds = node.match(/\bbounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
        if (!bounds) {
            throw new Error(`Accessibility node has no bounds: ${label}`);
        }

        const [, left, top, right, bottom] = bounds.map(Number);
        const x = Math.round((left + right) / 2);
        const y = Math.round((top + bottom) / 2);
        run(['shell', 'input', 'tap', String(x), String(y)]);
        console.log(`Tapped "${label}" at ${x},${y}`);
        process.exit(0);
    }

    throw new Error(`Accessibility label not found: ${label}`);
} finally {
    run(['shell', 'rm', '-f', remoteHierarchyPath], true);
}
