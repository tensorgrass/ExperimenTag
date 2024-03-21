function log_ini_function() { 
    console.log("*********** ini " + log_ini_function.caller.name + " ***********")
} 

function log_end_function() { 
    console.log("*********** end " + log_end_function.caller.name + " ***********")
}

function status_error(response) {
    console.log("*********** status error  **************")
    console.trace();
    console.log("Status error: " + response[JSON_MESSAGE]);
    alert("Connection error: " + response[JSON_MESSAGE]);
}

function connection_error(xhr, status, error) {
    console.log("*********** connection error  **************")
    console.trace();
    console.log("xhr: ");
    console.log(xhr);
    console.log("status: ");
    console.log(status);
    console.log("error: ");
    console.log(error);
    alert("Connection error: " + error);
}