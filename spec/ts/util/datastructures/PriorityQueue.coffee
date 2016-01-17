describe "The Priority Queue when forwards", ->
    beforeEach ->
        this.priorityQueue = new util.datastructures.PriorityQueue()
        this.priorityQueue.enqueue(1, {obj: "Object1"})
        this.priorityQueue.enqueue(2, {obj: "Object2"})
        this.priorityQueue.enqueue(4, {obj: "Object4"})
        this.priorityQueue.enqueue(3, {obj: "Object3a"})
        this.priorityQueue.enqueue(3, {obj: "Object3b"})

    it "Sorts by ascending priority", ->
        expect(this.priorityQueue.peek().obj).toBe "Object4"

    it "Pops from the top of the queue", ->
        expect(this.priorityQueue.dequeue().obj).toBe "Object4"

    it "Gives tie breakers in priority to the last object added at that priority", ->
        expect(this.priorityQueue.length).toBe 5
        this.priorityQueue.dequeue()
        expect(this.priorityQueue.dequeue().obj).toBe "Object3b"
        expect(this.priorityQueue.length).toBe 3

    it "Returns null when there is nothing to dequeue", ->
        this.priorityQueue.dequeue();
        this.priorityQueue.dequeue();
        this.priorityQueue.dequeue();
        this.priorityQueue.dequeue();
        this.priorityQueue.dequeue();
        expect(this.priorityQueue.dequeue()).toBe null


describe "The Priority Queue when backwards", ->
    beforeEach ->
        this.priorityQueue = new util.datastructures.PriorityQueue(true)
        this.priorityQueue.enqueue(1, {obj: "Object1"})
        this.priorityQueue.enqueue(2, {obj: "Object2"})
        this.priorityQueue.enqueue(4, {obj: "Object4"})
        this.priorityQueue.enqueue(3, {obj: "Object3a"})
        this.priorityQueue.enqueue(3, {obj: "Object3b"})

    it "Sorts by descending priority", ->
        expect(this.priorityQueue.peek().obj).toBe "Object1";
