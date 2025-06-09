# TTS WebUI Extension Generator

A command-line tool to generate boilerplate extensions for [TTS Generation WebUI](https://github.com/rsxdalv/tts-generation-webui).

## Installation & Usage

### Using npx (Recommended)

```bash
npx tts-webui-extension-generator my_awesome_extension
```

### Global Installation

```bash
npm install -g tts-webui-extension-generator
tts-webui-generate-extension my_awesome_extension
```

## What it creates

The generator creates a complete extension structure:

```
extension_my_awesome_extension/
├── extension_my_awesome_extension/
│   ├── __init__.py
│   └── main.py
├── setup.py
├── README.md
└── LICENSE
```

### Generated Files

- **`main.py`**: Contains the main extension logic with:
  - UI function using Gradio components
  - `extension__tts_generation_webui()` function with metadata
  - Standalone demo for testing
- **`setup.py`**: Python package configuration
- **`__init__.py`**: Package initialization
- **`README.md`**: Documentation template
- **`LICENSE`**: MIT license template

## Extension Structure

The generated extension follows the TTS WebUI extension pattern:

```python
def extension__tts_generation_webui():
    return {
        "package_name": "extension_my_awesome_extension",
        "name": "My Awesome Extension",
        "requirements": "git+https://github.com/yourusername/extension_my_awesome_extension@main",
        "description": "A template extension for TTS Generation WebUI",
        "extension_type": "interface",
        "extension_class": "tools",
        # ... more metadata
    }
```

## Development Workflow

1. **Generate extension**:
   ```bash
   npx tts-webui-extension-generator my_extension
   cd extension_my_extension
   ```

2. **Test standalone**:
   ```bash
   python extension_my_extension/main.py
   ```

3. **Customize**:
   - Edit `main.py` to implement your functionality
   - Update metadata (author, description, repository URLs)
   - Add dependencies to `setup.py`

4. **Publish**:
   - Create GitHub repository
   - Push your code
   - Update the `requirements` URL in `main.py`

## Extension Types

The generator creates `interface` type extensions by default. You can modify the `extension_type` and `extension_class` in the generated code:

- **Extension Types**: `interface`, `decorator`
- **Extension Classes**: `tools`, `audio-conversion`, `text-to-speech`, `outputs`, etc.

## Requirements

- Node.js 14+
- Git (for repository initialization)

## Contributing

Issues and pull requests welcome at [GitHub](https://github.com/rsxdalv/tts-webui-extension-generator).

## License

MIT License
