import PriorityQueue from 'ts/util/datastructures/PriorityQueue';

describe("The Priority Queue when forwards", function() {
    beforeEach(function() {
        this.priorityQueue = new PriorityQueue();
        this.priorityQueue.enqueue(1, {
            obj: "Object1"
        });
        this.priorityQueue.enqueue(2, {
            obj: "Object2"
        });
        this.priorityQueue.enqueue(4, {
            obj: "Object4"
        });
        this.priorityQueue.enqueue(3, {
            obj: "Object3a"
        });
        this.priorityQueue.enqueue(3, {
            obj: "Object3b"
        });
    });
    it("Sorts by ascending priority", function() {
        expect(this.priorityQueue.peek().obj).toBe("Object4");
    });
    it("Pops from the top of the queue", function() {
        expect(this.priorityQueue.dequeue().obj).toBe("Object4");
    });
    it("Gives tie breakers in priority to the last object added at that priority", function() {
        expect(this.priorityQueue.length).toBe(5);
        this.priorityQueue.dequeue();
        expect(this.priorityQueue.dequeue().obj).toBe("Object3b");
        expect(this.priorityQueue.length).toBe(3);
    });
    it("Returns null when there is nothing to dequeue", function() {
        this.priorityQueue.dequeue();
        this.priorityQueue.dequeue();
        this.priorityQueue.dequeue();
        this.priorityQueue.dequeue();
        this.priorityQueue.dequeue();
        expect(this.priorityQueue.dequeue()).toBe(null);
    });
    it("Can store negatives along with position priorities", function() {
        this.priorityQueue.enqueue(-100, {
            obj: "ObjectNegative100"
        });
        this.priorityQueue.enqueue(-1, {
            obj: "ObjectNegative1"
        });
        this.priorityQueue.dequeue();
        this.priorityQueue.dequeue();
        this.priorityQueue.dequeue();
        this.priorityQueue.dequeue();
        this.priorityQueue.dequeue();
        expect(this.priorityQueue.dequeue().obj).toBe("ObjectNegative1");
        expect(this.priorityQueue.dequeue().obj).toBe("ObjectNegative100");
    });
});

describe("The Priority Queue when backwards", function() {
    beforeEach(function() {
        this.priorityQueue = new PriorityQueue(true);
        this.priorityQueue.enqueue(1, {
            obj: "Object1"
        });
        this.priorityQueue.enqueue(2, {
            obj: "Object2"
        });
        this.priorityQueue.enqueue(4, {
            obj: "Object4"
        });
        this.priorityQueue.enqueue(3, {
            obj: "Object3a"
        });
        this.priorityQueue.enqueue(3, {
            obj: "Object3b"
        });
    });
    it("Sorts by descending priority", function() {
        expect(this.priorityQueue.peek().obj).toBe("Object1");
    });
});
