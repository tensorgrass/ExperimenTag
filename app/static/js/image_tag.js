const TEST_SELECTION = false;

const DEFAULT_BORDER_SIZE = 2;
const MAX_BORDER_SIZE_CORNER = 6;
const MIN_SIDE_LENGTH = 10;
const SECURITY_MARGIN = 2;
const MAX_NUM_TAG = 9;
const OPERATION_CHANGE_SIZE = "OPERATION_CHANGE_SIZE";
const OPERATION_CHANGE_SIZE_HORIZONTAL = "OPERATION_CHANGE_SIZE_HORIZONTAL";
const OPERATION_CHANGE_SIZE_VERTICAL = "OPERATION_CHANGE_SIZE_VERTICAL";
const OPERATION_CHANGE_POSITION = "OPERATION_CHANGE_POSITION";
const SIDE_X_LEFT = "LEFT";
const SIDE_X_RIGHT = "RIGHT";
const SIDE_Y_TOP = "TOP";
const SIDE_Y_BOTTOM = "BOTTOM";

const PX = "px";
const BORDER_SIZE = "border-size";
const BORDER_COLOR = "border-color";

const TAG_ACTIVE = "active";
const TAG_TYPE = "tag_type";
const TAG_TYPE_SINGLE = "single";
const TAG_TYPE_LINEAR = "linear";
const TAG_TYPE_CURVE = "curve";
const TAG_TYPE_MULTIPLE_CALCULATED = "multi_calc";
const TAG_TYPE_MULTIPLE_INITIAL = "multi_ini";
const TAG_TYPE_MULTIPLE_FINAL = "multi_fin";
const TAG_LEFT = "left";
const TAG_TOP = "top";
const TAG_WIDTH = "width";
const TAG_HEIGHT = "height";
const TAG_CLASS = "class";
const TAG_COLOR_SELECTED = "color_selected";
const TAG_COLOR_SELECTED_DEFAULT = "#008000";
const TAG_COLOR_UNSELECTED = "color_unselected";
const TAG_COLOR_UNSELECTED_DEFAULT = "#FFFFFF";

const MAIN_SCROLL_IMG_HEIGHT_DEFAULT = "300";
const MAIN_SCROLL_IMG_HEIGHT_DOUBLE = "600";

const MAIN_SCROLL_IMG = "#main_scroll_img";
const IMAGE_TO_TAG = "#image_to_tag";
const DIV_CONTAINER = "#div_container";
const BTN_ZOOM_MAXIMIZE =  "#btn_maximize_window";
const BTN_ZOOM_MINIMIZE =  "#btn_minimize_window";
const BTN_ZOOM_IN =  "#btn_zoom_in";
const BTN_ZOOM_OUT =  "#btn_zoom_out";
const INPUT_ZOOM_VALUE = "#input_zoom_value";
const BTN_PREVIOUS = "#btn_previous";
const INPUT_IMG_NUMBER = "#input_img_number";
const BTN_NEXT = "#btn_next";
const DIV_TAG = ".div_tag";
const BTN_DELETE_TAG = "#btn_delete_tag";
const BTN_SAVE_TAGS = "#btn_save_tags";
const BTN_RESTORE_TAGS = "#btn_restore_tags";
const BTN_DELETE_CURRENT_IMAGE = "#btn_delete_current_image";
const BTN_POPUP_DELETE_CURRENT_IMAGE = "#btn_popup_delete_current_image";
const BTN_ADD_IMAGE_AT_THE_END = "#btn_add_image_at_the_end";

const TABLE_GRID_TAGS_NAMES = "#table_grid_tags_names";
const TABLE_GRID = "#table_grid";

const CLASS_DIV_TAG_SELECTED = "div_tag_selected";
const CLASS_DIV_TAG_UNSELECTED = "div_tag_unselected";

const INPUT_TAG_DETAIL_NAME = "#input_tag_detail_name"
const INPUT_TAG_DETAIL_CLASS = "#input_tag_detail_class"
const INPUT_TAG_DETAIL_COLOR_SELECTED = "#input_tag_detail_color_selected"
const INPUT_TAG_DETAIL_COLOR_UNSELECTED = "#input_tag_detail_color_unselected"
const INPUT_TAG_DETAIL_ACTIVE = "#input_tag_detail_active"
const SELECT_TAG_DETAIL_TAG_TYPE = "#select_tag_detail_tag_type";
const INPUT_TAG_DETAIL_MULTIPLE_CALCULATED = "#input_tag_detail_multiple_calculated";
const INPUT_TAG_DETAIL_MULTIPLE_INITIAL = "#input_tag_detail_multiple_initial";
const INPUT_TAG_DETAIL_MULTIPLE_FINAL = "#input_tag_detail_multiple_final";
const INPUT_TAG_DETAIL_TOP = "#input_tag_detail_top";
const INPUT_TAG_DETAIL_LEFT = "#input_tag_detail_left";
const INPUT_TAG_DETAIL_WIDTH = "#input_tag_detail_width";
const INPUT_TAG_DETAIL_HEIGHT = "#input_tag_detail_height";
const MODAL_DELETE_IMAGE = "#modal_delete_image"; 
const INDEX_IMAGE_DELETE_IMAGE = "#num_image_delete_image";


function load_image_tag() {
    load_behaviour();
}

////////////////////////////////////////////////
///////////// CALLS FROM BROWSER ///////////////
////////////////////////////////////////////////
function load_behaviour() {
    log_ini_function();
    let delay_call = new DelayCall([]);
    delay_call.push_function(function(){create_window_tag_data(delay_call);});
    delay_call.push_function(function(){call_server_get_table_grid(delay_call);});
    delay_call.push_function(function(){table_grid_load_all_table(delay_call);});
    delay_call.push_function(function(){call_server_load_image(delay_call, 0);});
    delay_call.push_function(function(){image_window_load_image(delay_call);});
    //after all the calls, wait to load the image and then call the next function

    let img = $(IMAGE_TO_TAG);
    img.on('load', function() {
        console.log("img.on load");
        let delay_call = new DelayCall([]);
        delay_call.push_function(function(){image_window_load_natural_size_image(delay_call);});
        delay_call.push_function(function(){image_window_remove_all_tags_image(delay_call);});
        delay_call.push_function(function(){image_window_add_all_tags_image(delay_call);});
        delay_call.push_function(function(){image_window_apply_zoom(delay_call);});
        delay_call.push_function(function(){image_window_select_tag(delay_call);});
        delay_call.push_function(function(){table_grid_select_image(delay_call);});
        delay_call.push_function(function(){table_grid_select_tag(delay_call);});
        delay_call.push_function(function(){detail_tag_select_tag(delay_call);});
        delay_call.push_function(function(){calculate_max_id_tag_image(delay_call);});
        delay_call.call_next_function();
    });

    let div_container = $(DIV_CONTAINER);
    div_container.mousedown(function(event) {
        on_mousedown_manage_tag(event);
    });

    // div_container.mousemove(function(event) {
    $("body").mousemove(function(event) {
        on_mousemove_manage_tag(event);
    });

    // div_container.mouseup(function(event) {
    $("body").mouseup(function(event) {
        on_mouseup_manage_tag(event);
    });

    let btn_maximize = $(BTN_ZOOM_MAXIMIZE);
    btn_maximize.click(function() {
        on_maximize();
    });

    let btn_minimize = $(BTN_ZOOM_MINIMIZE);
    btn_minimize.click(function() {
        on_minimize();
    });

    let btn_zoom_in = $(BTN_ZOOM_IN);
    btn_zoom_in.click(function() {
        on_zoom_in();
    });

    let btn_zoom_out = $(BTN_ZOOM_OUT);
    btn_zoom_out.click(function() {
        on_zoom_out();
    });

    //NAVIGATION
    let btn_previous = $(BTN_PREVIOUS);
    btn_previous.click(function(event) {
        on_click_previous_image(event);
    });

    let btn_next = $(BTN_NEXT);
    btn_next.click(function(event) {
        on_click_next_image(event);
    });

    //DELETE TAG
    let btn_delete_tag = $(BTN_DELETE_TAG);
    btn_delete_tag.click(function(event) {
        on_click_delete_tag(event);
    });

    $(document).keyup(function (event) {
        if(event.keyCode == 46) {
            on_click_delete_tag(event);
        }
    });

    //SAVE TAGS
    let btn_save_tags = $(BTN_SAVE_TAGS);
    btn_save_tags.click(function(event) {
        on_click_save_tags(event);
    });

    //RESTORE TAGS
    let btn_restore_tags = $(BTN_RESTORE_TAGS);
    btn_restore_tags.click(function(event) {
        on_click_restore_tags(event);
    });

    //
    let btn_add_image_at_the_end = $(BTN_ADD_IMAGE_AT_THE_END);
    btn_add_image_at_the_end.click(function(event) {
        call_server_save_image(delay_call);
    });

    //DELETE IMAGE
    let btn_delete_current_image = $(BTN_DELETE_CURRENT_IMAGE);
    btn_delete_current_image.click(function(event) {
        on_delete_current_image(event);
    });



    //RESTORE TAGS
    let btn_popup_delete_current_image = $(BTN_POPUP_DELETE_CURRENT_IMAGE);
    btn_popup_delete_current_image.click(function(event) {
        on_popup_delete_current_image(event);
    });

    //INPUT_TAG_DETAIL_CLASS
    let input_tag_detail_class = $(INPUT_TAG_DETAIL_CLASS);
    input_tag_detail_class.change(function(event) {
        on_change_tag_detail_class(event);
    });

    //INPUT_TAG_DETAIL_ACTIVE
    let select_tag_detail_active = $(INPUT_TAG_DETAIL_ACTIVE);
    select_tag_detail_active.change(function(event) {
        on_change_tag_detail_active(event);
    });

    //SELECT TAG DETAIL TAG TYPE
    let select_tag_detail_tag_type = $(SELECT_TAG_DETAIL_TAG_TYPE);
    select_tag_detail_tag_type.change(function(event) {
        on_change_tag_detail_tag_type(event);
    });

    //INPUT_TAG_DETAIL_MULTIPLE_CALCULATED
    let input_tag_detail_multiple_calculated = $(INPUT_TAG_DETAIL_MULTIPLE_CALCULATED);
    input_tag_detail_multiple_calculated.change(function(event) {
        on_change_tag_detail_multiple_calculated(event);
    });

    //INPUT_TAG_DETAIL_MULTIPLE_INITIAL
    let input_tag_detail_multiple_initial = $(INPUT_TAG_DETAIL_MULTIPLE_INITIAL);
    input_tag_detail_multiple_initial.change(function(event) {
        on_change_tag_detail_multiple_initial(event);
    });

    //INPUT_TAG_DETAIL_MULTIPLE_FINAL
    let input_tag_detail_multiple_final = $(INPUT_TAG_DETAIL_MULTIPLE_FINAL);
    input_tag_detail_multiple_final.change(function(event) {
        on_change_tag_detail_multiple_final(event);
    });

    //COLOR SELECTED
    let input_tag_detail_color_selected = $(INPUT_TAG_DETAIL_COLOR_SELECTED);
    input_tag_detail_color_selected.change(function(event) {
        on_change_tag_color_selected(event);
    });

    //COLOR UNSELECTED
    let input_tag_detail_color_unselected = $(INPUT_TAG_DETAIL_COLOR_UNSELECTED);
    input_tag_detail_color_unselected.change(function(event) {
        on_change_tag_color_unselected(event);
    });

    //llama al listado de funciones a ejecutar en la carga de manera diferida
    delay_call.call_next_function();

}


function on_click_next_image(event) {
    event.preventDefault();
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let index_image = img_tag_data.get_index_image();
    let next_index_image = index_image + 1;

    let delay_call = new DelayCall([]);
    delay_call.push_function(function(){call_server_save_image(delay_call);});
    delay_call.push_function(function(){call_server_load_image(delay_call, next_index_image);});
    delay_call.push_function(function(){image_window_load_image(delay_call);});
    delay_call.call_next_function();

    log_end_function();
}

