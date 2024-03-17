const UPDATE_TYPE_IMAGES = "update_images";
const UPDATE_TYPE_VIDEO = "update_video";
const UPDATE_TYPE_IMPORT = "update_import";
const UPDATE_TYPE_IMPORT_ZIP = "update_import_zip";

const VALID_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png']
const VALID_VIDEO_EXTENSIONS = ['mp4']
const VALID_IMPORT_EXTENSIONS = ['jpg', 'jpeg', 'png', 'txt', 'yaml', 'yml', 'json']
const VALID_IMPORT_ZIP_EXTENSIONS = ['zip']
const BATCH_SIZE_PROGRESSBAR = 500;

const IMAGE_TARGET_PROGRESSBAR = '\n \
    <div id="div-[file_name_id]" class="card border-left-success shadow h-100 py-2 mt-2 progressbar_card"> \n \
        <div class="card-body">\n \
            <div class="row no-gutters align-items-center">\n \
                <div class="col mr-2">\n \
                    <div class="h5 mb-0 font-weight-bold text-gray-800">\n \
                        <progress id="progress-[file_name_id]" value="0" max="100"></progress>\n \
                        <span id="percentage-[file_name_id]">0%</span>\n \
                        <span>[file_name_value]</span>\n \
                        <div id="response-[file_name_id]"></div>\n \
                    </div>\n \
                </div>\n \
                <div class="col-auto">\n \
                    <i class="fa-solid fa-folder-open fa-2x text-gray-300"></i>\n \
                </div>\n \
            </div>\n \
        </div>\n \
    </div>\n \
';

const IMAGE_TARGET_ERROR = '\n \
    <div id="div-[file_name_id]" class="card border-left-success shadow h-100 py-2 mt-2 progressbar_card"> \n \
        <div class="card-body">\n \
            <div class="row no-gutters align-items-center">\n \
                <div class="col mr-2">\n \
                    <div class="h5 mb-0 font-weight-bold text-gray-800">\n \
                        <span>[file_name_value]</span>\n \
                        <div id="response-[file_name_id]">[message]</div>\n \
                    </div>\n \
                </div>\n \
                <div class="col-auto">\n \
                    <i class="fa-solid fa-folder-open fa-2x text-gray-300"></i>\n \
                </div>\n \
            </div>\n \
        </div>\n \
    </div>\n \
';

const PROGRESSBAR_CODE_TAG = '\n \
    <div id="div-tag-images" class="card border-left-success shadow h-100 py-2 mt-2 progressbar_card"> \n \
        <div class="card-body">\n \
            <div class="row no-gutters align-items-center">\n \
                <div class="col mr-2">\n \
                    <div class="h5 mb-0 font-weight-bold text-gray-800">\n \
                        <progress id="progress-tag-images" value="0" max="100"></progress>\n \
                        <span id="percentage-tag-images">0%</span>\n \
                        <span>Tag all images</span>\n \
                        <div id="response-tag-images">\n \
                        <button id="button-tag-images" class="btn btn-secondary" type="button" style="display: none !important;">Tag images</button>\n \
                        </div>\n \
                    </div>\n \
                </div>\n \
                <div class="col-auto">\n \
                    <i class="fa-solid fa-folder-open fa-2x text-gray-300"></i>\n \
                </div>\n \
            </div>\n \
        </div>\n \
    </div>\n \
';

function on_load_document() {
    $("#sidebarToggle").click();
    $('#btn_upload').click(function(){
        upload_files();
    });
}

