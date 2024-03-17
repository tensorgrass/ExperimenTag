import os
import shutil
import json
import cv2

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

@project_bp.route('/upload/video/project_selection')
def upload_video_project_selection():
    editable = True
    title = UPLOAD_VIDEO_TITLE

    data_projects = ProjectUtils.get_project_list_data('project.upload_video_selection')

    return render_template('project/project_selection.html', 
                            projects=data_projects, 
                            editable=editable,
                            title=title)

@validate_project_id
@project_bp.route('/upload/video/<project_id>/selection')
def upload_video_selection(project_id):
    project_name = ProjectUtils.get_project_name(project_id)
    ProjectUtils.delete_temporal_directories(project_id)
    return render_template('project/upload_video_selection.html', project_id=project_id, project_name=project_name) 

@validate_project_id
@project_bp.route('/upload/video/<project_id>/check_before_upload', methods = ['GET'])
def upload_video_check_before_upload(project_id):
    project_name = ProjectUtils.get_project_name(project_id)
    ProjectUtils.delete_temporal_directories(project_id)
    ConfigUtils.backup_config_json(project_id)
    json_data = {JSON_DATA_PROJECT_ID: project_id,
                 JSON_DATA_PROJECT_NAME: project_name}
    message = f"All validations passed!"
    return {JSON_STATUS: JSON_STATUS_SUCCESS, JSON_DATA: json_data, JSON_MESSAGE: message}

@validate_project_id
@project_bp.route('/upload/video/<project_id>/file', methods = ['GET', 'POST'])
def upload_video_file_rest(project_id):
    project_name = ProjectUtils.get_project_name(project_id)
    if request.method == 'POST':
        print("Init upload_video_file_rest")
        base_path = ProjectUtils.get_project_path(project_id)
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)
        #Create base_tmp_path if not exists
        dir_exists = os.path.exists(base_tmp_path)
        if (not dir_exists):
            os.mkdir(base_tmp_path)

        result_json = ResultUtils.get_result_json(project_id)

        upload_file = request.files['upload_file']
        file_name = upload_file.filename.replace('\\', '/').split('/')[-1]
        file_extension = file_name.split('.')[-1]
        if file_extension in VALID_VIDEO_EXTENSIONS:
            file_path = os.path.join(base_tmp_path, file_name).replace('\\', '/')
            upload_file.save(file_path)

            #read single_file with openCV and save frames to the same directory
            video = cv2.VideoCapture(file_path)
            success, image = video.read()
            count = 0
            while success:
                frame_name = f"{count:07d}_{Path(file_name).stem}.jpg"
                frame_path = os.path.join(base_path, frame_name).replace('\\', '/')
                print(f'Read a new frame {frame_path}: {success}')
                cv2.imwrite(frame_path, image)
                success, image = video.read()
                count += 1
                result_json[RESULT_JSON_ADDED_IMAGES].append(frame_name)
            video.release()

            message = f"Video uploaded and framed successfully!"

            ResultUtils.save_result_json(project_id, result_json)
            json_data = {JSON_DATA_PROJECT_ID: project_id, 
                         JSON_DATA_PROJECT_NAME: project_name,
                         file_name: file_name}
            return {JSON_STATUS: JSON_STATUS_SUCCESS, JSON_DATA: json_data, JSON_MESSAGE: message}
        else:
            json_data = {JSON_DATA_PROJECT_ID: project_id, 
                         JSON_DATA_PROJECT_NAME: project_name,
                         file_name: file_name}
            message = f"File '{upload_file}' extension not allowed!\n{VALID_IMAGE_EXTENSIONS}"
            return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: json_data, JSON_MESSAGE: message}
    else:
        json_data = {JSON_DATA_PROJECT_ID: project_id, 
                        JSON_DATA_PROJECT_NAME: project_name}
        message = f"Functionality not implemented yet!"
        return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: json_data, JSON_MESSAGE: message}

@validate_project_id
@project_bp.route('/upload/video/<project_id>/tag_images', methods = ['GET', 'POST'])
def upload_video_tag_images_rest(project_id):
    if request.method == 'POST':
        base_path = ProjectUtils.get_project_path(project_id)
        result_json = ResultUtils.get_result_json(project_id, create_if_not_exists=False)
        result_path = os.path.join(base_path, RESULT_JSON).replace('\\', '/')
        #Check result file exists
        if result_path is not None:
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

