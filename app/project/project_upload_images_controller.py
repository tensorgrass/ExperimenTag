import os
import json

from flask import Flask, Blueprint, render_template, abort, session
from flask import request, url_for, redirect, send_from_directory
from flask import current_app as app

from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
from pathlib import Path
from icecream import ic

from app.constant import *
from app.decorators.validate_project_decorator import validate_project_id
from app.project.ConfigUtils import ConfigUtils
from app.project.ProjectUtils import ProjectUtils
from app.project.ResultUtils import ResultUtils
from app.project.project_controller import project_bp

@project_bp.route('/upload/images/project_selection')
def upload_images_project_selection():
    '''
    Get all the projects and show them in a list to select one to upload images
    '''
    editable = True
    title = UPLOAD_IMAGES_TITLE

    data_projects = ProjectUtils.get_project_list_data('project.upload_images_selection')

    return render_template('project/project_selection.html', 
                            projects=data_projects, 
                            editable=editable,
                            title=title)

@validate_project_id
@project_bp.route('/upload/images/<project_id>/selection')
def upload_images_selection(project_id):
    '''
    Show the main upload images page
    '''
    ProjectUtils.delete_temporal_directories(project_id)
    project_name = ProjectUtils.get_project_name(project_id)
    return render_template('project/upload_images_selection.html', project_id=project_id, project_name=project_name) 

@validate_project_id
@project_bp.route('/upload/images/<project_id>/check_before_upload', methods = ['GET'])
def upload_images_check_before_upload(project_id):
    '''
    Check if the project is ready to upload images
    '''
    project_name = ProjectUtils.get_project_name(project_id)
    ProjectUtils.delete_temporal_directories(project_id)
    ConfigUtils.backup_config_json(project_id)
    json_data = {JSON_DATA_PROJECT_ID: project_id,
                 JSON_DATA_PROJECT_NAME: project_name}
    message = f"All validations passed!"
    return {JSON_STATUS: JSON_STATUS_SUCCESS, JSON_DATA: json_data, JSON_MESSAGE: message}

@validate_project_id
@project_bp.route('/upload/images/<project_id>/file', methods = ['GET', 'POST'])
def upload_images_file_rest(project_id):
    '''
    Upload images to the project
    '''
    project_name = ProjectUtils.get_project_name(project_id)
    if request.method == 'POST':
        print("Init upload_images_file_rest")
        base_path = ProjectUtils.get_project_path(project_id)
        result_json = ResultUtils.get_result_json(project_id)

        ic(request.files)
        upload_file = request.files['upload_file']
        file_name = upload_file.filename.replace('\\', '/').split('/')[-1]
        file_extension = file_name.split('.')[-1]
        if file_extension in VALID_IMAGE_EXTENSIONS:
            file_path = os.path.join(base_path, file_name).replace('\\', '/')
            file_exists = os.path.isfile(file_path)
            if not file_exists:
                result_json[RESULT_JSON_ADDED_IMAGES].append(file_name)
                message = f"File uploaded and inserted successfully!"
            else:
                ProjectUtils.backup_file(project_id, file_name)
                result_json[RESULT_JSON_UPDATED_IMAGES].append(file_name)
                message = f"File uploaded and updated successfully!"
            upload_file.save(file_path)
            ResultUtils.save_result_json(project_id, result_json)
            json_data = {JSON_DATA_PROJECT_ID: project_id,
                         JSON_DATA_PROJECT_NAME: project_name,
                         JSON_DATA_PROJECT_NAME: project_id, file_name: file_name}
            return {JSON_STATUS: JSON_STATUS_SUCCESS, JSON_DATA: json_data, JSON_MESSAGE: message}
        else:
            json_data = {JSON_DATA_PROJECT_ID: project_id,
                         JSON_DATA_PROJECT_NAME: project_name,
                         JSON_DATA_PROJECT_NAME: project_id, file_name: file_name}
            message = f"File '{upload_file}' extension not allowed!\n{VALID_IMAGE_EXTENSIONS}"
            return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: json_data, JSON_MESSAGE: message}
    else:
        json_data = {JSON_DATA_PROJECT_ID: project_id,
                 JSON_DATA_PROJECT_NAME: project_name}
        message = f"Functionality not implemented yet!"
        return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: json_data, JSON_MESSAGE: message}

@validate_project_id
@project_bp.route('/upload/images/<project_id>/tag_images', methods = ['GET', 'POST'])
def upload_images_tag_images_rest(project_id):
    project_name = ProjectUtils.get_project_name(project_id)
    if request.method == 'POST':
        result_json = ResultUtils.get_result_json(project_id)
        #Check result file exists
        if result_json is not None:
            added_image_names = result_json[RESULT_JSON_ADDED_IMAGES]
            updated_image_names = result_json[RESULT_JSON_UPDATED_IMAGES]

            added_image_names.sort()
            action_tags = request.form["action_tags"]
            status, json_data, message = ConfigUtils.append_images_config_json(project_id, added_image_names, updated_image_names, action_tags)
            if status == JSON_STATUS_SUCCESS:
                status_val, message_val = ConfigUtils.validate_config_json_project(project_id)                
                if status_val == JSON_STATUS_SUCCESS:
                    ProjectUtils.delete_temporal_directories(project_id)
                    return {JSON_STATUS: status, JSON_DATA: json_data, JSON_MESSAGE: message}
                else:
                    ProjectUtils.restore_project_from_backup(project_id)
                    ProjectUtils.delete_temporal_directories(project_id)
                    return {JSON_STATUS: status_val, JSON_DATA: json_data, JSON_MESSAGE: message_val}
            else:
                return {JSON_STATUS: status, JSON_DATA: json_data, JSON_MESSAGE: message}
        else:
            return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: {JSON_DATA_PROJECT_NAME: project_id}, JSON_MESSAGE: f"No images to tag!"}
    else:
        return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: {JSON_DATA_PROJECT_NAME: project_id}, JSON_MESSAGE: f"Functionality not implemented yet!"}
    

    
