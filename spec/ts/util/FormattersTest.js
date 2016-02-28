import {formatToTitleCase} from 'ts/util/Formatters';
describe("Format To Title Case", function() {
    it("Sentence with multiple words", function() {
        var testSentence;
        testSentence = "Hello my name Is";
        expect(formatToTitleCase(testSentence)).toBe("Hello My Name Is");
    });
    it("One word, lower case", function() {
        var testSentence;
        testSentence = "i";
        expect(formatToTitleCase(testSentence)).toBe("I");
    });
    it("One word, upper case", function() {
        var testSentence;
        testSentence = "I";
        expect(formatToTitleCase(testSentence)).toBe("I");
    });
    return it("empty string", function() {
        var testSentence;
        testSentence = "";
        expect(formatToTitleCase(testSentence)).toBe("");
    });
});