function on_click_previous_image(event) {
    event.preventDefault();
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let index_image = img_tag_data.get_index_image();
    let next_index_image = index_image - 1;

    let delay_call = new DelayCall([]);
    delay_call.push_function(function(){call_server_save_image(delay_call);});
    delay_call.push_function(function(){call_server_load_image(delay_call, next_index_image);});
    delay_call.push_function(function(){image_window_load_image(delay_call);});
    delay_call.call_next_function();

    log_end_function();
}

function on_click_save_tags(event) {
    event.preventDefault();
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let index_image = img_tag_data.get_index_image();
    let next_index_image = index_image;

    let delay_call = new DelayCall([]);
    delay_call.push_function(function(){call_server_save_image(delay_call);});
    delay_call.push_function(function(){call_server_load_image(delay_call, next_index_image);});
    delay_call.push_function(function(){image_window_load_image(delay_call);});
    delay_call.call_next_function();

    log_end_function();
}

function on_click_restore_tags(event) {
    if (event != null) {
        event.preventDefault();
    }
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let index_image = img_tag_data.get_index_image();
    let next_index_image = index_image;

    let delay_call = new DelayCall([]);
    delay_call.push_function(function(){table_grid_delete_all_rows(delay_call);});
    delay_call.push_function(function(){call_server_get_table_grid(delay_call);});
    delay_call.push_function(function(){table_grid_load_all_table(delay_call);});
    delay_call.push_function(function(){call_server_load_image(delay_call, next_index_image);});
    delay_call.push_function(function(){image_window_load_image(delay_call);});
    delay_call.call_next_function();

    log_end_function();
}

function on_delete_current_image(event) {
    if (event != null) {
        event.preventDefault();
    }
    let img_tag_data = get_window_tag_data();
    data_images = img_tag_data.get_data_images();
    let num_images = data_images.length;
    if (num_images > 1) {
        let index_image = img_tag_data.get_index_image();
        
        $(INDEX_IMAGE_DELETE_IMAGE).html(index_image + 1);
        $(MODAL_DELETE_IMAGE).modal('show');
    }
    else {
        console.log("on_delete_current_image: You can't delete the last image");
        alert("You can't delete the last image");
    }
}

function on_popup_delete_current_image(event) {
    if (event != null) {
        event.preventDefault();
    }
    $(MODAL_DELETE_IMAGE).modal('hide');
    call_server_delete_image(null);
}

function on_click_delete_tag(event) {
    event.preventDefault();
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let selected_id_tag = img_tag_data.get_selected_id_tag();
    let tags_image = img_tag_data.get_tags_image();

    if (selected_id_tag != null) {
        table_grid_delete_row(selected_id_tag);
        image_window_delete_tag(selected_id_tag);
        img_tag_data.set_selected_id_tag(null);
        // img_tag_data.set_tags_image(null);
        img_tag_data.set_previous_id_tag(null);

        // get lenght of tags_image
        let num_tags_image = Object.keys(tags_image).length;
        if (num_tags_image > 0) {
            let id_tag_image = null;
            for (let id in tags_image) {
                id_tag_image = id;
                if (tags_image[id][TAG_ACTIVE]) {
                    break;
                }
            }
            img_tag_data.set_selected_id_tag(id_tag_image);
            img_tag_data.set_previous_id_tag(id_tag_image);
            let delay_call = new DelayCall([]);
            delay_call.push_function(function(){image_window_select_tag(delay_call)});
            delay_call.push_function(function(){table_grid_select_tag(delay_call)});
            delay_call.push_function(function(){detail_tag_select_tag(delay_call);});
            delay_call.call_next_function();
        }
        else {
            detail_tag_select_tag(null);
        }
    }
    else {
        console.log("on_click_delete_tag: No tag selected");
        alert("No tag selected");
    }
    log_end_function();
}

function on_click_load_image_from_table_grid(event, new_index_img) {
    event.preventDefault();
    log_ini_function();
    console.log("new_index_img: " + new_index_img);
    let img_tag_data = get_window_tag_data();
    let index_image = img_tag_data.get_index_image();
    let selected_id_tag = img_tag_data.get_selected_id_tag();

    if (new_index_img != index_image) {
        console.log("Change image");
        img_tag_data.set_next_selected_tag(selected_id_tag);
        let delay_call = new DelayCall([]);
        delay_call.push_function(function(){call_server_save_image(delay_call);});
        delay_call.push_function(function(){call_server_load_image(delay_call, new_index_img);});
        delay_call.push_function(function(){image_window_load_image(delay_call);});
        delay_call.call_next_function();
    }

    log_end_function();
}

function on_click_select_tag_from_table_grid(event, new_index_img, id_tag_image) {
    event.preventDefault();
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let index_image = img_tag_data.get_index_image();

    if (new_index_img != index_image) {
        console.log("Change image");
        img_tag_data.set_next_selected_tag(id_tag_image);
        let delay_call = new DelayCall([]);
        delay_call.push_function(function(){call_server_save_image(delay_call);});
        delay_call.push_function(function(){call_server_load_image(delay_call, new_index_img);});
        delay_call.push_function(function(){image_window_load_image(delay_call);});
        delay_call.call_next_function();
    }
    else {
        console.log("Change tag");
        img_tag_data.set_selected_id_tag(id_tag_image);
        let delay_call = new DelayCall([]);
        delay_call.push_function(function(){image_window_select_tag(delay_call);});
        delay_call.push_function(function(){table_grid_select_image(delay_call);});
        delay_call.push_function(function(){table_grid_select_tag(delay_call);});
        delay_call.push_function(function(){detail_tag_select_tag(delay_call);});
        delay_call.call_next_function();
    }
    log_end_function();
}

function on_mousedown_manage_tag(event) {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let tags_image = img_tag_data.get_tags_image();
    let num_tags_image = Object.keys(tags_image).length;

    let event_offset_y = unzoom(event.offsetY);
    let event_offset_x = unzoom(event.offsetX);

    //jquery set top position
    if (TEST_SELECTION) {
        $("#pointer_box").show();
        $("#pointer_box").css({[TAG_LEFT]: zoom(event_offset_x)+ PX,
                               [TAG_TOP]: zoom(event_offset_y)+ PX});
    }

    //json tag_list key list
    if (num_tags_image > 0) {
        //sort tag_list by size of the rectangle decreasing
        let order_list = get_ordered_tag_list_by_weight(tags_image);

        for (let index_tag in order_list) {
            // console.log("SELECT index_tag: " + index_tag);
            let id_tag_image = order_list[index_tag];
            // tag = key_list[order_list[tag_num]].toString();
            console.log("id_tag: " + id_tag_image);
            let left_tag = tags_image[id_tag_image][TAG_LEFT];
            let top_tag = tags_image[id_tag_image][TAG_TOP];
            let width_tag = tags_image[id_tag_image][TAG_WIDTH];
            let height_tag = tags_image[id_tag_image][TAG_HEIGHT];
            if (tags_image[id_tag_image][TAG_ACTIVE] &&
                (event_offset_x >= left_tag - SECURITY_MARGIN && event_offset_x <= left_tag + width_tag + SECURITY_MARGIN &&
                 event_offset_y >= top_tag - SECURITY_MARGIN && event_offset_y <= top_tag + height_tag + SECURITY_MARGIN)) {
                console.log("TAG MOUSE SELECTED: " + id_tag_image);
                img_tag_data.set_selected_id_tag(id_tag_image);
                img_tag_data.set_pressed_mouse_over_tag(true);

                // window.w_tag_selected = $("#"+tag);
                let previous_id_tag = img_tag_data.get_previous_id_tag();
                if (previous_id_tag != null && tags_image.hasOwnProperty(previous_id_tag)) {
                    div_previous_tag = $("#" + previous_id_tag);
                    div_previous_tag.removeClass(CLASS_DIV_TAG_SELECTED);
                    div_previous_tag.addClass(CLASS_DIV_TAG_UNSELECTED);
                    div_previous_tag.css(BORDER_COLOR, tags_image[previous_id_tag][TAG_COLOR_UNSELECTED]);
                }
                let div_selected_tag = $("#" + id_tag_image);
                div_selected_tag.removeClass(CLASS_DIV_TAG_UNSELECTED);
                div_selected_tag.addClass(CLASS_DIV_TAG_SELECTED);
                div_selected_tag.css(BORDER_COLOR, tags_image[id_tag_image][TAG_COLOR_SELECTED]);
                img_tag_data.set_previous_id_tag(id_tag_image);

                //Calculate internal border for change size of square of tag
                let horizontal_border = Math.round(width_tag / 4);
                if (horizontal_border > MAX_BORDER_SIZE_CORNER) {//max value
                    horizontal_border = MAX_BORDER_SIZE_CORNER;
                }
                if (horizontal_border < DEFAULT_BORDER_SIZE) {//min value
                    horizontal_border = DEFAULT_BORDER_SIZE;
                }

                let horizontal_izquierda = event_offset_x >= left_tag - SECURITY_MARGIN && event_offset_x <= left_tag + horizontal_border;
                let horizontal_derecha = event_offset_x >= left_tag + width_tag - horizontal_border && event_offset_x <= left_tag + width_tag + SECURITY_MARGIN;
                let horizontal_central = event_offset_x > left_tag + horizontal_border && event_offset_x < left_tag + width_tag - horizontal_border;

                //Calculate internal border for change size of square of tag
                let vertical_border = Math.round(height_tag / 4);
                if (vertical_border > MAX_BORDER_SIZE_CORNER) {//max value
                    vertical_border = MAX_BORDER_SIZE_CORNER;
                }
                if (vertical_border < DEFAULT_BORDER_SIZE) {//min value
                    vertical_border = DEFAULT_BORDER_SIZE;
                }

                let vertical_superior = event_offset_y >= top_tag - SECURITY_MARGIN && event_offset_y <= top_tag + vertical_border;
                let vertical_inferior = event_offset_y >= top_tag + height_tag - vertical_border && event_offset_y <= top_tag + height_tag + SECURITY_MARGIN;
                let vertical_central = event_offset_y > top_tag + vertical_border && event_offset_y < top_tag + height_tag - vertical_border;


                if (TEST_SELECTION) {
                    $("#border_box").show();
                    $("#border_box").css({[TAG_LEFT]: String(zoom(left_tag) - SECURITY_MARGIN) + PX,
                                         [TAG_TOP]: String(zoom(top_tag) - SECURITY_MARGIN) + PX,
                                         [TAG_WIDTH]: String(zoom(width_tag) + (2 * SECURITY_MARGIN)) + PX,
                                         [TAG_HEIGHT]: String(zoom(height_tag) + (2 * SECURITY_MARGIN)) + PX,
                                         "border": SECURITY_MARGIN + PX + " solid yellow",
                                        });
                    $("#margin_box").show();
                    $("#margin_box").css({[TAG_LEFT]: String(zoom(left_tag) + DEFAULT_BORDER_SIZE) + PX,
                                          [TAG_TOP]: String(zoom(top_tag) + DEFAULT_BORDER_SIZE) + PX,
                                          [TAG_WIDTH]: String(zoom(width_tag) - (2 * DEFAULT_BORDER_SIZE)) + PX,
                                          [TAG_HEIGHT]: String(zoom(height_tag) - (2 * DEFAULT_BORDER_SIZE)) + PX,
                                          "border": String(MAX_BORDER_SIZE_CORNER - DEFAULT_BORDER_SIZE) + PX + " solid red",
                    });
                }

                //esquina inferior derecha
                if (horizontal_derecha && vertical_inferior) {
                    //console.log("esquina inferior derecha");
                    img_tag_data.set_operation_selected_tag(OPERATION_CHANGE_SIZE);
                    img_tag_data.set_x_side_selected_tag(SIDE_X_RIGHT);
                    img_tag_data.set_y_side_selected_tag(SIDE_Y_BOTTOM);
                }
                //esquina inferior izquierda
                else if (horizontal_izquierda && vertical_inferior) {
                    //console.log("esquina inferior izquierda");
                    img_tag_data.set_operation_selected_tag(OPERATION_CHANGE_SIZE);
                    img_tag_data.set_x_side_selected_tag(SIDE_X_LEFT);
                    img_tag_data.set_y_side_selected_tag(SIDE_Y_BOTTOM);
                }
                //esquina superior derecha
                else if (horizontal_derecha && vertical_superior) {
                    //console.log("esquina superior derecha");
                    img_tag_data.set_operation_selected_tag(OPERATION_CHANGE_SIZE);
                    img_tag_data.set_x_side_selected_tag(SIDE_X_RIGHT);
                    img_tag_data.set_y_side_selected_tag(SIDE_Y_TOP);
                }
                //esquina superior izquierda
                else if (horizontal_izquierda && vertical_superior) {
                    //console.log("esquina superior izquierda");
                    img_tag_data.set_operation_selected_tag(OPERATION_CHANGE_SIZE);
                    img_tag_data.set_x_side_selected_tag(SIDE_X_LEFT);
                    img_tag_data.set_y_side_selected_tag(SIDE_Y_TOP);
                }
                //borde izquierdo
                else if (horizontal_izquierda && vertical_central) {
                    //console.log("borde izquierdo");
                    img_tag_data.set_operation_selected_tag(OPERATION_CHANGE_SIZE_HORIZONTAL);
                    img_tag_data.set_x_side_selected_tag(SIDE_X_LEFT);
                    img_tag_data.set_y_side_selected_tag(SIDE_Y_TOP);
                }
                //borde derecho
                else if (horizontal_derecha && vertical_central) {
                    //console.log("borde derecho");
                    img_tag_data.set_operation_selected_tag(OPERATION_CHANGE_SIZE_HORIZONTAL);
                    img_tag_data.set_x_side_selected_tag(SIDE_X_RIGHT);
                    img_tag_data.set_y_side_selected_tag(SIDE_Y_TOP);
                }
                //borde superior
                else if (horizontal_central && vertical_superior) {
                    //console.log("borde superior");
                    img_tag_data.set_operation_selected_tag(OPERATION_CHANGE_SIZE_VERTICAL);
                    img_tag_data.set_x_side_selected_tag(SIDE_X_RIGHT);
                    img_tag_data.set_y_side_selected_tag(SIDE_Y_TOP);
                }
                //borde inferior
                else if (horizontal_central && vertical_inferior) {
                    //console.log("borde inferior");
                    img_tag_data.set_operation_selected_tag(OPERATION_CHANGE_SIZE_VERTICAL);
                    img_tag_data.set_x_side_selected_tag(SIDE_X_RIGHT);
                    img_tag_data.set_y_side_selected_tag(SIDE_Y_BOTTOM);
                }
                //interno
                else if (horizontal_central && vertical_central) {
                    //console.log("mover");
                    img_tag_data.set_operation_selected_tag(OPERATION_CHANGE_POSITION);
                }
                else {
                    console.trace();
                    console.log("on_mousedown_manage_tag: Operación no controlada");
                    alert("Operación no controlada");
                    img_tag_data.selected_id_tag = null;
                }
                // In case a tag is selected, the mouse position inside the tag must be saved
                // to avoid abrupt movements
                img_tag_data.set_x_offset_inside_selected_tag(event_offset_x - left_tag);
                img_tag_data.set_y_offset_inside_selected_tag(event_offset_y - top_tag);
                break;
            }
        }
    }

    // If no tag is selected, a new tag is created
    let pressed_mouse_over_tag = img_tag_data.get_pressed_mouse_over_tag();
    if (!pressed_mouse_over_tag) {
        new_id_tag = calculate_new_id_tag_image();
        img_tag_data.set_selected_id_tag(new_id_tag);
        img_tag_data.set_pressed_mouse_over_tag(true);
        img_tag_data.set_operation_selected_tag(OPERATION_CHANGE_SIZE);
        img_tag_data.set_x_side_selected_tag(SIDE_X_RIGHT);
        img_tag_data.set_y_side_selected_tag(SIDE_Y_BOTTOM);
        let width_tag = 1;
        let height_tag = 1;
        image_window_add_tag_image(new_id_tag, event_offset_x, event_offset_y, width_tag, height_tag);


        let delay_call = new DelayCall([]);
        delay_call.push_function(function(){image_window_select_tag(delay_call);});
        let load_table_mode = false;
        delay_call.push_function(function(){table_grid_add_tag_row(delay_call, new_id_tag, load_table_mode)});
        delay_call.push_function(function(){table_grid_select_tag(delay_call)});
        delay_call.push_function(function(){detail_tag_select_tag(delay_call);});
        delay_call.call_next_function();
    }
    else {
        let delay_call = new DelayCall([]);
        delay_call.push_function(function(){image_window_select_tag(delay_call)});
        delay_call.push_function(function(){table_grid_select_tag(delay_call)});
        delay_call.push_function(function(){detail_tag_select_tag(delay_call);});
        delay_call.call_next_function();
    }

    log_end_function();
}

