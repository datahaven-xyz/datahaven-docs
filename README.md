# Documentation for DataHaven

Welcome to the DataHaven Documentation repository! This repository contains the source files for the DataHaven docs site, built with [MkDocs](https://www.mkdocs.org/) and [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).

It includes the documentation content, written in Markdown, along with related images and example code. The theme and framework configurations live in the [datahaven-mkdocs](https://github.com/papermoonio/datahaven-mkdocs) repository.

## Repository Structure

```markdown
├── .snippets/           # Code and text snippets referenced in docs
│   ├── code/            
│   └── text/     
├── images/              # Images used in docs
├── <section>/           # Top-level section folder (e.g., `manage-stored-data`,`provide-storage`)
│   ├── nav.yml          # Navigation definition for this section
│   ├── index.md         # Section landing page
│   ├── <page>.md        # Documentation pages within this section
│   └── ...                    
├── .nav.yml             # Navigation definition for top-level sections
├── index.md             # Main landing page
├── README.md
└── variables.yml        # Reusable variables used in docs
```

**Notes**:

- Each section folder contains its Markdown pages, an `index.md` landing page, and a `.nav.yml` file defining page titles and their order.
- Snippets and images mirror the structure of the documentation, making it easy to reference them.

## Run the Docs Locally

To preview the documentation site locally:

1. Clone the [`datahaven-mkdocs`](https://github.com/papermoonio/datahaven-mkdocs) theme repository:

    ```bash
    git clone https://github.com/papermoonio/datahaven-mkdocs.git
    ```

2. Clone the `datahaven-docs` repository and place it under the `datahaven-mkdocs` directory:

    ```markdown
    datahaven-mkdocs
    └── datahaven-docs
    ```

    ```bash
    git clone https://github.com/datahaven-xyz/datahaven-docs.git
    ```

3. Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

4. Serve the site:

    ```bash
    mkdocs serve
    ```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser to view the docs. Any changes to Markdown files, snippets, or images will automatically update in the local preview.

## License

This project is licensed under the [GPL-3.0 License](LICENSE).