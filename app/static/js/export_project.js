const BTN_EXPORT = "btn_export";
const PARAMETER_VALID = "valid";
const INPUT_VALID_PERCENTAGE = "input_valid_percentage"
const SPAN_VALID_PERCENTAGE = "span_valid_percentage"
const PARAMETER_TEST = "test";
const INPUT_TEST_PERCENTAGE = "input_test_percentage";
const SPAN_TEST_PERCENTAGE = "span_test_percentage";
const PARAMETER_TRAIN = "train";
const INPUT_TRAIN_PERCENTAGE = "input_train_percentage";
const SPAN_TRAIN_PERCENTAGE = "span_train_percentage";
const PARAMETER_IMAGES_TO_EXPORT = "images_to_export";
const INPUT_IMAGES_TO_EXPORT = "images_to_export";

function on_load_document() {
    $("#sidebarToggle").click();
    //jquery on BTN_EXPORT click call funtion export_file
    $("#"+BTN_EXPORT).click(open_popup_result);

    $("#"+INPUT_VALID_PERCENTAGE).on("input change", function() {on_change_valid_percentage();});
    $("#"+INPUT_TEST_PERCENTAGE).on("input change", function() {on_change_test_percentage();});
    $("#"+INPUT_TRAIN_PERCENTAGE).on("input change", function() {on_change_train_percentage();});
    //radio buttons on change call function on_change_images_to_export
    $("input[name='"+INPUT_IMAGES_TO_EXPORT+"']").change(function() {on_change_images_to_export();});

    update_url_download();
}

function open_popup_result() {
    $("#result_modal").modal("show");
}

function update_url_download() {
    var url = new URL(URL_DOWNLOAD_PROJECT, document.location);
    // jquery get value of input test_percentage
    var test_percentage = $("#"+INPUT_TEST_PERCENTAGE).val();
    // check test_percentage is not empty
    if (test_percentage) {
        url.searchParams.append(PARAMETER_TEST, test_percentage);
    }
    // jquery get value of input valid_percentage
    var valid_percentage = $("#"+INPUT_VALID_PERCENTAGE).val();
    // check valid_percentage is not empty
    if (valid_percentage) {
        url.searchParams.append(PARAMETER_VALID, valid_percentage);
    }
    // jquery get value of input train_percentage
    var train_percentage = $("#"+INPUT_TRAIN_PERCENTAGE).val();
    // check train_percentage is not empty
    if (train_percentage) {
        url.searchParams.append(PARAMETER_TRAIN, train_percentage);
    }

    // jquery get value of input radio with name images_to_export
    var images_to_export = $("input[name='"+INPUT_IMAGES_TO_EXPORT+"']:checked").val();
    url.searchParams.append(PARAMETER_IMAGES_TO_EXPORT, images_to_export);


    // console.log(url);
    $('#btn_export').attr("href", url.href);
}

var change_inputs = true;

function on_change_valid_percentage() {
    if (change_inputs) {
        change_inputs = false;
        // console.log("on_change_valid_percentage");
        let valid_percentage = $("#"+INPUT_VALID_PERCENTAGE).val();
        let test_percentage = $("#"+INPUT_TEST_PERCENTAGE).val();
        // let train_percentage = $("#"+INPUT_TRAIN_PERCENTAGE).val();
        if (parseInt(valid_percentage) + parseInt(test_percentage) > 100) {
            valid_percentage = 100 - parseInt(test_percentage); 
            $("#"+INPUT_VALID_PERCENTAGE).val(valid_percentage);
        }
        $("#"+SPAN_VALID_PERCENTAGE).text(valid_percentage + "%");
        update_train_percentage();
        update_url_download();
        change_inputs = true;
    }
}

function on_change_test_percentage() {
    if (change_inputs) {
        change_inputs = false;
        // console.log("on_change_test_percentage");
        let valid_percentage = $("#"+INPUT_VALID_PERCENTAGE).val();
        let test_percentage = $("#"+INPUT_TEST_PERCENTAGE).val();
        if (parseInt(valid_percentage) + parseInt(test_percentage) > 100) {
            test_percentage = 100 - parseInt(test_percentage); 
            $("#"+INPUT_TEST_PERCENTAGE).val(test_percentage);
        }
        $("#"+SPAN_TEST_PERCENTAGE).text(test_percentage + "%");
        update_train_percentage();
        update_url_download();
        change_inputs = true;
    }
}

function on_change_train_percentage() {
    if (change_inputs) {
        change_inputs = false;
        // console.log("on_change_train_percentage");
        let valid_percentage = $("#"+INPUT_VALID_PERCENTAGE).val();
        // let test_percentage = $("#"+INPUT_TEST_PERCENTAGE).val();
        let train_percentage = $("#"+INPUT_TRAIN_PERCENTAGE).val();

        if (parseInt(valid_percentage) + parseInt(train_percentage) > 100) {
            train_percentage = 100 - parseInt(valid_percentage);
            $("#"+INPUT_TRAIN_PERCENTAGE).val(train_percentage);
        }
        $("#"+SPAN_TRAIN_PERCENTAGE).text(train_percentage + "%");
        update_test_percentage();
        update_url_download();
        change_inputs = true;
    }
}

function update_valid_percentage() {
    let test_percentage = $("#"+INPUT_TEST_PERCENTAGE).val();
    let train_percentage = $("#"+INPUT_TRAIN_PERCENTAGE).val();
    let valid_percentage = 100 - parseInt(test_percentage) - parseInt(train_percentage);
    $("#"+INPUT_VALID_PERCENTAGE).val(valid_percentage);
    $("#"+SPAN_VALID_PERCENTAGE).text(valid_percentage + "%");
}

function update_test_percentage() {
    let valid_percentage = $("#"+INPUT_VALID_PERCENTAGE).val();
    let train_percentage = $("#"+INPUT_TRAIN_PERCENTAGE).val();
    let test_percentage = 100 - parseInt(valid_percentage) - parseInt(train_percentage);
    $("#"+INPUT_TEST_PERCENTAGE).val(test_percentage);
    $("#"+SPAN_TEST_PERCENTAGE).text(test_percentage + "%");
}

function update_train_percentage() {
    let valid_percentage = $("#"+INPUT_VALID_PERCENTAGE).val();
    // console.log("valid_percentage: " + valid_percentage);
    let test_percentage = $("#"+INPUT_TEST_PERCENTAGE).val();
    // console.log("test_percentage: " + test_percentage);
    let train_percentage = 100 - parseInt(valid_percentage) - parseInt(test_percentage);
    // console.log("train_percentage: " + train_percentage);
    $("#"+INPUT_TRAIN_PERCENTAGE).val(train_percentage);
    $("#"+SPAN_TRAIN_PERCENTAGE).text(train_percentage + "%");
}

function on_change_images_to_export() {
    update_url_download();
}