/**
 * Order tags by weight (size of the rectangle)
 * @param {*} num_tags_image 
 * @param {*} tags_image 
 * @returns 
 */
function get_ordered_tag_list_by_weight(tags_image) {
    // size of tags_image
    let num_tags_image = Object.keys(tags_image).length;
    let order_list = [num_tags_image];
    let weight_list = [num_tags_image];
    let num_tag = 0;
    for (let id_tag_image in tags_image) {
        order_list[num_tag] = id_tag_image;
        weight_list[id_tag_image] = tags_image[id_tag_image][TAG_WIDTH] * tags_image[id_tag_image][TAG_HEIGHT];
        num_tag += 1;
    }
    // console.log("INIT ORDER: " + num_tags_image);
    if (num_tags_image > 1) {
        //console.log("ini sort");
        let list_sorted = false;
        while (!list_sorted) {
            list_sorted = true;
            for (let i = 0; i < num_tags_image - 1; i++) {
                // console.log("ORDER " + order_list[i] + ": " + weight_list[order_list[i]] + " " + order_list[i + 1] + ": " + weight_list[order_list[i + 1]]);
                if (weight_list[order_list[i]] > weight_list[order_list[i + 1]]) {
                    // console.log("swap");
                    let tmp1 = order_list[i];
                    let tmp2 = order_list[i + 1];
                    order_list[i] = tmp2;
                    order_list[i + 1] = tmp1;
                    list_sorted = false;
                    //console.log("up");
                }
                if (weight_list[order_list[num_tags_image - 1 - i]] < weight_list[order_list[num_tags_image - 1 - i - 1]]) {
                    let tmp1 = order_list[num_tags_image - 1 - i];
                    let tmp2 = order_list[num_tags_image - 1 - i - 1];
                    order_list[num_tags_image - 1 - i] = tmp2;
                    order_list[num_tags_image - 1 - i - 1] = tmp1;
                    list_sorted = false;
                    //console.log("down");
                }
            }
        }
    }
    return order_list;
}

function on_mousemove_manage_tag(event) {
    let img_tag_data = get_window_tag_data();
    let pressed_mouse_over_tag = img_tag_data.get_pressed_mouse_over_tag();
    if (pressed_mouse_over_tag) {
        // log_ini_function();
        real_offsetX = event.offsetX;
        real_offsetY = event.offsetY;
        if (event.target.id != "div_container") {//if the mouse is outside the div_container
            let div_container = $(DIV_CONTAINER);
            let div_container_absolute_left =  div_container.offset().left;
            let div_container_absolute_top = div_container.offset().top;

            let mouse_left = event.pageX;
            let mouse_top = event.pageY;
            
            real_offsetX = Math.max(mouse_left - div_container_absolute_left, 0);//allways positive values
            real_offsetY = Math.max(mouse_top - div_container_absolute_top, 0);//allways positive values
        }

        event_offset_x = unzoom(real_offsetX);
        event_offset_y = unzoom(real_offsetY);

        let operation_selected_tag = img_tag_data.get_operation_selected_tag();
        let selected_id_tag = img_tag_data.get_selected_id_tag();
        if (operation_selected_tag == OPERATION_CHANGE_POSITION) {
            image_window_move_tag(selected_id_tag, event_offset_x, event_offset_y)
        }
        else if(operation_selected_tag == OPERATION_CHANGE_SIZE ||
                operation_selected_tag == OPERATION_CHANGE_SIZE_HORIZONTAL ||
                operation_selected_tag == OPERATION_CHANGE_SIZE_VERTICAL) {
            image_window_resize_tag(selected_id_tag, event_offset_x, event_offset_y);
        }
        else {
            console.trace();
            console.log("on_mousemove_manage_tag: Operación no controlada");
            alert("Operación no controlada");
        }
        detail_tag_update_position();
        // log_end_function();
    }
}

function on_mouseup_manage_tag(event) {
    let img_tag_data = get_window_tag_data();
    let pressed_mouse_over_tag = img_tag_data.get_pressed_mouse_over_tag();
    if (pressed_mouse_over_tag) {
        log_ini_function();

        // let img_tag_data = get_window_tag_data();
        let selected_id_tag = img_tag_data.get_selected_id_tag();
        let tags_image = img_tag_data.get_tags_image();
        image_window_check_size_boundaries_tag(selected_id_tag);
        detail_tag_update_position();
        img_tag_data.set_pressed_mouse_over_tag(false);
        img_tag_data.set_operation_selected_tag(null);
        img_tag_data.set_x_offset_inside_selected_tag(0);
        img_tag_data.set_y_offset_inside_selected_tag(0);
        img_tag_data.set_x_side_selected_tag(null);
        img_tag_data.set_y_side_selected_tag(null);

        if (tags_image[selected_id_tag][TAG_TYPE] != TAG_TYPE_SINGLE) {
            tags_image[selected_id_tag][TAG_TYPE_MULTIPLE_CALCULATED] = false;
            detail_tag_checkbox_multiple_calculated_false();
            table_grid_checkbox_multiple_calculated_change();
            table_grid_recalculate_tag_row();
        }

        log_end_function();
    }
}

function on_maximize() {
    log_ini_function();
    let main_scroll_img = $(MAIN_SCROLL_IMG);
    // get div size
    let height_div = main_scroll_img.height();
    if (height_div == MAIN_SCROLL_IMG_HEIGHT_DEFAULT) {
        main_scroll_img.height(MAIN_SCROLL_IMG_HEIGHT_DOUBLE);
    }
    else {
        let image_to_tag = $(IMAGE_TO_TAG);
        main_scroll_img.height(image_to_tag.height());
    }
    log_end_function();
}

function on_minimize(){
    log_ini_function();
    let main_scroll_img = $(MAIN_SCROLL_IMG);
    // get div size
    let height_div = main_scroll_img.height();
    if (height_div == MAIN_SCROLL_IMG_HEIGHT_DOUBLE) {
        main_scroll_img.height(MAIN_SCROLL_IMG_HEIGHT_DEFAULT);
    }
    else if (height_div == MAIN_SCROLL_IMG_HEIGHT_DEFAULT) {
        console.log("Minim size of the window");
        // alert("Minim size of the window");
    }
    else {
        main_scroll_img.height(MAIN_SCROLL_IMG_HEIGHT_DOUBLE);
    }
    log_end_function();
}



function on_zoom_in() {
    log_ini_function();
    let img_tag_data = get_window_tag_data();

    let zoom_image = img_tag_data.get_zoom_image();
    if (zoom_image < 1000) {
        zoom_image = Math.round(zoom_image + 10);
        img_tag_data.set_zoom_image(zoom_image);
        image_window_apply_zoom(null);
    }
    log_end_function();
}

