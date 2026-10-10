import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const nativeRoot = path.resolve(import.meta.dirname, '..');
const repositoryRoot = path.resolve(nativeRoot, '..');
const lockPath = path.join(nativeRoot, 'token-source.lock.json');

const gitBlobSha = (contents) =>
    crypto.createHash('sha1').update(`blob ${Buffer.byteLength(contents)}\0`).update(contents).digest('hex');

export function readLockedTokenSources() {
    const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    const webRoot = path.join(repositoryRoot, 'fresnica-ui');
    const head = execFileSync('git', ['-C', webRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();

    if (head !== lock.commit) {
        throw new Error(`Web token source revision mismatch: expected ${lock.commit}, received ${head}`);
    }

    const readLockedFile = (relativePath) => {
        const sourcePath = path.join(webRoot, relativePath);
        const contents = fs.readFileSync(sourcePath, 'utf8');
        const actualSha = gitBlobSha(contents);
        const expectedSha = lock.files?.[relativePath]?.gitBlobSha;

        if (!expectedSha) {
            throw new Error(`Missing token source lock entry: ${relativePath}`);
        }
        if (actualSha !== expectedSha) {
            throw new Error(
                `Web token source content mismatch for ${relativePath}: expected ${expectedSha}, received ${actualSha}`,
            );
        }

        return { sourcePath, contents };
    };

    const tokens = readLockedFile('design-system/tokens.json');
    const platform = readLockedFile('design-system/platform-token-source.json');

    return {
        lock,
        tokenPath: tokens.sourcePath,
        platformTokenPath: platform.sourcePath,
        source: JSON.parse(tokens.contents),
        platformSource: JSON.parse(platform.contents),
    };
}
