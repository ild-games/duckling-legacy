import "reflect-metadata";
import "mocha";
import { expect } from "chai";

import { changeType, ChangeType } from "../../duckling/state";

describe("changeType", function() {
    it("returns Equal for two equivalent primitives", function() {
        expect(changeType("foo", "foo")).to.eql(ChangeType.Equal);
    });

    it("returns PrimitiveChange for two primitives of the same type", function() {
        expect(changeType("foo", "bar")).to.eql(ChangeType.PrimitiveChange);
    });

    it("returns PrimitiveChange for two primitives of different types", function() {
        expect(changeType("foo", 3)).to.eql(ChangeType.PrimitiveChange);
    });

    it("returns PrimitiveChange for a primitive and null", function() {
        expect(changeType(null, 3)).to.eql(ChangeType.PrimitiveChange);
    });

    it("returns ComplexChange for a primitive and an object", function() {
        expect(changeType("foo", { foo: 3 })).to.eql(ChangeType.ComplexChange);
    });

    it("returns ComplexChange for a null and an object", function() {
        expect(changeType(null, { foo: 3 })).to.eql(ChangeType.ComplexChange);
    });

    it("returns Equal for two empty objects", function() {
        expect(changeType({}, {})).to.eql(ChangeType.Equal);
    });

    it("returns Equal for two flat objects", function() {
        expect(changeType({ foo: 3, bar: 2 }, { foo: 3, bar: 2 })).to.eql(
            ChangeType.Equal
        );
    });

    it("returns PrimitiveChange for two flat objects with one differing key", function() {
        expect(changeType({ foo: 3, bar: 4 }, { foo: 3, bar: 2 })).to.eql(
            ChangeType.PrimitiveChange
        );
    });

    it("returns ComplexChange for two flat objects with two differing keys", function() {
        expect(changeType({ foo: 5, bar: 4 }, { foo: 3, bar: 2 })).to.eql(
            ChangeType.ComplexChange
        );
    });

    it("returns PrimitiveChange for two flat objects with a missing key", function() {
        expect(
            changeType({ foo: 3, bar: 2 }, { foo: 3, bar: 2, spam: 2 })
        ).to.eql(ChangeType.PrimitiveChange);
    });

    it("returns PrimitiveChange for two flat objects with an extra key", function() {
        expect(
            changeType({ foo: 3, bar: 2, spam: 2 }, { foo: 3, bar: 2 })
        ).to.eql(ChangeType.PrimitiveChange);
    });

    it("returns Equal for nested object", function() {
        expect(
            changeType(
                { foo: 3, bar: { cake: 1 } },
                { foo: 3, bar: { cake: 1 } }
            )
        ).to.eql(ChangeType.Equal);
    });

    it("returns PrimitiveChange for a nested prinmitive change", function() {
        expect(
            changeType(
                { foo: 3, bar: { cake: 1 } },
                { foo: 3, bar: { cake: 3 } }
            )
        ).to.eql(ChangeType.PrimitiveChange);
    });

    it("returns PrimitiveChange for a nested missing key", function() {
        expect(
            changeType({ foo: 3, bar: { cake: 1 } }, { foo: 3, bar: {} })
        ).to.eql(ChangeType.PrimitiveChange);
    });

    it("returns ComplexChange for a nested complex change", function() {
        expect(
            changeType(
                { foo: 3, bar: { cake: 1 } },
                { foo: 3, bar: { train: 2 } }
            )
        ).to.eql(ChangeType.ComplexChange);
    });
});
