import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const projectDir = path.join(root, 'example', 'FresnicaPreview');
const iosDir = path.join(projectDir, 'ios');
const workspace = path.join(iosDir, 'FresnicaPreview.xcworkspace');
const projectPath = path.join(iosDir, 'FresnicaPreview.xcodeproj');
const evidenceDir = path.join(root, 'example', 'ios-interaction-evidence');
const derivedData = path.join(root, 'example', '.cache', 'ios-interaction-derived-data');
const resultBundle = path.join(evidenceDir, 'q05-interactions.xcresult');
const uiTestsDir = path.join(iosDir, 'FresnicaPreviewUITests');
const swiftPath = path.join(uiTestsDir, 'Q05InteractionTests.swift');
const rubyPath = path.join(root, 'example', '.cache', 'configure-q05-ui-tests.rb');
const deviceName = process.env.IOS_PREVIEW_DEVICE ?? 'iPhone 16';
const runtimeVersion = process.env.IOS_PREVIEW_RUNTIME ?? '18.5';

function run(command, args, cwd = root, capture = false) {
    const result = spawnSync(command, args, {
        cwd,
        encoding: capture ? 'utf8' : undefined,
        stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
        shell: false,
    });

    if (result.status !== 0) {
        if (capture) {
            process.stdout.write(result.stdout ?? '');
            process.stderr.write(result.stderr ?? '');
        }
        process.exit(result.status ?? 1);
    }

    return capture ? (result.stdout ?? '').trim() : '';
}

if (process.platform !== 'darwin') {
    throw new Error('The iOS interaction check requires macOS.');
}

if (!fs.existsSync(projectDir)) {
    throw new Error('Preview host is missing. Run npm run example:bootstrap first.');
}

if (!fs.existsSync(workspace)) {
    run('bundle', ['install'], projectDir);
    run('bundle', ['exec', 'pod', 'install'], iosDir);
}

fs.rmSync(evidenceDir, { recursive: true, force: true });
fs.rmSync(derivedData, { recursive: true, force: true });
fs.mkdirSync(evidenceDir, { recursive: true });
fs.mkdirSync(uiTestsDir, { recursive: true });
fs.mkdirSync(path.dirname(rubyPath), { recursive: true });

const swiftSource = `import XCTest

final class Q05InteractionTests: XCTestCase {
    private let app = XCUIApplication()

    override func setUpWithError() throws {
        continueAfterFailure = false
        app.launch()
    }

    private func attachScreenshot(_ name: String) {
        let attachment = XCTAttachment(screenshot: XCUIScreen.main.screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    private func scrollUntilHittable(_ element: XCUIElement, maxSwipes: Int = 12) {
        if element.isHittable {
            return
        }

        for _ in 0..<maxSwipes {
            app.swipeUp()
            if element.isHittable {
                return
            }
        }

        XCTFail("Element did not become hittable: \\(element)")
    }

    func testKeyboardFieldAndPrimaryAction() throws {
        let field = app.textFields["Keyboard visibility check"]
        XCTAssertTrue(field.waitForExistence(timeout: 12), "Keyboard field was not found")
        scrollUntilHittable(field)
        field.tap()

        let keyboard = app.keyboards.firstMatch
        XCTAssertTrue(keyboard.waitForExistence(timeout: 6), "Software keyboard did not appear")
        attachScreenshot("keyboard-before-primary-action")

        let action = app.buttons["Primary action below keyboard field"]
        XCTAssertTrue(action.waitForExistence(timeout: 4), "Primary action was not found")
        scrollUntilHittable(action)
        XCTAssertTrue(action.isHittable, "Primary action is not reachable with the keyboard open")
        action.tap()

        let feedback = app.staticTexts["Keyboard action was pressed"]
        XCTAssertTrue(feedback.waitForExistence(timeout: 6), "Primary action feedback did not appear")
        attachScreenshot("keyboard-after-primary-action")
    }
}
`;
fs.writeFileSync(swiftPath, swiftSource);

