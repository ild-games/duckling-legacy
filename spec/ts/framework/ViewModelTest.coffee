describe "The ViewModel", ->
    beforeEach ->
        this.vm = new framework.ViewModel
        this.vm.logging = false
        this.callbackSpy = jasmine.createSpy("callbackSpy")
        this.obsa = new helpers.SimpleObservableA
        spyOn this.vm, "render"

    describe "set change listener", ->
        beforeEach ->
            this.vm.setChangeListener(this.obsa, this.callbackSpy)

        it "registers the callback for change events", ->
            this.obsa.stringValue = "NewFoo"
            expect(this.callbackSpy.calls.count()).toBe 1

        describe "calling destroy", ->
            beforeEach ->
                spyOn this.vm, "onDestroy"
                this.vm.destroy()

            it "calls onDestroy", ->
                expect(this.vm.onDestroy).toHaveBeenCalled()

            it "removes the callback from observed objects", ->
                this.obsa.stringValue = "NewFoo"
                expect(this.callbackSpy.calls.count()).toBe 0

            it "clears the array of observations", ->
                expect(this.vm.dataObservations.length).toBe 0
