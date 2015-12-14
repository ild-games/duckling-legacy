serlib = util.serialize
jsonFrom = JSON.stringify
deserialize = serlib.deserialize
fromObject = (root, object) -> deserialize(jsonFrom(object), root)
fromEmpty = (root) -> fromObject root, {}

testUnsettable = (fieldName, typeName, value) ->
    it "throws an error when replaced with a #{typeName}", ->
        error = serlib.errors.createInvalidJSONError "__root__.#{fieldName}", value, this.root[fieldName]
        expect(=> fromObject this.root, "#{fieldName}" : value).toThrow(error)

testTakeJSON = (fieldName, typeName, value) ->
    it "takes a #{typeName} provided by the json object", ->
        result = fromObject this.root, "#{fieldName}" : value
        expect(result[fieldName]).toEqual value

describe "Deserialize", ->
    describe "with no root", ->
        testDeserialize = (typeName, typeValue) ->
            it "can deserialize an object containing #{typeName}", ->
                result = deserialize(jsonFrom val : typeValue)
                expect(result).toBeTruthy()
                expect(result.val).toEqual(typeValue)
        testDeserialize "null", null
        testDeserialize "a primitive", 3
        testDeserialize "an object", isa: "string"
        testDeserialize "an array", [32, 41, 42]

    describe "with a simple observable root", ->
        beforeEach ->
            this.root = new helpers.ObservableTypedRoot()

        describe "a typed object property", ->
            beforeEach ->
                this.ogChild = this.root.object;
                this.ogChild.stringValue = "Bubble"
            it "original value is preserved if missing from the json", ->
                result = fromEmpty(this.root)
                expect(result.object).toBe this.ogChild
                expect(result.object.stringValue).toBe "Bubble"
            describe " is initialized using a json object", ->
                beforeEach ->
                    this.result = fromObject(this.root, {object : { stringValue : "Boom"}})
                it "is used as the base for the json object", ->
                    expect(this.result.object).toBe this.ogChild
                it "contains the value from the json object", ->
                    expect(this.result.object.stringValue).toEqual "Boom"
            testTakeJSON "object", "null", null
            testUnsettable "object", "primitive", 3
            testUnsettable "object", "array", [1, 2, 3]

        describe "a typed array property", ->
            beforeEach ->
                this.ogChild = this.root.array;
            it "original value is preserved if missing from the json", ->
                result = fromEmpty(this.root)
                expect(result.array).toBe this.ogChild
                expect(result.array).toEqual [1,2,3,4]
            it "takes an array provided by the json object", ->
                result = fromObject this.root, array : [42,41]
                expect(result.array).toEqual [42, 41]
            it "is replaced by null", ->
                result = fromObject this.root, array : null
                expect(result.array).toBe null
            testUnsettable "array", "primitive", 3
            testUnsettable "array", "object", isa : "string"

        describe "a typed null property", ->
            beforeEach ->
                this.ogChild = this.root.nill;
            it "original value is preserved if missing from the json", ->
                result = fromEmpty(this.root)
                expect(result.nill).toEqual null

            testTakeJSON "nill", "array", [42, 41]
            testTakeJSON "nill", "null", null
            testTakeJSON "nill", "object", 1:1, 2:2, 3:3
            testUnsettable "nill", "primitive", 3

        describe "a typed primitive property", ->
            testUnsettable "primitive", "object", ima: "string"
            testUnsettable "primitive", "array", array: [12, 42]
            testUnsettable "primitive", "null", null
            testTakeJSON "primitive", "primitive", 3

        testCompletelyUnsettable = (fieldName, fieldType) ->
            describe "a typed #{fieldType} property", ->
                testSet = (typeName, value) -> testUnsettable fieldName, typeName, value
                testSet "object", ima : "string"
                testSet "array", [32, 42]
                testSet "null", null
                testSet "primitive", 7
        testCompletelyUnsettable "undef", "undefined"
        testCompletelyUnsettable "aMethod", "function"

describe "an ObservableMap with a factory", ->
    beforeEach ->
        this.root = new framework.observe.ObservableMap(-> new helpers.SimpleObservableA())
    describe "serializing a map with a single object", ->
        beforeEach ->
            this.result = fromObject(this.root, {
                    a : {
                        stringValue : "a"
                    }
                });
        it "It contains an element with the correct key", ->
            expect(this.root.get("a")).toBeTruthy()
        it "The element is of the right type", ->
            expect(this.root.get("a").constructor).toBe helpers.SimpleObservableA
        it "the element has been initialized", ->
            expect(this.root.get("a").stringValue).toEqual "a"

describe "an ObservableMap with annotated types", ->
        beforeEach ->
            this.root = new framework.observe.ObservableMap()
        describe "serializing a map with a single object", ->
            beforeEach ->
                this.result = fromObject(this.root, {
                        a : {
                            __cpp_type : "helpers.SimpleObservableA",
                            stringValue : "a"
                        }
                    });
            it "It contains an element with the correct key", ->
                expect(this.root.get("a")).toBeTruthy()
            it "The element is of the right type", ->
                expect(this.root.get("a").constructor).toBe helpers.SimpleObservableA
            it "the element has been initialized", ->
                expect(this.root.get("a").stringValue).toEqual "a"

describe "a annotated object inside another object", ->
    beforeEach ->
        this.result = deserialize (jsonFrom {
                child : {
                    __cpp_type : "helpers.SimpleObservableA",
                    stringValue : "whataguy"
                }
            })
    it "It contains an element with the correct key", ->
        expect(this.result.child).toBeTruthy()
    it "The element is of the right type", ->
        expect(this.result.child.constructor).toBe helpers.SimpleObservableA
    it "the element has been initialized", ->
        expect(this.result.child.stringValue).toEqual "whataguy"