function on_zoom_out() {
    log_ini_function();
    let img_tag_data = get_window_tag_data();

    let zoom_image = img_tag_data.get_zoom_image();
    if (zoom_image > 10) {
        zoom_image = Math.round(zoom_image - 10);
        img_tag_data.set_zoom_image(zoom_image);
        image_window_apply_zoom(null);
    }
    log_end_function();
}

function on_change_tag_detail_class(event){
    event.preventDefault();
    log_ini_function();

    let img_tag_data = get_window_tag_data();
    if (!img_tag_data.get_initialize_tag_type()) {
        let tags_image = img_tag_data.get_tags_image();
        let selected_id_tag = img_tag_data.get_selected_id_tag();
        let value = event.target.value;
        tags_image[selected_id_tag][TAG_CLASS] = value;
    }
    log_end_function();
}

function on_change_tag_detail_active(event){
    event.preventDefault();
    log_ini_function();

    let img_tag_data = get_window_tag_data();
    if (!img_tag_data.get_initialize_tag_type()) {

        let tags_image = img_tag_data.get_tags_image();
        let selected_id_tag = img_tag_data.get_selected_id_tag();
        let checkbox_value = event.target.checked;
        tags_image[selected_id_tag][TAG_ACTIVE] = checkbox_value;

        image_window_checkbox_active_change();
        table_grid_checkbox_active_change();
        table_grid_recalculate_tag_row();
        detail_tag_checkbox_active_change();
    }
    log_end_function();
}


/**
 * On change the tag type update the tag type in the tag list
 * @param {*} event 
 */
function on_change_tag_detail_tag_type(event){
    event.preventDefault();
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    if (!img_tag_data.get_initialize_tag_type()) {
        let tags_image = img_tag_data.get_tags_image();
        let selected_id_tag = img_tag_data.get_selected_id_tag();
        let value = event.target.value;
        tags_image[selected_id_tag][TAG_TYPE] = value;
        img_tag_data.set_last_type_tag(value);

        table_grid_recalculate_tag_row();
        tag_detail_visible_type_multiple();
    }
    log_end_function();
}

function on_change_tag_detail_multiple_calculated(event){
    event.preventDefault();
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    if (!img_tag_data.get_initialize_tag_type()) {
        let tags_image = img_tag_data.get_tags_image();
        let selected_id_tag = img_tag_data.get_selected_id_tag();
        let value = event.target.checked;
        tags_image[selected_id_tag][TAG_TYPE_MULTIPLE_CALCULATED] = value;

        table_grid_checkbox_multiple_calculated_change();
        table_grid_recalculate_tag_row();
    }
    log_end_function();
}

function on_change_tag_detail_multiple_initial(event){
    event.preventDefault();
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    if (!img_tag_data.get_initialize_tag_type()) {
        let tags_image = img_tag_data.get_tags_image();
        let selected_id_tag = img_tag_data.get_selected_id_tag();
        let checkbox_value = event.target.checked;
        tags_image[selected_id_tag][TAG_TYPE_MULTIPLE_INITIAL] = checkbox_value;
        tags_image[selected_id_tag][TAG_TYPE_MULTIPLE_CALCULATED] = false;

        detail_tag_checkbox_multiple_calculated_false();
        table_grid_checkbox_multiple_calculated_change();
        table_grid_recalculate_tag_row();
    }
    log_end_function();
}

function on_change_tag_detail_multiple_final(event){
    event.preventDefault();
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    if (!img_tag_data.get_initialize_tag_type()) {
        let tags_image = img_tag_data.get_tags_image();
        let selected_id_tag = img_tag_data.get_selected_id_tag();
        let checkbox_value = event.target.checked;
        tags_image[selected_id_tag][TAG_TYPE_MULTIPLE_FINAL] = checkbox_value;
        tags_image[selected_id_tag][TAG_TYPE_MULTIPLE_CALCULATED] = false;

        detail_tag_checkbox_multiple_calculated_false()
        table_grid_checkbox_multiple_calculated_change();
        table_grid_recalculate_tag_row();
    }
    log_end_function();
}

function on_change_tag_color_selected(event){
    event.preventDefault();
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    if (!img_tag_data.get_initialize_tag_type()) {
        let tags_image = img_tag_data.get_tags_image();
        let selected_id_tag = img_tag_data.get_selected_id_tag();
        let value = event.target.value;
        tags_image[selected_id_tag][TAG_COLOR_SELECTED] = value;

        image_window_color_selected_change();
    }
    log_end_function();
}

function image_window_color_selected_change() {
    log_ini_function();

    let img_tag_data = get_window_tag_data();
    let tags_image = img_tag_data.get_tags_image();
    let selected_id_tag = img_tag_data.get_selected_id_tag();
   
    let div_selected_tag = $("#" + selected_id_tag);
    div_selected_tag.css(BORDER_COLOR, tags_image[selected_id_tag][TAG_COLOR_SELECTED]);
    log_end_function();
}

function on_change_tag_color_unselected(event){
    event.preventDefault();
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    if (!img_tag_data.get_initialize_tag_type()) {
        let tags_image = img_tag_data.get_tags_image();
        let selected_id_tag = img_tag_data.get_selected_id_tag();
        let value = event.target.value;
        tags_image[selected_id_tag][TAG_COLOR_UNSELECTED] = value;
    }
    log_end_function();
}

///////////////////////////////////////////////
///////////// CALLS FROM SERVER ///////////////
///////////////////////////////////////////////

/**
 * Load the specified image from server
 * @param {*} delay_call 
 */
function call_server_load_image(delay_call, index_image) {
    log_ini_function();
    let url = URL_IMAGE.slice(0, -1) + index_image;
    console.log("url: " + url);

    let img_tag_data = get_window_tag_data();
    $.ajax({
        url: url,
        type: "GET",
        contentType: 'application/json',
        success: function (response) {
            console.log(JSON.stringify(response));
            // if response data status is success, load the data else show an alert
            let status = response[JSON_STATUS];
            if (status == JSON_STATUS_SUCCESS) {
                // console.log(data);
                let num_current_img = response.data.num_current_img;
                console.log("num_current_img: " + num_current_img);
                img_tag_data.set_index_image(num_current_img);

                let data_image = response.data.image;
                console.log("data_image: " + data_image);
                img_tag_data.set_data_image(data_image);

                let tags_image = data_image["tags"];
                img_tag_data.set_tags_image(tags_image);

                previous_id_tag = img_tag_data.get_previous_id_tag();
                if (!tags_image.hasOwnProperty(previous_id_tag)) {
                    img_tag_data.set_previous_id_tag(null);
                }
                selected_id_tag = img_tag_data.get_selected_id_tag();
                if (!tags_image.hasOwnProperty(selected_id_tag)) {
                    img_tag_data.set_selected_id_tag(null);
                }

                call_next_function(delay_call);
            } else {
                status_error(response);
            }
        },
        error: function(xhr, status, error) {
            connection_error(xhr, status, error);
        },
    });
}

/**
 * Load all the data tags from server
 * @param {*} delay_call 
 */
function call_server_get_table_grid(delay_call) {
    log_ini_function();
    operation_json = {
        "operation": "load_tags",
    };
    $.ajax({
        url: URL_TAGS,
        type: "GET",
        contentType: 'application/json',
        success: function (response) {
            console.log(JSON.stringify(response));
            // if response data status is success, load the data else show an alert
            let status = response[JSON_STATUS];
            if (status == JSON_STATUS_SUCCESS) {
                let img_tag_data = get_window_tag_data();
                let data_images = response.config.images;
                img_tag_data.set_data_images(data_images);
                let num_images = data_images.length;
                console.log("num_images: " + num_images);
                img_tag_data.set_num_images(num_images);

                call_next_function(delay_call);
            } else {
                status_error(response);
            }
        },
        error: function(xhr, status, error) {
            connection_error(xhr, status, error);
        },
    });
    log_end_function();
}

function call_server_save_image(delay_call) {
    log_ini_function();

    let img_tag_data = get_window_tag_data();
    let operation = "save_tags";
    let tags_image = img_tag_data.get_tags_image();
    let index_image = img_tag_data.get_index_image();

    operation_json = {
        "operation": operation,
        "img_tags": tags_image,
        "num_current_img": index_image,
    };

    let url = URL_IMAGE.slice(0, -1) + index_image.toString();
    console.log("url: " + url);

    $.ajax({
        url: url,
        type: "POST",
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(operation_json),
        success: function (response) {
            console.log(JSON.stringify(response));
            // if response data status is success, load the data else show an alert
            let status = response[JSON_STATUS];
            if (status == JSON_STATUS_SUCCESS) {
                console.log(response);
                let data_images = response.data.config.images;
                img_tag_data.set_data_images(data_images);
            } else {
                status_error(response);
            }
            call_next_function(delay_call);
        },
        error: function(xhr, status, error) {
            connection_error(xhr, status, error);
        },
    });
    log_end_function();
}

function call_server_delete_image(delay_call) {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let operation = "delete_image";
    let tags_image = img_tag_data.get_tags_image();
    let index_image = img_tag_data.get_index_image();

    operation_json = {
        "operation": operation,
        "img_tags": tags_image,
        "num_current_img": index_image,
    };

    let url = URL_IMAGE.slice(0, -1) + index_image.toString();
    console.log("url: " + url);

    $.ajax({
        url: url,
        type: "DELETE",
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(operation_json),
        success: function (response) {
            console.log(JSON.stringify(response));
            // if response data status is success, load the data else show an alert
            let status = response[JSON_STATUS];
            if (status == JSON_STATUS_SUCCESS) {
                console.log(response);
                let img_tag_data = get_window_tag_data();
                index_image = img_tag_data.get_index_image();
                if (index_image > 0) {
                    img_tag_data.set_index_image(index_image - 1);
                }
                num_images = img_tag_data.get_num_images();
                img_tag_data.set_num_images(num_images - 1);
                on_click_restore_tags(null);
            } else {
                status_error(response);
            }
            call_next_function(delay_call);
        },
        error: function(xhr, status, error) {
            connection_error(xhr, status, error);
        },
    });
    log_end_function();
}

///////////////////////////////////////////////////
///////////// TAGS MAIN IMAGE WINDOW///////////////
///////////////////////////////////////////////////

function image_window_load_image(delay_call) {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let index_image = img_tag_data.get_index_image();

    let input_img_number = $(INPUT_IMG_NUMBER);
    input_img_number.val(index_image + 1);

    let data_image = img_tag_data.get_data_image();

    let img = $(IMAGE_TO_TAG);
    img.attr("src", URL_STATIC_IMAGE + '/' + data_image.name);

    let div_container = $(DIV_CONTAINER);
    //Set background color transparent
    div_container.css("background-color", "transparent");
    //Delete div tag
    $("$div_loading").remove();

    call_next_function(delay_call);
    log_end_function();
}

/**
 * Load the natural size of the image
 * @param {*} delay_call 
 */
function image_window_load_natural_size_image(delay_call) {
    log_ini_function();

    let img_tag_data = get_window_tag_data();
    let img = $(IMAGE_TO_TAG);    
    img_tag_data.set_natural_width_image(img[0].naturalWidth);
    img_tag_data.set_natural_height_image(img[0].naturalHeight);

    call_next_function(delay_call);
    log_end_function();
}

/**
 * Set the position of the specified tag of image window
 * @param {*} id_tag_image 
 * @param {*} left_tag 
 * @param {*} top_tag 
 * @param {*} width_tag 
 * @param {*} height_tag 
 */
