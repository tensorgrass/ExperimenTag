class ImgTagData {
    constructor() {
        this.num_images = 0; // number of images
        this.data_images = []; // array of all data of the images
        this.index_image = 0; // index of the current image
        this.zoom_image = 100; // current zoom value of the image
        this.data_image = null; // data of the current image
        this.tags_image = {}; // tags of the current image
        this.natural_width_image = 0; // natural width of the current image 
        this.natural_height_image = 0; // natural height of the current image 
        this.x_offset_inside_selected_tag = 0; // x offset inside tag
        this.y_offset_inside_selected_tag = 0; // y offset inside tag
        this.selected_id_tag = null; // name of selected tag
        this.previous_id_tag = null; // name of selected tag
        this.operation_selected_tag = null; // operation selected tag
        this.x_side_selected_tag = null; // x side selected tag
        this.y_side_selected_tag = null; // y side selected tag
        this.pressed_mouse_over_tag = false; // hold tag
        this.next_selected_tag = null; // next selected tag
        this.calculate_next_id_tag = 0; // calculate next id tag
        this.initialize_tag_type = false; // initialize tag type
        this.last_type_tag = "single"; // last type tag
    

        this.get_num_images = function () {
            return this.num_images;
        };

        this.set_num_images = function (num_images) {
            this.num_images = num_images;
        };

        this.get_data_images = function () {
            return this.data_images;
        };

        this.set_data_images = function (data_images) {
            this.data_images = data_images;
        };

        this.get_index_image = function () {
            return this.index_image;
        };

        this.set_index_image = function (index_image) {
            this.index_image = index_image;
        };

        this.get_zoom_image = function () {
            return this.zoom_image;
        };  

        this.set_zoom_image = function (zoom_image) {
            this.zoom_image = zoom_image;
        };  

        this.get_data_image = function () {
            return this.data_image;
        };

        this.set_data_image = function (data_image) {
            this.data_image = data_image;
        };

        this.get_tags_image = function () {
            return this.tags_image;
        };

        this.set_tags_image = function (tags_image) {
            this.tags_image = tags_image;
        };

        this.get_natural_width_image = function () {
            return this.natural_width_image;
        };

        this.set_natural_width_image = function (natural_width_image) {
            this.natural_width_image = natural_width_image;
        };
        
        this.get_natural_height_image = function () {
            return this.natural_height_image;
        };

        this.set_natural_height_image = function (natural_height_image) {
            this.natural_height_image = natural_height_image;
        };

        this.get_x_offset_inside_selected_tag = function () {
            return this.x_offset_inside_selected_tag;
        };

        this.set_x_offset_inside_selected_tag = function (x_offset_inside_selected_tag) {
            this.x_offset_inside_selected_tag = x_offset_inside_selected_tag;
        };

        this.get_y_offset_inside_selected_tag = function () {
            return this.y_offset_inside_selected_tag;
        };

        this.set_y_offset_inside_selected_tag = function (y_offset_inside_selected_tag) {
            this.y_offset_inside_selected_tag = y_offset_inside_selected_tag;
        };

        this.get_selected_id_tag = function () {
            return this.selected_id_tag;
        };

        this.set_selected_id_tag = function (selected_id_tag) {
            this.selected_id_tag = selected_id_tag;
        };

        this.get_operation_selected_tag = function () {
            return this.operation_selected_tag;
        };

        this.get_previous_id_tag = function () {
            return this.previous_id_tag;
        };

        this.set_previous_id_tag = function (previous_id_tag) {
            this.previous_id_tag = previous_id_tag;
        };

        this.set_operation_selected_tag = function (operation_selected_tag) {
            this.operation_selected_tag = operation_selected_tag;
        };

        this.get_x_side_selected_tag = function () {
            return this.x_side_selected_tag;
        };

        this.set_x_side_selected_tag = function (x_side_selected_tag) {
            this.x_side_selected_tag = x_side_selected_tag;
        };

        this.get_y_side_selected_tag = function () {
            return this.y_side_selected_tag;
        };

        this.set_y_side_selected_tag = function (y_side_selected_tag) {
            this.y_side_selected_tag = y_side_selected_tag;
        };

        this.get_pressed_mouse_over_tag = function () {
            return this.pressed_mouse_over_tag;
        };

        this.set_pressed_mouse_over_tag = function (pressed_mouse_over_tag) {
            this.pressed_mouse_over_tag = pressed_mouse_over_tag;
        };

        this.get_next_selected_tag = function () {
            return this.next_selected_tag;
        };

        this.set_next_selected_tag = function (next_selected_tag) {
            this.next_selected_tag = next_selected_tag;
        };

        this.get_initialize_tag_type = function () {
            return this.initialize_tag_type;
        };

        this.set_initialize_tag_type = function (initialize_tag_type) {
            this.initialize_tag_type = initialize_tag_type;
        };

        this.get_calculate_next_id_tag = function () {
            this.calculate_next_id_tag += 1;
            return this.calculate_next_id_tag;
        };

        this.set_calculate_next_id_tag = function (max_id_tag) {
            this.calculate_next_id_tag = max_id_tag;
        };

        this.get_last_type_tag = function () {
            return this.last_type_tag;
        };

        this.set_last_type_tag = function (last_type_tag) {
            this.last_type_tag = last_type_tag;
        };
    }
}