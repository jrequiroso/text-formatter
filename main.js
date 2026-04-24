const { createApp } = Vue;
const {
    applyCasePresetToText,
    casePresets,
    cleanMarkdownText,
    normalizeToPlainText,
    replaceCurlyQuotes,
    transformText,
    variants
} = TextFormatterCore;

createApp({
    data() {
        return {
            input: "",
            editor_input: "",
            copied: null,
            editorCopied: false,
            theme: sessionStorage.getItem("theme") || "light",
            active_tab: "formatter",
            variants,
            casePresets,
            editorSelectionLength: 0,
            history: [],
            historyIndex: -1,
            suppressNextInputHistory: false,
            activeTypingStyle: null
        };
    },
    computed: {
        formattedVariants() {
            const formatted = {};
            Object.entries(this.variants).forEach(([name, map]) => {
                formatted[name] = this.transform(this.input, map);
            });
            return formatted;
        },
        editorSelectionHint() {
            if (this.editorSelectionLength > 0) {
                return `Selection: ${this.editorSelectionLength} chars selected.`;
            }
            return "Selection: none. Case presets and Remove/Reset apply to all text.";
        },
        editorTypingHint() {
            if (this.activeTypingStyle) {
                return `Typing mode: ${this.activeTypingStyle}.`;
            }
            return "Typing mode: off. Use Ctrl+B or Ctrl+I with no selection.";
        },
        canUndo() {
            return this.historyIndex > 0;
        },
        canRedo() {
            return this.historyIndex >= 0 && this.historyIndex < this.history.length - 1;
        }
    },
    mounted() {
        this.applyThemeClass();
        this.$nextTick(() => {
            this.updateSelectionFromTextarea();
            this.pushHistorySnapshot(this.captureEditorSnapshot(), true);
        });
    },
    methods: {
        applyThemeClass() {
            document.body.classList.toggle("dark", this.theme === "dark");
        },
        handleEditorBeforeInput(event) {
            if (!this.activeTypingStyle) {
                return;
            }

            if (event.ctrlKey || event.metaKey || event.altKey) {
                return;
            }

            const shouldTransformInput =
                event.inputType === "insertText" ||
                event.inputType === "insertCompositionText";

            if (!shouldTransformInput || typeof event.data !== "string" || event.data.length === 0) {
                return;
            }

            event.preventDefault();
            this.insertStyledText(event.data, this.activeTypingStyle);
        },
        handleEditorKeydown(event) {
            const isModifier = event.ctrlKey || event.metaKey;
            if (!isModifier || event.altKey) {
                if (event.key === "Escape" && this.activeTypingStyle) {
                    this.activeTypingStyle = null;
                }
                return;
            }

            const key = event.key.toLowerCase();
            if (key === "z" && !event.shiftKey) {
                event.preventDefault();
                this.undoEditor();
                return;
            }

            if (key === "y" || (key === "z" && event.shiftKey)) {
                event.preventDefault();
                this.redoEditor();
                return;
            }

            if (key === "b") {
                event.preventDefault();
                this.handleStyleShortcut("Bold (Sans)");
                return;
            }

            if (key === "i") {
                event.preventDefault();
                this.handleStyleShortcut("Italic (Sans)");
            }
        },
        handleStyleShortcut(styleName) {
            const textarea = this.$refs.editorTextarea;
            if (!textarea) {
                return;
            }

            const hasSelection = textarea.selectionStart !== textarea.selectionEnd;
            if (hasSelection) {
                this.toggleStyleForSelection(styleName);
                return;
            }

            this.activeTypingStyle = this.activeTypingStyle === styleName ? null : styleName;
        },
        toggleStyleForSelection(styleName) {
            this.applyTransformToEditor((text) => {
                const normalized = this.normalizeToPlain(text);
                const styled = this.transform(normalized, this.variants[styleName]);
                return text === styled ? normalized : styled;
            }, false);
        },
        insertStyledText(text, styleName) {
            const textarea = this.$refs.editorTextarea;
            if (!textarea || !this.variants[styleName]) {
                return;
            }

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const transformed = this.transform(this.normalizeToPlain(text), this.variants[styleName]);

            const scrollTop = textarea.scrollTop;
            this.suppressNextInputHistory = true;
            textarea.setRangeText(transformed, start, end, "end");
            this.editor_input = textarea.value;
            textarea.scrollTop = scrollTop;
            textarea.focus();
            this.updateSelectionFromTextarea(textarea);
            this.pushHistorySnapshot(this.captureEditorSnapshot());
        },
        captureEditorSnapshot() {
            const textarea = this.$refs.editorTextarea;
            const text = this.editor_input || "";
            if (!textarea) {
                return {
                    text,
                    selectionStart: 0,
                    selectionEnd: 0
                };
            }

            return {
                text,
                selectionStart: textarea.selectionStart,
                selectionEnd: textarea.selectionEnd
            };
        },
        pushHistorySnapshot(snapshot, force = false) {
            if (!snapshot) {
                return;
            }

            const current = this.history[this.historyIndex];
            if (!force && current && current.text === snapshot.text) {
                this.history[this.historyIndex] = snapshot;
                return;
            }

            if (this.historyIndex < this.history.length - 1) {
                this.history = this.history.slice(0, this.historyIndex + 1);
            }

            this.history.push(snapshot);
            const maxHistory = 100;
            if (this.history.length > maxHistory) {
                this.history.shift();
            }
            this.historyIndex = this.history.length - 1;
        },
        applySnapshot(snapshot) {
            if (!snapshot) {
                return;
            }

            this.editor_input = snapshot.text;
            this.$nextTick(() => {
                const textarea = this.$refs.editorTextarea;
                if (!textarea) {
                    return;
                }

                textarea.value = snapshot.text;
                const limit = snapshot.text.length;
                textarea.selectionStart = Math.min(snapshot.selectionStart, limit);
                textarea.selectionEnd = Math.min(snapshot.selectionEnd, limit);
                textarea.focus();
                this.updateSelectionFromTextarea(textarea);
                this.suppressNextInputHistory = false;
            });
        },
        undoEditor() {
            if (!this.canUndo) {
                return;
            }

            this.historyIndex -= 1;
            this.applySnapshot(this.history[this.historyIndex]);
        },
        redoEditor() {
            if (!this.canRedo) {
                return;
            }

            this.historyIndex += 1;
            this.applySnapshot(this.history[this.historyIndex]);
        },
        updateSelectionFromTextarea(textarea = null) {
            const target = textarea || this.$refs.editorTextarea;
            if (!target) {
                this.editorSelectionLength = 0;
                return;
            }
            this.editorSelectionLength = Math.max(0, target.selectionEnd - target.selectionStart);
        },
        updateSelectionFromEvent(event) {
            this.updateSelectionFromTextarea(event.target);
        },
        handleEditorInput(event) {
            this.updateSelectionFromTextarea(event.target);
            if (this.suppressNextInputHistory) {
                this.suppressNextInputHistory = false;
                return;
            }
            this.pushHistorySnapshot(this.captureEditorSnapshot());
        },
        transform(text, map) {
            return transformText(text, map);
        },
        async copyToClipboard(text, variantName = null, isEditor = false) {
            try {
                await navigator.clipboard.writeText(text);
                if (isEditor) {
                    this.editorCopied = true;
                    setTimeout(() => {
                        this.editorCopied = false;
                    }, 1500);
                } else {
                    this.copied = variantName;
                    setTimeout(() => {
                        this.copied = null;
                    }, 1500);
                }
            } catch (error) {
                console.error("Clipboard copy failed:", error);
            }
        },
        toggleTheme() {
            this.theme = this.theme === "dark" ? "light" : "dark";
            this.applyThemeClass();
            sessionStorage.setItem("theme", this.theme);
        },
        normalizeToPlain(text) {
            return normalizeToPlainText(text);
        },
        resetFormatting() {
            this.applyTransformToAllEditorText((text) => this.normalizeToPlain(text));
        },
        applyTransformToAllEditorText(transformer) {
            const textarea = this.$refs.editorTextarea;
            if (!textarea || typeof transformer !== "function") {
                return;
            }

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            this.suppressNextInputHistory = true;
            this.editor_input = transformer(textarea.value);
            textarea.value = this.editor_input;
            textarea.selectionStart = start;
            textarea.selectionEnd = end;
            textarea.focus();
            this.updateSelectionFromTextarea(textarea);
            this.pushHistorySnapshot(this.captureEditorSnapshot());
            this.suppressNextInputHistory = false;
        },
        applyTransformToEditor(transformer, applyOnAllWhenNoSelection = false) {
            const textarea = this.$refs.editorTextarea;
            if (!textarea || typeof transformer !== "function") {
                return;
            }

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const hasSelection = start !== end;

            if (!hasSelection && !applyOnAllWhenNoSelection) {
                return;
            }

            if (hasSelection) {
                const selected = textarea.value.slice(start, end);
                const newText = transformer(selected);
                const scrollTop = textarea.scrollTop;
                this.suppressNextInputHistory = true;
                textarea.setRangeText(newText, start, end, "end");
                this.editor_input = textarea.value;
                textarea.scrollTop = scrollTop;
                textarea.focus();
                this.updateSelectionFromTextarea(textarea);
                this.pushHistorySnapshot(this.captureEditorSnapshot());
                return;
            }

            const normalizedStart = textarea.selectionStart;
            const normalizedEnd = textarea.selectionEnd;
            this.suppressNextInputHistory = true;
            this.editor_input = transformer(textarea.value);
            textarea.value = this.editor_input;
            textarea.selectionStart = normalizedStart;
            textarea.selectionEnd = normalizedEnd;
            textarea.focus();
            this.updateSelectionFromTextarea(textarea);
            this.pushHistorySnapshot(this.captureEditorSnapshot());
            this.suppressNextInputHistory = false;
        },
        replaceSelection(styleName = null, applyOnAllWhenNoSelection = false) {
            this.applyTransformToEditor((text) => {
                const normalized = this.normalizeToPlain(text);
                return styleName ? this.transform(normalized, this.variants[styleName]) : normalized;
            }, applyOnAllWhenNoSelection);
        },
        applyStyleToSelection(styleName) {
            this.replaceSelection(styleName);
        },
        applyStyleShortcut(styleName, applyOnAllWhenNoSelection = false) {
            this.applyTransformToEditor((text) => {
                const normalized = this.normalizeToPlain(text);
                return this.transform(normalized, this.variants[styleName]);
            }, applyOnAllWhenNoSelection);
        },
        removeFormatFromSelection() {
            this.replaceSelection(null, true);
        },
        replaceCurlyQuotesInEditor() {
            this.applyTransformToEditor((text) => replaceCurlyQuotes(text), true);
        },
        cleanMarkdownInEditor() {
            this.applyTransformToEditor((text) => cleanMarkdownText(text), true);
        },
        applyCasePreset(presetName) {
            const preset = this.casePresets[presetName];
            if (!preset) {
                return;
            }
            this.applyTransformToEditor((text) => applyCasePresetToText(text, presetName), true);
        }
    }
}).mount("#app");
