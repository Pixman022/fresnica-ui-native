import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const outputDir = path.join(root, 'artifacts', 'delivery');
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const pack = spawnSync(npm, ['pack', '--json', '--pack-destination', outputDir], {
    cwd: root,
    encoding: 'utf8',
    shell: false,
});
if (pack.status !== 0) {
    process.stderr.write(pack.stderr || pack.stdout);
    process.exit(pack.status ?? 1);
}

const metadata = JSON.parse(pack.stdout);
if (metadata.length !== 1) {
    throw new Error('Expected exactly one packed delivery artifact.');
}

const filename = metadata[0].filename;
const archivePath = path.join(outputDir, filename);
const sha256 = crypto.createHash('sha256').update(fs.readFileSync(archivePath)).digest('hex');
const sourceSha =
    process.env.DELIVERY_SOURCE_SHA ?? execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const tokenLock = JSON.parse(fs.readFileSync(path.join(root, 'token-source.lock.json'), 'utf8'));

const record = {
    package: packageJson.name,
    version: packageJson.version,
    filename,
    sha256,
    nativeSourceSha: sourceSha,
    webTokenSourceSha: tokenLock.commit,
    react: packageJson.peerDependencies.react,
    reactNative: packageJson.peerDependencies['react-native'],
    node: packageJson.engines.node,
};

fs.writeFileSync(path.join(outputDir, 'delivery-record.json'), JSON.stringify(record, null, 4) + '\n');
console.log(`DELIVERY_ARTIFACT ${filename}`);
console.log(`DELIVERY_SHA256 ${sha256}`);
console.log(`DELIVERY_NATIVE_SHA ${sourceSha}`);
console.log(`DELIVERY_WEB_SHA ${tokenLock.commit}`);