function upload_files() {
    let formData = new FormData();
    $.ajax({
        url: URL_UPLOAD_CHECK,
        data: formData,
        type: 'GET',
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false, // NEEDED, DON'T OMIT THIS
        // ... Other options like success and etc
        success: function (response) {
            console.log(JSON.stringify(response));
            // if response data status is success, create progressbar for each file to be uploaded, else alert the error message
            let status = response[JSON_STATUS];
            if (status == JSON_STATUS_SUCCESS) {
                create_progressbar_file_upload();
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

var current_id_file = 0;
var num_directory_files_to_upload = 0;
var num_single_file_to_upload = 0;
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
//https://developer.mozilla.org/es/docs/Web/API/MutationObserver
var observer_creation_cards = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        // console.log("mutation: " + mutation.addedNodes);
        let file_div_id = "div-file_" + current_id_file;
        for (let node of mutation.addedNodes) {
            // console.log("node.innerHTML: " + node.innerHTML);
            if (node.id == file_div_id) {
                console.log(file_div_id + " exists.");
                current_id_file += 1;
                on_create_progressbar_file_upload();
                break;
            }
        }
    });
});

function create_progressbar_file_upload() {
    //delete all elements that contains class progressbar_card
    $(".progressbar_card").remove();
    current_id_file = 0;
    //jquery check if element with id input_directory_upload exists
    console.log("$('#input_directory_upload').length: " + $('#input_directory_upload').length);
    if ($('#input_directory_upload').length > 0) {
        num_directory_files_to_upload = $('#input_directory_upload')[0].files.length;
        console.log("num_directory_files_to_upload: " + num_directory_files_to_upload);
    }
    //jquery check if element with id input_file_upload exists
    console.log("$('#input_file_upload').length: " + $('#input_file_upload').length);
    if ($('#input_file_upload').length > 0) {
        num_single_file_to_upload = $('#input_file_upload')[0].files.length;
        console.log("num_single_file_to_upload: " + num_single_file_to_upload);
    }
    
    var list = document.querySelector(".container-fluid");
    observer_creation_cards.observe(list, {
            // attributes: true, 
            // characterData: true,
            childList: true
        });
    on_create_progressbar_file_upload();
}

/**
 * Create a progressbar cart for each file to be uploaded. The creation of the progressbar is done in a batch of 500 files
 * This function is called when a progressbar is loaded, and it will call the next progressbar to be loaded
 * Let DOM to be updated before calling the next progressbar
 * Check MutationObserver to know when the next progressbar is loaded
 */
function on_create_progressbar_file_upload() {
    console.log("on_create_progressbar_file_upload current_id_file: " + current_id_file);
    if (current_id_file < num_directory_files_to_upload + num_single_file_to_upload ) {
        let count = 0;

        let real_current_id_file = current_id_file;
        let real_num_files_to_upload = num_directory_files_to_upload;
        if (current_id_file >= num_directory_files_to_upload) {
            real_current_id_file = current_id_file - num_directory_files_to_upload;
            real_num_files_to_upload = num_single_file_to_upload;
        }

        if (real_num_files_to_upload - real_current_id_file > BATCH_SIZE_PROGRESSBAR) {
            count = BATCH_SIZE_PROGRESSBAR;
        }
        else {
            count = real_num_files_to_upload - real_current_id_file;
        }

        let htmldata = "";
        console.log("on_create_progressbar_file_upload count: " + count);
        while (count > 0) {
            let card_data = IMAGE_TARGET_PROGRESSBAR;
            let file_name_id = "file_" + current_id_file;
            let file_name_value = "";
            if (current_id_file >= num_directory_files_to_upload) {
                real_current_id_file = current_id_file - num_directory_files_to_upload;
                file_name_value = $('#input_file_upload')[0].files[real_current_id_file]["name"];
            }
            else {
                real_current_id_file = current_id_file;
                file_name_value = $('#input_directory_upload')[0].files[real_current_id_file]["name"];
            }
            console.log("file_name_value: " + file_name_value);
            let file_extension = file_name_value.split('.').pop().toLowerCase();
            let message = "";
            if (UPDATE_TYPE == UPDATE_TYPE_IMAGES) {
                if (!VALID_IMAGE_EXTENSIONS.includes(file_extension)) {
                    card_data = IMAGE_TARGET_ERROR
                    message = "Invalid file extension for image. Only jpg, jpeg and png are allowed.";
                }
            }
            else if (UPDATE_TYPE == UPDATE_TYPE_VIDEO) {
                if (!VALID_VIDEO_EXTENSIONS.includes(file_extension)) {
                    card_data = IMAGE_TARGET_ERROR
                    message = "Invalid file extension for image. Only mp4 is allowed.";
                }
            }
            else if (UPDATE_TYPE == UPDATE_TYPE_IMPORT) {
                if (!VALID_IMPORT_EXTENSIONS.includes(file_extension)) {
                    card_data = IMAGE_TARGET_ERROR
                    message = "Invalid file extension for image. Only jpg, jpeg, png, txt, yaml, yml and json are allowed.";
                }
            }
            else if (UPDATE_TYPE == UPDATE_TYPE_IMPORT_ZIP) {
                if (!VALID_IMPORT_ZIP_EXTENSIONS.includes(file_extension)) {
                    card_data = IMAGE_TARGET_ERROR
                    message = "Invalid file extension for import image. Only zip is allowed.";
                }
            }
            htmldata += card_data.replaceAll('[file_name_id]', file_name_id).replace("[file_name_value]", current_id_file + ": " + file_name_value).replace("[message]", message);
            count -= 1;
            current_id_file += 1;
        }
        current_id_file -= 1;
        // console.log("htmldata: " + htmldata);
        $(".container-fluid").append(htmldata);
    }
    else {
        // When finished, stop the observer and upload the files to server
        observer_creation_cards.disconnect();
        upload_file_to_server(0, num_directory_files_to_upload + num_single_file_to_upload);
    }
}

function upload_file_to_server(current_id_file, num_files_to_upload) {
    if (current_id_file >= num_files_to_upload) {
        tag_images_on_server();
    }
    else {
        let file_to_upload;
        let real_current_id_file = current_id_file;
        if (current_id_file >= num_directory_files_to_upload) {
            real_current_id_file = current_id_file - num_directory_files_to_upload;
            console.log("single upload value1: " + $('#input_file_upload'));
            console.log("single upload value2: " + $('#input_file_upload')[0]);
            console.log("single upload value3: " + $('#input_file_upload')[0].files[real_current_id_file]);
            file_to_upload = $('#input_file_upload')[0].files[real_current_id_file];
        }
        else {
            real_current_id_file = current_id_file;
            file_to_upload = $('#input_directory_upload')[0].files[real_current_id_file]
        }
        let file_name_value = file_to_upload["name"];
        let file_extension = file_name_value.split('.').pop().toLowerCase();

        if ( (UPDATE_TYPE == UPDATE_TYPE_IMAGES && VALID_IMAGE_EXTENSIONS.includes(file_extension)) ||
             (UPDATE_TYPE == UPDATE_TYPE_VIDEO && VALID_VIDEO_EXTENSIONS.includes(file_extension)) ||
             (UPDATE_TYPE == UPDATE_TYPE_IMPORT && VALID_IMPORT_EXTENSIONS.includes(file_extension)) ||
             (UPDATE_TYPE == UPDATE_TYPE_IMPORT_ZIP && VALID_IMPORT_ZIP_EXTENSIONS.includes(file_extension))
            ) {
            let file_name_id = "file_" + current_id_file;
            let formData = new FormData();
            console.log("upload_file_to_server file_name_value: " + file_name_value);
            formData.append('upload_file', file_to_upload);
            if (UPDATE_TYPE == UPDATE_TYPE_VIDEO) {
                $('body').loadingModal({text: 'Generating frames from video...', 'animation': 'wanderingCubes'});
            }
            $.ajax({
                xhr: function() {
                    var xhr = new window.XMLHttpRequest();
                    var file_name = file_name_id;
                    // percentage-data.yaml_0
                    // percentage-data.yaml_0

                    // Upload progress
                    xhr.upload.addEventListener("progress", function(evt){
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded * 100 / evt.total;
                            //Do something with upload progress
                            console.log(file_name + ": " + percentComplete + "%")
                            console.log("id percentage: " + '#percentage-' + file_name + " dom exists: " + $('#percentage-' + file_name).length);
                            $('#percentage-' + file_name).html(percentComplete+'%');
                            $('#progress-' + file_name).attr('value', percentComplete);
                            if (percentComplete >= 100) {
                                console.log(file_name + " 100%");
                            }
                        }
                    }, false);
                                        
                    return xhr;
                },
                url: URL_UPLOAD_FILE,
                data: formData,
                type: 'POST',
                contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
                processData: false, // NEEDED, DON'T OMIT THIS
                // ... Other options like success and etc
                success: function (response) {
                    $('html, body').scrollTop($("#percentage-" + file_name_id).offset().top);
                    let message =  response["message"];
                    $("#response-" + file_name_id).html(message);
                    if (UPDATE_TYPE == UPDATE_TYPE_VIDEO) {
                        $('body').loadingModal('destroy');
                    }
                    upload_file_to_server(current_id_file + 1, num_files_to_upload);
                },
                error: function(xhr, status, error) {
                    connection_error(xhr, status, error);
                },
            });
        }
        else {
            upload_file_to_server(current_id_file + 1, num_files_to_upload);
        }
    }
}

