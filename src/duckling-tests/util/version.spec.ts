import "mocha";
import { expect } from "chai";
import "reflect-metadata";

import {
    compareVersions,
    versionCompareFunction,
    VersionCompatibility,
} from "../../duckling/util/version";

describe("compareVersions", function() {
    it("throws an error for a blank version", function() {
        expect(() => compareVersions("", "1.0")).to.throw(Error);
    });

    it("throws an error for a version number without a major and minor number separated by a decimal point", function() {
        expect(() => compareVersions("1.", "1.0")).to.throw(Error);
        expect(() => compareVersions(".1", "1.0")).to.throw(Error);
        expect(() => compareVersions("1", "1.0")).to.throw(Error);
        expect(() => compareVersions("1.1.1", "1.0")).to.throw(Error);
    });

    it("throws an error for a version number that doesn't contain numbers", function() {
        expect(() => compareVersions("hello", "1.0")).to.throw(Error);
        expect(() => compareVersions(".bad", "1.0")).to.throw(Error);
        expect(() => compareVersions("super_bad.", "1.0")).to.throw(Error);
        expect(() => compareVersions("why.are", "1.0")).to.throw(Error);
        expect(() => compareVersions("why.are.you.doing.this", "1.0")).to.throw(
            Error
        );
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

describe("versionCompareFunction", function() {
    it("Sorts an array of versions", function() {
        expect(
            ["4.1", "1.2", "2.0", "1.0", "4.1", "1.1", "4.5"].sort(
                versionCompareFunction
            )
        ).to.eql(["1.0", "1.1", "1.2", "2.0", "4.1", "4.1", "4.5"]);
    });
});
