module framework.command {
    /**
     * An object implementing the Command interface describes an undoable task.
     */
    export interface Command {
        /**
         * Perform the action encapsulated by the command.
         */
        execute();
        /**
         * Undo the operation performed by the command.
         */
        undo();
    }
}