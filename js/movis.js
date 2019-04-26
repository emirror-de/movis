/**
 * (c) Lewin Probst, lprobst@emirror.de, www.emirror.de, 2019

 * This file is part of the movis package originally available at
 * https://github.com/emirror-de/movis.
 * It is licensed under MIT. More information about the license is provided
 * in the root folder of the repository in the LICENSE file.
 *
 * It is explicitly prohibited to use this and any customized version of this
 * software to provide content that supports racism, violence, or any other kind
 * of content that harms human rights or animals.
 */


/**
 * Provides a centralized state management for JavaScript applications.
 */
function Movis() {
    // initialize private members
    /**
     * Contains the state history with key being the stateId and the value being
     * an array of state values.
     */
    var stateValues = new Map();
    /**
     * Contains an array that holds the registered listener functions.
     */
    var listenerCollection = new Map();

    // create the MoViS object
    return {

        /**
         * Adds the state to the state management.
         *
         * @param {String} stateId
         *  The state identifier that defines the property that is used to get or
         *  set its value.
         *
         * @param {Mixed} initialValue
         *  The initial value of the state.
         *
         * @param {Mixed} listenerFunction
         *  Can be a function or an array of functions. These functions will be
         *  executed when the state changes.
         *
         * @return {this}
         *  Returns the MoViS object.
         */
        addState: function(stateId, initialValue, listenerFunction) {

            if (this.hasOwnProperty(stateId)) {
                console.info("State " + stateId + " already exists!");
                return this;
            }

            // initialize private maps
            stateValues.set(stateId, [initialValue]);
            listenerFunction = listenerFunction || [];
            if (listenerFunction.constructor === Array) {
                listenerCollection.set(stateId, listenerFunction);
            } else if (typeof listenerFunction === "function") {
                listenerCollection.set(stateId, [listenerFunction]);
            }

            Object.defineProperty(
                this,
                stateId,
                {
                    get: () => {
                        return stateValues.get(stateId).slice(-1)[0];
                    },
                    set: (value) => {
                        stateValues.get(stateId).push(value);
                        listenerCollection.get(stateId).map((f) => { f(this[stateId]); });
                    }
                }
            );
            return this;
        },

        /**
         * Removes the state from the state management.
         *
         * @param {String} stateId
         *  The state identifier that defines the property that is used to get or
         *  set its value.
         *
         * @return {this}
         *  Returns the MoViS object.
         */
        removeState: function(stateId) {
            stateValues.delete(stateId);
            listenerCollection.delete(stateId);
            delete this[stateId];
            return this;
        },

        /**
         * Removes the last change of the state and calls all listener functions.
         * Does nothing if the history contains only the initial value.
         *
         * @param {String} stateId
         *  The state identifier that defines the property that is used to get or
         *  set its value.
         *
         * @return {this}
         *  Returns the MoViS object.
         */
        undoState: function(stateId) {
            if (stateValues.get(stateId).length > 1) {
                stateValues.get(stateId).pop();
                listenerCollection.get(stateId).map((f) => { f(this[stateId]); });
            }
            return this;
        },

        /**
         * Binds the given listener function to a change of the given state.
         *
         * @param {String} stateId
         *  The state identifier that defines the property that is used to get or
         *  set its value.
         *
         * @param {Function} listenerFunction
         *  Can be a function or an array of functions. These functions will be
         *  executed when the state changes.
         *
         * @return {this}
         *  Returns the MoViS object.
         */
        addStateListener: function(stateId, listenerFunction) {
            if (!stateValues.has(stateId)) {
                console.error("State ID " + stateId + " does not exist");
                return this;
            }
            if (listenerCollection.get(stateId).includes(listenerFunction)) {
                console.error("Listener function already registered!");
                return this;
            }
            listenerCollection.get(stateId).push(listenerFunction);
            return this;
        },

        /**
         * Removes the given listener function from the given state.
         *
         * @param {String} stateId
         *  The state identifier that defines the property that is used to get or
         *  set its value.
         *
         * @param {Function} listenerFunction
         *  Can be a function or an array of functions. These functions will be
         *  executed when the state changes.
         *
         * @return {this}
         *  Returns the MoViS object.
         */
        removeStateListener: function(stateId, listenerFunction) {
            let index = listenerCollection.get(stateId).indexOf(listenerFunction);
            if (listenerCollection.get(stateId).length > 0 && index !== -1) {
                listenerCollection.get(stateId).splice(index, 1);
            }
            return this;
        }
    };
};


// Create the global movis variable
const movis = Movis();

