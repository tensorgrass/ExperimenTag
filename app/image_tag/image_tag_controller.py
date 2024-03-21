from flask import Flask, Blueprint, render_template, abort, session
from flask import request, url_for, redirect, send_from_directory

import os
from flask import current_app as app
import json

from icecream import ic
from app.decorators.validate_project_decorator import validate_project_id
from app.image_tag.ImageTagUtils import ImageTagUtils
from app.project.ConfigUtils import ConfigUtils

from app.project.ProjectUtils import ProjectUtils
from app.constant import *

image_tag_bp = Blueprint('image_tag', __name__, url_prefix='/image_tag')


@image_tag_bp.route('/project_selection')
def image_tag_project_selection():
    editable = False
    title = IMAGE_TAG_TITLE

    projects_data = ProjectUtils.get_project_list_data_error_empty('image_tag.image_tag')
    return render_template('project/project_selection.html', 
                            projects=projects_data, 
                            editable=editable,
                            title=title)

@validate_project_id
@image_tag_bp.route('/<project_id>')
def image_tag(project_id):
    print("------------------- image_tag -------------------")
    project_name = ProjectUtils.get_project_name(project_id)    
    config_current_id = int(0)
    session[SESSION_CONFIG_CURRENT_ID + project_id] = config_current_id
    ProjectUtils.delete_temporal_directories(project_id)
    return render_template('image_tag/image_tag.html', project_id=project_id, project_name=project_name)

@validate_project_id
@image_tag_bp.route('/<project_id>/tags', methods=['GET'])
def tags_rest(project_id):
    print("------------------- tags -------------------")
    content_type_json, content_type_error = ImageTagUtils.check_content_type(request)
    if (not content_type_json):
        return content_type_error

    config_json = ConfigUtils.get_config_json(project_id)
    return_value = {
        JSON_STATUS : "success",
        CONFIG: config_json,
        JSON_MESSAGE: "All tags are loaded!",
    }
    return return_value

@validate_project_id
@image_tag_bp.route('/<project_id>/image/<id>', methods=['GET', 'POST', 'DELETE'])
def image_rest(project_id, id):
    print(f"------------------- image {request.method}-------------------")
    project_name = ProjectUtils.get_project_name(project_id)
    json_data = {JSON_DATA_PROJECT_ID: project_id, 
                 JSON_DATA_PROJECT_NAME: project_name}
    config_current_id = int(id)
    config_json = ConfigUtils.get_config_json(project_id)
    num_images = len(config_json[CONFIG_IMAGES])
    print(f"------------------- image request {request.method}-------------------")
    if request.method == 'GET':
        if (config_current_id < 0 or config_current_id >= num_images):
            message = "No more images!"
            return {JSON_STATUS : JSON_STATUS_ERROR, JSON_DATA: json_data, JSON_MESSAGE: message}
        status, json_data, message = ImageTagUtils.load_next_image(project_id, config_current_id)
        return {JSON_STATUS : status, JSON_DATA: json_data, JSON_MESSAGE: message}
    elif request.method == 'POST':
        if (config_current_id < 0 or config_current_id >= num_images):
            message = "Image not exists!"
            return {JSON_STATUS : JSON_STATUS_ERROR, JSON_DATA: json_data, JSON_MESSAGE: message}
        content_type_json, content_type_error = ImageTagUtils.check_content_type(request)
        if (not content_type_json):
            message = content_type_error[JSON_MESSAGE]
            return {JSON_STATUS : JSON_STATUS_ERROR, JSON_DATA: json_data, JSON_MESSAGE: message}

        json_request = request.json
        status, json_data, message = ImageTagUtils.save_image_tags(project_id, config_current_id, json_request)
        return {JSON_STATUS : status, JSON_DATA: json_data, JSON_MESSAGE: message}
    elif request.method == 'DELETE':
        if (config_current_id < 0 or config_current_id >= num_images):
            message = "Image not exists!"
            return {JSON_STATUS : JSON_STATUS_ERROR, JSON_DATA: json_data, JSON_MESSAGE: message}
        json_request = request.json
        status, json_data, message = ImageTagUtils.delete_image(project_id, config_current_id, json_request)
        return {JSON_STATUS : status, JSON_DATA: json_data, JSON_MESSAGE: message}

