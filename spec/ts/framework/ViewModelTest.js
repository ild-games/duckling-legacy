import {SimpleObservableA} from '../../helpers/ObservableTestHelpers';
import ViewModel from 'ts/framework/ViewModel';

describe("The ViewModel", function() {
    beforeEach(function() {
        this.vm = new ViewModel;
        this.vm.logging = false;
        this.callbackSpy = jasmine.createSpy("callbackSpy");
        this.obsa = new SimpleObservableA;
        spyOn(this.vm, "render");
    });
    describe("set change listener", function() {
        beforeEach(function() {
            this.vm.setChangeListener(this.obsa, this.callbackSpy);
        });
        it("registers the callback for change events", function() {
            this.obsa.stringValue = "NewFoo";
            expect(this.callbackSpy.calls.count()).toBe(1);
        });
        describe("calling destroy", function() {
            beforeEach(function() {
                spyOn(this.vm, "onDestroy");
                this.vm.destroy();
            });
            it("calls onDestroy", function() {
                expect(this.vm.onDestroy).toHaveBeenCalled();
            });
            it("removes the callback from observed objects", function() {
                this.obsa.stringValue = "NewFoo";
                expect(this.callbackSpy.calls.count()).toBe(0);
            });
            it("clears the array of observations", function() {
                expect(this.vm.dataObservations.length).toBe(0);
            });
        });
    });
});
