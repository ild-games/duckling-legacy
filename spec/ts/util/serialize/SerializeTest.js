import {createInvalidJSONError, deserialize} from 'ts/util/serialize/Serializer'
import {ObservableMap} from 'ts/framework/observe/ObservableMap';
import {SimpleObservableA} from '../../../helpers/ObservableTestHelpers';
import {ObservableTypedRoot} from '../../../helpers/SerializationTestHelpers';

var jsonFrom = JSON.stringify;

function fromObject(root, object) {
    return deserialize(jsonFrom(object), root);
};

function fromEmpty(root) {
    return fromObject(root, {});
};

function testUnsettable(fieldName, typeName, value) {
    it("throws an error when replaced with a " + typeName, function() {
        var error;
        error = createInvalidJSONError("__root__." + fieldName, value, this.root[fieldName]);
        expect(() => {
            var testObject = {};
            testObject[fieldName] = value;
            fromObject(this.root, testObject);
        }).toThrow(error);
    });
};

function testTakeJSON(fieldName, typeName, value) {
    it("takes a " + typeName + " provided by the json object", function() {
        var obj, result;
        obj = {};
        obj[fieldName] = value;
        result = fromObject(this.root, obj);
        expect(result[fieldName]).toEqual(value);
    });
};

describe("Deserialize", function() {
    describe("with no root", function() {
        var testDeserialize;
        testDeserialize = function(typeName, typeValue) {
            it("can deserialize an object containing " + typeName, function() {
                var result;
                result = deserialize(jsonFrom({
                    val: typeValue
                }));
                expect(result).toBeTruthy();
                expect(result.val).toEqual(typeValue);
            });
        };
        testDeserialize("null", null);
        testDeserialize("a primitive", 3);
        testDeserialize("an object", {
            isa: "string"
        });
        testDeserialize("an array", [32, 41, 42]);
    });
    describe("with a simple observable root", function() {
        var testCompletelyUnsettable;
        beforeEach(function() {
            this.root = new ObservableTypedRoot();
        });
        describe("a typed object property", function() {
            beforeEach(function() {
                this.ogChild = this.root.object;
                this.ogChild.stringValue = "Bubble";
            });
            it("original value is preserved if missing from the json", function() {
                var result;
                result = fromEmpty(this.root);
                expect(result.object).toBe(this.ogChild);
                expect(result.object.stringValue).toBe("Bubble");
            });
            describe(" is initialized using a json object", function() {
                beforeEach(function() {
                    this.result = fromObject(this.root, {
                        object: {
                            stringValue: "Boom"
                        }
                    });
                });
                it("is used as the base for the json object", function() {
                    expect(this.result.object).toBe(this.ogChild);
                });
                it("contains the value from the json object", function() {
                    expect(this.result.object.stringValue).toEqual("Boom");
                });
            });
            testTakeJSON("object", "null", null);
            testUnsettable("object", "primitive", 3);
            testUnsettable("object", "array", [1, 2, 3]);
        });
        describe("a typed array property", function() {
            beforeEach(function() {
                this.ogChild = this.root.array;
            });
            it("original value is preserved if missing from the json", function() {
                var result;
                result = fromEmpty(this.root);
                expect(result.array).toBe(this.ogChild);
                expect(result.array).toEqual([1, 2, 3, 4]);
            });
            it("takes an array provided by the json object", function() {
                var result;
                result = fromObject(this.root, {
                    array: [42, 41]
                });
                expect(result.array).toEqual([42, 41]);
            });
            it("is replaced by null", function() {
                var result;
                result = fromObject(this.root, {
                    array: null
                });
                expect(result.array).toBe(null);
            });
            testUnsettable("array", "primitive", 3);
            testUnsettable("array", "object", {
                isa: "string"
            });
        });
        describe("a typed null property", function() {
            beforeEach(function() {
                this.ogChild = this.root.nill;
            });
            it("original value is preserved if missing from the json", function() {
                var result;
                result = fromEmpty(this.root);
                expect(result.nill).toEqual(null);
            });
            testTakeJSON("nill", "array", [42, 41]);
            testTakeJSON("nill", "null", null);
            testTakeJSON("nill", "object", {
                1: 1,
                2: 2,
                3: 3
            });
            testUnsettable("nill", "primitive", 3);
        });
        describe("a typed primitive property", function() {
            testUnsettable("primitive", "object", {
                ima: "string"
            });
            testUnsettable("primitive", "array", {
                array: [12, 42]
            });
            testUnsettable("primitive", "null", null);
            testTakeJSON("primitive", "primitive", 3);
        });
        testCompletelyUnsettable = function(fieldName, fieldType) {
            describe("a typed " + fieldType + " property", function() {
                var testSet;
                testSet = function(typeName, value) {
                    testUnsettable(fieldName, typeName, value);
                };
                testSet("object", {
                    ima: "string"
                });
                testSet("array", [32, 42]);
                testSet("null", null);
                testSet("primitive", 7);
            });
        };
        testCompletelyUnsettable("undef", "undefined");
        testCompletelyUnsettable("aMethod", "function");
    });
});

describe("an ObservableMap with a factory", function() {
    beforeEach(function() {
        this.root = new ObservableMap(function() {
            return new SimpleObservableA();
        });
    });
    describe("serializing a map with a single object", function() {
        beforeEach(function() {
            this.result = fromObject(this.root, {
                a: {
                    stringValue: "a"
                }
            });
        });
        it("It contains an element with the correct key", function() {
            expect(this.root.get("a")).toBeTruthy();
        });
        it("The element is of the right type", function() {
            expect(this.root.get("a").constructor).toBe(SimpleObservableA);
        });
        it("the element has been initialized", function() {
            expect(this.root.get("a").stringValue).toEqual("a");
        });
    });
});

describe("an ObservableMap with annotated types", function() {
    beforeEach(function() {
        this.root = new ObservableMap();
    });
    describe("serializing a map with a single object", function() {
        beforeEach(function() {
            this.result = fromObject(this.root, {
                a: {
                    __cpp_type: "helpers.SimpleObservableA",
                    stringValue: "a"
                }
            });
        });
        it("It contains an element with the correct key", function() {
            expect(this.root.get("a")).toBeTruthy();
        });
        it("The element is of the right type", function() {
            expect(this.root.get("a").constructor).toBe(SimpleObservableA);
        });
        it("the element has been initialized", function() {
            expect(this.root.get("a").stringValue).toEqual("a");
        });
    });
});

describe("a annotated object inside another object", function() {
    beforeEach(function() {
        this.result = deserialize(jsonFrom({
            child: {
                __cpp_type: "helpers.SimpleObservableA",
                stringValue: "whataguy"
            }
        }));
    });
    it("It contains an element with the correct key", function() {
        expect(this.result.child).toBeTruthy();
    });
    it("The element is of the right type", function() {
        expect(this.result.child.constructor).toBe(SimpleObservableA);
    });
    it("the element has been initialized", function() {
        expect(this.result.child.stringValue).toEqual("whataguy");
    });
});