function image_window_set_tag_position(id_tag_image, left_tag, top_tag, width_tag, height_tag) {
    // log_ini_function();
    let img_tag_data = get_window_tag_data();
    let tags_image = img_tag_data.get_tags_image();

    let real_pos_x = zoom(left_tag);
    let real_pos_y = zoom(top_tag);
    // let real_size_x = zoom(width_tag) - (2 * DEFAULT_BORDER_SIZE);
    let real_size_x = zoom(width_tag);
    if (real_size_x < 0) {
        real_size_x = 0;
    }
    // let real_size_y = zoom(height_tag) - (2 * DEFAULT_BORDER_SIZE);
    let real_size_y = zoom(height_tag);
    if (real_size_y < 0) {
        real_size_y = 0;
    }
    let div_tag = $("#"+id_tag_image);
    div_tag.css({
        [TAG_LEFT]: real_pos_x + PX,
        [TAG_TOP]: real_pos_y + PX,
        [TAG_WIDTH]: real_size_x + PX,
        [TAG_HEIGHT]: real_size_y + PX,
        [BORDER_SIZE]: DEFAULT_BORDER_SIZE + PX,
    });
    tags_image[id_tag_image][TAG_LEFT] = left_tag;
    tags_image[id_tag_image][TAG_TOP] = top_tag;
    tags_image[id_tag_image][TAG_WIDTH] = width_tag;
    tags_image[id_tag_image][TAG_HEIGHT] = height_tag;
    // log_end_function();
}

/**
 * Apply the zoom value to the image and tags
 * @param {*} delay_call 
 */
function image_window_apply_zoom(delay_call) {
    log_ini_function();
    let img_tag_data = get_window_tag_data();

    let zoom_image = img_tag_data.get_zoom_image();
    console.log("zoom_image: " + zoom_image);

    // window.w_input_zoom_value = zoom_image;
    let input_zoom_value = $(INPUT_ZOOM_VALUE);
    input_zoom_value.val(zoom_image);

    let img = $(IMAGE_TO_TAG);
    let zoom_width_img = zoom(img_tag_data.get_natural_width_image());
    let zoom_height_img = zoom(img_tag_data.get_natural_height_image());
    console.log("DIV_CONTAINER zoom img_width: " + zoom_width_img);
    console.log("DIV_CONTAINER zoom img_height: " + zoom_height_img);

    img.css({
        [TAG_WIDTH]: zoom_width_img,
        [TAG_HEIGHT]: zoom_height_img,
    });

    let div_container = $(DIV_CONTAINER);
    div_container.css({
        [TAG_WIDTH]: zoom_width_img,
        [TAG_HEIGHT]: zoom_height_img,
    });

    let tags_image = img_tag_data.get_tags_image();
    for (let id_tag_image in tags_image) {
        console.log("zoom tag_id: " + id_tag_image);
        let tag_json = tags_image[id_tag_image];
        let left_tag = tag_json[TAG_LEFT];
        let top_tag = tag_json[TAG_TOP];
        let width_tag = tag_json[TAG_WIDTH];
        let height_tag = tag_json[TAG_HEIGHT];
        image_window_set_tag_position(id_tag_image, left_tag, top_tag, width_tag, height_tag)
    }

    call_next_function(delay_call);
    log_end_function();
}

/**
 * Calculate the zoom value and apply it to the image or tag
 * @param {*} value 
 * @returns 
 */
function zoom(value) {
    let img_tag_data = get_window_tag_data();
    let zoom_image = img_tag_data.get_zoom_image();
    let calc = Math.round(value * (zoom_image / 100));
    return calc;
}

/**
 * Calculate the unzoom value and apply it to the image or tag
 * @param {*} value 
 * @returns 
 */
function unzoom(value) {
    let img_tag_data = get_window_tag_data();
    let zoom_image = img_tag_data.get_zoom_image();
    let calc = Math.round(value / (zoom_image / 100));
    return calc;
}

/**
 * Remove all the tags from image
 * @param {*} delay_call 
 */
function image_window_remove_all_tags_image(delay_call) {
    log_ini_function();
    let tag_array = $(DIV_TAG);
    for (let tag of tag_array) {
        tag.remove();
    }
    call_next_function(delay_call);
    log_end_function();
}

/**
 * Add all the tags to image window
 * @param {*} delay_call 
 */
function image_window_add_all_tags_image(delay_call) {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let tags_image = img_tag_data.get_tags_image();

    let selected_id_tag = img_tag_data.get_selected_id_tag();
    let next_selected_tag = img_tag_data.get_next_selected_tag();
    if (next_selected_tag != null) {
        selected_id_tag = next_selected_tag;
        img_tag_data.set_next_selected_tag(null);
        img_tag_data.set_selected_id_tag(selected_id_tag);
    }

    let selected_id_tag_encontrado = false;
    let selected_id_tag_active = null;
    for (let id_tag_image in tags_image) {
        if (id_tag_image == selected_id_tag) {
            selected_id_tag_encontrado = true;
            break;
        }
        if (selected_id_tag_active == null) {
            if (tags_image[id_tag_image][TAG_ACTIVE]) {
                selected_id_tag_active = id_tag_image;
            }
        }
    }
    if (!selected_id_tag_encontrado) {
        if (selected_id_tag_active != null) {
            img_tag_data.set_selected_id_tag(selected_id_tag_active);
            img_tag_data.set_previous_id_tag(selected_id_tag_active);
        }
        else {
            for (let id_tag_image in tags_image) {
                img_tag_data.set_selected_id_tag(id_tag_image);
                img_tag_data.set_previous_id_tag(id_tag_image);
                break;
            }
        }
    }

    console.log("tags_image: " + tags_image);

    for (let id_tag_image in tags_image) {
        console.log("image_window_add_all_tags_image - add tag: " + id_tag_image);
        if (tags_image[id_tag_image][TAG_ACTIVE]) {
            let left_tag = tags_image[id_tag_image].left;
            let top_tag = tags_image[id_tag_image].top;
            let width_tag = tags_image[id_tag_image].width;
            let height_tag = tags_image[id_tag_image].height;
            image_window_add_tag_image(id_tag_image, left_tag, top_tag, width_tag, height_tag);
            image_window_check_size_boundaries_tag(id_tag_image);
            img_tag_data.set_previous_id_tag(id_tag_image);
            image_window_select_tag(null);
        }

    }

    

    call_next_function(delay_call);
    log_end_function();
}


/**
 * Add a tag to image window
 * @param {*} id_tag_image 
 * @param {*} event_offset_x 
 * @param {*} event_offset_y 
 * @param {*} width_tag 
 * @param {*} height_tag 
 */
function image_window_add_tag_image(id_tag_image, event_offset_x, event_offset_y, width_tag, height_tag) {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let tags_image = img_tag_data.get_tags_image();
    let num_tags_image = Object.keys(tags_image).length;

    if (num_tags_image <= MAX_NUM_TAG) {
        let main_scroll_img = $(MAIN_SCROLL_IMG);
        main_scroll_img.append("<div id='" + id_tag_image + "' class='div_tag div_tag_unselected'></div>");

        let color_selected = TAG_COLOR_SELECTED_DEFAULT;
        let color_unselected = TAG_COLOR_UNSELECTED_DEFAULT;
        previous_id_tag = img_tag_data.get_previous_id_tag();
        if (previous_id_tag != null && tags_image.hasOwnProperty(previous_id_tag)) {
            color_selected = tags_image[previous_id_tag][TAG_COLOR_SELECTED];
            color_unselected = tags_image[previous_id_tag][TAG_COLOR_UNSELECTED];
        }

        if (tags_image[id_tag_image] == null) {
            tags_image[id_tag_image] = {
                [TAG_TYPE]: img_tag_data.get_last_type_tag(),
                [TAG_ACTIVE]: true,
                [TAG_TYPE_MULTIPLE_CALCULATED]: false,
                [TAG_TYPE_MULTIPLE_INITIAL]: false,
                [TAG_TYPE_MULTIPLE_FINAL]: false,
                [TAG_LEFT]: event_offset_x,
                [TAG_TOP]: event_offset_y,
                [TAG_WIDTH]: width_tag,
                [TAG_HEIGHT]: height_tag,
                [TAG_CLASS]: '',
                [TAG_COLOR_SELECTED]: color_selected,
                [TAG_COLOR_UNSELECTED]: color_unselected,
            };
        }
        else {
            tags_image[id_tag_image][TAG_LEFT] = event_offset_x;
            tags_image[id_tag_image][TAG_TOP] = event_offset_y;
            tags_image[id_tag_image][TAG_WIDTH] = width_tag;
            tags_image[id_tag_image][TAG_HEIGHT] = height_tag;
        }

        // image_window_move_tag(id_tag_image, event_offset_x, event_offset_y);
        image_window_set_tag_position(id_tag_image, 
                                      tags_image[id_tag_image][TAG_LEFT], 
                                      tags_image[id_tag_image][TAG_TOP], 
                                      tags_image[id_tag_image][TAG_WIDTH], 
                                      tags_image[id_tag_image][TAG_HEIGHT])

    }
    else {
        console.log("image_window_add_tag_image: No se pueden agregar mas de " + MAX_NUM_TAG + " tags");
        alert("No se pueden agregar mas de " + MAX_NUM_TAG + " tags");
    }
}

/**
 * Select the specified tag of image window
 */
function image_window_select_tag(delay_call) {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let selected_id_tag = img_tag_data.get_selected_id_tag();
    if (selected_id_tag != null) {
        let tags_image = img_tag_data.get_tags_image();

        let previous_id_tag = img_tag_data.get_previous_id_tag();
        if (previous_id_tag != null && tags_image.hasOwnProperty(previous_id_tag)) {
            let div_previous_tag = $("#" + previous_id_tag)
            div_previous_tag.removeClass(CLASS_DIV_TAG_SELECTED).addClass(CLASS_DIV_TAG_UNSELECTED);
            div_previous_tag.css(BORDER_COLOR, tags_image[previous_id_tag][TAG_COLOR_UNSELECTED]);
        }

        if (tags_image[selected_id_tag][TAG_ACTIVE]) {
            let div_selected_tag = $("#" + selected_id_tag)
            div_selected_tag.removeClass(CLASS_DIV_TAG_UNSELECTED).addClass(CLASS_DIV_TAG_SELECTED);
            div_selected_tag.css(BORDER_COLOR, tags_image[selected_id_tag][TAG_COLOR_SELECTED]);
            img_tag_data.set_previous_id_tag(selected_id_tag);
        }
    }

    call_next_function(delay_call);
    log_end_function();
}

//img 925x1388
/**
 * Aply the offset position to the specified tag of image window
 * @param {*} selected_id_tag 
 * @param {*} event_offset_x 
 * @param {*} event_offset_y 
 */
function image_window_move_tag(id_tag_image, event_offset_x, event_offset_y) {
    // log_ini_function();
    let img_tag_data = get_window_tag_data();
    let tags_image = img_tag_data.get_tags_image();

    let tag_json = tags_image[id_tag_image];

    let div_tag_width = tag_json[TAG_WIDTH];
    let div_tag_height = tag_json[TAG_HEIGHT];
    let width_tag = tag_json[TAG_WIDTH];
    let heigth_tag = tag_json[TAG_HEIGHT];
    let x_offset_inside_selected_tag = img_tag_data.get_x_offset_inside_selected_tag();
    let y_offset_inside_selected_tag = img_tag_data.get_y_offset_inside_selected_tag();
    let natural_width_image = img_tag_data.get_natural_width_image();
    let natural_height_image = img_tag_data.get_natural_height_image();

    let left_tag_with_offset = event_offset_x - x_offset_inside_selected_tag;
    if (left_tag_with_offset + div_tag_width > natural_width_image) {
        left_tag_with_offset = natural_width_image - div_tag_width;
    }
    if (left_tag_with_offset < 0) {
        left_tag_with_offset = 0;
    }
    let top_tag_with_offset = event_offset_y - y_offset_inside_selected_tag;
    if (top_tag_with_offset + div_tag_height > natural_height_image) {
        top_tag_with_offset = natural_height_image - div_tag_height;
    }
    if (top_tag_with_offset < 0) {
        top_tag_with_offset = 0;
    }
    image_window_set_tag_position(id_tag_image, left_tag_with_offset, top_tag_with_offset, width_tag, heigth_tag);

    // log_end_function();
}

