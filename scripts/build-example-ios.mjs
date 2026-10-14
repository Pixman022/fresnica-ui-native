import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const projectDir = path.join(root, 'example', 'FresnicaPreview');
const iosDir = path.join(projectDir, 'ios');
const workspace = path.join(iosDir, 'FresnicaPreview.xcworkspace');

function run(command, args, cwd) {
    const result = spawnSync(command, args, {
        cwd,
        stdio: 'inherit',
        shell: false,
    });

    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

if (process.platform !== 'darwin') {
    throw new Error('The iOS preview build requires macOS.');
}

if (!fs.existsSync(projectDir)) {
    throw new Error('Preview host is missing. Run npm run example:bootstrap first.');
}

run('sw_vers', [], root);
run('xcodebuild', ['-version'], root);
run('xcodebuild', ['-showsdks'], root);
run('node', ['--version'], root);
run('ruby', ['--version'], root);
run('bundle', ['--version'], root);
run('bundle', ['install'], projectDir);
run(
    'bundle',
    [
        'exec',
        'ruby',
        '-e',
        "require './node_modules/react-native/scripts/react_native_pods'; puts \"React Native min iOS: #{min_ios_version_supported}\"",
    ],
    projectDir,
);
run('bundle', ['exec', 'pod', 'install'], iosDir);
run('bundle', ['exec', 'pod', '--version'], iosDir);

if (!fs.existsSync(workspace)) {
    throw new Error('Expected iOS workspace was not created by CocoaPods.');
}

run(
    'xcodebuild',
    [
        '-workspace',
        'FresnicaPreview.xcworkspace',
        '-scheme',
        'FresnicaPreview',
        '-configuration',
        'Debug',
        '-sdk',
        'iphonesimulator',
        '-destination',
        'generic/platform=iOS Simulator',
        'CODE_SIGNING_ALLOWED=NO',
        'build',
    ],
    iosDir,
);
