# Unicode Text Formatter + Editor

A small Vue 3 web app for converting plain text into styled Unicode variants
(bold, italic, script, double-struck, monospace, bubble, and more). It also
includes an editor mode that applies styles to highlighted selections.

Live demo: https://jrequiroso.github.io/text-formatter/

## Features

- Unicode formatter with multiple style variants
- Text editor mode with selection-based formatting
- Case presets for common naming and sentence styles
- Undo/redo support for editor changes
- Keyboard shortcuts for bold/italic typing mode in the editor
- Straight-quotes action for replacing curly single and double quotes
- Convert-Markdown action for converting Markdown emphasis into Unicode styles
- Remove-format action for selected text or full text reset
- Light and dark theme toggle (stored in session storage)
- One-click copy for each formatted output and editor content

## Usage

Use the **Text Formatter** tab when you want full-output previews. Type or paste
plain text once, then copy the Unicode variant you need.

Use the **Text Editor** tab when you want to edit a longer block in place:

- Highlight text, then choose a Unicode style to apply it only to the selection.
- Use case presets to convert selected text, or the full editor text when no
  text is selected.
- Use **Remove Format** to normalize styled Unicode text back to plain text.
- Use **Straight Quotes** to replace curly single and double quotes with straight
  quotes.
- Use **Convert Markdown** to clean pasted Markdown into readable text, convert
  Markdown emphasis to Unicode bold/italic styles, and preserve line breaks.
- Use undo/redo to move through editor changes.

## Project Structure

- `index.html`: app shell and Vue templates
- `formatter-core.js`: shared Unicode transform and case-preset logic
- `main.js`: Vue app state and editor interactions
- `package.json`: test script configuration
- `style.css`: theme and layout styles
- `test/formatter-core.test.js`: unit tests for happy and unhappy paths

## Run Locally

Because this is a static site, you can run it with any local HTTP server.

Option 1 (Python):

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

Option 2 (VS Code Live Server):

- Open the project folder
- Start Live Server from `index.html`

## Build

No build step is required in the current setup.

## Testing

Run the unit tests with:

```bash
npm test
```

Use a modern Node.js version that supports the built-in test runner. Node 20+
is recommended.

## Deploy

This project can be deployed to any static host:

- GitHub Pages
- Netlify
- Vercel static deployment

For GitHub Pages, publish the repository root (or a dedicated branch/folder)
as a static site.

## Notes

- Unicode styling is character-map based and may render differently by platform
  or font.
- Some Unicode styles do not have native digit equivalents.

## License

MIT
