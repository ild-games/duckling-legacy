import CommandQueue from 'ts/framework/command/CommandQueue';

describe("The Command Queue", function() {
    var queue;
    queue = new CommandQueue();
    it("Starts empty", function() {
        expect(queue.peekUndo()).toBe(null);
    });
});
