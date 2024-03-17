import os

from flask import render_template, abort
from flask import request, url_for
from flask import current_app as app

from icecream import ic

from app.constant import *
from app.decorators.validate_project_decorator import validate_export_formats, validate_project_id
from app.project.ConfigUtils import ConfigUtils
from app.project.ExportUtils import ExportUtils
from app.project.ProjectUtils import ProjectUtils
from app.project.ExportYoloV8Utils import ExportYoloV8Utils
from app.project.ExportBackupUtils import ExportBackupUtils

from app.project.project_controller import project_bp

@validate_export_formats
@project_bp.route('/export/<format>/project_selection')
def export_project_selection(format):
    editable = False
    title = EXPORT_TITLE + " " + format

    data_projects = ProjectUtils.get_project_list_data_error_empty('project.export_selection', format)

    return render_template('project/project_selection.html', 
                            projects=data_projects, 
                            editable=editable,
                            title=title)

@validate_export_formats
@validate_project_id
@project_bp.route('/export/<format>/<project_id>/selection')
def export_selection(format, project_id):
    project_name = ProjectUtils.get_project_name(project_id)
    ProjectUtils.delete_temporal_directories(project_id)

    if format == EXPORT_FORMAT_BACKUP:
        valid_percentage = 0
        test_percentage = 0
        train_percentage = 100
        valid_disabled = True
        test_disabled = True
        train_disabled = True
    elif format == EXPORT_FORMAT_YOLOV8:
        valid_percentage = 5
        test_percentage = 10
        train_percentage = 85
        valid_disabled = False
        test_disabled = False
        train_disabled = False
    else:
        message = f"Format {format} not supported!"
        json_data = {JSON_DATA_PROJECT_ID: project_id, JSON_DATA_PROJECT_NAME: project_name}
        return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: json_data, JSON_MESSAGE: message}
    return render_template('project/export_selection.html', 
                           format=format, 
                           project_id=project_id,
                           project_name=project_name,
                           valid_percentage=valid_percentage,
                           test_percentage=test_percentage,
                           train_percentage=train_percentage,
                           valid_disabled=valid_disabled,
                           test_disabled=test_disabled,
                           train_disabled=train_disabled) 
    
   
@validate_export_formats
@validate_project_id
@project_bp.route('/export/<format>/<project_id>/download', methods = ['GET'])
def export_project_download(format, project_id):
    '''
    Export project to a specific format in zip file
    In project_id and create a zip file with all the images and the configuration file
    '''  
    if ConfigUtils.check_config_json_exists(project_id):
        #request get parameters
        valid_percentage = request.args.get(PARAMETER_VALID)
        test_percentage = request.args.get(PARAMETER_TEST)
        train_percentage = request.args.get(PARAMETER_TRAIN)
        images_to_export = request.args.get(PARAMETER_IMAGES_TO_EXPORT)

        if format == EXPORT_FORMAT_BACKUP:
            return ExportBackupUtils.export_backup(project_id)
        elif format == EXPORT_FORMAT_YOLOV8:
            return ExportYoloV8Utils.export_yolov8(project_id, valid_percentage, test_percentage, train_percentage, images_to_export)
        else:
            abort(500)
    else:
        # return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: {JSON_DATA_PROJECT_NAME: project_id}, JSON_MESSAGE: "No file configuration exists!"}
        abort(500)


