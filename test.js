#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running tests for tts-webui-extension-generator...');

// Test 1: Basic functionality test
console.log('\n1. Testing basic extension generation...');

const testExtensionName = 'test_extension_' + Date.now();
const packageName = `tts_webui_extension.${testExtensionName}`;
const testDir = path.join(__dirname, 'test_output');

// Clean up any existing test directory
if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
}

// Create test directory
fs.mkdirSync(testDir, { recursive: true });

try {
    // Change to test directory
    process.chdir(testDir);
    
    // Run the generator
    execSync(`node ${path.join(__dirname, 'generate-extension.js')} ${testExtensionName}`, { stdio: 'pipe' });
    
    // Check if files were created (generator now creates package 'tts_webui_extension.<name>')
    const expectedFiles = [
        `${packageName}/tts_webui_extension/${testExtensionName}/main.py`,
        `${packageName}/tts_webui_extension/${testExtensionName}/__init__.py`,
        `${packageName}/pyproject.toml`,
        `${packageName}/README.md`,
        `${packageName}/LICENSE`,
        `${packageName}/.github/workflows/build_wheel.yml`
    ];
    
    let allFilesExist = true;
    for (const file of expectedFiles) {
        if (!fs.existsSync(file)) {
            console.error(`❌ Missing file: ${file}`);
            allFilesExist = false;
        }
    }
    
    if (allFilesExist) {
        console.log('✅ All expected files created successfully');
    }
    
    // Test 2: Check main.py content
    console.log('\n2. Testing main.py content...');
    const mainPyPath = `${packageName}/tts_webui_extension/${testExtensionName}/main.py`;
    const mainPyContent = fs.readFileSync(mainPyPath, 'utf8');
    
    const requiredContent = [
        `def ${testExtensionName}_ui():`,
        'def extension__tts_generation_webui():',
        `"package_name": "${packageName}"`,
        'gr.Markdown('
    ];
    
    let contentValid = true;
    for (const content of requiredContent) {
        if (!mainPyContent.includes(content)) {
            console.error(`❌ Missing content in main.py: ${content}`);
            contentValid = false;
        }
    }
    
    if (contentValid) {
        console.log('✅ main.py content is valid');
    }
    
    // Test 3: Check pyproject.toml content
    console.log('\n3. Testing pyproject.toml content...');
    const pyprojectPath = `${packageName}/pyproject.toml`;
    const pyprojectContent = fs.readFileSync(pyprojectPath, 'utf8');

    const hasProjectSection = pyprojectContent.includes('[project]');
    const hasName = pyprojectContent.includes(`name = "${packageName}"`);

    if (hasProjectSection && hasName) {
        console.log('✅ pyproject.toml content is valid');
    } else {
        console.error('❌ pyproject.toml content is invalid');
    }
    
    console.log('\n✅ All tests passed!');
    
} catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
} finally {
    // Clean up test directory
    process.chdir(__dirname);
    if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
    }
}

// Test 4: Invalid extension name
console.log('\n4. Testing invalid extension name handling...');
try {
    execSync(`node ${path.join(__dirname, 'generate-extension.js')} 123invalid`, { stdio: 'pipe' });
    console.error('❌ Should have failed with invalid extension name');
    process.exit(1);
} catch (error) {
    if (error.status === 1) {
        console.log('✅ Correctly rejected invalid extension name');
    } else {
        console.error('❌ Unexpected error:', error.message);
        process.exit(1);
    }
}

console.log('\n🎉 All tests completed successfully!');
