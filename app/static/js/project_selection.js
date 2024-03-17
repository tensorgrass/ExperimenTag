/**
 * JQuery This function call the server with url URL_PROJECT to create a new project 
 */
function new_project(event) {
    event.preventDefault();
    let new_project_name = $("#new_project_name").val();
    console.log("new_project_name: ");
    console.log(new_project_name);
    if (new_project_name != ""){
        let url = URL_PROJECT;
        console.log("url: " + url);
        $.ajax({
            url: url,
            data: {"project_name": new_project_name},
            type: 'POST',
            success: function(response) {
                console.log(JSON.stringify(response));
                // if response data status is success, reload the page, else alert the error message
                let status = response[JSON_STATUS];
                if (status == JSON_STATUS_SUCCESS) {
                    location.reload();
                }
                else {
                    status_error(response);
                }
            },
            error: function(xhr, status, error) {
                connection_error(xhr, status, error);
            },
        });
    }
    else {
        console.trace();
        console.log("new_project: The name of the new project can't be empty");
        alert("The name of the new project can't be empty");
    }
}

function on_edit_project(event, project_id, project_name) {
    event.preventDefault();
    console.log("Project to edit: ");
    console.log(project_id, project_name);
    $("#edit_project_name").val(project_name);
    $("#edit_project_modal").modal("show");
    $("#btn_popup_edir_project").click(function() {edit_project(event, project_id);});
}

function edit_project(event, project_id) {
    event.preventDefault();
    // let project_id = $("#delete_project_id").text();
    console.log("Project to edit: ");
    console.log(project_id);
    let edit_project_name = $("#edit_project_name").val();
    console.log("edit_project_name: ");
    console.log(edit_project_name);
    if (project_id != "" && project_id != null && project_id != undefined){
        let url = url_edit_project[project_id];
        console.log("url: " + url);
        $.ajax({
            url: url,
            data: {"project_name": edit_project_name},
            type: 'PATCH',
            success: function(response) {
                console.log(JSON.stringify(response));
                // if response data status is success, reload the page, else alert the error message
                let status = response[JSON_STATUS];
                if (status == JSON_STATUS_SUCCESS) {
                    location.reload();
                }
                else {
                    status_error(response);
                }
            },
            error: function(xhr, status, error) {
                connection_error(xhr, status, error);
            },
        });
    }
    else {
        console.trace();
        console.log("edit_project: The name of the project to edit can't be empty");
        alert("The name of the project to delete can't be empty");
    }
}

function on_delete_project(event, project_id, project_name) {
    event.preventDefault();
    console.log("Project to delete: ");
    console.log(project_id);
    $("#delete_project_name").text(project_name);
    $("#btn_popup_delete_project").click(function() {delete_project(event, project_id)});
    $("#delete_project_modal").modal("show");

}

/**
 * JQuery This function call the server with url URL_PROJECT to delete a project
 */
function delete_project(event, project_id) {
    event.preventDefault();
    // let project_id = $("#delete_project_id").text();
    console.log("Project to delete: ");
    console.log(project_id);
    if (project_id != "" && project_id != null && project_id != undefined){
        let url = url_delete_project[project_id];
        console.log("url: " + url);
        $.ajax({
            url: url,
            type: 'DELETE',
            success: function(response) {
                console.log(JSON.stringify(response));
                // if response data status is success, reload the page, else alert the error message
                let status = response[JSON_STATUS];
                if (status == JSON_STATUS_SUCCESS) {
                    location.reload();
                }
                else {
                    status_error(response);
                }
            },
            error: function(xhr, status, error) {
                connection_error(xhr, status, error);
            },
        });
    }
    else {
        console.trace();
        console.log("delete_project: The name of the project to delete can't be empty");
        alert("The name of the project to delete can't be empty");
    }
}



function on_empty_project(event, project_id, project_name) {
    event.preventDefault();
    console.log("Project to empty: ");
    console.log(project_id);
    $("#empty_project_name").text(project_name);
    $("#btn_popup_empty_project").click(function() {empty_project(event, project_id)});
    $("#empty_project_modal").modal("show");
}

/**
 * JQuery This function call the server with url URL_PROJECT to empty a project
 */
function empty_project(event, project_id) {
    event.preventDefault();
    // let project_id = $("#empty_project_id").text();
    console.log("Project to empty: ");
    console.log(project_id);
    if (project_id != "" && project_id != null && project_id != undefined){
        let url = url_empty_project[project_id];
        // if url ends with a slash, remove it
        if (url.endsWith("/")) {
            url = url.slice(0, -1);
        }
        console.log("url: " + url);
        $.ajax({
            url: url,
            type: 'DELETE',
            success: function(response) {
                console.log(JSON.stringify(response));
                // if response data status is success, reload the page, else alert the error message
                let status = response[JSON_STATUS];
                if (status == JSON_STATUS_SUCCESS) {
                    location.reload();
                }
                else {
                    status_error(response);
                }
            },
            error: function(xhr, status, error) {
                connection_error(xhr, status, error);
            },
        });
    }
    else {
        console.trace();
        console.log("empty_project: The name of the project to empty can't be empty");
        alert("The name of the project to empty can't be empty");
    }
}