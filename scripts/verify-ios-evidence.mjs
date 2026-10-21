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

const q03Manifest = JSON.parse(
    fs.readFileSync(path.join(base, 'ios/2026-10-19/evidence-manifest.json'), 'utf8'),
);
const q03Ids = new Set();

for (const reference of q03Manifest.references) {
    if (q03Ids.has(reference.id)) throw new Error(`Duplicate Q03 evidence ID: ${reference.id}`);
    q03Ids.add(reference.id);
    const archive = reference.archive;
    const png = readArchivedFile(archive.screenshot);
    const metadataBytes = readArchivedFile(archive.metadata);
    if (sha256(png) !== archive.screenshotSha256 || sha256(metadataBytes) !== archive.metadataSha256) {
        throw new Error(`Archived Q03 bytes changed: ${reference.id}`);
    }
    if (
        png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' ||
        png.readUInt32BE(16) !== archive.width ||
        png.readUInt32BE(20) !== archive.height
    ) {
        throw new Error(`Q03 PNG dimensions/signature disagree: ${reference.id}`);
    }
    const metadata = JSON.parse(metadataBytes.toString('utf8'));
    if (metadata.sourceSha !== archive.captureSourceSha) {
        throw new Error(`Q03 capture source disagrees: ${reference.id}`);
    }
    for (const key of ['device', 'runtime', 'contentSize', 'appearance', 'previewLocale', 'previewScenario']) {
        if (metadata[key] !== reference[key]) throw new Error(`Q03 metadata ${key} disagrees: ${reference.id}`);
    }
    if (metadata.previewEvidenceView !== reference.previewEvidenceView) {
        throw new Error(`Q03 evidence view disagrees: ${reference.id}`);
    }
}

const q05Manifest = JSON.parse(
    fs.readFileSync(path.join(base, 'ios/2026-10-20/q05-interactions/evidence-manifest.json'), 'utf8'),
);
const q05MetadataBytes = readArchivedFile(q05Manifest.originalFiles.metadata.path);
const q05AttachmentsBytes = readArchivedFile(q05Manifest.originalFiles.attachmentsManifest.path);
if (
    sha256(q05MetadataBytes) !== q05Manifest.originalFiles.metadata.sha256 ||
    sha256(q05AttachmentsBytes) !== q05Manifest.originalFiles.attachmentsManifest.sha256
) {
    throw new Error('Archived Q05 metadata bytes changed.');
}
const q05Metadata = JSON.parse(q05MetadataBytes.toString('utf8'));
if (q05Metadata.sourceSha !== q05Manifest.captureCheckoutSha) {
    throw new Error('Q05 capture source disagrees.');
}
for (const key of ['device', 'runtime', 'configuration', 'contentSize', 'appearance', 'locale', 'scenario']) {
    if (q05Metadata[key] !== q05Manifest.environment[key]) throw new Error(`Q05 metadata ${key} disagrees.`);
}

const q05Attachments = JSON.parse(q05AttachmentsBytes.toString('utf8'));
const attachmentIndex = new Map();
for (const group of q05Attachments) {
    for (const attachment of group.attachments) {
        attachmentIndex.set(attachment.exportedFileName, {
            testIdentifier: group.testIdentifier,
            suggestedHumanReadableName: attachment.suggestedHumanReadableName,
            isAssociatedWithFailure: attachment.isAssociatedWithFailure,
        });
    }
}

for (const screenshot of q05Manifest.screenshots) {
    const png = readArchivedFile(screenshot.path);
    if (sha256(png) !== screenshot.sha256) throw new Error(`Archived Q05 screenshot changed: ${screenshot.id}`);
    if (
        png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' ||
        png.readUInt32BE(16) !== screenshot.width ||
        png.readUInt32BE(20) !== screenshot.height
    ) {
        throw new Error(`Q05 PNG dimensions/signature disagree: ${screenshot.id}`);
    }
    const filename = path.basename(screenshot.path);
    const attachment = attachmentIndex.get(filename);
    if (!attachment) throw new Error(`Q05 attachment manifest is missing: ${screenshot.id}`);
    if (
        attachment.testIdentifier !== screenshot.testIdentifier ||
        attachment.suggestedHumanReadableName !== screenshot.suggestedHumanReadableName ||
        attachment.isAssociatedWithFailure
    ) {
        throw new Error(`Q05 attachment metadata disagrees: ${screenshot.id}`);
    }
}

const q05Summary = JSON.parse(readArchivedFile(q05Manifest.testSummary).toString('utf8'));
if (
    q05Summary.workflowRunId !== q05Manifest.workflowRunId ||
    q05Summary.jobId !== q05Manifest.jobId ||
    q05Summary.artifactId !== q05Manifest.artifactId ||
    q05Summary.artifactDigest !== q05Manifest.artifactDigest ||
    q05Summary.executed !== 3 ||
    q05Summary.failures !== 0 ||
    q05Summary.unexpectedFailures !== 0 ||
    q05Summary.tests.length !== 3 ||
    q05Summary.tests.some((test) => test.status !== 'passed')
) {
    throw new Error('Q05 test summary disagrees with the pinned passing run.');
}

console.log(
    `Verified ${q03Ids.size} archived Q03 frames and ${q05Manifest.screenshots.length} Q05 interaction screenshots; Q05 tests: ${q05Summary.executed} passed, ${q05Summary.failures} failed.`,
);

