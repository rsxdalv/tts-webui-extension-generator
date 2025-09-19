#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('Usage: npx tts-webui-extension-generator <extension-name>');
    console.log('   or: tts-webui-generate-extension <extension-name>');
    console.log('Example: npx tts-webui-extension-generator my_awesome_extension');
    process.exit(1);
}

const extensionName = args[0];
const packageName = `tts_webui_extension.${extensionName}`;
const extensionDir = path.join('.', packageName);
const packageStructureDir = path.join(extensionDir, 'tts_webui_extension');
const sourceDir = path.join(packageStructureDir, extensionName);

// Validate extension name
if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(extensionName)) {
    console.error('Error: Extension name must be a valid Python identifier (letters, numbers, underscores, cannot start with number)');
    process.exit(1);
}

// Check if directory already exists
if (fs.existsSync(extensionDir)) {
    console.error(`Error: Directory ${extensionDir} already exists`);
    process.exit(1);
}

console.log(`Creating extension: ${extensionName}`);
console.log(`Package name: ${packageName}`);
console.log(`Directory: ${extensionDir}`);

// Create directory structure
fs.mkdirSync(extensionDir, { recursive: true });
fs.mkdirSync(packageStructureDir, { recursive: true });
fs.mkdirSync(sourceDir, { recursive: true });
fs.mkdirSync(path.join(extensionDir, '.github', 'workflows'), { recursive: true });

// Template for main.py
const mainPyTemplate = `import gradio as gr


def ${extensionName}_ui():
    gr.Markdown(
        """
    # ${extensionName.charAt(0).toUpperCase() + extensionName.slice(1).replace(/_/g, ' ')}
    
    This is a template extension. Replace this content with your extension's functionality.
    
    To use it, simply modify this UI and add your custom logic.
    """
    )
    
    # Add your UI components here
    # Example:
    # with gr.Row():
    #     with gr.Column():
    #         input_text = gr.Textbox(label="Input")
    #         button = gr.Button("Process")
    #     with gr.Column():
    #         output_text = gr.Textbox(label="Output")
    # 
    # button.click(
    #     fn=your_processing_function,
    #     inputs=[input_text],
    #     outputs=[output_text],
    #     api_name="${extensionName}",
    # )


def extension__tts_generation_webui():
    ${extensionName}_ui()
    
    return {
        "package_name": "${packageName}",
        "name": "${extensionName.charAt(0).toUpperCase() + extensionName.slice(1).replace(/_/g, ' ')}",
        "requirements": "git+https://github.com/yourusername/${packageName}@main",
        "description": "A template extension for TTS Generation WebUI",
        "extension_type": "interface",
        "extension_class": "tools",
        "author": "Your Name",
        "extension_author": "Your Name",
        "license": "MIT",
        "website": "https://github.com/yourusername/${packageName}",
        "extension_website": "https://github.com/yourusername/${packageName}",
        "extension_platform_version": "0.0.1",
    }


if __name__ == "__main__":
    if "demo" in locals():
        locals()["demo"].close()
    with gr.Blocks() as demo:
        with gr.Tab("${extensionName.charAt(0).toUpperCase() + extensionName.slice(1).replace(/_/g, ' ')}", id="${extensionName}"):
            ${extensionName}_ui()

    demo.launch(
        server_port=7772,  # Change this port if needed
    )
`;

// Template for __init__.py
const initPyTemplate = `# ${extensionName.charAt(0).toUpperCase() + extensionName.slice(1).replace(/_/g, ' ')} extension
`;

// Template for setup.py
const setupPyTemplate = `import setuptools

setuptools.setup(
    name="${packageName}",
    packages=setuptools.find_namespace_packages(),
    version="0.0.1",
    author="Your Name",
    description="A template extension for TTS Generation WebUI",
    url="https://github.com/yourusername/${packageName}",
    project_urls={},
    scripts=[],
    install_requires=[
        # Add your dependencies here
        # "numpy",
        # "torch",
    ],
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
)
`;

// Template for README.md
const readmeTemplate = `# ${extensionName.charAt(0).toUpperCase() + extensionName.slice(1).replace(/_/g, ' ')}

A template extension for TTS Generation WebUI.

## Description

This is a template extension. Replace this content with your extension's description.

## Installation

\`\`\`bash
pip install git+https://github.com/yourusername/${packageName}@main
\`\`\`

## Usage

1. Install the extension
2. Restart TTS Generation WebUI
3. Navigate to the ${extensionName.charAt(0).toUpperCase() + extensionName.slice(1).replace(/_/g, ' ')} tab

## Development

To run the extension standalone:

\`\`\`bash
cd tts_webui_extension/${extensionName}
python main.py
\`\`\`

## License

MIT License
`;

// Template for LICENSE
const licenseTemplate = `MIT License

Copyright (c) ${new Date().getFullYear()} Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

// Read template files
function readTemplate(templatePath) {
    try {
        return fs.readFileSync(path.join(__dirname, 'templates', templatePath), 'utf8');
    } catch (error) {
        console.warn(`Warning: Could not read template ${templatePath}: ${error.message}`);
        return null;
    }
}

// Write files
console.log('Creating files...');

fs.writeFileSync(path.join(sourceDir, 'main.py'), mainPyTemplate);
console.log(`✓ Created ${path.join(sourceDir, 'main.py')}`);

fs.writeFileSync(path.join(sourceDir, '__init__.py'), initPyTemplate);
console.log(`✓ Created ${path.join(sourceDir, '__init__.py')}`);

fs.writeFileSync(path.join(extensionDir, 'setup.py'), setupPyTemplate);
console.log(`✓ Created ${path.join(extensionDir, 'setup.py')}`);

fs.writeFileSync(path.join(extensionDir, 'README.md'), readmeTemplate);
console.log(`✓ Created ${path.join(extensionDir, 'README.md')}`);

fs.writeFileSync(path.join(extensionDir, 'LICENSE'), licenseTemplate);
console.log(`✓ Created ${path.join(extensionDir, 'LICENSE')}`);

// Copy build_wheel.yml template if it exists
const buildWheelTemplate = readTemplate('.github/workflows/build_wheel.yml');
if (buildWheelTemplate) {
    fs.writeFileSync(path.join(extensionDir, '.github', 'workflows', 'build_wheel.yml'), buildWheelTemplate);
    console.log(`✓ Created ${path.join(extensionDir, '.github', 'workflows', 'build_wheel.yml')}`);
}

// Initialize git repository
console.log('Initializing git repository...');
try {
    process.chdir(extensionDir);
    execSync('git init', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Initial commit: Extension template"', { stdio: 'inherit' });
    console.log('✓ Git repository initialized and initial commit created');
} catch (error) {
    console.error('Warning: Failed to initialize git repository:', error.message);
}

console.log('\n🎉 Extension created successfully!');
console.log('\nNext steps:');
console.log(`1. cd ${extensionDir}`);
console.log('2. Edit the files to implement your extension functionality');
console.log('3. Update the metadata in main.py (author, description, etc.)');
console.log('4. Add dependencies to setup.py if needed');
console.log(`5. Test your extension by running: cd tts_webui_extension/${extensionName} && python main.py`);
console.log('6. Create a GitHub repository and push your code');
console.log('7. Update the requirements URL in main.py to point to your repository');
