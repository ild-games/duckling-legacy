import {ObservableMap} from 'ts/framework/observe/ObservableMap';
import {ObservableArray} from 'ts/framework/observe/ObservableArray';
import {makeSimpleObservableTree, SimpleObservableA} from '../../../helpers/ObservableTestHelpers';

function addObjectTest() {
    it("triggers one event", function() {
        expect(this.callback.calls.count()).toEqual(1);
    });
    it("the event is for adding an object", function() {
        var event;
        event = this.callback.calls.mostRecent().args[0];
        expect(event.isItemRemoved).toBe(false);
        expect(event.isItemAdded).toBe(true);
        expect(event.isItemChanged).toBe(false);
    });
};

function mutateChildTests() {
    describe("changing the objects primitive value", function() {
        beforeEach(function() {
            this.obja.stringValue = "Balloon";
            this.event = this.callback.calls.mostRecent().args[0];
        });
        resultsInChildChanged();
        it("results in updating the value", function() {
            expect(this.obja.stringValue).toEqual("Balloon");
        });
    });
    describe("changing the objects child value", function() {
        beforeEach(function() {
            this.newchild = new SimpleObservableA;
            this.oldchild = this.obja.child;
            this.newchild.stringValue = "NewGuy";
            this.obja.child = this.newchild;
            this.event = this.callback.calls.mostRecent().args[0];
        });
        resultsInChildChanged();
        it("results in updating the value", function() {
            expect(this.obja.child).toBe(this.newchild);
            expect(this.obja.child).not.toBe(this.oldchild);
        });
    });
    describe("chaning the child's child's primitive value", function() {
        beforeEach(function() {
            this.obja.child.stringValue = "Balloon";
            this.event = this.callback.calls.mostRecent().args[0];
        });
        resultsInChildChanged();
        it("results in updating the value", function() {
            expect(this.obja.child.stringValue).toEqual("Balloon");
        });
    });
    describe("changing the child's child's object value", function() {
        beforeEach(function() {
            this.newchild = new SimpleObservableA;
            this.oldchild = this.obja.child.child;
            this.newchild.stringValue = "NewGuy";
            this.obja.child.child = this.newchild;
            this.event = this.callback.calls.mostRecent().args[0];
        });
        resultsInChildChanged();
        it("results in updating the value", function() {
            expect(this.obja.child.child).toBe(this.newchild);
            expect(this.obja.child.child).not.toBe(this.oldchild);
        });
    });
};

function resultsInChildChanged() {
    it("triggers one event", function() {
        expect(this.callback.calls.count()).toEqual(1);
    });
    it("the event is for changing an object", function() {
        expect(this.event.isItemRemoved).toBe(false);
        expect(this.event.isItemAdded).toBe(false);
        expect(this.event.isItemChanged).toBe(true);
    });
};

function testCollection(collectionName, createCollection, addObject, removeObject) {
    describe("The " + collectionName, function() {
        beforeEach(function() {
            this.collection = createCollection();
            this.callback = jasmine.createSpy("callback");
        });
        describe("when empty", function() {
            beforeEach(function() {
                this.collection.addChangeListener(this.callback);
            });
            it("does not trigger an event if nothing is done to it", function() {
                expect(this.callback).not.toHaveBeenCalled();
            });
            describe("adding an object", function() {
                beforeEach(function() {
                    this.obja = new SimpleObservableA;
                    addObject.call(this, this.obja);
                });
                addObjectTest();
            });
        });
        describe("with one object", function() {
            beforeEach(function() {
                this.obja = makeSimpleObservableTree(4);
                addObject.call(this, this.obja);
                this.collection.addChangeListener(this.callback);
            });
            describe("removing the object", function() {
                beforeEach(function() {
                    removeObject.call(this);
                });
                it("triggers one event", function() {
                    expect(this.callback.calls.count()).toEqual(1);
                });
                it("the event is for removing an object", function() {
                    var event;
                    event = this.callback.calls.mostRecent().args[0];
                    expect(event.isItemRemoved).toBe(true);
                    expect(event.isItemAdded).toBe(false);
                    expect(event.isItemChanged).toBe(false);
                });
            });
            mutateChildTests();
        });
    });
};

function mapCreate() {
    return new ObservableMap();
};

function mapAddVal(value) {
    return this.collection.put("a", value);
};

function mapRemoveVal() {
    return this.collection.remove("a");
};

testCollection("ObservableMap", mapCreate, mapAddVal, mapRemoveVal);

function arrayCreate() {
    return new ObservableArray();
};

function arrayAddVal(value) {
    return this.collection.push(value);
};

function arrayRemoveVal() {
    return this.collection.popBack();
};

testCollection("ObservableArray", arrayCreate, arrayAddVal, arrayRemoveVal);
