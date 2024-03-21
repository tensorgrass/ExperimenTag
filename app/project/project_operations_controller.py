from flask import abort, request

# from app import app
from flask import current_app as app
import os
import shutil

from app.constant import *

from icecream import ic
from app.decorators.validate_project_decorator import validate_project_id
from app.project.ProjectUtils import ProjectUtils

from app.project.project_controller import project_bp

@project_bp.route('/', methods=['GET', 'POST'])
@project_bp.route('/<project_id>', methods=['GET', 'POST', 'DELETE', 'PATCH'])
def manage_project_rest(project_id=""):
    """
    Create a new directory (project) to work with
    """
    if request.method == 'GET':
        if project_id is None or project_id == "":
            json_data = []
            projects_json = ProjectUtils.get_projects_json()
            project_list = list(projects_json[PROJECTS_JSON_PROJECTS].keys())
            for project_id in project_list:
                project_name = projects_json[PROJECTS_JSON_PROJECTS][project_id][PROJECTS_JSON_PROJECTS_NAME]
                json_data.append({JSON_DATA_PROJECT_ID: project_id,
                                JSON_DATA_PROJECT_NAME: project_name})
            message = f"Projects list retrieved successfully!"
            return {JSON_STATUS: JSON_STATUS_SUCCESS, JSON_DATA: json_data, JSON_MESSAGE: message}
        else:
            project_name = ProjectUtils.get_project_name(project_id)
            json_data = {JSON_DATA_PROJECT_ID: project_id,
                        JSON_DATA_PROJECT_NAME: project_name}
            message = f"Project {project_name} retrieved successfully!"
            return {JSON_STATUS: JSON_STATUS_SUCCESS, JSON_DATA: json_data, JSON_MESSAGE: message}
    elif request.method == 'POST':
        #get data posted
        project_name = request.form.get(JSON_DATA_PROJECT_NAME)
        if project_name is None or project_name == "" or project_name.isspace():
            message = f"No project name provided!"
            return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: {}, JSON_MESSAGE: message}
        
        projects_json = ProjectUtils.get_projects_json()
        project_name = project_name.strip()
        if project_id is None or project_id == "":
            project_num = projects_json[PROJECTS_JSON_NEXT_PROJECT]
            project_name_list = [char_name for char_name in project_name if char_name.isalnum() or char_name == "_" or char_name.isspace()]
            project_name_clean = "".join(project_name_list)
            project_name_clean = project_name_clean.replace(" ", "_")
            new_project_id = f"p{project_num}_{project_name_clean.lower()}"

            projects_json[PROJECTS_JSON_PROJECTS][new_project_id] = {PROJECTS_JSON_PROJECTS_NAME: project_name}
            projects_json[PROJECTS_JSON_NEXT_PROJECT] = project_num + 1

            json_data = {JSON_DATA_PROJECT_ID: new_project_id,
                        JSON_DATA_PROJECT_NAME: project_name}
            base_path = ProjectUtils.get_project_path(new_project_id)
            os.mkdir(base_path)
            message = f"Project {project_name} created successfully!"
            ProjectUtils.save_projects_json(projects_json)
            return {JSON_STATUS: JSON_STATUS_SUCCESS, JSON_DATA: json_data, JSON_MESSAGE: message}
    elif request.method == 'PATCH':
        #get data posted
        project_name = request.form.get(JSON_DATA_PROJECT_NAME)
        if project_name is None or project_name == "" or project_name.isspace():
            message = f"No project name provided!"
            return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: {}, JSON_MESSAGE: message}
        
        projects_json = ProjectUtils.get_projects_json()
        project_name = project_name.strip()

        json_data = {JSON_DATA_PROJECT_ID: project_id,
                    JSON_DATA_PROJECT_NAME: project_name}
        if not ProjectUtils.exists_project(project_id):
            message = f"Project {project_name} does not exists!"
            return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: json_data, JSON_MESSAGE: message}
        projects_json[PROJECTS_JSON_PROJECTS][project_id][PROJECTS_JSON_PROJECTS_NAME] = project_name
        json_data = {JSON_DATA_PROJECT_ID: project_id,
                    JSON_DATA_PROJECT_NAME: project_name}
        message = f"Project {project_name} updated successfully!"
        ProjectUtils.save_projects_json(projects_json)
        return {JSON_STATUS: JSON_STATUS_SUCCESS, JSON_DATA: json_data, JSON_MESSAGE: message}
    elif request.method == 'DELETE':
        if project_id is None or project_id == "":
            message = f"No project id provided!"
            return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: {}, JSON_MESSAGE: message}
        
        try:
            base_path = ProjectUtils.get_project_path(project_id)
            # os.rmdir(path)
            shutil.rmtree(base_path)
            projects_json = ProjectUtils.get_projects_json()
            project_name = projects_json[PROJECTS_JSON_PROJECTS][project_id][PROJECTS_JSON_PROJECTS_NAME]
            json_data = {JSON_DATA_PROJECT_ID: project_id,
                         JSON_DATA_PROJECT_NAME: project_name}
            del projects_json[PROJECTS_JSON_PROJECTS][project_id]
            ProjectUtils.save_projects_json(projects_json)
        except FileNotFoundError as e:
            print("Problems deleting directory")
            message = f"Project {project_name} does not exists!"
            return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: json_data, JSON_MESSAGE: message}
        message = f"Project {project_name} deleted successfully!"
        return {JSON_STATUS: JSON_STATUS_SUCCESS, JSON_DATA: json_data, JSON_MESSAGE: message}

@validate_project_id
@project_bp.route('/empty/<project_id>', methods=['DELETE'])
def manage_project_empty_rest(project_id):
    """
    Create a new directory (project) to work with
    """
    project_name = ProjectUtils.get_project_name(project_id)
    json_data = {JSON_DATA_PROJECT_ID: project_id,
                 JSON_DATA_PROJECT_NAME: project_name}
    try:
        base_path = ProjectUtils.get_project_path(project_id)
        # os.rmdir(path)
        shutil.rmtree(base_path)
        os.mkdir(base_path)
    except FileNotFoundError as e:
        print("Directory does not exists")
        message = f"Project {project_name} does not exists!"
        return {JSON_STATUS: JSON_STATUS_ERROR, JSON_DATA: json_data, JSON_MESSAGE: message}
    message = f"Project {project_name} empty successfully!"
    return {JSON_STATUS: JSON_STATUS_SUCCESS, JSON_DATA: json_data, JSON_MESSAGE: message}

