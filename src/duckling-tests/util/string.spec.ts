import 'reflect-metadata';
import 'mocha';
import {expect} from 'chai';

import {toTitleCase} from '../../duckling/util';

describe("string utils", function() {
    describe("toTitleCase", function() {
        it("doesn't change an already title case string", function() {
            var testString = "Test";
            expect(toTitleCase(testString)).to.eql(testString);
        });

        it("changes the first character to a capital if it's lowercase", function() {
            expect(toTitleCase("test")).to.eql("Test");
        });

        it("changes the characters that aren't first to lowercase", function() {
            expect(toTitleCase("TEST")).to.eql("Test");
        });
    });
});
