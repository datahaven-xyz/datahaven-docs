# Snippets

This directory contains reusable content for the DataHaven documentation.

Snippets are small pieces of text or code that can be referenced in multiple places across the docs to ensure consistency and reduce duplication.

## Structure

- **`code/`**: Reusable code snippets (e.g., CLI commands, config examples).
- **`text/`** – Reusable text snippets (e.g., disclaimers, repeated notes).

Snippets should mirror the structure of the docs. For example, if you have a page at `provide-storage/run-node.md`, related snippets might be stored as:

```markdown
.snippets/
├── code/
│   └── provide-storage/
│       └── run-node
│          └── run-node-1.sh
└── text/
│   └── provide-storage/
│       └── run-node
│           └── run-node-note.md
```

This keeps snippets organized and easy to locate.

## Usage

Snippets are included in Markdown files using the `--8<--` directive.

💡 **Note**: Do not include Markdown code fences (```) inside the snippet itself. Apply code fencing in the Markdown page where the snippet is used.

For example, to include a snippet stored at `.snippets/code/install.sh`, your Markdown file should contain:

```markdown
    ```sh
    --8<-- ".snippets/code/install.sh"
    ```
```

This will insert the contents of the snippet directly into the page at build time.

Refer to the [PyMdown Extensions Snippets documentation](https://facelessuser.github.io/pymdown-extensions/extensions/snippets/#snippets) for more usage information.
