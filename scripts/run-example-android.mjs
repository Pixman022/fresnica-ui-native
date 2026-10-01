import { spawnSync } from 'node:child_process';
import path from 'node:path';

const projectDir = path.resolve(import.meta.dirname, '..', 'example', 'FresnicaPreview');
const executable = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const result = spawnSync(executable, ['run', 'android'], {
    cwd: projectDir,
    stdio: 'inherit',
    shell: false,
});

process.exit(result.status ?? 1);
