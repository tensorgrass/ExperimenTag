import glob
import os
import json
import shutil
import yaml
import copy

from flask import render_template, url_for, send_file, send_from_directory, after_this_request
from flask import current_app as app
from icecream import ic
from zipfile import ZipFile
from pathlib import Path
from pymage_size import get_image_size

from app.constant import *
import random
from app.project.ConfigUtils import ConfigUtils

from app.project.ProjectUtils import ProjectUtils
from app.project.ResultUtils import ResultUtils

class ImportUtils:

    def validate_before_import(format, project_id):
        project_name = ProjectUtils.get_project_name(project_id)
        base_path = ProjectUtils.get_project_path(project_id)
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)
        #Get list od files in directory without directories
        files = [f for f in os.listdir(base_path) if os.path.isfile(os.path.join(base_path, f))]

        data_yaml = os.path.join(base_tmp_path, DATA_YAML).replace('\\', '/')

        if len(files) > 0:
            json_data = {JSON_DATA_PROJECT_ID: project_id, 
                         JSON_DATA_PROJECT_NAME: project_name,
                         JSON_DATA_FORMAT: format}
            message = f"Can't import images to a project with images."
            print(message)
            for file in files:
                print(file)
            return JSON_STATUS_ERROR, json_data, message
        if os.path.isfile(data_yaml):
            shutil.rmtree(base_path)
            os.mkdir(base_path)
            json_data = {JSON_DATA_PROJECT_ID: project_id, 
                         JSON_DATA_PROJECT_NAME: project_name,
                         JSON_DATA_FORMAT: format}
            message = f"No data.yaml file found!"
            return JSON_STATUS_ERROR, json_data, message
        else:
            json_data = {JSON_DATA_PROJECT_ID: project_id, 
                         JSON_DATA_PROJECT_NAME: project_name,
                         JSON_DATA_FORMAT: format}
            message = f"All validations passed!"
            return JSON_STATUS_SUCCESS, json_data, message

    def import_file_zip(project_id, format, upload_file):
        project_name = ProjectUtils.get_project_name(project_id)
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)

        result_json = ResultUtils.get_result_json(project_id)

        file_name = upload_file.filename.replace('\\', '/').split('/')[-1]
        json_data = {JSON_DATA_PROJECT_ID: project_id, 
                     JSON_DATA_PROJECT_NAME: project_name,
                     JSON_DATA_FORMAT: format, file_name: file_name}
        if file_name.split('.')[-1] in VALID_ZIP_EXTENSIONS:
            file_path = os.path.join(base_tmp_path, file_name).replace('\\', '/')
            upload_file.save(file_path)
            result_json[RESULT_JSON_IMPORT_ZIP] = file_name
            ResultUtils.save_result_json(project_id, result_json)
            message = f"File uploaded successfully!"
            return JSON_STATUS_SUCCESS, json_data, message
        else:
            message = f"File extension not allowed!\n{VALID_IMPORT_EXTENSIONS}"
            return JSON_STATUS_ERROR, json_data, message

    def import_file_yolov8(project_id, format, upload_file):
        project_name = ProjectUtils.get_project_name(project_id)
        base_path = ProjectUtils.get_project_path(project_id)
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)

        result_json = ResultUtils.get_result_json(project_id)

        file_name = upload_file.filename.replace('\\', '/').split('/')[-1]
        json_data = {JSON_DATA_PROJECT_NAME: project_id, 
                     JSON_DATA_PROJECT_NAME: project_name,
                     JSON_DATA_FORMAT: format, file_name: file_name}
        if file_name.split('.')[-1] in VALID_IMAGE_EXTENSIONS:
            file_path = os.path.join(base_path, file_name).replace('\\', '/')
            file_exists = os.path.isfile(file_path)
            if not file_exists:
                result_json[RESULT_JSON_ADDED_IMAGES].append(file_name)
                message = f"Image uploaded and inserted successfully!"
                upload_file.save(file_path)
                ResultUtils.save_result_json(project_id, result_json)
                return JSON_STATUS_SUCCESS, json_data, message
            else:
                message = f"Image duplicated!"
                return JSON_STATUS_ERROR, json_data, message
        elif file_name.split('.')[-1] in VALID_IMPORT_EXTENSIONS:
            file_path = os.path.join(base_tmp_path, file_name).replace('\\', '/')
            file_exists = os.path.isfile(file_path)
            if not file_exists:
                message = f"File uploaded and inserted successfully!"
                upload_file.save(file_path)
                return JSON_STATUS_SUCCESS, json_data, message
            else:
                message = f"File duplicated!"
                return JSON_STATUS_ERROR, json_data, message
        else:
            message = f"File extension not allowed!\n{VALID_IMPORT_EXTENSIONS}"
            return JSON_STATUS_ERROR, json_data, message

    def import_file_backup(project_id, format, upload_file):
        project_name = ProjectUtils.get_project_name(project_id)
        base_path = ProjectUtils.get_project_path(project_id)

        file_name = upload_file.filename.replace('\\', '/').split('/')[-1]
        json_data = {JSON_DATA_PROJECT_NAME: project_id, 
                     JSON_DATA_PROJECT_NAME: project_name,
                     JSON_DATA_FORMAT: format, file_name: file_name}
        if file_name.split('.')[-1] in VALID_IMAGE_EXTENSIONS:
            file_path = os.path.join(base_path, file_name).replace('\\', '/')
            file_exists = os.path.isfile(file_path)
            if not file_exists:
                message = f"Image uploaded and inserted successfully!"
                upload_file.save(file_path)
                return JSON_STATUS_SUCCESS, json_data, message
            else:
                message = f"Image duplicated!"
                return JSON_STATUS_ERROR, json_data, message
        elif file_name == CONFIG_JSON:
            if not ConfigUtils.check_config_json_exists(project_id):
                message = f"File uploaded and inserted successfully!"
                upload_file.save(file_path)
                return JSON_STATUS_SUCCESS, json_data, message
            else:
                message = f"File not uploaded!"
                return JSON_STATUS_ERROR, json_data, message
        else:
            message = f"File extension not allowed!\n{VALID_IMPORT_EXTENSIONS}"
            return JSON_STATUS_ERROR, json_data, message

    def initialize_project_to_import(project_id):
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)
        #Remove tmp directory if exists
        dir_tmp_exists = os.path.exists(base_tmp_path)
        if (not dir_tmp_exists):
            os.mkdir(base_tmp_path)
    