/**
 * Check the boundaries of the specified tag of image window
 */
function image_window_check_size_boundaries_tag(id_tag_image) {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    // let selected_id_tag = img_tag_data.get_selected_id_tag();
    let tags_image = img_tag_data.get_tags_image();

    let recalculate_tag_size = false;
    let width_tag = tags_image[id_tag_image][TAG_WIDTH];
    if (width_tag < MIN_SIDE_LENGTH) {
        width_tag = MIN_SIDE_LENGTH;
        tags_image[id_tag_image][TAG_WIDTH] = width_tag;
        recalculate_tag_size = true;
    }
    let height_tag = tags_image[id_tag_image][TAG_HEIGHT];
    if (height_tag < MIN_SIDE_LENGTH) {
        height_tag = MIN_SIDE_LENGTH;
        tags_image[id_tag_image][TAG_HEIGHT] = height_tag;
        recalculate_tag_size = true;
    }
    if (recalculate_tag_size) {
        let left_tag = tags_image[id_tag_image][TAG_LEFT];
        let top_tag = tags_image[id_tag_image][TAG_TOP];
        image_window_set_tag_position(id_tag_image, left_tag, top_tag, width_tag, height_tag)
    }

    log_end_function();
}

/**
 * Resize the specified tag of image window
 * @param {*} id_tag_image 
 * @param {*} event_offset_x 
 * @param {*} event_offset_y 
 */
function image_window_resize_tag(id_tag_image, event_offset_x, event_offset_y) {
    // log_ini_function();
    let img_tag_data = get_window_tag_data();
    let tags_image = img_tag_data.get_tags_image();
    let operation_selected_tag = img_tag_data.get_operation_selected_tag();

    let tag = tags_image[id_tag_image];
    let left_tag = tag[TAG_LEFT];
    let top_tag = tag[TAG_TOP];
    let width_tag = tag[TAG_WIDTH];
    let height_tag = tag[TAG_HEIGHT];

    if (operation_selected_tag != OPERATION_CHANGE_SIZE_VERTICAL) {
    //     left_tag = tag[TAG_LEFT];
    //     width_tag = tag[TAG_WIDTH];
    // }
    // else {
        const horizontal = check_horizontal_boundaries(tag, event_offset_x);
        left_tag = horizontal[0];
        width_tag = horizontal[1];
    }

    if (operation_selected_tag != OPERATION_CHANGE_SIZE_HORIZONTAL) {
    //     top_tag = tag[TAG_TOP];
    //     height_tag = tag[TAG_HEIGHT];
    // }
    // else {
        const vertical = check_vertical_boundaries(tag, event_offset_y);
        top_tag = vertical[0];
        height_tag = vertical[1];
    }
    image_window_set_tag_position(id_tag_image, left_tag, top_tag, width_tag, height_tag);
    // log_end_function();
}

/**
 * Check boundaries of tag size in horizontal direction
 * @param {*} tag 
 * @param {*} event_offset_x 
 * @returns 
 */
function check_horizontal_boundaries(tag, event_offset_x) {
    // log_ini_function();
    let img_tag_data = get_window_tag_data();

    let div_left_tag = tag[TAG_LEFT];
    let div_width_tag = tag[TAG_WIDTH];
    let left_tag = 0;
    let width_tag = 0;

    let x_side_selected = img_tag_data.get_x_side_selected_tag()
    if (x_side_selected != SIDE_X_LEFT && event_offset_x <= div_left_tag) {
        img_tag_data.set_x_side_selected_tag(SIDE_X_LEFT);
        x_side_selected = SIDE_X_LEFT;
    }
    if (x_side_selected != SIDE_X_RIGHT && event_offset_x >= div_left_tag + div_width_tag) {
        img_tag_data.set_x_side_selected_tag(SIDE_X_RIGHT);
        x_side_selected = SIDE_X_RIGHT;
    }
    //console.log("window.w_tag_selected_side_x: " + window.w_tag_selected_side_x);
    if (x_side_selected == SIDE_X_RIGHT) {
        left_tag = div_left_tag;
        width_tag = event_offset_x - div_left_tag;
        let natural_width_image = img_tag_data.get_natural_width_image();
        if (left_tag + width_tag > natural_width_image) {
            width_tag = natural_width_image - left_tag;
        }
    }
    else {
        left_tag = event_offset_x;
        width_tag = (div_left_tag + div_width_tag) - event_offset_x;
    }

    // log_end_function();
    return [left_tag, width_tag];
}

/**
 * Check boundaries of tag size in vertical direction
 * @param {*} tag_json 
 * @param {*} event_offset_y 
 * @returns 
 */
function check_vertical_boundaries(tag_json, event_offset_y) {
    // log_ini_function();
    let img_tag_data = get_window_tag_data();

    let div_top_tag = tag_json[TAG_TOP];
    let div_height_tag = tag_json[TAG_HEIGHT];
    let top_tag = 0;
    let height_tag = 0;

    if (event_offset_y < div_top_tag) {
        img_tag_data.set_y_side_selected_tag(SIDE_Y_TOP);
    }
    if (event_offset_y > div_top_tag + div_height_tag) {
        img_tag_data.set_y_side_selected_tag(SIDE_Y_BOTTOM);
    }
    if (img_tag_data.get_y_side_selected_tag() == SIDE_Y_BOTTOM) {
        top_tag = div_top_tag;
        height_tag = event_offset_y - top_tag;
        let natural_height_image = img_tag_data.get_natural_height_image();
        if (top_tag + height_tag > natural_height_image) {
            height_tag = natural_height_image - top_tag;
        }
    }
    else {
        top_tag = event_offset_y;
        height_tag = (div_top_tag + div_height_tag) - event_offset_y;
    }

    // log_end_function();
    return [top_tag, height_tag];
}

/**
 * Delete the specified tag of image window
 * @param {*} id_tag_image 
 */
function image_window_delete_tag(id_tag_image) {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let tags_image = img_tag_data.get_tags_image();
    let div_selected_tag = $("#" + id_tag_image);
    div_selected_tag.remove();

    delete tags_image[id_tag_image];
    img_tag_data.set_selected_id_tag(null);
    img_tag_data.set_previous_id_tag(null);
    img_tag_data.set_operation_selected_tag(null);
    img_tag_data.set_x_offset_inside_selected_tag(0);
    img_tag_data.set_y_offset_inside_selected_tag(0);
    img_tag_data.set_x_side_selected_tag(null);
    img_tag_data.set_y_side_selected_tag(null);

    log_end_function();
}

function image_window_checkbox_active_change() {
    log_ini_function();

    let img_tag_data = get_window_tag_data();
    let tags_image = img_tag_data.get_tags_image();
    let selected_id_tag = img_tag_data.get_selected_id_tag();
    let tag_active = tags_image[selected_id_tag][TAG_ACTIVE];

    if (tag_active) {
        let main_scroll_img = $(MAIN_SCROLL_IMG);
        main_scroll_img.append("<div id='" + selected_id_tag + "' class='div_tag div_tag_unselected'></div>");
        //get tag div
        // let div_tag = $("#" + selected_id_tag);
        // div_tag.css({
        //     [TAG_WIDTH]: tags_image[selected_id_tag][TAG_WIDTH] + PX,
        //     [TAG_HEIGHT]: tags_image[selected_id_tag][TAG_HEIGHT] + PX,
        //     [BORDER_SIZE]: DEFAULT_BORDER_SIZE,
        // });

        // image_window_move_tag(selected_id_tag, tags_image[selected_id_tag][TAG_LEFT], tags_image[selected_id_tag][TAG_TOP]);
        image_window_set_tag_position(selected_id_tag, 
                                      tags_image[selected_id_tag][TAG_LEFT], 
                                      tags_image[selected_id_tag][TAG_TOP], 
                                      tags_image[selected_id_tag][TAG_WIDTH], 
                                      tags_image[selected_id_tag][TAG_HEIGHT])
        image_window_select_tag(null);
    }
    else {
        let div_selected_tag = $("#" + selected_id_tag);
        div_selected_tag.remove();
    }
    log_end_function();
}

////////////////////////////////////////////
///////////// TAGS TABLE GRID///////////////
////////////////////////////////////////////

const TABLE_GRID_TAG_ACTIVE = '<i class="fa-solid fa-x fa-inverse" ></i>';
const TABLE_GRID_TAG_ACTIVE_CALCULATED = '<i class="fa-solid fa-ellipsis fa-inverse"></i>';
const TABLE_GRID_TAG_NOT_ACTIVE = '';

/**
 * Load all the table grid
 * @param {*} delay_call 
 */
function table_grid_load_all_table(delay_call) {
    log_ini_function();

    table_grid_add_title_row(null);
    table_grid_add_all_tag_rows(null);

    call_next_function(delay_call);
    log_end_function()
}

/**
 * Add the first row of table grid with the numbers of images
 * @param {} delay_call 
 */
function table_grid_add_title_row(delay_call) {
    log_ini_function();
    let img_tag_data = get_window_tag_data()
    let num_images = img_tag_data.get_num_images();
    let table_tags_names = $(TABLE_GRID_TAGS_NAMES);
    table_tags_names.append('<tr id="tr_grid_tags_name_group_num_img"><td class="td_grid_group_num_img" colspan="9">&nbsp;</td></tr>');
    table_tags_names.append('<tr id="tr_grid_tags_name_num_img"><td id="td_grid_title_tag_name" class="td_grid_num_img">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>');
    let table_grid = $(TABLE_GRID);
    console.log("Add first title row with num_images: " + num_images);
    table_grid.append('<tr id="tr_grid_group_num_img"><td class="td_grid_group_num_img" colspan="9">&nbsp;</td></tr>');
    table_grid.append('<tr id="tr_grid_num_img"></tr>');
    let tr_num_img = $("#tr_grid_num_img");
    for (let i = 0; i < num_images; i++) {
        let num_image = (i + 1).toString();
        let num_image_unidad = num_image.charAt(num_image.length - 1);
        if (num_image_unidad == '0') {
            colspan = "10";
            colspan_end = num_images - (i);
            if (colspan_end < 10) {
                colspan = colspan_end.toString();
            }
            $("#tr_grid_group_num_img").append('<td class="td_grid_group_num_img" colspan="' + colspan + '">' + num_image + '</td>');
        }
        tr_num_img.append('<td id="td_grid_title_' + i + '" class="td_grid_num_img"><a id="a_grid_title_' + i + '" title="' +  num_image + '">' + num_image_unidad + '</a></td>');
        $("#a_grid_title_" + i).click(function(event) {
            on_click_load_image_from_table_grid(event, i);
        });
    }

    call_next_function(delay_call);
    log_end_function()
}

/**
 * Add all the tags rows of table grid
 * @param {*} delay_call 
 */
function table_grid_add_all_tag_rows(delay_call) {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let index_img = 0;
    let load_table_mode = true;
    for (let data_image of img_tag_data.get_data_images()) {
        // console.log(data_image);
        let tags = data_image["tags"];
        // console.log(tags);
        for (let id_tag in tags) {
            console.log(id_tag);
            table_grid_add_tag_row(null, id_tag, load_table_mode);
        }
        index_img += 1;
    }
    call_next_function(delay_call);
    log_end_function()
}

/**
 * Add specified tag row to table grid
 * @param {*} delay_call 
 * @param {*} id_tag_image 
 */
