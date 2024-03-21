from flask import Flask, Blueprint, render_template, abort, session
from flask import request, url_for, redirect, send_from_directory

import os
from flask import current_app as app
import json

from icecream import ic
from app.decorators.validate_project_decorator import validate_project_id
from app.project.ConfigUtils import ConfigUtils

from app.project.ProjectUtils import ProjectUtils
from app.constant import *

class ImageTagUtils:
    def load_next_image(project_id, config_current_id):
        print("------------------- load_next_image -------------------")
        session[SESSION_CONFIG_CURRENT_ID + project_id] = config_current_id
        config_json = ConfigUtils.get_config_json(project_id)
        project_name = ProjectUtils.get_project_name(project_id)
        message = "Image loaded successfully!"
        json_data = {JSON_DATA_PROJECT_ID: project_id,
                     JSON_DATA_PROJECT_NAME: project_name,
                     JSON_NUM_CURRENT_IMG: config_current_id,
                     JSON_IMAGE: config_json[CONFIG_IMAGES][config_current_id],}

        return JSON_STATUS_SUCCESS, json_data, message
    
    def delete_image(project_id, config_current_id, json_request):
        print("------------------- load_next_image -------------------")
        
        config_json = ConfigUtils.get_config_json(project_id)
        base_path = ProjectUtils.get_project_path(project_id)

        #Delete image selected
        image_path = os.path.join(base_path, config_json[CONFIG_IMAGES][config_current_id][CONFIG_IMAGES_NAME]).replace("\\", "/")
        os.remove(image_path)
        del config_json[CONFIG_IMAGES][config_current_id]
        ConfigUtils.save_config_json(project_id, config_json)
        if config_current_id > 0:
            config_current_id -= 1

        session[SESSION_CONFIG_CURRENT_ID + project_id] = config_current_id

        json_request[JSON_NUM_CURRENT_IMG] = config_current_id
        json_request[JSON_IMG_TAGS] = config_json[CONFIG_IMAGES][config_current_id][CONFIG_IMAGES_TAGS]

        modified_tags = []
        json_tags = json_request[JSON_IMG_TAGS]
        for tag in json_tags:
            modified_tags.append(tag)
        ImageTagUtils.update_modificated_tags(project_id, json_tags, config_json, modified_tags)

        # save file to static folder
        ConfigUtils.save_config_json(project_id, config_json)
        project_name = ProjectUtils.get_project_name(project_id)
        message = "Image deleted successfully!"
        json_data = {JSON_DATA_PROJECT_ID: project_id, 
                    JSON_DATA_PROJECT_NAME: project_name, 
                    CONFIG: config_json}
        return JSON_STATUS_SUCCESS, json_data, message 


    def save_image_tags(project_id, config_current_id, json_request):
        print("------------------- save_image_tags -------------------")
        num_current_img = json_request[JSON_NUM_CURRENT_IMG]
        if (config_current_id != num_current_img):
            message = "Image number mismatch!"
            return_value = {JSON_STATUS : JSON_STATUS_ERROR, JSON_MESSAGE: message}
            return return_value

        json_tags = json_request[JSON_IMG_TAGS]
        # ic(json_tags)

        config_json = ConfigUtils.get_config_json(project_id)
        config_current_id = session[SESSION_CONFIG_CURRENT_ID + project_id]
        #Get id on deleted tags
        print("------------------- created_tags -------------------")

        deleted_tags = []
        created_tags = []
        modified_tags = []
        for tag in json_tags:
            created_tags.append(tag)
            
        for tag in config_json[CONFIG_IMAGES][config_current_id][CONFIG_IMAGES_TAGS]:
            deleted_tags.append(tag)
            if tag in created_tags:
                created_tags.remove(tag)

        for tag in json_tags:
            if tag in deleted_tags:
                deleted_tags.remove(tag)
            # if not tag in created_tags and not json_tags[tag][TAG_TYPE] == TAG_TYPE_SINGLE:
            if not tag in created_tags:
                new_tag = json_tags[tag]
                old_tag = config_json[CONFIG_IMAGES][config_current_id][CONFIG_IMAGES_TAGS][tag]

                if not new_tag[TAG_ACTIVE] == old_tag[TAG_ACTIVE] or \
                not new_tag[TAG_TYPE] == old_tag[TAG_TYPE] or \
                not new_tag[TAG_TYPE_MULTIPLE_CALCULATED] == old_tag[TAG_TYPE_MULTIPLE_CALCULATED] or \
                not new_tag[TAG_TYPE_MULTIPLE_INITIAL] == old_tag[TAG_TYPE_MULTIPLE_INITIAL] or \
                not new_tag[TAG_TYPE_MULTIPLE_FINAL] == old_tag[TAG_TYPE_MULTIPLE_FINAL] or \
                not new_tag[TAG_LEFT] == old_tag[TAG_LEFT] or \
                not new_tag[TAG_TOP] == old_tag[TAG_TOP] or \
                not new_tag[TAG_WIDTH] == old_tag[TAG_WIDTH] or \
                not new_tag[TAG_HEIGHT] == old_tag[TAG_HEIGHT] or \
                not new_tag[TAG_CLASS] == old_tag[TAG_CLASS] or \
                not new_tag[TAG_COLOR_SELECTED] == old_tag[TAG_COLOR_SELECTED] or \
                not new_tag[TAG_COLOR_UNSELECTED] == old_tag[TAG_COLOR_UNSELECTED]:
                    modified_tags.append(tag)

        ImageTagUtils.update_deleted_tags(project_id, config_json, deleted_tags)
        config_json[CONFIG_IMAGES][config_current_id][CONFIG_IMAGES_TAGS] = json_tags
        ImageTagUtils.update_created_tags(project_id, config_current_id, json_tags, config_json, created_tags)
        ImageTagUtils.update_modificated_tags(project_id, json_tags, config_json, modified_tags)

        # save file to static folder
        ConfigUtils.save_config_json(project_id, config_json)
        project_name = ProjectUtils.get_project_name(project_id)
        message = "Image tags saved successfully!"
        json_data = {JSON_DATA_PROJECT_ID: project_id, 
                    JSON_DATA_PROJECT_NAME: project_name, 
                    CONFIG: config_json}
        return JSON_STATUS_SUCCESS, json_data, message 

    def update_deleted_tags(project_id, config_json, deleted_tags):
        print("Created tags:")
        for delete_tag in deleted_tags:
            for image_data in config_json[CONFIG_IMAGES]:
                if (delete_tag in image_data[CONFIG_IMAGES_TAGS]):
                    del image_data[CONFIG_IMAGES_TAGS][delete_tag]

    def update_created_tags(project_id, config_current_id, json_tags, config_json, created_tags):
        for new_tag in created_tags:
            index_image = 0
            tag_active = False
            tag_type_multiple_calculate = not json_tags[new_tag][TAG_TYPE] == TAG_TYPE_SINGLE
            for image_data in config_json[CONFIG_IMAGES]:
                tags = image_data[CONFIG_IMAGES_TAGS]
                if (config_current_id != index_image):
                    if (not new_tag in tags):
                        tags[new_tag] = {TAG_ACTIVE: tag_active,
                                            TAG_TYPE: json_tags[new_tag][TAG_TYPE],
                                            TAG_TYPE_MULTIPLE_CALCULATED: tag_type_multiple_calculate,
                                            TAG_TYPE_MULTIPLE_INITIAL: json_tags[new_tag][TAG_TYPE_MULTIPLE_INITIAL],
                                            TAG_TYPE_MULTIPLE_FINAL: json_tags[new_tag][TAG_TYPE_MULTIPLE_FINAL],
                                            TAG_LEFT: json_tags[new_tag][TAG_LEFT],
                                            TAG_TOP: json_tags[new_tag][TAG_TOP],
                                            TAG_WIDTH: json_tags[new_tag][TAG_WIDTH],
                                            TAG_HEIGHT: json_tags[new_tag][TAG_HEIGHT],
                                            TAG_CLASS: json_tags[new_tag][TAG_CLASS],
                                            TAG_COLOR_SELECTED: json_tags[new_tag][TAG_COLOR_SELECTED],
                                            TAG_COLOR_UNSELECTED: json_tags[new_tag][TAG_COLOR_UNSELECTED],
                                            }
                else:
                    if (not json_tags[new_tag][TAG_TYPE] == TAG_TYPE_SINGLE):
                        tags[new_tag][TAG_TYPE_MULTIPLE_CALCULATED] = False
                        tags[new_tag][TAG_TYPE_MULTIPLE_FINAL] = False
                        tag_active = json_tags[new_tag][TAG_ACTIVE]

                index_image += 1

    def update_modificated_tags(project_id, json_tags, config_json, modified_tags):
        for modified_tag in modified_tags:
            tag_left = 0
            tag_top = 0
            tag_width = 0
            tag_height =  0
            tag_class = ""
            tag_color_selected = ""
            tag_color_unselected = ""
            for image_data in config_json[CONFIG_IMAGES]:
                tag = image_data[CONFIG_IMAGES_TAGS][modified_tag]
                if ((tag[TAG_TYPE] == TAG_TYPE_SINGLE and tag[TAG_ACTIVE]) or
                    (not tag[TAG_TYPE] == TAG_TYPE_SINGLE and tag[TAG_ACTIVE] and not tag[TAG_TYPE_MULTIPLE_CALCULATED])):
                    tag_left = tag[TAG_LEFT]
                    tag_top = tag[TAG_TOP]
                    tag_width = tag[TAG_WIDTH]
                    tag_height = tag[TAG_HEIGHT]
                    break
            
            tag_class = json_tags[modified_tag][TAG_CLASS]
            tag_color_selected = json_tags[modified_tag][TAG_COLOR_SELECTED]
            tag_color_unselected = json_tags[modified_tag][TAG_COLOR_UNSELECTED]
            if (json_tags[modified_tag][TAG_TYPE] == TAG_TYPE_SINGLE):
                for image_data in config_json[CONFIG_IMAGES]:
                    tags = image_data[CONFIG_IMAGES_TAGS]
                    tag = tags[modified_tag]
                    tag_active = False
                    if ((tag[TAG_TYPE] == TAG_TYPE_SINGLE and tag[TAG_ACTIVE]) or
                        (not tag[TAG_TYPE] == TAG_TYPE_SINGLE and tag[TAG_ACTIVE] and not tag[TAG_TYPE_MULTIPLE_CALCULATED])):
                        tag_active = True
                        tag_left = tag[TAG_LEFT]
                        tag_top = tag[TAG_TOP]
                        tag_width = tag[TAG_WIDTH]
                        tag_height = tag[TAG_HEIGHT]
                    
                    tags[modified_tag] = {TAG_ACTIVE: tag_active,
                                        TAG_TYPE: json_tags[modified_tag][TAG_TYPE],
                                        TAG_TYPE_MULTIPLE_CALCULATED: False,
                                        TAG_TYPE_MULTIPLE_INITIAL: False,
                                        TAG_TYPE_MULTIPLE_FINAL: False,
                                        TAG_LEFT: tag_left,
                                        TAG_TOP: tag_top,
                                        TAG_WIDTH: tag_width,
                                        TAG_HEIGHT: tag_height,
                                        TAG_CLASS: tag_class,
                                        TAG_COLOR_SELECTED: tag_color_selected,
                                        TAG_COLOR_UNSELECTED: tag_color_unselected,
                                        }
            else:
                has_next_active_tag = False
                num_images_to_next = 0
                tag_left_factor_to_next = 0
                tag_top_factor_to_next = 0
                tag_width_factor_to_next = 0
                tag_height_factor_to_next = 0
                tag_active = False
                index_image = 0
                index_image_from_active = 0
                for image_data in config_json[CONFIG_IMAGES]:
                    tags = image_data[CONFIG_IMAGES_TAGS]
                    tag = tags[modified_tag]
                    tag_type_multiple_calculated = True
                    tag_type_multiple_initial = False
                    if ((tag[TAG_TYPE] == TAG_TYPE_SINGLE and tag[TAG_ACTIVE]) or
                        (not tag[TAG_TYPE] == TAG_TYPE_SINGLE and tag[TAG_ACTIVE] and not tag[TAG_TYPE_MULTIPLE_CALCULATED])):
                        if (not tag_active):
                            tag_type_multiple_initial = True
                        tag_active = True
                        tag_type_multiple_calculated = False
                        tag_left = tag[TAG_LEFT]
                        tag_top = tag[TAG_TOP]
                        tag_width = tag[TAG_WIDTH]
                        tag_height = tag[TAG_HEIGHT]


                        has_next_active_tag = False
                        num_images_to_next = 0
                        tag_left_factor_to_next = 0
                        tag_top_factor_to_next = 0
                        tag_width_factor_to_next = 0
                        tag_height_factor_to_next = 0
                        index_image_from_active = 0
                        index_image_next = 0
                        for image_info_next in config_json[CONFIG_IMAGES]:
                            if (index_image_next > index_image):
                                tag_next = image_info_next[CONFIG_IMAGES_TAGS][modified_tag]
                                num_images_to_next += 1
                                if ((tag_next[TAG_TYPE] == TAG_TYPE_SINGLE and tag_next[TAG_ACTIVE]) or
                                    (not tag_next[TAG_TYPE] == TAG_TYPE_SINGLE and tag_next[TAG_ACTIVE] and not tag_next[TAG_TYPE_MULTIPLE_CALCULATED])):
                                    has_next_active_tag = True
                                    tag_left_factor_to_next =(tag_next[TAG_LEFT] - tag_left) / num_images_to_next
                                    tag_top_factor_to_next = (tag_next[TAG_TOP] - tag_top) / num_images_to_next
                                    tag_width_factor_to_next = (tag_next[TAG_WIDTH] - tag_width) / num_images_to_next
                                    tag_height_factor_to_next = (tag_next[TAG_HEIGHT] - tag_height) / num_images_to_next
                                    ic(num_images_to_next)
                                    break
                            index_image_next += 1
                            

                    next_tag_ative = tag_active
                    if (not tag[TAG_TYPE] == TAG_TYPE_SINGLE and tag[TAG_ACTIVE] and not tag[TAG_TYPE_MULTIPLE_CALCULATED] and tag[TAG_TYPE_MULTIPLE_FINAL]):
                        next_tag_ative = False

                    if (tag_active and tag_type_multiple_calculated and has_next_active_tag):
                        index_image_from_active += 1

                    tags[modified_tag] = {TAG_ACTIVE: tag_active,
                                        TAG_TYPE: json_tags[modified_tag][TAG_TYPE],
                                        TAG_TYPE_MULTIPLE_CALCULATED: tag_active and tag_type_multiple_calculated,
                                        TAG_TYPE_MULTIPLE_INITIAL: tag_type_multiple_initial,
                                        TAG_TYPE_MULTIPLE_FINAL: tag[TAG_TYPE_MULTIPLE_FINAL],
                                        TAG_LEFT:  round(tag_left + (index_image_from_active * tag_left_factor_to_next), 0),
                                        TAG_TOP: round(tag_top + (index_image_from_active * tag_top_factor_to_next), 0),
                                        TAG_WIDTH: round(tag_width + (index_image_from_active * tag_width_factor_to_next), 0),
                                        TAG_HEIGHT: round(tag_height + (index_image_from_active * tag_height_factor_to_next), 0),
                                        TAG_CLASS: tag_class,
                                        TAG_COLOR_SELECTED: tag_color_selected,
                                        TAG_COLOR_UNSELECTED: tag_color_unselected,
                                        }
                    
                    tag_active = next_tag_ative
                    index_image += 1 

    def check_content_type(request):
        print("------------------- check_content_type -------------------")
        content_type = request.headers.get('Content-Type')
        content_type_json = True
        content_type_error = None
        if (content_type != 'application/json'):
            content_type_json = False
            content_type_error = \
                {
                    JSON_STATUS : "error",
                    JSON_MESSAGE: "Content-Type not supported!",
                }
        return content_type_json, content_type_error