const { createApp } = Vue;

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
            copied: null,
            editorCopied: false,
            theme: sessionStorage.getItem('theme') || 'light',
            active_tab: 'formatter',
            previewText: 'AaBb',
            variants: {
                'Bold (Serif)': genMap(0x1D400, 0x1D41A),
                'Italic (Serif)': Object.assign(genMap(0x1D434, 0x1D44E), { h: 'ℎ' }),
                'Bold Italic (Serif)': genMap(0x1D468, 0x1D482),
                'Bold (Sans)': genMap(0x1D5D4, 0x1D5EE),
                'Italic (Sans)': genMap(0x1D608, 0x1D622),
                'Bold Italic (Sans)': genMap(0x1D63C, 0x1D656),
                'Double-Struck': genMap(0x1D538, 0x1D552),
                'Monospace': genMap(0x1D670, 0x1D68A),
                'Sans Serif': genMap(0x1D5A0, 0x1D5BA),
                'Script (Cursive)': Object.assign({}, scriptMap),
                'Bold Script': genMap(0x1D4D0, 0x1D4EA),
                'Bubble': genBubbleMap(),
                'Dark Bubble': genDarkBubbleMap(),
            }
        };
    },
    mounted() {
        document.body.classList.toggle('dark', this.theme === 'dark');
    },
    methods: {
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
        applyStyleToSelection(styleName) {
            const textarea = document.querySelector('#text-editor-container textarea');
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            if (start === end) return; // nothing selected

            const before = this.editor_input.substring(0, start);
            const selected = this.editor_input.substring(start, end);
            const after = this.editor_input.substring(end);

            const styled = this.transform(selected, this.variants[styleName]);
            this.editor_input = before + styled + after;

            this.$nextTick(() => {
                textarea.focus();
                textarea.selectionStart = textarea.selectionEnd = start + styled.length;
            });
        }

    }
}).mount('#app');