const rubySource = `require 'xcodeproj'

project_path = ARGV.fetch(0)
swift_path = ARGV.fetch(1)
app_name = 'FresnicaPreview'
test_name = 'FresnicaPreviewUITests'
scheme_name = 'FresnicaPreviewQ05'

project = Xcodeproj::Project.open(project_path)
app_target = project.targets.find { |target| target.name == app_name }
raise "Missing app target: #{app_name}" unless app_target

test_target = project.targets.find { |target| target.name == test_name }
unless test_target
  test_target = project.new_target(:ui_test_bundle, test_name, :ios, '15.1')
end

relative_swift_path = Pathname.new(swift_path).relative_path_from(Pathname.new(File.dirname(project_path))).to_s
file_ref = project.files.find { |file| file.path == relative_swift_path }
file_ref ||= project.main_group.new_file(relative_swift_path)

unless test_target.source_build_phase.files_references.include?(file_ref)
  test_target.add_file_references([file_ref])
end

test_target.build_configurations.each do |config|
  config.build_settings['PRODUCT_BUNDLE_IDENTIFIER'] = 'org.reactjs.native.example.FresnicaPreviewUITests'
  config.build_settings['GENERATE_INFOPLIST_FILE'] = 'YES'
  config.build_settings['SWIFT_VERSION'] = '5.0'
  config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.1'
  config.build_settings['TEST_TARGET_NAME'] = app_name
  config.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
end

project.save

scheme = Xcodeproj::XCScheme.new
scheme.add_build_target(app_target)
scheme.add_test_target(test_target)
scheme.set_launch_target(app_target)
scheme.save_as(project_path, scheme_name, true)
`;
fs.writeFileSync(rubyPath, rubySource);

run('bundle', ['exec', 'ruby', rubyPath, projectPath, swiftPath], projectDir);

const devices = JSON.parse(
    run('xcrun', ['simctl', 'list', 'devices', 'available', '-j'], root, true),
);
const runtimeKey = Object.keys(devices.devices).find((key) =>
    key.endsWith(`iOS-${runtimeVersion.replace('.', '-')}`),
);
if (!runtimeKey) {
    throw new Error(`iOS ${runtimeVersion} Simulator runtime is not installed.`);
}

const device = devices.devices[runtimeKey].find((candidate) => candidate.name === deviceName);
if (!device) {
    throw new Error(`${deviceName} is not available for iOS ${runtimeVersion}.`);
}

run('defaults', [\n    'write',\n    'com.apple.iphonesimulator',\n    'ConnectHardwareKeyboard',\n    '-bool',\n    'false',\n]);

if (device.state !== 'Booted') {
    run('xcrun', ['simctl', 'boot', device.udid]);
}
run('xcrun', ['simctl', 'bootstatus', device.udid, '-b']);

const keyboardPreferenceKeys = [
    'DidShowContinuousPathIntroduction',
    'KeyboardDidShowProductivityTutorial',
    'DidShowGestureKeyboardIntroduction',
    'UIKeyboardDidShowInternationalInfoIntroduction',
];
for (const key of keyboardPreferenceKeys) {
    run('xcrun', ['simctl', 'spawn', device.udid, 'defaults', 'write', 'com.apple.keyboard.preferences', key, '1']);
}

run('xcrun', ['simctl', 'ui', device.udid, 'content_size', 'extra-extra-extra-large']);
run('xcrun', ['simctl', 'ui', device.udid, 'appearance', 'light']);

run(
    'xcodebuild',
    [
        '-workspace',
        workspace,
        '-scheme',
        'FresnicaPreviewQ05',
        '-configuration',
        'Debug',
        '-sdk',
        'iphonesimulator',
        '-destination',
        `id=${device.udid}`,
        '-derivedDataPath',
        derivedData,
        '-resultBundlePath',
        resultBundle,
        'CODE_SIGNING_ALLOWED=NO',
        'test',
    ],
    iosDir,
);

const metadata = {
    device: deviceName,
    runtime: `iOS ${runtimeVersion}`,
    sourceSha: process.env.GITHUB_SHA ?? 'local',
    xcode: run('xcodebuild', ['-version'], root, true),
    node: run('node', ['--version'], root, true),
    contentSize: 'extra-extra-extra-large',
    appearance: 'light',
    locale: 'en',
    scenario: 'standard',
    interaction: 'keyboard-field-primary-action',
    resultBundle: path.relative(root, resultBundle),
};
fs.writeFileSync(path.join(evidenceDir, 'metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`);

const attachmentsDir = path.join(evidenceDir, 'attachments');
const exportResult = spawnSync(
    'xcrun',
    ['xcresulttool', 'export', 'attachments', '--path', resultBundle, '--output-path', attachmentsDir],
    { cwd: root, stdio: 'inherit', shell: false },
);
if (exportResult.status !== 0) {
    console.warn(\n        '[q05] xcresult attachment export was unavailable; the xcresult bundle still contains the screenshots.',\n    );
}

console.log(JSON.stringify(metadata, null, 2));
