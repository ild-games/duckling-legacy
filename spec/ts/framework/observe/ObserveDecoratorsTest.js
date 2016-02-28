import {makeSimpleObservableTree} from '../../../helpers/ObservableTestHelpers';

describe("The Observe Decorators", function() {
    beforeEach(function() {
        this.callback = jasmine.createSpy("callback");
        this.obja = makeSimpleObservableTree(4);
        this.obja.addChangeListener(this.callback);
    });
    describe("changing a primitive value", function() {
        beforeEach(function() {
            this.obja.stringValue = "Bubble";
        });
        it("triggers one event", function() {
            expect(this.callback.calls.count()).toEqual(1);
        });
        it("updates the value", function() {
            expect(this.obja.stringValue).toEqual("Bubble");
        });
    });
    describe("changing a object value", function() {
        beforeEach(function() {
            this.oldchild = this.obja.child;
            this.newchild = new makeSimpleObservableTree(3);
            this.obja.child = this.newchild;
        });
        it("triggers one event", function() {
            expect(this.callback.calls.count()).toEqual(1);
        });
        it("updates the value", function() {
            expect(this.obja.child).toBe(this.newchild);
            expect(this.obja.child).not.toBe(this.oldchild);
        });
    });
    describe("changing a child's primitive value", function() {
        beforeEach(function() {
            this.obja.child.stringValue = "Bubble";
        });
        it("triggers one event", function() {
            expect(this.callback.calls.count()).toEqual(1);
        });
        it("updates the value", function() {
            expect(this.obja.child.stringValue).toEqual("Bubble");
        });
    });
    describe("changing a child's object value", function() {
        beforeEach(function() {
            this.oldchild = this.obja.child.child;
            this.newchild = new makeSimpleObservableTree(2);
            this.obja.child.child = this.newchild;
        });
        it("triggers one event", function() {
            expect(this.callback.calls.count()).toEqual(1);
        });
        it("updates the value", function() {
            expect(this.obja.child.child).toBe(this.newchild);
            expect(this.obja.child.child).not.toBe(this.oldchild);
        });
    });
});
