module framework.command {
    /**
     * Used to track commands that have already been applied to the model.  Its purpose is to allow users
     * to undo/redo their actions.
     */
    export class CommandQueue {
        _commands : Command[] = [];
        _undone : Command[] = [];

        /**
         * Push a command into the queue.  The command will be executed
         * by the queue.
         * @param cmd Command that should be equectued.
         */
        pushCommand(cmd : Command) {
            this._undone.length = 0;
            this._commands.push(cmd);
            cmd.execute();
        }

        /**
         * Undo the last operation that was performed.
         */
        undo() {
            if (this._commands.length) {
                var cmd = this._commands.pop();
                this._undone.push(cmd);
                cmd.undo();
            }
        }

        /**
         * Redo the last operation that was undone.
         */
        redo() {
            if (this._undone.length) {
                var cmd = this._undone.pop();
                this._commands.push(cmd);
                cmd.execute();
            }
        }

        /**
         * Peek at the command that is at the front of the undo queue.
         */
        peekUndo() {
            if (this._commands.length) {
                return this._commands[this._commands.length -1];
            }
            return null;
        }

    }
}