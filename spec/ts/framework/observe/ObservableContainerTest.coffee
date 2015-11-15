describe "The ObservableMap", ->
    beforeEach ->
        this.map = new framework.observe.ObservableMap()
        this.callback = jasmine.createSpy "callback"

    describe "when empty", ->
        beforeEach -> this.map.addChangeListener this.callback

        it "does not trigger an event if nothing is done to it", ->
            expect(this.callback).not.toHaveBeenCalled()

        describe "adding an object", ->
            beforeEach ->
                this.obja = new helpers.SimpleObservableA
                this.map.put "a", this.obja

            it "triggers one event", ->
                expect(this.callback.calls.count()).toEqual 1

            it "the event is for adding an object", ->
                event = this.callback.calls.mostRecent().args[0]
                expect(event.isItemRemoved).toBe false
                expect(event.isItemAdded).toBe true
                expect(event.isItemChanged).toBe false

    describe "with one object", ->
        beforeEach ->
            this.obja = helpers.makeSimpleObservableTree(4)
            this.map.put "a", this.obja
            this.map.addChangeListener(this.callback)

        resultsInChildChanged = ->
            it "triggers one event", ->
                expect(this.callback.calls.count()).toEqual 1

            it "the event is for changing an object", ->
                expect(this.event.isItemRemoved).toBe false
                expect(this.event.isItemAdded).toBe false
                expect(this.event.isItemChanged).toBe true

        describe "removing the object", ->
            beforeEach ->
                this.map.remove("a")

            it "triggers one event", ->
                expect(this.callback.calls.count()).toEqual 1

            it "the event is for removing an object", ->
                event = this.callback.calls.mostRecent().args[0]
                expect(event.isItemRemoved).toBe true
                expect(event.isItemAdded).toBe false
                expect(event.isItemChanged).toBe false

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
