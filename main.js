const { createApp } = Vue;

function addDigits(map, start) {
    const digits = '0123456789';
    for (let i = 0; i < 10; i++) {
        map[digits[i]] = String.fromCodePoint(start + i);
    }
    return map;
}

function genMap(upperStart, lowerStart) {
    const map = {};
    for (let i = 0; i < 26; i++) {
        map[String.fromCharCode(65 + i)] = String.fromCodePoint(upperStart + i);
        map[String.fromCharCode(97 + i)] = String.fromCodePoint(lowerStart + i);
    }
    return map;
}

function genBubbleMap() {
    const map = {};
    const upperStart = 0x24B6; // Ⓐ
    const lowerStart = 0x24D0; // ⓐ
    for (let i = 0; i < 26; i++) {
        map[String.fromCharCode(65 + i)] = String.fromCodePoint(upperStart + i);
        map[String.fromCharCode(97 + i)] = String.fromCodePoint(lowerStart + i);
    }
    const digits = '0123456789';
    const bubbles = ['⓪','①','②','③','④','⑤','⑥','⑦','⑧','⑨'];
    digits.split('').forEach((d, i) => (map[d] = bubbles[i]));
    return map;
}

function genDarkBubbleMap() {
    const map = {};
    const upperStart = 0x1F150; // 🅐
    for (let i = 0; i < 26; i++) {
        const char = String.fromCodePoint(upperStart + i);
        map[String.fromCharCode(65 + i)] = char;
        map[String.fromCharCode(97 + i)] = char;
    }
    const digits = ['①','②','③','④','⑤','⑥','⑦','⑧','⑨','⓪'];
    '0123456789'.split('').forEach((d, i) => (map[d] = digits[i]));
    return map;
}

const scriptMap = {
    A: '𝒜', B: 'ℬ', C: '𝒞', D: '𝒟', E: 'ℰ', F: 'ℱ', G: '𝒢',
    H: 'ℋ', I: 'ℐ', J: '𝒥', K: '𝒦', L: 'ℒ', M: 'ℳ', N: '𝒩',
    O: '𝒪', P: '𝒫', Q: '𝒬', R: 'ℛ', S: '𝒮', T: '𝒯', U: '𝒰',
    V: '𝒱', W: '𝒲', X: '𝒳', Y: '𝒴', Z: '𝒵',
    a: '𝒶', b: '𝒷', c: '𝒸', d: '𝒹', e: 'ℯ', f: '𝒻', g: 'ℊ',
    h: '𝒽', i: '𝒾', j: '𝒿', k: '𝓀', l: '𝓁', m: '𝓂', n: '𝓃',
    o: '𝓸', p: '𝓅', q: '𝓆', r: '𝓇', s: '𝓈', t: '𝓉', u: '𝓊',
    v: '𝓋', w: '𝓌', x: '𝓍', y: '𝓎', z: '𝓏'
};

