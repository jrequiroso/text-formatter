(function (root, factory) {
    const exported = factory();

    if (typeof module === "object" && module.exports) {
        module.exports = exported;
    }

    if (root) {
        root.TextFormatterStorage = exported;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
    const storageKeys = Object.freeze({
        formatterInput: "textFormatter.formatterInput",
        editorInput: "textFormatter.editorInput"
    });

    function readStoredText(storage, key) {
        try {
            return storage.getItem(key) || "";
        } catch (error) {
            console.warn("Text restore failed:", error);
            return "";
        }
    }

    function writeStoredText(storage, key, value) {
        try {
            storage.setItem(key, value || "");
        } catch (error) {
            console.warn("Text save failed:", error);
        }
    }

    function createTextStorage(storage) {
        return {
            readFormatterInput() {
                return readStoredText(storage, storageKeys.formatterInput);
            },
            writeFormatterInput(value) {
                writeStoredText(storage, storageKeys.formatterInput, value);
            },
            readEditorInput() {
                return readStoredText(storage, storageKeys.editorInput);
            },
            writeEditorInput(value) {
                writeStoredText(storage, storageKeys.editorInput, value);
            }
        };
    }

    return {
        createTextStorage: createTextStorage,
        storageKeys: storageKeys
    };
}));
