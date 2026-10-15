import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const base = path.resolve(import.meta.dirname, '../docs/visual-baselines');
const manifest = JSON.parse(fs.readFileSync(path.join(base, 'ios-simulator-evidence-manifest.json'), 'utf8'));
const ids = new Set();
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function readArchivedFile(relativePath) {
    const filename = path.resolve(base, relativePath);
    if (!filename.startsWith(`${base}${path.sep}`)) {
        throw new Error(`Evidence path leaves the baseline directory: ${relativePath}`);
    }
    return fs.readFileSync(filename);
}

for (const reference of manifest.references) {
    if (ids.has(reference.id)) throw new Error(`Duplicate evidence ID: ${reference.id}`);
    ids.add(reference.id);
    const archive = reference.archive;
    const png = readArchivedFile(archive.screenshot);
    const metadataBytes = readArchivedFile(archive.metadata);
    if (sha256(png) !== archive.screenshotSha256 || sha256(metadataBytes) !== archive.metadataSha256) {
        throw new Error(`Archived bytes changed: ${reference.id}`);
    }
    if (
        png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' ||
        png.readUInt32BE(16) !== archive.width ||
        png.readUInt32BE(20) !== archive.height
    ) {
        throw new Error(`PNG dimensions/signature disagree: ${reference.id}`);
    }
    const metadata = JSON.parse(metadataBytes.toString('utf8'));
    if (metadata.sourceSha !== archive.captureSourceSha) {
        throw new Error(`Capture source disagrees: ${reference.id}`);
    }
    for (const key of ['device', 'runtime', 'contentSize', 'appearance', 'previewLocale', 'previewScenario']) {
        if (metadata[key] !== reference[key]) throw new Error(`Metadata ${key} disagrees: ${reference.id}`);
    }
    if ((metadata.previewEvidenceView ?? 'full') !== reference.previewEvidenceView) {
        throw new Error(`Evidence view disagrees: ${reference.id}`);
    }
}

for (const id of manifest.ownerApproval.evidenceIds) {
    if (!ids.has(id)) throw new Error(`Unknown owner-review evidence ID: ${id}`);
}
if (
    manifest.ownerApproval.status === 'approved' &&
    (!manifest.ownerApproval.reviewer || !manifest.ownerApproval.reviewedAt || !manifest.ownerApproval.decision)
) {
    throw new Error('Approved owner review requires reviewer, date and decision.');
}
console.log(`Verified ${ids.size} archived iOS frames and metadata; owner approval: ${manifest.ownerApproval.status}.`);