####################################
### TAGS
####################################
    def tag_images_yolov8_zip(format, project_id):
        project_name = ProjectUtils.get_project_name(project_id)
        base_path = ProjectUtils.get_project_path(project_id)
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)
        result_json = ResultUtils.get_result_json(project_id, create_if_not_exists=False)
        
        if result_json == "":
            message = f"No images to tag!"
            json_data = {JSON_DATA_PROJECT_ID: project_id, 
                         JSON_DATA_PROJECT_NAME: project_name,
                         JSON_DATA_FORMAT: format}
            return JSON_STATUS_ERROR, json_data, message
        
        zip_file_name = result_json[RESULT_JSON_IMPORT_ZIP]
        zip_file_path = os.path.join(base_tmp_path, zip_file_name).replace('\\', '/')

        #unzip file
        with ZipFile(zip_file_path, 'r') as zip_ref:
            zip_ref.extractall(base_tmp_path)

        images = [f.replace('\\', '/') for f in glob.glob(base_tmp_path + '/**/*.*', recursive=True) if f.split('.')[-1] in VALID_IMAGE_EXTENSIONS]
        for image in images:
            image_name = image.split('/')[-1]
            image_path = os.path.join(base_path, image_name).replace('\\', '/')
            shutil.move(image, image_path)

        tag_files = [f.replace('\\', '/') for f in glob.glob(base_tmp_path + '/**/*.txt', recursive=True)]
        ic(tag_files)
        for tag_file in tag_files:
            tag_file_name = tag_file.split('/')[-1]
            tag_file_path = os.path.join(base_tmp_path, tag_file_name).replace('\\', '/')
            shutil.move(tag_file, tag_file_path)

        added_image_names = [f.replace('\\', '/').split("/")[-1] for f in os.listdir(base_path) if f.split('.')[-1] in VALID_IMAGE_EXTENSIONS]
        result_json[RESULT_JSON_ADDED_IMAGES] = added_image_names
        ResultUtils.save_result_json(project_id, result_json)

        return ImportUtils.tag_images_yolov8(format, project_id)
    
    def tag_images_yolov8(format, project_id):
        project_name = ProjectUtils.get_project_name(project_id)
        base_path = ProjectUtils.get_project_path(project_id)

        status, json_data, message = ImportUtils.get_class_names_from_load_data_yaml(format, project_id)
        if status == JSON_STATUS_ERROR:
            return status, json_data, message
        class_names = json_data["class_names"]
        if class_names is None:
            shutil.rmtree(base_path)
            os.mkdir(base_path)
            message = f"No file data.yaml!"
            return JSON_STATUS_ERROR, json_data, message

        result_json = ResultUtils.get_result_json(project_id, create_if_not_exists=False)
        if result_json is None:
            shutil.rmtree(base_path)
            os.mkdir(base_path)
            message = f"No images to tag!"
            return JSON_STATUS_ERROR, json_data, message     

        added_image_names = result_json[RESULT_JSON_ADDED_IMAGES]
        added_image_names.sort()
        updated_image_names = result_json[RESULT_JSON_UPDATED_IMAGES]

        #read all images from directory in base_path orderer by name
        image_tags_template, tagged_image_names = \
            ImportUtils.tag_all_images_yolov8(project_id, class_names, added_image_names)

        config_json = ConfigUtils.get_config_json(project_id, create_if_not_exists=True)
        #complete image_tags with all tags. All images must have the same tags
        for image in config_json[CONFIG_IMAGES]:
            complete_image_tags = copy.deepcopy(image_tags_template)
            for image_tag in image[CONFIG_IMAGES_TAGS]:
                complete_image_tags[image_tag] = image[CONFIG_IMAGES_TAGS][image_tag]
                complete_image_tags[image_tag][TAG_LEFT] = image[CONFIG_IMAGES_TAGS][image_tag][TAG_LEFT]
                complete_image_tags[image_tag][TAG_TOP] = image[CONFIG_IMAGES_TAGS][image_tag][TAG_TOP]
                complete_image_tags[image_tag][TAG_WIDTH] = image[CONFIG_IMAGES_TAGS][image_tag][TAG_WIDTH]
                complete_image_tags[image_tag][TAG_HEIGHT] = image[CONFIG_IMAGES_TAGS][image_tag][TAG_HEIGHT]
                complete_image_tags[image_tag][TAG_ACTIVE] = image[CONFIG_IMAGES_TAGS][image_tag][TAG_ACTIVE]
            image[CONFIG_IMAGES_TAGS] = complete_image_tags

        if (len(tagged_image_names) > 0):
            ConfigUtils.save_config_json(project_id, config_json)
            url_for_tag_images = url_for('image_tag.image_tag', project_id=project_id)
            json_data = {JSON_DATA_PROJECT_ID: project_id, 
                         JSON_DATA_PROJECT_NAME: project_name,
                         JSON_DATA_FORMAT: format, 
                         RESULT_JSON_ADDED_IMAGES: added_image_names, 
                         RESULT_JSON_UPDATED_IMAGES: updated_image_names, 
                         JSON_URL_FOR_TAG_IMAGES: url_for_tag_images}
            message = f"Tags saved successfully!"
            return JSON_STATUS_SUCCESS, json_data, message
        else:
            shutil.rmtree(base_path)
            os.mkdir(base_path)
            json_data = {JSON_DATA_PROJECT_ID: project_id, 
                         JSON_DATA_PROJECT_NAME: project_name,
                         JSON_DATA_FORMAT: format}
            message = f"No images with tag!"
            return JSON_STATUS_ERROR, json_data, message

    def tag_all_images_yolov8(project_id, class_names, added_image_names):
        image_tags_template = {}
        tagged_image_names = []
        config_json = ConfigUtils.get_config_json(project_id, create_if_not_exists=True)
        base_path = ProjectUtils.get_project_path(project_id)
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)
        for image_name in added_image_names:
            print(image_name)
            image_path = os.path.join(base_path, image_name).replace('\\', '/')
            # image_name = image_path.replace('\\', '/').split('/')[-1]
            tag_file_name = os.path.splitext(image_name)[0] + '.txt'
            print("Looking for tag file for image: " + tag_file_name )
            tag_file_path = os.path.join(base_tmp_path, tag_file_name).replace('\\', '/')
            #check if tag file exists
            if (os.path.isfile(tag_file_path)):
                print("tag_file found")
                tagged_image_names.append(image_name)
                #get with and height of image
                # image_height, image_width, image_channels = cv2.imread(image_path).shape
                img_format = get_image_size(image_path)
                image_height, image_width = img_format.get_dimensions()
                image_tags = copy.deepcopy(image_tags_template)
                with open(tag_file_path, 'r') as file:
                    lines = file.readlines()
                    for line in lines:
                        print(line)
                        #line clear spaces at the beginning and end
                        clear_line = line.strip()
                        #replace multiple spaces with one
                        while "  " in clear_line:
                            clear_line = clear_line.replace('  ', ' ')
                        #split line by space
                        tag_value = clear_line.split(' ')
                        #if tag size = 5 then read the tag
                        #Check if tag have 5 values separated by space and first value is integer and the rest are float
                        if (len(tag_value) == 5 and tag_value[0].isdigit() and all(map(lambda x: x.replace('.', '', 1).isdigit(), tag_value[1:]))):
                            class_tag_id = tag_value[0]
                            # look for class in image_tags_tempalte

                            tag_x = float(tag_value[1])
                            tag_y = float(tag_value[2])
                            tag_width = float(tag_value[3])
                            tag_height = float(tag_value[4])

                            num_tags = 0
                            for tag_name in image_tags:
                                num_tags += 1
                                if image_tags[tag_name][TAG_CLASS] == class_names[int(class_tag_id)] and not image_tags[new_tag_name][TAG_ACTIVE]:
                                    image_tags[tag_name][TAG_LEFT] = round(image_width * tag_x - (image_width * tag_width / 2), 0)
                                    image_tags[tag_name][TAG_TOP] = round(image_height * tag_y - (image_height * tag_height / 2), 0)
                                    image_tags[tag_name][TAG_WIDTH] = round(image_width * tag_width, 0)
                                    image_tags[tag_name][TAG_HEIGHT] = round(image_height * tag_height, 0)
                                    image_tags[tag_name][TAG_ACTIVE] = True
                                    break
                            else:
                                new_tag_name = f'tag_{num_tags:03d}'
                                image_tags[new_tag_name] = {TAG_LEFT: round(image_width * tag_x - (image_width * tag_width / 2), 0),
                                                        TAG_TOP: round(image_height * tag_y - (image_height * tag_height / 2), 0),
                                                        TAG_WIDTH: round(image_width * tag_width, 0),
                                                        TAG_HEIGHT: round(image_height * tag_height, 0),
                                                        TAG_CLASS: class_names[int(class_tag_id)],
                                                        TAG_COLOR_SELECTED: TAG_COLOR_SELECTED_DEFAULT,
                                                        TAG_COLOR_UNSELECTED: TAG_COLOR_UNSELECTED_DEFAULT,
                                                        TAG_ACTIVE: True,
                                                        TAG_TYPE: TAG_TYPE_SINGLE,
                                                        TAG_TYPE_MULTIPLE_CALCULATED: False,
                                                        TAG_TYPE_MULTIPLE_INITIAL: False,
                                                        TAG_TYPE_MULTIPLE_FINAL: False,
                                                    }
                                image_tags_template[new_tag_name] = {TAG_LEFT: 0,
                                                        TAG_TOP: 0,
                                                        TAG_WIDTH: 0,
                                                        TAG_HEIGHT: 0,
                                                        TAG_CLASS: class_names[int(class_tag_id)],
                                                        TAG_COLOR_SELECTED: TAG_COLOR_SELECTED_DEFAULT,
                                                        TAG_COLOR_UNSELECTED: TAG_COLOR_UNSELECTED_DEFAULT,
                                                        TAG_ACTIVE: False,
                                                        TAG_TYPE: TAG_TYPE_SINGLE,
                                                        TAG_TYPE_MULTIPLE_CALCULATED: False,
                                                        TAG_TYPE_MULTIPLE_INITIAL: False,
                                                        TAG_TYPE_MULTIPLE_FINAL: False,
                                                    }
                config_json[CONFIG_IMAGES].append({
                    CONFIG_IMAGES_NAME: image_name,
                    CONFIG_IMAGES_TAGS: image_tags,
                    CONFIG_IMAGES_HEIGHT: image_height,
                    CONFIG_IMAGES_WIDTH: image_width,
                })
            else:
                #delete image because no tag file was found
                os.remove(image_path)
        ConfigUtils.save_config_json(project_id, config_json)
        return image_tags_template, tagged_image_names

    def get_class_names_from_load_data_yaml(format, project_id):
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)
        class_names = None
        data_yaml = os.path.join(base_tmp_path, DATA_YAML).replace('\\', '/')
        project_name = ProjectUtils.get_project_name(project_id)
        json_data = {JSON_DATA_PROJECT_ID: project_id,
                     JSON_DATA_PROJECT_NAME: project_name,
                     JSON_DATA_FORMAT: format}
        with open(data_yaml, 'r') as stream:
            try:
                data = yaml.safe_load(stream)
                class_names = data['names']
            except yaml.YAMLError as exc:
                print(exc)
                message = f"Error reading data.yaml file!\n{str(exc)}"
                return JSON_STATUS_ERROR, json_data, message
        json_data["class_names"] = class_names
        message = f"Class names read successfully!"
        return JSON_STATUS_SUCCESS, json_data, message
    
    def tag_images_backup_zip(format, project_id):
        base_path = ProjectUtils.get_project_path(project_id)
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)
        result_json = ResultUtils.get_result_json(project_id, create_if_not_exists=False)
        if result_json == "":
            json_data = {JSON_DATA_PROJECT_NAME: project_id, JSON_DATA_FORMAT: format}
            message = f"No images to tag!"
            return JSON_STATUS_ERROR, json_data, message
        
        ic(result_json)
        ic(result_json[RESULT_JSON_IMPORT_ZIP])
        zip_file_name = result_json[RESULT_JSON_IMPORT_ZIP]
        zip_file_path = os.path.join(base_tmp_path, zip_file_name).replace('\\', '/')

        #unzip file
        with ZipFile(zip_file_path, 'r') as zip_ref:
            zip_ref.extractall(base_path)
       
        return ImportUtils.tag_images_backup(format, project_id)

    def tag_images_backup(format, project_id):
        project_name = ProjectUtils.get_project_name(project_id)
        base_path = ProjectUtils.get_project_path(project_id)
        json_data = {JSON_DATA_PROJECT_ID: project_id, 
                     JSON_DATA_PROJECT_NAME: project_name, 
                     JSON_DATA_FORMAT: format}
        config_json = ConfigUtils.get_config_json(project_id)
        if config_json is None:
            shutil.rmtree(base_path)
            os.mkdir(base_path)
            message = f"No file config.json!"
            return JSON_STATUS_ERROR, json_data, message

        added_image_names = []
        file_list = [f for f in os.listdir(base_path) if os.path.isfile(os.path.join(base_path, f))]
        file_list.remove(CONFIG_JSON)
        for image in config_json[CONFIG_IMAGES]:
            image_path_real = os.path.join(base_path, image[CONFIG_IMAGES_NAME]).replace('\\', '/')
            if os.path.isfile(image_path_real):
                file_list.remove(image[CONFIG_IMAGES_NAME])
                added_image_names.append(image_path_real.split('/')[-1])
            else:
                shutil.rmtree(base_path)
                os.mkdir(base_path)
                message = f"Image {image[CONFIG_IMAGES_NAME]} not found!"
                return JSON_STATUS_ERROR, json_data, message
        
        for file in file_list:
            os.remove(os.path.join(base_path, file))
        
        #Get all directories in the directory
        dir_list = [f for f in os.listdir(base_path) if os.path.isdir(os.path.join(base_path, f))]
        for dir in dir_list:
            shutil.rmtree(os.path.join(base_path, dir))

        message = f"Images tagged successfully!"
        url_for_tag_images = url_for('image_tag.image_tag', project_id=project_id)
        updated_image_names = []
        ConfigUtils.save_config_json(project_id, config_json)
        json_data = {JSON_DATA_PROJECT_ID: project_id, 
                     JSON_DATA_PROJECT_NAME: project_name,
                     JSON_DATA_FORMAT: format, 
                     RESULT_JSON_ADDED_IMAGES: added_image_names, 
                     RESULT_JSON_UPDATED_IMAGES: updated_image_names, 
                     JSON_URL_FOR_TAG_IMAGES: url_for_tag_images}
        return JSON_STATUS_SUCCESS, json_data, message