function table_grid_add_tag_row(delay_call, id_tag_image, load_table_mode) {
    log_ini_function();

    if($("#tr_grid_" + id_tag_image).length == 0) {
        let table_grid_tags_names = $(TABLE_GRID_TAGS_NAMES);
        let table_grid = $(TABLE_GRID);

        let img_tag_data = get_window_tag_data();
        let index_image = img_tag_data.get_index_image();
        let num_images = img_tag_data.get_num_images();
        let data_images = img_tag_data.get_data_images();
        let tags_image = img_tag_data.get_tags_image();

        let id_tr_tags_names = "tr_grid_tags_names_" + id_tag_image;
        let id_tr = "tr_grid_" + id_tag_image;
        console.log(id_tr + " preparado para añadir el tr a la tabla");
        table_grid_tags_names.append("<tr id='" + id_tr_tags_names + "'></tr>");
        table_grid.append("<tr id='" + id_tr + "'></tr>");
        let tr_tags_names = $("#" + id_tr_tags_names);
        let tr_tag = $("#" + id_tr);
        tr_tags_names.append('<td id="td_grid_tag_name_' + id_tag_image + '" class="td_grid td_grid_tag_name">' + id_tag_image + '</td>');
        for (let i = 0; i < num_images; i++) {
            let id_td = "" + i + "_" + id_tag_image;
            tr_tag.append('<td id="td_grid_' + id_td + '"class="td_grid">' + 
                            '<a id="a_grid_' + i + '_' + id_tag_image + '" class="a_grid">' + 
                              '<div id="div_grid_' + i + '_' + id_tag_image + '" class="div_grid"></div</a></td>');
            let data_image = data_images[i];
            let tag_encontrado = false;
            let tags = null;
            if (!load_table_mode && i == index_image) {
                tags = tags_image;
            }
            else {
                tags = data_image["tags"];
            }
            for (let id_tag in tags) {
                if (id_tag == id_tag_image) {
                    let tag_active = tags[id_tag][TAG_ACTIVE];
                    let tag_type = tags[id_tag][TAG_TYPE];
                    let tag_type_multiple_calculate = tags[id_tag][TAG_TYPE_MULTIPLE_CALCULATED];

                    let td_tag_table = $("#td_grid_" + i + '_' + id_tag_image);
                    let div_tag_table = $("#div_grid_" + i + '_' + id_tag_image);
                    if (tag_active) {
                        td_tag_table.addClass("td_grid_set");

                        if (tag_type == "single" || (tag_type != "single" && !tag_type_multiple_calculate)) {
                            div_tag_table.html(TABLE_GRID_TAG_ACTIVE);
                        }
                        else {
                            div_tag_table.html(TABLE_GRID_TAG_ACTIVE_CALCULATED);
                        }
                    }

                    let a_tag_table = $("#a_grid_" + i + "_" + id_tag_image);
                    a_tag_table.click(function(event) {
                        on_click_select_tag_from_table_grid(event, i, id_tag_image);
                    });
                    tag_encontrado = true;
                    break;
                }
            }
            if (!tag_encontrado) {
                let a_tag_table = $("#a_grid_" + i + "_" + id_tag_image);
                a_tag_table.click(function(event) {
                    on_click_load_image_from_table_grid(event, i);
                });
            }
        }

        $('[id^="td_grid_' + index_image + '_"]').addClass("td_grid_current_image");
    }
    call_next_function(delay_call);
    log_end_function();
}

/**
 * Select the specified tag row of table grid
 * @param {*} delay_call 
 */
function table_grid_select_image(delay_call) {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let index_image = img_tag_data.get_index_image();

    $('.td_grid_num_img_current_image').removeClass("td_grid_num_img_current_image");
    $('#td_grid_title_' + index_image).addClass('td_grid_num_img_current_image');
    $('.td_grid_current_image').removeClass("td_grid_current_image");
    $('[id^="td_grid_' + index_image + '_"]').addClass("td_grid_current_image");


    let scrollTo = $('#td_grid_title_' + index_image); 
    let scroll_to_offset_left = Math.round(scrollTo.offset().left);
    let scroll_to_width = Math.round(scrollTo.width());
    let container = $('#div_scroll_grid'); 
    let container_offset_left = Math.round(container.offset().left);
    let container_width = Math.round(container.width());
    let container_scroll_left = Math.round(container.scrollLeft());

    if (index_image == 0) {
        container.scrollLeft(0);
    }
    else if (scroll_to_offset_left < container_offset_left) {
        let position = container_scroll_left - (container_offset_left - scroll_to_offset_left + scroll_to_width);
        // alert(scroll_to_offset_left + " - " + scroll_to_width + "\n" 
        //       + container_offset_left + " - " + container_width + " - " + container_scroll_left + "\n" 
        //       + "position hide left: " + position);
        container.scrollLeft(position);
    }
    else if (scroll_to_offset_left + scroll_to_width > container_offset_left + container_width) {
        let position = (scroll_to_offset_left + (2*scroll_to_width)) - (container_offset_left + (container_width)) + container_scroll_left;
        // alert(scroll_to_offset_left + " + " + scroll_to_width + "\n" 
        //       + container_offset_left + " - " + container_width + " - " + container_scroll_left + "\n" 
        //       + "scroll_to_offset_left + container_width: " + (scroll_to_offset_left + scroll_to_width) + "\n"
        //       + "container_offset_left + container_width" + (container_offset_left + container_width) + "\n"
        //       + "position hide right: " + position);
        container.scrollLeft(position);
    }
    // container.scrollLeft(30);

    call_next_function(delay_call);
    log_end_function();
}

/**
 * Select the specified column of image in table grid
 * @param {*} delay_call 
 */
function table_grid_select_tag(delay_call) {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let index_image = img_tag_data.get_index_image();
    let selected_id_tag = img_tag_data.get_selected_id_tag();
    
    $('.td_grid_set_selected').removeClass("td_grid_set_selected");
    if (selected_id_tag != null) {
        $('#td_grid_' + index_image + '_' + selected_id_tag).addClass("td_grid_set_selected");
        $('#td_grid_tag_name_' + selected_id_tag).addClass("td_grid_set_selected");
    }

    call_next_function(delay_call);
    log_end_function();
}

/**
 * Delete all the rows of table grid
 * @param {*} delay_call 
 */
function table_grid_delete_all_rows(delay_call) {
    console.log("ELIMINAR TABLA");
    $(TABLE_GRID_TAGS_NAMES).empty();
    $(TABLE_GRID).empty();
    call_next_function(delay_call);
}

/**
 * Delete the specified tag row of table grid
 * @param {*} id_tag 
 */
function table_grid_delete_row(id_tag) {
    $("#tr_grid_" + id_tag).remove();
    $("#tr_grid_tags_names_" + id_tag).remove();
}

function table_grid_tag_calculated() {
    let img_tag_data = get_window_tag_data();
    let index_image = img_tag_data.get_index_image();
    let selected_id_tag = img_tag_data.get_selected_id_tag();
    let div_tag_table = $("#div_grid_" + index_image + '_' + selected_id_tag);
    if (value) {
        div_tag_table.html(TABLE_GRID_TAG_ACTIVE_CALCULATED);
    }
    else {
        div_tag_table.html(TABLE_GRID_TAG_ACTIVE);
    }
}


function table_grid_checkbox_active_change() {
    log_ini_function();

    let img_tag_data = get_window_tag_data();
    let tags_image = img_tag_data.get_tags_image();
    let selected_id_tag = img_tag_data.get_selected_id_tag();
    let tag_active = tags_image[selected_id_tag][TAG_ACTIVE];

    let index_image = img_tag_data.get_index_image();
    let td_tag_table = $("#td_grid_" + index_image + '_' + selected_id_tag);
    let div_tag_table = $("#div_grid_" + index_image + '_' + selected_id_tag);
    if (tag_active) {
        td_tag_table.addClass("td_grid_set");
        div_tag_table.html(TABLE_GRID_TAG_ACTIVE);
    }
    else {
        td_tag_table.removeClass("td_grid_set");
        div_tag_table.html(TABLE_GRID_TAG_NOT_ACTIVE);
    }
    log_end_function();
}

function table_grid_checkbox_multiple_calculated_change() {
    log_ini_function();

    let img_tag_data = get_window_tag_data();
    let tags_image = img_tag_data.get_tags_image();
    let selected_id_tag = img_tag_data.get_selected_id_tag();
    let tag_type_multiple_calculated = tags_image[selected_id_tag][TAG_TYPE_MULTIPLE_CALCULATED];

    let index_image = img_tag_data.get_index_image();
    let div_tag_table = $("#div_grid_" + index_image + '_' + selected_id_tag);
    if (tag_type_multiple_calculated) {
        div_tag_table.html(TABLE_GRID_TAG_ACTIVE_CALCULATED);
    }
    else {
        div_tag_table.html(TABLE_GRID_TAG_ACTIVE);
    }
    log_end_function();
}

function table_grid_recalculate_tag_row() {
    log_ini_function();

    let img_tag_data = get_window_tag_data();
    let tags_image = img_tag_data.get_tags_image();
    let selected_id_tag = img_tag_data.get_selected_id_tag();
    let num_images = img_tag_data.get_num_images();
    let index_image = img_tag_data.get_index_image();
    let data_images = img_tag_data.get_data_images();

    let tag_type = tags_image[selected_id_tag][TAG_TYPE];
    console.log("tag_type: " + tag_type);

    let multiple_active = false;
    for (let i = 0; i < num_images; i++) {
        let tag = null;
        //check if i exists in data_images array
        // console.log('data_images[i]["tags"][selected_id_tag]: ')
        // console.log(data_images[i]["tags"][selected_id_tag]);
        if (i == index_image) {
            tag = tags_image[selected_id_tag];
        }
        else {
            if (!(data_images[i]["tags"][selected_id_tag] === 'undefined')) {
                tag = data_images[i]["tags"][selected_id_tag];
            }
        }

        let td_tag_table = $("#td_grid_" + i + '_' + selected_id_tag);
        td_tag_table.removeClass("td_grid_set");
        let div_tag_table = $("#div_grid_" + i + '_' + selected_id_tag);
        if (tag_type == TAG_TYPE_SINGLE) { 
            if (tag == null || tag[TAG_TYPE] == tag_type) { //ORIGINAL TAG_TYPE SINGLE, new TAG_TYPE SIMPLE
                if (tag != null && tag[TAG_ACTIVE]) {
                    td_tag_table.addClass("td_grid_set");
                    div_tag_table.html(TABLE_GRID_TAG_ACTIVE);
                }
            }
            else {//ORIGINAL TAG_TYPE MULTIPLE, new TAG_TYPE SIMPLE
                if (tag != null && tag[TAG_ACTIVE] && !tag[TAG_TYPE_MULTIPLE_CALCULATED]) {
                    td_tag_table.addClass("td_grid_set");
                    div_tag_table.html(TABLE_GRID_TAG_ACTIVE);
                }
                else {
                    div_tag_table.html(TABLE_GRID_TAG_NOT_ACTIVE);
                }
            }
        }
        else {
            if (tag == null || tag[TAG_TYPE] == tag_type) { //ORIGINAL TAG_TYPE MULTIPLE, new TAG_TYPE MULTIPLE
                if (tag != null && tag[TAG_ACTIVE] && !tag[TAG_TYPE_MULTIPLE_CALCULATED]) {
                    td_tag_table.addClass("td_grid_set");
                    div_tag_table.html(TABLE_GRID_TAG_ACTIVE);
                    multiple_active = !tag[TAG_TYPE_MULTIPLE_FINAL];
                }
                else {
                    if (multiple_active) {
                        td_tag_table.addClass("td_grid_set");
                        div_tag_table.html(TABLE_GRID_TAG_ACTIVE_CALCULATED);
                    }
                    else {
                        div_tag_table.html(TABLE_GRID_TAG_NOT_ACTIVE);
                    }
                }
            }
            else {//ORIGINAL TAG_TYPE SINGLE, new TAG_TYPE MULTIPLE
                if (tag != null && tag[TAG_ACTIVE] && !tag[TAG_TYPE_MULTIPLE_CALCULATED]) {
                    td_tag_table.addClass("td_grid_set");
                    div_tag_table.html(TABLE_GRID_TAG_ACTIVE);
                    multiple_active = true;
                }
                else {
                    if (multiple_active) {
                        td_tag_table.addClass("td_grid_set");
                        div_tag_table.html(TABLE_GRID_TAG_ACTIVE_CALCULATED);
                    }
                    else {
                        div_tag_table.html(TABLE_GRID_TAG_NOT_ACTIVE);
                    }
                }
            }
            // // console.log("index image: " + index_image + " i: " + i);
            // // console.log("tag[TAG_TYPE]" + tag[TAG_TYPE] + " tag[TAG_ACTIVE]: " + tag[TAG_ACTIVE] + " tag[TAG_TYPE_MULTIPLE_CALCULATED]: " + tag[TAG_TYPE_MULTIPLE_CALCULATED]);
            // if ((tag[TAG_TYPE] == TAG_TYPE_SINGLE && tag[TAG_ACTIVE]) ||
            //     (tag[TAG_TYPE] != TAG_TYPE_SINGLE && tag[TAG_ACTIVE] && !tag[TAG_TYPE_MULTIPLE_CALCULATED])) {
            //     multiple_active = true;
            //     // console.log("multiple_active: " + multiple_active);
            // }

            // if (multiple_active) {
            //     // console.log("add class");
            //     td_tag_table.addClass("td_grid_set");
            // }
            // if (tag[TAG_TYPE] != TAG_TYPE_SINGLE && tag[TAG_ACTIVE] && !tag[TAG_TYPE_MULTIPLE_CALCULATED] && tag[TAG_TYPE_MULTIPLE_FINAL]) {
            //     multiple_active = false;
            //     // console.log("TAG_TYPE_MULTIPLE_FINAL multiple_active: " + multiple_active);
            // }
        }
    }
    log_end_function();
}
////////////////////////////////////////
///////////// DETAIL TAG ///////////////
////////////////////////////////////////

