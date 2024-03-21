class DelayCall {
    constructor(on_call_functions) {
        this.on_call_functions = on_call_functions; //OnChange handler

        //This method returns nums functions waiting to execute
        this.get_number_functions = function () {
            return this.on_call_functions.length;
        };

        // Method to add a new function to the queue
        this.push_function = function (new_function) {
            this.on_call_functions.push(new_function);
        };

        this.call_next_function = function () {
            let next_function = this.on_call_functions.shift();
            // check next_function is undefined
            if (next_function != undefined) {
                next_function();
            }
        };

    }
}