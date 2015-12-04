addObjectTest = ->
    it "triggers one event", ->
        expect(this.callback.calls.count()).toEqual 1

    it "the event is for adding an object", ->
        event = this.callback.calls.mostRecent().args[0]
        expect(event.isItemRemoved).toBe false
        expect(event.isItemAdded).toBe true
        expect(event.isItemChanged).toBe false

mutateChildTests = ->
    describe "changing the objects primitive value", ->
        beforeEach ->
            this.obja.stringValue = "Balloon"
            this.event = this.callback.calls.mostRecent().args[0]

        resultsInChildChanged()

        it "results in updating the value", ->
            expect(this.obja.stringValue).toEqual "Balloon"

    describe "changing the objects child value", ->
        beforeEach ->
            this.newchild = new helpers.SimpleObservableA
            this.oldchild = this.obja.child
            this.newchild.stringValue = "NewGuy"
            this.obja.child = this.newchild
            this.event = this.callback.calls.mostRecent().args[0]

        resultsInChildChanged()

        it "results in updating the value", ->
            expect(this.obja.child).toBe this.newchild
            expect(this.obja.child).not.toBe this.oldchild

    describe "chaning the child's child's primitive value", ->
        beforeEach ->
            this.obja.child.stringValue = "Balloon"
            this.event = this.callback.calls.mostRecent().args[0]

        resultsInChildChanged()

        it "results in updating the value", ->
            expect(this.obja.child.stringValue).toEqual "Balloon"

    describe "changing the child's child's object value", ->
        beforeEach ->
            this.newchild = new helpers.SimpleObservableA
            this.oldchild = this.obja.child.child
            this.newchild.stringValue = "NewGuy"
            this.obja.child.child = this.newchild
            this.event = this.callback.calls.mostRecent().args[0]

        resultsInChildChanged()

        it "results in updating the value", ->
            expect(this.obja.child.child).toBe this.newchild
            expect(this.obja.child.child).not.toBe this.oldchild

resultsInChildChanged = ->
    it "triggers one event", ->
        expect(this.callback.calls.count()).toEqual 1

    it "the event is for changing an object", ->
        expect(this.event.isItemRemoved).toBe false
        expect(this.event.isItemAdded).toBe false
        expect(this.event.isItemChanged).toBe true

testCollection = (collectionName, createCollection, addObject, removeObject) ->
    describe "The #{collectionName}", ->
        beforeEach ->
            this.collection = createCollection()
            this.callback = jasmine.createSpy "callback"

        describe "when empty", ->
            beforeEach -> this.collection.addChangeListener this.callback

            it "does not trigger an event if nothing is done to it", ->
                expect(this.callback).not.toHaveBeenCalled()

            describe "adding an object", ->
                beforeEach ->
                    this.obja = new helpers.SimpleObservableA
                    addObject.call(this, this.obja)
                addObjectTest()

        describe "with one object", ->
            beforeEach ->
                this.obja = helpers.makeSimpleObservableTree(4)
                addObject.call(this, this.obja)
                this.collection.addChangeListener(this.callback)

            describe "removing the object", ->
                beforeEach ->
                    removeObject.call(this)

                it "triggers one event", ->
                    expect(this.callback.calls.count()).toEqual 1

                it "the event is for removing an object", ->
                    event = this.callback.calls.mostRecent().args[0]
                    expect(event.isItemRemoved).toBe true
                    expect(event.isItemAdded).toBe false
                    expect(event.isItemChanged).toBe false

            mutateChildTests()

mapCreate = -> new framework.observe.ObservableMap()
mapAddVal = (value) -> this.collection.put "a", value
mapRemoveVal = -> this.collection.remove("a")
testCollection "ObservableMap", mapCreate, mapAddVal, mapRemoveVal

mapCreate = -> new framework.observe.ObservableArray()
mapAddVal = (value) -> this.collection.push value
mapRemoveVal = -> this.collection.popBack()
testCollection "ObservableArray", mapCreate, mapAddVal, mapRemoveVal

###
describe "The ObservableMap", ->
    beforeEach ->
        this.collection = new framework.observe.ObservableMap()
        this.callback = jasmine.createSpy "callback"

    describe "when empty", ->
        beforeEach -> this.collection.addChangeListener this.callback

        it "does not trigger an event if nothing is done to it", ->
            expect(this.callback).not.toHaveBeenCalled()

        describe "adding an object", ->
            beforeEach ->
                this.obja = new helpers.SimpleObservableA
                this.collection.put "a", this.obja
            addObjectTest()

    describe "with one object", ->
        beforeEach ->
            this.obja = helpers.makeSimpleObservableTree(4)
            this.collection.put "a", this.obja
            this.collection.addChangeListener(this.callback)

        describe "removing the object", ->
            beforeEach ->
                this.collection.remove("a")

            it "triggers one event", ->
                expect(this.callback.calls.count()).toEqual 1

            it "the event is for removing an object", ->
                event = this.callback.calls.mostRecent().args[0]
                expect(event.isItemRemoved).toBe true
                expect(event.isItemAdded).toBe false
                expect(event.isItemChanged).toBe false

        mutateChildTests()
###
