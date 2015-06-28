module framework.dependencies {
    /**
     * Configures rivets for the duckling editor.
     *
     * Binder: "rv-command-*"
     * Example: <button "rv-command-foo"="data.thing">Click Me!</button>
     * Behavior: When the button is clicked the foo command callback will be fired on the view model.  The argument
     *           will be the data.thing object.  The binder can be used on any HTML element type.
     *
     * @param rivets The object containing the rivets library
     */
    export function ConfigureRivets(rivets) {
        if ("command-*" in rivets.binders) {
            return;
        }

        function removeCommandCallback(el : HTMLElement) {
            if (el["___command_callback"]) {
                el.removeEventListener("click", el["___command_callback"]);
                el["___command_callback"] = null;
            }
        }

        function addCommandCallback(el : HTMLElement, callback) {
            el.addEventListener("click", callback);
            el["___command_callback"] = callback;
        }

        rivets.binders["command-*"] = {
            routine : function(el : HTMLElement, value) {
                removeCommandCallback(el);

                var command = this.type.slice("command-".length);
                var callback = (event) => this.view.models.handleCommand(command, event, value);
                addCommandCallback(el, callback);
            },
            unbind : function(el : HTMLElement) {
                removeCommandCallback(el);
            }
        };

        rivets.adapters["@"] = {
            observe : function(){},
            unobserve : function(){},
            get : function(obj, keypath) {
                window[keypath] = obj;
            },
            set : function(obj, keypath, value) {
                throw "Set should never be called on this adapter";
            }
        };

        rivets.components['view-model'] = {
            template : function() {
                return ''
            },
            initialize: function(el, data, arg2) {
                var vm = new data.vm();
                this.addChild(vm, el, data.data);
            }
        };
    }
}