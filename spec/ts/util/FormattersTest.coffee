describe "Format To Title Case", ->
    it "Sentence with multiple words", ->
        testSentence = "Hello my name Is"
        expect(util.formatters.formatToTitleCase(testSentence)).toBe "Hello My Name Is"

    it "One word, lower case", ->
        testSentence = "i"
        expect(util.formatters.formatToTitleCase(testSentence)).toBe "I"

    it "One word, upper case", ->
        testSentence = "I"
        expect(util.formatters.formatToTitleCase(testSentence)).toBe "I"

    it "empty string", ->
        testSentence = ""
        expect(util.formatters.formatToTitleCase(testSentence)).toBe ""
