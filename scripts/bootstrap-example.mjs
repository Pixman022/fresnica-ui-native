import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const exampleRoot = path.join(root, 'example');
const projectDir = path.join(exampleRoot, 'FresnicaPreview');
const cacheDir = path.join(exampleRoot, '.cache');

function run(command, args, cwd) {
    const executable = process.platform === 'win32' && command === 'npm' ? 'npm.cmd' : command;
    const result = spawnSync(executable, args, {
        cwd,
        stdio: 'inherit',
        shell: false,
    });

    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

if (!fs.existsSync(projectDir)) {
    run(
        'npx',
        ['--yes', '@react-native-community/cli@20.2.0', 'init', 'FresnicaPreview', '--version', '0.87.0'],
        exampleRoot,
    );
}

fs.mkdirSync(cacheDir, { recursive: true });
for (const entry of fs.readdirSync(cacheDir)) {
    if (entry.endsWith('.tgz')) {
        fs.rmSync(path.join(cacheDir, entry));
    }
}

run('npm', ['pack', '--pack-destination', cacheDir], root);

const packageArchive = fs.readdirSync(cacheDir).find((entry) => entry.endsWith('.tgz'));
if (!packageArchive) {
    throw new Error('Unable to locate the packed @fresnica/ui-native archive.');
}

run('npm', ['install', '--save-exact', path.join(cacheDir, packageArchive)], projectDir);
fs.copyFileSync(path.join(exampleRoot, 'App.tsx'), path.join(projectDir, 'App.tsx'));

console.log('FresnicaPreview is ready at ' + projectDir);
