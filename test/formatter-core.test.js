const test = require("node:test");
const assert = require("node:assert/strict");

const {
    analyzeStyledText,
    applyCasePresetToText,
    casePresets,
    findUniformVariant,
    normalizeToPlainText,
    transformText,
    variantMetadata,
    variants
} = require("../formatter-core.js");

test("transformText returns the original text when the map is missing", () => {
    assert.equal(transformText("Hello", null), "Hello");
    assert.equal(transformText("", variants["Bold (Sans)"]), "");
});

test("normalizeToPlainText round-trips common variants", () => {
    const bold = transformText("Hello 123", variants["Bold (Sans)"]);
    const monospace = transformText("Stack_42", variants.Monospace);

    assert.equal(normalizeToPlainText(bold), "Hello 123");
    assert.equal(normalizeToPlainText(monospace), "Stack_42");
});

test("Dark Bubble only styles uppercase letters and digits to avoid lossy normalization", () => {
    const darkBubble = variants["Dark Bubble"];

    assert.equal(transformText("ABC123", darkBubble), "🅐🅑🅒①②③");
    assert.equal(transformText("abc123", darkBubble), "abc①②③");
    assert.equal(normalizeToPlainText("🅐🅑🅒①②③"), "ABC123");
});

test("case presets work on uniformly styled text and preserve the style on happy paths", () => {
    const bold = variants["Bold (Sans)"];
    const styled = transformText("Hello World", bold);

    const snake = applyCasePresetToText(styled, "snake_case");
    const camel = applyCasePresetToText(styled, "camelCase");

    assert.equal(normalizeToPlainText(snake), "hello_world");
    assert.equal(normalizeToPlainText(camel), "helloWorld");
    assert.equal(snake, transformText("hello_world", bold));
    assert.equal(camel, transformText("helloWorld", bold));
});

test("length-preserving case presets keep mixed style positions intact", () => {
    const bold = variants["Bold (Sans)"];
    const mixed = transformText("Hello", bold) + " world";

    const snake = applyCasePresetToText(mixed, "snake_case");

    assert.equal(normalizeToPlainText(snake), "hello_world");
    assert.equal(snake, transformText("hello", bold) + "_world");
});

test("length-changing case presets do not over-style mixed input on unhappy paths", () => {
    const italic = variants["Italic (Sans)"];
    const mixed = transformText("hello", italic) + " world test";

    const camel = applyCasePresetToText(mixed, "camelCase");

    assert.equal(normalizeToPlainText(camel), "helloWorldTest");
    assert.equal(camel, "helloWorldTest");
});

test("unknown case presets fail safely and return the original text", () => {
    const input = transformText("Hello", variants["Bold (Sans)"]);

    assert.equal(applyCasePresetToText(input, "not-a-real-preset"), input);
    assert.equal(applyCasePresetToText("", "not-a-real-preset"), "");
});

test("analyzeStyledText and findUniformVariant distinguish styled and plain unhappy paths", () => {
    const italic = variants["Italic (Sans)"];
    const styled = transformText("hello world", italic);
    const mixed = transformText("hello", italic) + " world";

    const styledAnalysis = analyzeStyledText(styled, variantMetadata.reverseMap, variantMetadata.styledCharIndex);
    const mixedAnalysis = analyzeStyledText(mixed, variantMetadata.reverseMap, variantMetadata.styledCharIndex);

    assert.equal(styledAnalysis.plainText, "hello world");
    assert.equal(findUniformVariant(styledAnalysis), "Italic (Sans)");
    assert.equal(findUniformVariant(mixedAnalysis), null);
    assert.equal(casePresets["snake_case"](styledAnalysis.plainText), "hello_world");
});
