describe "The Observe Decorators", ->
    beforeEach ->
        this.callback = jasmine.createSpy "callback"
        this.obja = helpers.makeSimpleObservableTree(4)
        this.obja.addChangeListener this.callback

    describe "changing a primitive value", ->
        beforeEach ->
            this.obja.stringValue = "Bubble"

        it "triggers one event", ->
            expect(this.callback.calls.count()).toEqual 1

        it "updates the value", ->
            expect(this.obja.stringValue).toEqual "Bubble"

    describe "changing a object value", ->
        beforeEach ->
            this.oldchild = this.obja.child
            this.newchild = new helpers.makeSimpleObservableTree(3)
            this.obja.child = this.newchild

        it "triggers one event", ->
            expect(this.callback.calls.count()).toEqual 1

        it "updates the value", ->
            expect(this.obja.child).toBe this.newchild
            expect(this.obja.child).not.toBe this.oldchild

    describe "changing a child's primitive value", ->
        beforeEach ->
            this.obja.child.stringValue = "Bubble"

        it "triggers one event", ->
            expect(this.callback.calls.count()).toEqual 1

        it "updates the value", ->
            expect(this.obja.child.stringValue).toEqual "Bubble"

    describe "changing a child's object value", ->
        beforeEach ->
            this.oldchild = this.obja.child.child
            this.newchild = new helpers.makeSimpleObservableTree(2)
            this.obja.child.child = this.newchild

        it "triggers one event", ->
            expect(this.callback.calls.count()).toEqual 1

        it "updates the value", ->
            expect(this.obja.child.child).toBe this.newchild
            expect(this.obja.child.child).not.toBe this.oldchild
