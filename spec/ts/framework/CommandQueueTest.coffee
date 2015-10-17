describe "The Command Queue", ->
    queue = new framework.command.CommandQueue()
    it "Starts empty", ->
        expect(queue.peekUndo()).toBe null
