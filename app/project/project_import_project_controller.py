import os
import shutil
import json


from flask import Flask, Blueprint, render_template, abort, session
from flask import request, url_for, redirect, send_from_directory
from flask import current_app as app
from icecream import ic

from app.constant import *
from app.decorators.validate_project_decorator import validate_import_formats, validate_project_id
from app.project.ConfigUtils import ConfigUtils
from app.project.ImportUtils import ImportUtils
from app.project.ProjectUtils import ProjectUtils

from app.project.project_controller import project_bp

@validate_import_formats
@project_bp.route('/import/<format>/project_selection')
def import_project_selection(format):
    editable = True
    title = IMPORT_TITLE + " " + format

    data_projects = ProjectUtils.get_project_list_data_error_not_empty('project.import_selection', format)

    return render_template('project/project_selection.html', 
                            projects=data_projects, 
                            editable=editable,
                            title=title)    

@validate_import_formats
@validate_project_id
@project_bp.route('/import/<format>/<project_id>/selection')
def import_selection(format, project_id):
    project_name = ProjectUtils.get_project_name(project_id)
    ProjectUtils.delete_temporal_directories(project_id)
    zip_import = format in IMPORT_ZIP_FORMATS
    ImportUtils.initialize_project_to_import(project_id)
    return render_template('project/import_selection.html', format=format, project_id=project_id , project_name=project_name, zip_import=zip_import) 

@validate_import_formats
@validate_project_id
@project_bp.route('/import/<format>/<project_id>/check', methods = ['GET'])
def import_check_before_upload_rest(format, project_id):
    status, json_data, message = ImportUtils.validate_before_import(format, project_id)
    if status == JSON_STATUS_SUCCESS:
        ProjectUtils.delete_temporal_directories(project_id)
        ConfigUtils.backup_config_json(project_id)
    return {JSON_STATUS: status, JSON_DATA: json_data, JSON_MESSAGE: message}

@validate_import_formats
@validate_project_id
@project_bp.route('/import/<format>/<project_id>/file', methods = ['GET', 'POST'])
def import_file_rest(format, project_id):
    if request.method == 'POST':
        if format == IMPORT_FORMAT_YOLOV8:
            upload_file = request.files['upload_file']
            status, json_data, message = ImportUtils.import_file_yolov8(project_id, format, upload_file)
            return {JSON_STATUS: status, JSON_DATA: json_data, JSON_MESSAGE: message}
        if format == IMPORT_FORMAT_BACKUP:
            upload_file = request.files['upload_file']
            status, json_data, message = ImportUtils.import_file_backup(project_id, format, upload_file)
            return {JSON_STATUS: status, JSON_DATA: json_data, JSON_MESSAGE: message}
        elif format in IMPORT_ZIP_FORMATS:
            upload_file = request.files['upload_file']
            status, json_data, message = ImportUtils.import_file_zip(project_id, format, upload_file)
            return {JSON_STATUS: status, JSON_DATA: json_data, JSON_MESSAGE: message}
    else:
        project_name = ProjectUtils.get_project_name(project_id)
        json_data = {JSON_DATA_PROJECT_ID: project_id, 
                     JSON_DATA_PROJECT_NAME: project_name, 
                     JSON_DATA_FORMAT: format}
        message = f"Functionality not implemented yet!"
        return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: json_data, JSON_MESSAGE: message}

@validate_import_formats
@validate_project_id
@project_bp.route('/import/<format>/<project_id>/tag_images', methods = ['GET', 'POST'])
def import_tag_images(format, project_id):

    if request.method == 'POST':
        if format == IMPORT_FORMAT_YOLOV8:
            status, json_data, message = ImportUtils.tag_images_yolov8(format, project_id)
        elif format == IMPORT_FORMAT_YOLOV8_ZIP:
            status, json_data, message = ImportUtils.tag_images_yolov8_zip(format, project_id)
        elif format == IMPORT_FORMAT_BACKUP_ZIP:
            status, json_data, message = ImportUtils.tag_images_backup_zip(format, project_id)
        elif format == IMPORT_FORMAT_BACKUP:
            status, json_data, message = ImportUtils.tag_images_backup(format, project_id)
        
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
        json_data = {JSON_DATA_PROJECT_NAME: project_id, JSON_DATA_FORMAT: format}
        message = f"Functionality not implemented yet!"
        return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: json_data, JSON_MESSAGE: message}
