import 'mocha';
import {expect} from 'chai';
import "reflect-metadata";

import {compareVersions, VersionCompatibility, MAP_VERSION} from '../duckling/version';

describe("compareVersions", function() {
    it("throws an error for a blank version", function() {
        expect(() => compareVersions("")).to.throw(Error);
    });

    it("throws an error for a version number without a major and minor number separated by a decimal point", function() {
        expect(() => compareVersions("1.")).to.throw(Error);
        expect(() => compareVersions(".1")).to.throw(Error);
        expect(() => compareVersions("1")).to.throw(Error);
        expect(() => compareVersions("1.1.1")).to.throw(Error);
    });

    it("throws an error for a version number that doesn't contain numbers", function() {
        expect(() => compareVersions("hello")).to.throw(Error);
        expect(() => compareVersions(".bad")).to.throw(Error);
        expect(() => compareVersions("super_bad.")).to.throw(Error);
        expect(() => compareVersions("why.are")).to.throw(Error);
        expect(() => compareVersions("why.are.you.doing.this")).to.throw(Error);
    });

    it("uses MAP_VERSION if no version was supplied", function() {
        let compatible = compareVersions(MAP_VERSION);
        expect(compatible).to.eql(VersionCompatibility.Compatible);
    });

    it("Returns incompatible if major versions mismatch", function() {
        let compatible = compareVersions("1.0", "2.0");
        expect(compatible).to.eql(VersionCompatibility.MajorIncompatible);
        compatible = compareVersions("3.0", "2.0");
        expect(compatible).to.eql(VersionCompatibility.MajorIncompatible);
    });

    it("Returns incompatible if minor version of actual is greater than expected", function() {
        let compatible = compareVersions("1.1", "1.0");
        expect(compatible).to.eql(VersionCompatibility.MinorIncompatible);
    });

    it("Prioritizes a major incompatibility if both major and minor versions are incompatible", function() {
        let compatible = compareVersions("2.1", "1.0");
        expect(compatible).to.eql(VersionCompatibility.MajorIncompatible);
    });

    it("Returns compatible for valid versions", function() {
        let compatible = compareVersions("2.1", "2.1");
        expect(compatible).to.eql(VersionCompatibility.Compatible);
        compatible = compareVersions("2.1", "2.2");
        expect(compatible).to.eql(VersionCompatibility.Compatible);
    });
});
