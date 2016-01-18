module util.datastructures {

    /**
     * A queue that stores elements sorted by priority numbers.
     */
    export class PriorityQueue<T> {
        private sortedPriorities : Array<number> = [];
        private unsortedPriorityToContents : {[priority : number] : Array<T>} = {};
        private backwards : boolean;

        constructor(backwards? : boolean) {
            this.backwards = backwards || false;
        }

        /**
         * Pushes a new element onto the queue with a given priority.
         * @param  {number} priority Priority of the element.
         * @param  {T}      element  Element to store.
         */
        enqueue(priority : number, element : T) {
            if (this.sortedPriorities.indexOf(priority) === -1) {
                this.sortedPriorities.push(priority);

                this.sortedPriorities.sort(function(a,b) {return a - b});
                if (this.backwards) {
                    this.sortedPriorities.reverse();
                }
                this.unsortedPriorityToContents[priority] = [];
            }

            this.unsortedPriorityToContents[priority].push(element);
        }

        /**
         * Removes the last element off the priority queue.
         * @return {T} The removed element.
         */
        dequeue() : T {
            if (this.length === 0) {
                return null;
            }
            var lastPriority = this.sortedPriorities[this.sortedPriorities.length - 1];
            var lastPriorityArray = this.unsortedPriorityToContents[lastPriority];
            var elementRemoved = lastPriorityArray.splice(lastPriorityArray.length - 1, 1);
            if (lastPriorityArray.length === 0) {
                delete this.unsortedPriorityToContents[lastPriority];
                this.sortedPriorities.splice(this.sortedPriorities.length - 1, 1);
            }

            if (elementRemoved.length === 0) {
                return null;
            } else {
                return elementRemoved[0];
            }
        }

        /**
         * Peeks at the element on the top of the queue.
         * @return {T} Element at the top of the queue.
         */
        peek() : T {
            if (this.length === 0) {
                return null;
            }
            var lastPriority = this.unsortedPriorityToContents[this.sortedPriorities[this.sortedPriorities.length - 1]];
            return lastPriority[lastPriority.length - 1];
        }

        /**
         * Removes an element at the specified priority.
         * @param  {number} priority Priority of the element.
         * @param  {T}      element  Element to remove.
         */
        remove(priority : number, element : T) {
            throw new Error("Currently unsupported.");
        }

        /**
         * Iterates over the objects in the priority queue.
         * @param func Function that passes the object being iterated over.
         */
        forEach(func : (object : T) => void) {
            this.sortedPriorities.forEach((priority) => {
                this.unsortedPriorityToContents[priority].forEach(func);
            })
        }

        //region Getters and Setters
        get length() {
            var length = 0;
            this.sortedPriorities.forEach((priority) => {
                length += this.unsortedPriorityToContents[priority].length;
            });
            return length;
        }
        //endregion
    }
}
