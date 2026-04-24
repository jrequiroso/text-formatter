(function (root, factory) {
    const exported = factory();

    if (typeof module === "object" && module.exports) {
        module.exports = exported;
    }

    if (root) {
        root.TextFormatterCore = exported;
    }
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
    function addDigits(map, start) {
        const digits = "0123456789";
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
        const map = genMap(0x24b6, 0x24d0);
        const digitCodePoints = [0x24ea, 0x2460, 0x2461, 0x2462, 0x2463, 0x2464, 0x2465, 0x2466, 0x2467, 0x2468];
        "0123456789".split("").forEach((digit, index) => {
            map[digit] = String.fromCodePoint(digitCodePoints[index]);
        });
        return map;
    }

    function genDarkBubbleMap() {
        const map = {};
        const upperStart = 0x1f150;
        for (let i = 0; i < 26; i++) {
            const char = String.fromCodePoint(upperStart + i);
            map[String.fromCharCode(65 + i)] = char;
        }

        const digitCodePoints = [0x24ea, 0x2460, 0x2461, 0x2462, 0x2463, 0x2464, 0x2465, 0x2466, 0x2467, 0x2468];
        "0123456789".split("").forEach((digit, index) => {
            map[digit] = String.fromCodePoint(digitCodePoints[index]);
        });
        return map;
    }

    function genFullwidthMap() {
        const map = {};
        for (let code = 0x21; code <= 0x7e; code++) {
            const asciiChar = String.fromCharCode(code);
            map[asciiChar] = String.fromCodePoint(code + 0xfee0);
        }
        map[" "] = String.fromCodePoint(0x3000);
        return map;
    }

    function mapFromCodePoints(codePointsByChar) {
        const map = {};
        Object.entries(codePointsByChar).forEach(([char, cp]) => {
            map[char] = String.fromCodePoint(cp);
        });
        return map;
    }

    const scriptMap = mapFromCodePoints({
        A: 0x1d49c, B: 0x212c, C: 0x1d49e, D: 0x1d49f, E: 0x2130, F: 0x2131, G: 0x1d4a2,
        H: 0x210b, I: 0x2110, J: 0x1d4a5, K: 0x1d4a6, L: 0x2112, M: 0x2133, N: 0x1d4a9,
        O: 0x1d4aa, P: 0x1d4ab, Q: 0x1d4ac, R: 0x211b, S: 0x1d4ae, T: 0x1d4af, U: 0x1d4b0,
        V: 0x1d4b1, W: 0x1d4b2, X: 0x1d4b3, Y: 0x1d4b4, Z: 0x1d4b5,
        a: 0x1d4b6, b: 0x1d4b7, c: 0x1d4b8, d: 0x1d4b9, e: 0x212f, f: 0x1d4bb, g: 0x210a,
        h: 0x1d4bd, i: 0x1d4be, j: 0x1d4bf, k: 0x1d4c0, l: 0x1d4c1, m: 0x1d4c2, n: 0x1d4c3,
        o: 0x1d4c4, p: 0x1d4c5, q: 0x1d4c6, r: 0x1d4c7, s: 0x1d4c8, t: 0x1d4c9, u: 0x1d4ca,
        v: 0x1d4cb, w: 0x1d4cc, x: 0x1d4cd, y: 0x1d4ce, z: 0x1d4cf
    });

    const doubleStruckMap = mapFromCodePoints({
        A: 0x1d538, B: 0x1d539, C: 0x2102, D: 0x1d53b, E: 0x1d53c, F: 0x1d53d, G: 0x1d53e,
        H: 0x210d, I: 0x1d540, J: 0x1d541, K: 0x1d542, L: 0x1d543, M: 0x1d544, N: 0x2115,
        O: 0x1d546, P: 0x2119, Q: 0x211a, R: 0x211d, S: 0x1d54a, T: 0x1d54b, U: 0x1d54c,
        V: 0x1d54d, W: 0x1d54e, X: 0x1d54f, Y: 0x1d550, Z: 0x2124,
        a: 0x1d552, b: 0x1d553, c: 0x1d554, d: 0x1d555, e: 0x1d556, f: 0x1d557, g: 0x1d558,
        h: 0x1d559, i: 0x1d55a, j: 0x1d55b, k: 0x1d55c, l: 0x1d55d, m: 0x1d55e, n: 0x1d55f,
        o: 0x1d560, p: 0x1d561, q: 0x1d562, r: 0x1d563, s: 0x1d564, t: 0x1d565, u: 0x1d566,
        v: 0x1d567, w: 0x1d568, x: 0x1d569, y: 0x1d56a, z: 0x1d56b,
        "0": 0x1d7d8, "1": 0x1d7d9, "2": 0x1d7da, "3": 0x1d7db, "4": 0x1d7dc,
        "5": 0x1d7dd, "6": 0x1d7de, "7": 0x1d7df, "8": 0x1d7e0, "9": 0x1d7e1
    });

    const variants = Object.freeze({
        "Bold (Sans)": addDigits(genMap(0x1d5d4, 0x1d5ee), 0x1d7ec),
        "Italic (Sans)": genMap(0x1d608, 0x1d622),
        "Bold Italic (Sans)": genMap(0x1d63c, 0x1d656),
        "Bold (Serif)": addDigits(genMap(0x1d400, 0x1d41a), 0x1d7ce),
        "Italic (Serif)": Object.assign(genMap(0x1d434, 0x1d44e), { h: String.fromCodePoint(0x210e) }),
        "Bold Italic (Serif)": genMap(0x1d468, 0x1d482),
        "Double-Struck": doubleStruckMap,
        Monospace: addDigits(genMap(0x1d670, 0x1d68a), 0x1d7f6),
        "Sans Serif": addDigits(genMap(0x1d5a0, 0x1d5ba), 0x1d7e2),
        "Script (Cursive)": scriptMap,
        "Bold Script": genMap(0x1d4d0, 0x1d4ea),
        Fullwidth: genFullwidthMap(),
        Bubble: genBubbleMap(),
        "Dark Bubble": genDarkBubbleMap()
    });

    function buildVariantMetadata(allVariants) {
        const reverseMap = {};
        const styledCharIndex = {};

        Object.entries(allVariants).forEach(([variantName, map]) => {
            Object.entries(map).forEach(([plain, styled]) => {
                if (!styled) {
                    return;
                }

                if (reverseMap[styled] === undefined) {
                    reverseMap[styled] = plain;
                }

                if (!styledCharIndex[styled]) {
                    styledCharIndex[styled] = [];
                }

                styledCharIndex[styled].push({ plain, variantName });
            });
        });

        return { reverseMap, styledCharIndex };
    }

    function wordsFromText(text) {
        return text
            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
            .replace(/[_-]+/g, " ")
            .split(/[^A-Za-z0-9]+/)
            .filter(Boolean);
    }

    function toTitleCase(text) {
        return text
            .toLowerCase()
            .replace(/\b([a-z])([a-z0-9]*)/g, function (_, first, rest) {
                return first.toUpperCase() + rest;
            });
    }

    function toSentenceCase(text) {
        const lower = text.toLowerCase();
        return lower.replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, function (match) {
            return match.toUpperCase();
        });
    }

    function toCamelCase(text) {
        const words = wordsFromText(text).map(function (word) {
            return word.toLowerCase();
        });
        if (!words.length) {
            return "";
        }
        const first = words[0];
        const rest = words.slice(1);
        return first + rest.map(function (word) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join("");
    }

    function toPascalCase(text) {
        return wordsFromText(text)
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join("");
    }

    function toSnakeCase(text) {
        return wordsFromText(text).map(function (word) {
            return word.toLowerCase();
        }).join("_");
    }

    function toKebabCase(text) {
        return wordsFromText(text).map(function (word) {
            return word.toLowerCase();
        }).join("-");
    }

    function toConstantCase(text) {
        return wordsFromText(text).map(function (word) {
            return word.toUpperCase();
        }).join("_");
    }

    function toAlternatingCase(text) {
        let shouldUpper = false;
        return Array.from(text, function (ch) {
            if (!/[a-z]/i.test(ch)) {
                return ch;
            }
            shouldUpper = !shouldUpper;
            return shouldUpper ? ch.toLowerCase() : ch.toUpperCase();
        }).join("");
    }

    const casePresets = Object.freeze({
        "Title Case": toTitleCase,
        "Sentence case": toSentenceCase,
        lowercase: function (text) { return text.toLowerCase(); },
        UPPERCASE: function (text) { return text.toUpperCase(); },
        camelCase: toCamelCase,
        PascalCase: toPascalCase,
        snake_case: toSnakeCase,
        "kebab-case": toKebabCase,
        CONSTANT_CASE: toConstantCase,
        "alternating case (mOcKiNg)": toAlternatingCase
    });

    const variantMetadata = buildVariantMetadata(variants);

    function transformText(text, map) {
        if (!text || !map) {
            return text || "";
        }
        return Array.from(text, function (ch) {
            return map[ch] || ch;
        }).join("");
    }

    function normalizeToPlainText(text, reverseMap) {
        const activeReverseMap = reverseMap || variantMetadata.reverseMap;
        return Array.from(text || "", function (ch) {
            return activeReverseMap[ch] || ch;
        }).join("");
    }

    function replaceCurlyQuotes(text) {
        return (text || "")
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201c\u201d]/g, "\"");
    }

    function convertMarkdownEmphasis(text) {
        return (text || "")
            .replace(/(\*\*\*|___)(?=\S)([\s\S]*?\S)\1/g, function (_, marker, content) {
                return transformText(content, variants["Bold Italic (Sans)"]);
            })
            .replace(/(\*\*|__)(?=\S)([\s\S]*?\S)\1/g, function (_, marker, content) {
                return transformText(content, variants["Bold (Sans)"]);
            })
            .replace(/(\*|_)(?=\S)([^*_]*?\S)\1/g, function (_, marker, content) {
                return transformText(content, variants["Italic (Sans)"]);
            });
    }

    function cleanMarkdownText(text) {
        const cleaned = (text || "")
            .replace(/\r\n?/g, "\n")
            .replace(/(^|\n)```[^\n]*\n/g, "$1")
            .replace(/\n[ \t]{0,3}```[ \t]*(?=\n|$)/g, "")
            .replace(/^[ \t]{0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/gm, "")
            .replace(/^[ \t]{0,3}#{1,6}[ \t]+(.+)$/gm, function (_, heading) {
                return transformText(heading.replace(/[ \t]+#+[ \t]*$/, ""), variants["Bold (Sans)"]);
            })
            .replace(/^[ \t]{0,3}>[ \t]?/gm, "")
            .replace(/^[ \t]*[-*+][ \t]+\[[ xX]\][ \t]+/gm, "- ")
            .replace(/^[ \t]*[-*+][ \t]+/gm, "- ")
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1")
            .replace(/^[ \t]*\[[^\]]+\]:[ \t]+\S+.*$/gm, "")
            .replace(/`([^`\n]+)`/g, "$1")
            .replace(/~~([\s\S]*?)~~/g, "$1")
            .replace(/<((?:https?:\/\/|mailto:)[^>\s]+)>/g, "$1")
            .replace(/[ \t]+\n/g, "\n");

        return convertMarkdownEmphasis(cleaned);
    }

    function analyzeStyledText(text, reverseMap, styledCharIndex) {
        const activeReverseMap = reverseMap || variantMetadata.reverseMap;
        const activeStyledCharIndex = styledCharIndex || variantMetadata.styledCharIndex;
        const plainChars = [];
        const stylePerChar = [];

        Array.from(text || "", function (ch) {
            const plain = activeReverseMap[ch] || ch;
            plainChars.push(plain);

            const matches = activeStyledCharIndex[ch];
            if (!matches) {
                stylePerChar.push(null);
                return ch;
            }

            const exactMatches = matches.filter(function (entry) {
                return entry.plain === plain;
            });

            stylePerChar.push(exactMatches.length === 1 ? exactMatches[0].variantName : null);
            return ch;
        });

        return {
            plainChars: plainChars,
            plainText: plainChars.join(""),
            stylePerChar: stylePerChar
        };
    }

    function findUniformVariant(analysis) {
        const styles = new Set();

        analysis.plainChars.forEach(function (plain, index) {
            if (!/[A-Za-z0-9]/.test(plain)) {
                return;
            }

            const styleName = analysis.stylePerChar[index];
            styles.add(styleName || "__plain__");
        });

        if (styles.size !== 1 || styles.has("__plain__")) {
            return null;
        }

        return Array.from(styles)[0];
    }

    function reapplyStylesToCasePreset(resultText, analysis, allVariants) {
        const activeVariants = allVariants || variants;
        const resultChars = Array.from(resultText || "");

        if (resultChars.length === analysis.plainChars.length) {
            return resultChars.map(function (ch, index) {
                const styleName = analysis.stylePerChar[index];
                const map = styleName ? activeVariants[styleName] : null;
                return map && map[ch] ? map[ch] : ch;
            }).join("");
        }

        const uniformVariant = findUniformVariant(analysis);
        return uniformVariant ? transformText(resultText, activeVariants[uniformVariant]) : resultText;
    }

    function applyCasePresetToText(text, presetName, options) {
        const settings = options || {};
        const activeCasePresets = settings.casePresets || casePresets;
        const activeVariants = settings.variants || variants;
        const activeReverseMap = settings.reverseMap || variantMetadata.reverseMap;
        const activeStyledCharIndex = settings.styledCharIndex || variantMetadata.styledCharIndex;
        const preset = activeCasePresets[presetName];

        if (!preset) {
            return text || "";
        }

        const analysis = analyzeStyledText(text || "", activeReverseMap, activeStyledCharIndex);
        const transformed = preset(analysis.plainText);
        return reapplyStylesToCasePreset(transformed, analysis, activeVariants);
    }

    return {
        buildVariantMetadata: buildVariantMetadata,
        cleanMarkdownText: cleanMarkdownText,
        convertMarkdownEmphasis: convertMarkdownEmphasis,
        casePresets: casePresets,
        normalizeToPlainText: normalizeToPlainText,
        replaceCurlyQuotes: replaceCurlyQuotes,
        transformText: transformText,
        analyzeStyledText: analyzeStyledText,
        applyCasePresetToText: applyCasePresetToText,
        findUniformVariant: findUniformVariant,
        reapplyStylesToCasePreset: reapplyStylesToCasePreset,
        variantMetadata: variantMetadata,
        variants: variants
    };
}));
