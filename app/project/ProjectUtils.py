import json
import os
import shutil

from flask import current_app as app, url_for
from icecream import ic

from app.constant import *

class ProjectUtils:
    ######################################
    ## Project list                     ##
    ######################################
    def get_projects_json():
        root_path = os.path.join(app.config[UPLOAD_FOLDER]).replace('\\', '/')
        projects_path = os.path.join(root_path, PROJECTS_JSON).replace('\\', '/')
        #Read projects.json from projects_path
        with open(projects_path, 'r') as f:
            projects_json = json.load(f)
        return projects_json

    def save_projects_json(projects_json):
        root_path = os.path.join(app.config[UPLOAD_FOLDER]).replace('\\', '/')
        projects_path = os.path.join(root_path, PROJECTS_JSON).replace('\\', '/')
        #Save projects.json to projects_path
        with open(projects_path, 'w') as f:
            json.dump(projects_json, f, indent=4)

    def get_next_project_number():
        projects_json = ProjectUtils.get_projects_json()
        next_project = projects_json[PROJECTS_JSON_NEXT_PROJECT]
        # projects_json[PROJECTS_JSON_NEXT_PROJECT] = next_project + 1
        # ProjectUtils.save_projects_json(projects_json)
        return next_project

    def exists_project(project_id):
        projects_json = ProjectUtils.get_projects_json()
        #Check if key project_id exists in projects_json[PROJECTS_JSON_PROJECTS]
        return project_id in projects_json[PROJECTS_JSON_PROJECTS]

    def get_project_name(project_id):
        projects_json = ProjectUtils.get_projects_json()
        project_name = projects_json[PROJECTS_JSON_PROJECTS][project_id][PROJECTS_JSON_PROJECTS_NAME]
        return project_name
    
    def get_project_list():
        projects_json = ProjectUtils.get_projects_json()
        # Get keys of projects_json[PROJECTS_JSON_PROJECTS]
        list_projects_id = list(projects_json[PROJECTS_JSON_PROJECTS].keys())
        return list_projects_id
    
    def get_project_list_data(url_for_destination, format=None):
        project_list = ProjectUtils.get_project_list()

        data_projects = []
        # inside directory count the number of images
        for project_id in project_list:
            project_name = ProjectUtils.get_project_name(project_id)
            num_images = ProjectUtils.get_project_num_images(project_id)
            error = False
            error_message = "The project is not empty"
            if format is not None:
                url_detination = url_for(url_for_destination, format=format, project_id=project_id)
            else:
                url_detination = url_for(url_for_destination, project_id=project_id)
            data_projects.append({JSON_PROJECT_ID: project_id,
                                JSON_PROJECT_NAME: project_name, 
                                JSON_PROJECT_NUM_IMAGES: num_images, 
                                JSON_PROJECT_URL_DESTINATION: url_detination,
                                JSON_PROJECT_ERROR: error,
                                JSON_PROJECT_ERROR_MESSAGE: error_message,
                                JSON_PROJECT_NUM: int(project_id.split('_')[0].replace('p', ''))
                                })
        
        #inverse order array data_projects by JSON_PROJECT_NUM
        data_projects = sorted(data_projects, key=lambda k: k[JSON_PROJECT_NUM], reverse=True)

        return data_projects

    def get_project_list_data_error_not_empty(url_for_destination, format=None):
        project_list = ProjectUtils.get_project_list()

        data_projects = []
        # inside directory count the number of images
        for project_id in project_list:
            project_name = ProjectUtils.get_project_name(project_id)
            num_images = ProjectUtils.get_project_num_images(project_id)

            base_path = ProjectUtils.get_project_path(project_id)
            configuration_path = os.path.join(base_path, CONFIG_JSON).replace('\\', '/')
            error = os.path.isfile(configuration_path)
            error_message = "Can't inport images to a project with images."
            if format is not None:
                url_detination = url_for(url_for_destination, format=format, project_id=project_id)
            else:
                url_detination = url_for(url_for_destination, project_id=project_id)
            data_projects.append({JSON_PROJECT_ID: project_id,
                                JSON_PROJECT_NAME: project_name, 
                                JSON_PROJECT_NUM_IMAGES: num_images, 
                                JSON_PROJECT_URL_DESTINATION: url_detination,
                                JSON_PROJECT_ERROR: error,
                                JSON_PROJECT_ERROR_MESSAGE: error_message,
                                JSON_PROJECT_NUM: int(project_id.split('_')[0].replace('p', ''))
                                })
            
        #inverse order array data_projects by JSON_PROJECT_NUM
        data_projects = sorted(data_projects, key=lambda k: k[JSON_PROJECT_NUM], reverse=True)

        return data_projects

    def get_project_list_data_error_empty(url_for_destination, format=None):
        project_list = ProjectUtils.get_project_list()

        data_projects = []
        # inside directory count the number of images
        for project_id in project_list:
            project_name = ProjectUtils.get_project_name(project_id)
            num_images = ProjectUtils.get_project_num_images(project_id)
            base_path = ProjectUtils.get_project_path(project_id)
            configuration_path = os.path.join(base_path, CONFIG_JSON).replace('\\', '/')
            error = not os.path.isfile(configuration_path)
            error_message = "No file configuration exists!"
            if format is not None:
                url_detination = url_for(url_for_destination, format=format, project_id=project_id)
            else:
                url_detination = url_for(url_for_destination, project_id=project_id)
            data_projects.append({JSON_PROJECT_ID: project_id,
                                JSON_PROJECT_NAME: project_name, 
                                JSON_PROJECT_NUM_IMAGES: num_images, 
                                JSON_PROJECT_URL_DESTINATION: url_detination,
                                JSON_PROJECT_ERROR: error,
                                JSON_PROJECT_ERROR_MESSAGE: error_message,
                                JSON_PROJECT_NUM: int(project_id.split('_')[0].replace('p', ''))
                                })
        
        #inverse order array data_projects by JSON_PROJECT_NUM
        data_projects = sorted(data_projects, key=lambda k: k[JSON_PROJECT_NUM], reverse=True)

        return data_projects  

    ######################################
    ## Working with project directories ##
    ######################################
    def get_project_path(project_id):
        base_path = os.path.join(app.config[UPLOAD_FOLDER], project_id).replace('\\', '/')
        return base_path

    def get_project_tmp_path(project_id):
        base_tmp_path = os.path.join(app.config[UPLOAD_FOLDER], project_id, "tmp").replace('\\', '/')
        return base_tmp_path

    def get_project_backup_path(project_id):
        base_backup_path = os.path.join(app.config[UPLOAD_FOLDER], project_id, "backup").replace('\\', '/')
        return base_backup_path

    def get_project_num_images(project_id):
        base_path = ProjectUtils.get_project_path(project_id)
        num_images = len([f for f in os.listdir(base_path) if os.path.isfile(os.path.join(base_path, f)) and f.split('.')[-1] in VALID_IMAGE_EXTENSIONS])
        return num_images

    def delete_temporal_directories(project_id):
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)
        if os.path.exists(base_tmp_path):
            shutil.rmtree(base_tmp_path)
        base_backup_path = ProjectUtils.get_project_backup_path(project_id)
        if os.path.exists(base_backup_path):
            shutil.rmtree(base_backup_path)
        return True
    
    def generate_temporal_directories(project_id):
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)
        if not os.path.exists(base_tmp_path):
            os.makedirs(base_tmp_path)
        base_backup_path = ProjectUtils.get_project_backup_path(project_id)
        if not os.path.exists(base_backup_path):
            os.makedirs(base_backup_path)
        ProjectUtils.backup_file(project_id, CONFIG_JSON)

    def backup_file(project_id, file_name):
        base_path = ProjectUtils.get_project_path(project_id)
        base_backup_path = ProjectUtils.get_project_backup_path(project_id)
        if not os.path.exists(base_backup_path):
            os.makedirs(base_backup_path)
        file_path = os.path.join(base_path, file_name).replace('\\', '/')
        file_path_backup = os.path.join(base_backup_path, file_name).replace('\\', '/')
        if os.path.isfile(file_path) and not os.path.isfile(file_path_backup):
            shutil.copy(file_path, base_backup_path)

    def restore_project_from_backup(project_id):
        base_path = ProjectUtils.get_project_path(project_id)
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)
        base_backup_path = ProjectUtils.get_project_backup_path(project_id)
        if os.path.exists(base_path):
            result_json_path = os.path.join(base_tmp_path, RESULT_JSON).replace('\\', '/')
            if os.path.isfile(result_json_path):
                with open(result_json_path, 'r') as f:
                    result_json = json.load(f)
                added_image_names = result_json[RESULT_JSON_ADDED_IMAGES]
                #remove added images
                for added_image_name in added_image_names:
                    file_path = os.path.join(base_path, added_image_name).replace('\\', '/')
                    if os.path.isfile(file_path):
                        os.remove(file_path)
            config_json_path = os.path.join(base_path, CONFIG_JSON).replace('\\', '/')
            config_json_backup_path = os.path.join(base_backup_path, CONFIG_JSON).replace('\\', '/')
            if not os.path.isfile(config_json_backup_path) and os.path.isfile(config_json_path):
                os.remove(config_json_path)
            # copy base_backup_path only files to base_path
            name_files = [f for f in os.listdir(base_backup_path) if os.path.isfile(os.path.join(base_path, f)) and (f.split('.')[-1] in VALID_IMAGE_EXTENSIONS or f == CONFIG_JSON)]
            for name_file in name_files:
                file_path = os.path.join(base_backup_path, name_file).replace('\\', '/')
                file_path_dest = os.path.join(base_path, name_file).replace('\\', '/')
                shutil.copy(file_path, file_path_dest)
