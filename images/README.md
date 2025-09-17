# Images

This directory contains images used throughout the DataHaven documentation.

## Structure

Images should be organized to mirror the documentation sections where they are used.  
For example, if an image appears in `provide-storage/get-started.md`, place it under:

```markdown
images/
├── provide-storage/
│   └── get-started/
│       └── get-started-1.webp
│       └── get-started-2.webp
```

This makes it easier to find, update, and maintain images as the docs grow.

## Guidelines

- All images should be in `.webp` format.
- File names should correspond to the Markdown file they belong to and be numbered sequentially when multiple images are used (e.g., `get-started-1.webp`, `get-started-2.webp`).
- Screenshots should typically be taken at 150% zoom to ensure clarity when rendered on the docs.

## Usage

Include images in Markdown files using standard Markdown syntax:

```markdown
![Alt text for accessibility](/images/provide-storage/get-started/image-1.webp)
```

For guidelines on alt text, refer to the [Google Developer Documentation Style Guide](https://developers.google.com/style/images#alt-text).