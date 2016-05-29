import 'reflect-metadata';

import {toTitleCase} from '../../duckling/util';

describe("string utils", function() {
    describe("toTitleCase", function() {
        it("doesn't change an already title case string", function() {
            var testString = "Test";
            expect(toTitleCase(testString)).toBe(testString);
        });

        it("changes the first character to a capital if it's lowercase", function() {
            expect(toTitleCase("test")).toBe("Test");
        });

        it("changes the characters that aren't first to lowercase", function() {
            expect(toTitleCase("TEST")).toBe("Test");
        });
    });
});
