import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const productRoot = path.join(root, 'product');
const projectDir = path.join(productRoot, 'FresnicaWallet');
const cacheDir = path.join(productRoot, '.cache');

const hostDependencies = [
    '@react-native-async-storage/async-storage@2.2.0',
    '@react-native-community/netinfo@11.4.1',
    '@react-navigation/bottom-tabs@7.4.7',
    '@react-navigation/native@7.1.17',
    '@react-navigation/native-stack@7.3.26',
    'react-native-safe-area-context@5.8.1',
    'react-native-screens@4.27.0',
];

function run(command, args, cwd) {
    const executable =
        process.platform === 'win32' && (command === 'npm' || command === 'npx') ? `${command}.cmd` : command;
    const result = spawnSync(executable, args, {
        cwd,
        stdio: 'inherit',
        shell: false,
    });

    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

function applyAndroidBaseline() {
    const buildGradlePath = path.join(projectDir, 'android', 'build.gradle');
    const buildGradle = fs.readFileSync(buildGradlePath, 'utf8');

    if (!buildGradle.includes('minSdkVersion = 26')) {
        if (!buildGradle.includes('minSdkVersion = 24')) {
            throw new Error('Unexpected React Native Android minSdk baseline.');
        }
        fs.writeFileSync(buildGradlePath, buildGradle.replace('minSdkVersion = 24', 'minSdkVersion = 26'));
    }

    const manifestPath = path.join(projectDir, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
    const manifest = fs.readFileSync(manifestPath, 'utf8');
    const permission = '<uses-permission android:name="android.permission.CAMERA" />';

    if (!manifest.includes(permission)) {
        fs.writeFileSync(manifestPath, manifest.replace('<application', `${permission}\n    <application`));
    }
}

if (!fs.existsSync(projectDir)) {
    run(
        'npx',
        ['--yes', '@react-native-community/cli@20.2.0', 'init', 'FresnicaWallet', '--version', '0.87.0'],
        productRoot,
    );
}

applyAndroidBaseline();

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

run('npm', ['install', '--save-exact', path.join(cacheDir, packageArchive), ...hostDependencies], projectDir);
fs.copyFileSync(path.join(productRoot, 'App.tsx'), path.join(projectDir, 'App.tsx'));
fs.copyFileSync(path.join(productRoot, 'copy.ts'), path.join(projectDir, 'copy.ts'));

console.log('FresnicaWallet is ready at ' + projectDir);
