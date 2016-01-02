module util.datastructures {

    export class PriorityQueue<T> {
        private sortedPriorities : Array<number> = [];
        private unsortedPriorityToContents : {[priority : number] : Array<T>} = {};
        private backwards : boolean;

        constructor(backwards? : boolean) {
            this.backwards = backwards || false;
        }

        push(priority : number, element : T) {
            if (this.sortedPriorities.indexOf(priority) === -1) {
                this.sortedPriorities.push(priority);

                this.sortedPriorities.sort();
                if (this.backwards) {
                    this.sortedPriorities.reverse();
                }
                this.unsortedPriorityToContents[priority] = [];
            }

            this.unsortedPriorityToContents[priority].push(element);
        }

        remove(priority : number, element : T) {
            var index = this.unsortedPriorityToContents[priority].indexOf(element);
            if (index >= 0) {
                this.unsortedPriorityToContents[priority].splice(index, 1);
            }
        }

        /**
         * Iterates over the objects in the Priority Queue.
         * @param func
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
