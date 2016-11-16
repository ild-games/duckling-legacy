import 'mocha';
import {expect} from 'chai';
import "reflect-metadata";

import {MAP_VERSION, majorMapVersion, minorMapVersion} from '../duckling/version';

describe("majorMapVersion", function() {
    it("throws an error for a blank version", function() {
        expect(() => majorMapVersion("")).to.throw(Error);
    });

    it("throws an error for a version number without a major and minor number separated by a decimal point", function() {
        expect(() => majorMapVersion("1.")).to.throw(Error);
        expect(() => majorMapVersion(".1")).to.throw(Error);
        expect(() => majorMapVersion("1")).to.throw(Error);
        expect(() => majorMapVersion("1.1.1")).to.throw(Error);
    });

    it("throws an error for a version number that doesn't contain numbers", function() {
        expect(() => majorMapVersion("hello")).to.throw(Error);
        expect(() => majorMapVersion(".bad")).to.throw(Error);
        expect(() => majorMapVersion("super_bad.")).to.throw(Error);
        expect(() => majorMapVersion("why.are")).to.throw(Error);
        expect(() => majorMapVersion("why.are.you.doing.this")).to.throw(Error);
    });

    it("returns 1 for 1.0", function() {
        let majorVersion = majorMapVersion("1.0");
        expect(majorVersion).to.eql("1");
    });

    it("uses MAP_VERSION if no version was supplied", function() {
        let majorVersion = majorMapVersion();
        expect(majorVersion).to.eql(MAP_VERSION.split(".")[0]);
    });
});

describe("minorMapVersion", function() {
    it("throws an error for a blank version", function() {
        expect(() => minorMapVersion("")).to.throw(Error);
    });

    it("throws an error for a version number without a major and minor number separated by a decimal point", function() {
        expect(() => minorMapVersion("1.")).to.throw(Error);
        expect(() => minorMapVersion(".1")).to.throw(Error);
        expect(() => minorMapVersion("1")).to.throw(Error);
        expect(() => minorMapVersion("1.1.1")).to.throw(Error);
    });

    it("throws an error for a version number that doesn't contain numbers", function() {
        expect(() => minorMapVersion("hello")).to.throw(Error);
        expect(() => minorMapVersion(".bad")).to.throw(Error);
        expect(() => minorMapVersion("super_bad.")).to.throw(Error);
        expect(() => minorMapVersion("why.are")).to.throw(Error);
        expect(() => minorMapVersion("why.are.you.doing.this")).to.throw(Error);
    });

    it("returns 0 for 1.0", function() {
        let minorVersion = minorMapVersion("1.0");
        expect(minorVersion).to.eql("0");
    });

    it("uses MAP_VERSION if no version was supplied", function() {
        let minorVersion = minorMapVersion();
        expect(minorVersion).to.eql(MAP_VERSION.split(".")[1]);
    });
});