/**
 * Select the specified column of image in table grid
 * @param {*} delay_call 
 */
function detail_tag_select_tag(delay_call) {
    log_ini_function();

    detail_tag_update_name_tag();
    detail_tag_update_class_tag();
    detail_tag_update_color();
    detail_tag_update_position();
    detail_tag_update_type();
    detail_tag_checkbox_active_change();
    tag_detail_visible_type_multiple();
    
    call_next_function(delay_call);
    log_end_function();
}

function detail_tag_update_name_tag() {
    let img_tag_data = get_window_tag_data();
    let id_tag_image = img_tag_data.get_selected_id_tag();
    
    let input_tag_detail_name = $(INPUT_TAG_DETAIL_NAME);
    if (id_tag_image != null) {
        input_tag_detail_name.val(id_tag_image);
    }
    else {
        input_tag_detail_name.val("tag_");
    }
}

function detail_tag_update_class_tag() {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let id_tag_image = img_tag_data.get_selected_id_tag();
    if (id_tag_image != null) {
        let tags_image = img_tag_data.get_tags_image();
        let input_tag_detail_class = $(INPUT_TAG_DETAIL_CLASS);
        input_tag_detail_class.val(tags_image[id_tag_image][TAG_CLASS]);
    }
    log_end_function();
}

function detail_tag_update_color() {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let id_tag_image = img_tag_data.get_selected_id_tag();
    if (id_tag_image != null) {
        let tags_image = img_tag_data.get_tags_image();
        let input_tag_detail_color_selected = $(INPUT_TAG_DETAIL_COLOR_SELECTED);
        input_tag_detail_color_selected.val(tags_image[id_tag_image][TAG_COLOR_SELECTED]);
        let input_tag_detail_color_unselected = $(INPUT_TAG_DETAIL_COLOR_UNSELECTED);
        input_tag_detail_color_unselected.val(tags_image[id_tag_image][TAG_COLOR_UNSELECTED]);
    }
    log_end_function();
}

function detail_tag_update_position() {
    // log_ini_function();
    let img_tag_data = get_window_tag_data();
    let id_tag_image = img_tag_data.get_selected_id_tag();
    if (id_tag_image != null) {
        let tags_image = img_tag_data.get_tags_image();

        let input_tag_detail_top = $(INPUT_TAG_DETAIL_TOP);
        let input_tag_detail_left = $(INPUT_TAG_DETAIL_LEFT);
        let input_tag_detail_width = $(INPUT_TAG_DETAIL_WIDTH);
        let input_tag_detail_height = $(INPUT_TAG_DETAIL_HEIGHT);

        input_tag_detail_top.val(tags_image[id_tag_image][TAG_TOP]);
        input_tag_detail_left.val(tags_image[id_tag_image][TAG_LEFT]);
        input_tag_detail_width.val(tags_image[id_tag_image][TAG_WIDTH]);
        input_tag_detail_height.val(tags_image[id_tag_image][TAG_HEIGHT]);
    }
    // log_end_function();
}

function detail_tag_update_type() {
    let img_tag_data = get_window_tag_data();
    let id_tag_image = img_tag_data.get_selected_id_tag();

    let select_tag_detail_active = $(INPUT_TAG_DETAIL_ACTIVE);
    let select_tag_detail_tag_type = $(SELECT_TAG_DETAIL_TAG_TYPE);
    let input_tag_detail_multiple_calculated = $(INPUT_TAG_DETAIL_MULTIPLE_CALCULATED);
    let input_tag_detail_multiple_initial = $(INPUT_TAG_DETAIL_MULTIPLE_INITIAL);
    let input_tag_detail_multiple_final = $(INPUT_TAG_DETAIL_MULTIPLE_FINAL);
    if (id_tag_image != null) {
        let tags_image = img_tag_data.get_tags_image();

        select_tag_detail_active.prop('disabled', false);

        img_tag_data.set_initialize_tag_type(true);
        select_tag_detail_active.prop('checked', tags_image[id_tag_image][TAG_ACTIVE]);

        select_tag_detail_tag_type.val(tags_image[id_tag_image][TAG_TYPE]).change();
        select_tag_detail_tag_type.prop('disabled', !tags_image[id_tag_image][TAG_ACTIVE]);

        input_tag_detail_multiple_calculated.prop('checked', tags_image[id_tag_image][TAG_TYPE_MULTIPLE_CALCULATED]);
        input_tag_detail_multiple_initial.prop('checked', tags_image[id_tag_image][TAG_TYPE_MULTIPLE_INITIAL]);
        input_tag_detail_multiple_final.prop('checked', tags_image[id_tag_image][TAG_TYPE_MULTIPLE_FINAL]);
        img_tag_data.set_initialize_tag_type(false);
    }
    else {
        select_tag_detail_active.prop('disabled', true);
        select_tag_detail_tag_type.prop('disabled', true);
        input_tag_detail_multiple_calculated.prop('disabled', true);
        input_tag_detail_multiple_initial.prop('disabled', true);
        input_tag_detail_multiple_final.prop('disabled', true);
    }
}

function tag_detail_visible_type_multiple() {
    let img_tag_data = get_window_tag_data();
    let selected_id_tag = img_tag_data.get_selected_id_tag();
    
    if (selected_id_tag != null) {
        let tags_image = img_tag_data.get_tags_image();

        select_element_value = tags_image[selected_id_tag][TAG_TYPE];
        let input_tag_detail_multiple_calculated = $(INPUT_TAG_DETAIL_MULTIPLE_CALCULATED);
        let input_tag_detail_multiple_initial = $(INPUT_TAG_DETAIL_MULTIPLE_INITIAL);
        let input_tag_detail_multiple_final = $(INPUT_TAG_DETAIL_MULTIPLE_FINAL);
        if (select_element_value == TAG_TYPE_SINGLE) {
            input_tag_detail_multiple_calculated.parent().hide();
            input_tag_detail_multiple_initial.parent().hide();
            input_tag_detail_multiple_final.parent().hide();
        }
        else {
            let disabled = true;
            if (tags_image[selected_id_tag] != null && tags_image[selected_id_tag][TAG_ACTIVE] != null) {
                disabled = !tags_image[selected_id_tag][TAG_ACTIVE];
            }

            //jquery input checkbox shows
            input_tag_detail_multiple_calculated.parent().show();
            input_tag_detail_multiple_initial.parent().show();
            input_tag_detail_multiple_final.parent().show();
            input_tag_detail_multiple_calculated.prop('disabled', disabed);
            input_tag_detail_multiple_initial.prop('disabled', disabed);
            input_tag_detail_multiple_final.prop('disabled', disabed);
        }
    }
}

function detail_tag_checkbox_active_change() {
    log_ini_function();

    let img_tag_data = get_window_tag_data();
    let tags_image = img_tag_data.get_tags_image();
    let selected_id_tag = img_tag_data.get_selected_id_tag();

    let select_tag_detail_tag_type = $(SELECT_TAG_DETAIL_TAG_TYPE);
    let disabed = true;
    if (tags_image[selected_id_tag] != null && tags_image[selected_id_tag][TAG_ACTIVE] != null) {
        disabed = !tags_image[selected_id_tag][TAG_ACTIVE]
    }
    select_tag_detail_tag_type.prop('disabled', disabed);

    let input_tag_detail_multiple_calculated = $(INPUT_TAG_DETAIL_MULTIPLE_CALCULATED);
    let input_tag_detail_multiple_initial = $(INPUT_TAG_DETAIL_MULTIPLE_INITIAL);
    let input_tag_detail_multiple_final = $(INPUT_TAG_DETAIL_MULTIPLE_FINAL);
    input_tag_detail_multiple_calculated.prop('disabled', disabed);
    input_tag_detail_multiple_initial.prop('disabled', disabed);
    input_tag_detail_multiple_final.prop('disabled', disabed);

    let input_tag_detail_class = $(INPUT_TAG_DETAIL_CLASS);
    input_tag_detail_class.prop('disabled', disabed);

    let input_tag_detail_color_selected = $(INPUT_TAG_DETAIL_COLOR_SELECTED);
    input_tag_detail_color_selected.prop('disabled', disabed);

    let input_tag_detail_color_unselected = $(INPUT_TAG_DETAIL_COLOR_UNSELECTED);
    input_tag_detail_color_unselected.prop('disabled', disabed);

    log_end_function();
}


function detail_tag_checkbox_multiple_calculated_false() {
    log_ini_function();

    let input_tag_detail_multiple_calculated = $(INPUT_TAG_DETAIL_MULTIPLE_CALCULATED);
    //jquery set value to a checkbox
    input_tag_detail_multiple_calculated.prop('checked', false);

    log_end_function();
}

///////////////////////////////////
///////////// UTILS ///////////////
///////////////////////////////////
function create_window_tag_data(delay_call) {
    log_ini_function();
    window.w_tag_data = new ImgTagData();
    call_next_function(delay_call);
    log_end_function();
}

function get_window_tag_data() {
    return window.w_tag_data;
}

function set_window_tag_data(tag_data) {
    window.w_tag_data = tag_data;
}

function call_next_function(delay_call) {
    if (delay_call != null) {
        delay_call.call_next_function();
    }
}

function calculate_max_id_tag_image(delay_call) {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let new_id_tag = null;
    let max_id_tag = 0;
    let tags_image = img_tag_data.get_tags_image();
    for (let id_tag_image in tags_image) {
        id_tag_num = parseInt(id_tag_image.slice(-3));
        if (id_tag_num > max_id_tag) {
            max_id_tag = id_tag_num;
        }
    }
    img_tag_data.set_calculate_next_id_tag(max_id_tag);

    call_next_function(delay_call);
    log_end_function();
}

/**
 * Calculate the new id tag, based on the max number of tags
 * @returns new id tag
 */
function calculate_new_id_tag_image() {
    log_ini_function();
    let img_tag_data = get_window_tag_data();
    let new_id_tag = null;
    let next_id_tag = img_tag_data.get_calculate_next_id_tag();

    let tag_count_str = next_id_tag.toString();
    let tag_count_str_3 = ("000" + tag_count_str).slice(-3);
    new_id_tag = "tag_" + tag_count_str_3;

    log_end_function();
    return new_id_tag;
}