createApp({
    data() {
        return {
            input: '',
            editor_input: '',
            activeFormat: null,
            copied: null,
            editorCopied: false,
            theme: sessionStorage.getItem('theme') || 'light',
            active_tab: 'formatter',
            previewText: 'AaBb',
            variants: {
                'Bold (Serif)': addDigits(genMap(0x1D400, 0x1D41A), 0x1D7CE),
                'Italic (Serif)': Object.assign(genMap(0x1D434, 0x1D44E), { h: 'ℎ' }), // no italic digits exist
                'Bold Italic (Serif)': genMap(0x1D468, 0x1D482), // no digits exist here either
                'Bold (Sans)': addDigits(genMap(0x1D5D4, 0x1D5EE), 0x1D7EC),
                'Italic (Sans)': genMap(0x1D608, 0x1D622), // no italic sans digits exist
                'Bold Italic (Sans)': genMap(0x1D63C, 0x1D656), // no digits exist
                'Double-Struck': {
                    A: '𝔸', B: '𝔹', C: 'ℂ', D: '𝔻', E: '𝔼', F: '𝔽', G: '𝔾',
                    H: 'ℍ', I: '𝕀', J: '𝕁', K: '𝕂', L: '𝕃', M: '𝕄', N: 'ℕ',
                    O: '𝕆', P: 'ℙ', Q: 'ℚ', R: 'ℝ', S: '𝕊', T: '𝕋', U: '𝕌',
                    V: '𝕍', W: '𝕎', X: '𝕏', Y: '𝕐', Z: 'ℤ',

                    a: '𝕒', b: '𝕓', c: '𝕔', d: '𝕕', e: '𝕖', f: '𝕗', g: '𝕘',
                    h: '𝕙', i: '𝕚', j: '𝕛', k: '𝕜', l: '𝕝', m: '𝕞', n: '𝕟',
                    o: '𝕠', p: '𝕡', q: '𝕢', r: '𝕣', s: '𝕤', t: '𝕥', u: '𝕦',
                    v: '𝕧', w: '𝕨', x: '𝕩', y: '𝕪', z: '𝕫',

                    '0': '𝟘', '1': '𝟙', '2': '𝟚', '3': '𝟛', '4': '𝟜',
                    '5': '𝟝', '6': '𝟞', '7': '𝟟', '8': '𝟠', '9': '𝟡'
                },
                'Monospace': addDigits(genMap(0x1D670, 0x1D68A), 0x1D7F6),
                'Sans Serif': addDigits(genMap(0x1D5A0, 0x1D5BA), 0x1D7E2),
                'Script (Cursive)': Object.assign({}, scriptMap), // no script digits exist
                'Bold Script': genMap(0x1D4D0, 0x1D4EA), // no digits exist
                'Bubble': genBubbleMap(),
                'Dark Bubble': genDarkBubbleMap(),
            },
        };
    },
    mounted() {
        document.body.classList.toggle('dark', this.theme === 'dark');
    },
    methods: {

        toggleFormat(name) {
            this.activeFormat = this.activeFormat === name ? null : name;
        },
        handleTyping(e) {
            if (!this.activeFormat) return;
            const textarea = e.target;
            const pos = textarea.selectionStart;
            const char = this.editor_input.charAt(pos - 1);
            const transformed = this.transform(char, this.variants[this.activeFormat]);
            if (char !== transformed) {
            this.editor_input =
                this.editor_input.slice(0, pos - 1) + transformed + this.editor_input.slice(pos);
            textarea.selectionStart = textarea.selectionEnd = pos;
            }
        },
        transform(text, map) {
            return text.split('').map(ch => map[ch] || ch).join('');
        },
        async copyToClipboard(text, variantName = null, isEditor = false) {
            try {
                await navigator.clipboard.writeText(text);
                if (isEditor) {
                    this.editorCopied = true;
                    setTimeout(() => (this.editorCopied = false), 1500);
                } else {
                    this.copied = variantName;
                    setTimeout(() => (this.copied = null), 1500);
                }
            } catch (err) {
                console.error('Clipboard copy failed:', err);
            }
        },
        toggleTheme() {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            document.body.classList.toggle('dark', this.theme === 'dark');
            sessionStorage.setItem('theme', this.theme);
        },
        normalizeToPlain(text) {
            for (const map of Object.values(this.variants)) {
                for (const [plain, styled] of Object.entries(map)) {
                    if (styled) {
                        text = text.replaceAll(styled, plain);
                    }
                }
            }
            return text;
        },
        resetFormatting() {
            this.editor_input = this.normalizeToPlain(this.editor_input);
        },
        replaceSelection(styleName = null) {
            const textarea = document.querySelector('#text-editor-container textarea');
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            if (start === end) return;

            const selected = textarea.value.substring(start, end);
            const normalized = this.normalizeToPlain(selected);
            const newText = styleName ? this.transform(normalized, this.variants[styleName]) : normalized;

            const scrollTop = textarea.scrollTop;
            textarea.setRangeText(newText, start, end, 'end');
            this.editor_input = textarea.value;
            textarea.scrollTop = scrollTop;
            textarea.focus();
        },
        applyStyleToSelection(styleName) {
            this.replaceSelection(styleName);
        },
        removeFormatFromSelection() {
            this.replaceSelection();
        },


    }
}).mount('#app');
