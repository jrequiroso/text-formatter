const assert = require("node:assert/strict");
const test = require("node:test");

const {
    createTextStorage,
    storageKeys
} = require("../formatter-storage");

function createFakeStorage() {
    const values = new Map();
    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            values.set(key, String(value));
        }
    };
}

test("formatter and editor text are persisted under separate keys", () => {
    const rawStorage = createFakeStorage();
    const textStorage = createTextStorage(rawStorage);

    textStorage.writeFormatterInput("formatter text");
    textStorage.writeEditorInput("editor text");

    assert.notEqual(storageKeys.formatterInput, storageKeys.editorInput);
    assert.equal(textStorage.readFormatterInput(), "formatter text");
    assert.equal(textStorage.readEditorInput(), "editor text");
});

test("editor-only saved text does not restore into formatter input", () => {
    const rawStorage = createFakeStorage();
    const textStorage = createTextStorage(rawStorage);

    textStorage.writeEditorInput("editor draft");

    assert.equal(textStorage.readFormatterInput(), "");
    assert.equal(textStorage.readEditorInput(), "editor draft");
});
