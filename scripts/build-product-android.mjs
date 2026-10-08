import { spawnSync } from 'node:child_process';
import path from 'node:path';

const androidDir = path.resolve(import.meta.dirname, '..', 'product', 'FresnicaWallet', 'android');
const executable = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
const result = spawnSync(executable, ['assembleDebug', '--no-daemon'], {
    cwd: androidDir,
    stdio: 'inherit',
    shell: false,
});

process.exit(result.status ?? 1);