function tag_images_on_server() {
    $(".container-fluid").append(PROGRESSBAR_CODE_TAG);
    var formData = new FormData();
    var selected_radio = $("input[type='radio'][id='radio_keep_tags']:checked");
    if (selected_radio.length > 0) {
        selected_val = selected_radio.val();
        console.log("radio_keep_tags selected_val: " + selected_val);
        formData.append("action_tags", selected_val);
    }

    $.ajax({
        url: URL_UPLOAD_TAG_IMAGES,
        data: formData,
        type: 'POST',
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false, // NEEDED, DON'T OMIT THIS
        // ... Other options like success and etc
        success: function (response) {
            console.log(response);
            // if response data status is success, reload the page, else alert the error message
            let status = response[JSON_STATUS];
            if (status == JSON_STATUS_SUCCESS) {
                $('#percentage-tag-images').html('100%');
                $('#progress-tag-images').attr('value', 100);
                $('html, body').scrollTop($("#percentage-tag-images").offset().top);
                //len of array data["added_images"]
                console.log("data[added_images]: " + response["data"]["added_images"]);
                let num_added_images = response["data"]["added_images"].length;
                let num_updated_images = response["data"]["updated_images"].length;
                //jquery set span value of id num_added_images
                $('#num_added_images').html(num_added_images);
                if ($('#num_updated_images').length > 0) {
                    $('#num_updated_images').html(num_updated_images);
                }
                $("#result_modal").modal("show");

                $("#button-tag-images").show();
                url_for_tag_images = response["data"]["url_for_tag_images"];
                $('#button-tag-images').click(function(){
                    window.location.replace(url_for_tag_images);
                });
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