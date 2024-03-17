import os
import json
import shutil

from flask import render_template, url_for
from flask import current_app as app
from icecream import ic
from pymage_size import get_image_size

from app.constant import *
from app.project.ProjectUtils import ProjectUtils

class ConfigUtils:
    def check_config_json_exists(project_id):
        base_path = ProjectUtils.get_project_path(project_id)
        configuration_path = os.path.join(base_path, CONFIG_JSON).replace('\\', '/')
        return os.path.isfile(configuration_path)

    def get_config_json(project_id, migrate_if_needed=False):
        """
        Get the current configuration of the project
        """
        config = None
        base_path = ProjectUtils.get_project_path(project_id)
        configuration_path = os.path.join(base_path, CONFIG_JSON).replace('\\', '/')
        configuration_exists = os.path.isfile(configuration_path)
        config = {CONFIG_IMAGES: [],
                  CONFIG_VERSION: CONFIG_VERSION_CURRENT}
        if (configuration_exists):
            # load json from file
            with open(configuration_path) as f:
                config = json.load(f)
            if not (config[CONFIG_VERSION] == CONFIG_VERSION_CURRENT) and migrate_if_needed:
                ConfigUtils.migrate_config_json(project_id, config[CONFIG_VERSION])
        return config

    def save_config_json(project_id, config_json):
        base_path = ProjectUtils.get_project_path(project_id)
        configuration_path = os.path.join(base_path, CONFIG_JSON).replace('\\', '/')
        # save file to static folder
        with open(configuration_path, 'w') as f:
            f.write(json.dumps(config_json, indent=4))
        return True

    def backup_config_json(project_id):
        ProjectUtils.backup_file(project_id, CONFIG_JSON)

    def append_images_config_json(project_id, added_image_names, updated_image_names, action_tags):
        project_name = ProjectUtils.get_project_name(project_id)
        num_added_images = len(added_image_names)
        num_updated_images = len(updated_image_names)
        if num_added_images > 0 or num_updated_images > 0:
            base_path = ProjectUtils.get_project_path(project_id)
            config_json = ConfigUtils.get_config_json(project_id, migrate_if_needed=True)
            image_tags = {}
            last_image_tags = {}

            if action_tags == ACTION_TAGS_CLEAN:
                for image in config_json[CONFIG_IMAGES]:
                    image[CONFIG_IMAGES_TAGS] = {}
            elif action_tags == ACTION_TAGS_KEEP:
                if len(config_json[CONFIG_IMAGES]) > 0:
                    last_image_tags = config_json[CONFIG_IMAGES][-1][CONFIG_IMAGES_TAGS]
            
            if num_added_images > 0:
                for tag in last_image_tags.keys():
                    image_tags[tag] = {TAG_LEFT: last_image_tags[tag][TAG_LEFT],
                                    TAG_TOP: last_image_tags[tag][TAG_TOP],
                                    TAG_WIDTH: last_image_tags[tag][TAG_WIDTH],
                                    TAG_HEIGHT: last_image_tags[tag][TAG_HEIGHT],
                                    TAG_CLASS: last_image_tags[tag][TAG_CLASS],
                                    TAG_COLOR_SELECTED: last_image_tags[tag][TAG_COLOR_SELECTED],
                                    TAG_COLOR_UNSELECTED: last_image_tags[tag][TAG_COLOR_UNSELECTED],
                                    TAG_ACTIVE: not last_image_tags[tag][TAG_TYPE] == TAG_TYPE_SINGLE,
                                    TAG_TYPE: last_image_tags[tag][TAG_TYPE],
                                    TAG_TYPE_MULTIPLE_CALCULATED: not last_image_tags[tag][TAG_TYPE] == TAG_TYPE_SINGLE,
                                    TAG_TYPE_MULTIPLE_INITIAL: False,
                                    TAG_TYPE_MULTIPLE_FINAL: False,
                                    }
                
                for image_name in added_image_names:
                    image_path_real = os.path.join(base_path, image_name).replace('\\', '/')
                    img_format = get_image_size(image_path_real)
                    image_height, image_width = img_format.get_dimensions()
                    config_json[CONFIG_IMAGES].append({
                        CONFIG_IMAGES_NAME: image_name,
                        CONFIG_IMAGES_TAGS: image_tags,
                        CONFIG_IMAGES_HEIGHT: image_height,
                        CONFIG_IMAGES_WIDTH: image_width,
                    })
                        
            ConfigUtils.save_config_json(project_id, config_json)
            url_for_tag_images = url_for('image_tag.image_tag', project_id=project_id)
            status = JSON_STATUS_SUCCESS
            json_data = {JSON_DATA_PROJECT_ID: project_id, 
                         JSON_DATA_PROJECT_NAME: project_name,
                         RESULT_JSON_ADDED_IMAGES: added_image_names, 
                         RESULT_JSON_UPDATED_IMAGES: updated_image_names, 
                         JSON_URL_FOR_TAG_IMAGES: url_for_tag_images}
            message = f"Tags saved successfully!"
            return status, json_data, message
        else:
            status = JSON_STATUS_ERROR
            json_data = {JSON_DATA_PROJECT_ID: project_id,
                         JSON_DATA_PROJECT_NAME: project_name}
            message = f"No images to tag!"
            return status, json_data, message

    def validate_config_json_project(project_id):
        config_json = ConfigUtils.get_config_json(project_id)
        #Check if config file exists
        if config_json is None:
            return JSON_STATUS_ERROR, f"No file configuration exists!"

        #Check if CONFIG_IMAGES exists
        if CONFIG_IMAGES not in config_json:
            return JSON_STATUS_ERROR, f"No images in configuration file!"
        images = config_json[CONFIG_IMAGES]
        num_images_config = len(images)

        #Check if CONFIG_VERSION exists and is valid
        if CONFIG_VERSION not in config_json and config_json[CONFIG_VERSION] != CONFIG_VERSION_CURRENT:
            return JSON_STATUS_ERROR, f"Invalid version in configuration file {config_json[CONFIG_VERSION]}"
        
        base_path = ProjectUtils.get_project_path(project_id)
        #Count images in base_path
        name_images = [f for f in os.listdir(base_path) if os.path.isfile(os.path.join(base_path, f)) and f.split('.')[-1] in VALID_IMAGE_EXTENSIONS]
        num_images = len(name_images)
        if num_images != num_images_config:
            return JSON_STATUS_ERROR, f"Number of images in configuration file {num_images_config} is different from number of images in project {num_images}"
        
        num_tags = None
        for image in images:
            #Check if CONFIG_IMAGES_PATH exists
            # if CONFIG_IMAGES_PATH not in image:
            #     return JSON_STATUS_ERROR, f"Image {image} has no path!"

            image_name = image[CONFIG_IMAGES_NAME]
            if not os.path.isfile(os.path.join(base_path, image_name)):
                return JSON_STATUS_ERROR, f"Image {image_name} not found!"
            
            #Check if CONFIG_IMAGES_NAME exists
            if CONFIG_IMAGES_NAME not in image:
                return JSON_STATUS_ERROR, f"Image {image_name} has no name!"
            
            #Check if CONFIG_IMAGES_HEIGHT exists
            if CONFIG_IMAGES_HEIGHT not in image:
                return JSON_STATUS_ERROR, f"Image {image_name} has no height!"
            
            #Check if CONFIG_IMAGES_WIDTH exists
            if CONFIG_IMAGES_WIDTH not in image:
                return JSON_STATUS_ERROR, f"Image {image_name} has no width!"

            #Check if CONFIG_IMAGES_TAGS exists
            if CONFIG_IMAGES_TAGS not in image:
                return JSON_STATUS_ERROR, f"Image {image_name} has no tags!"
            
            image_tags = image[CONFIG_IMAGES_TAGS]
            if num_tags is None:
                num_tags = len(image_tags)
            else:
                if len(image_tags) != num_tags:
                    return JSON_STATUS_ERROR, f"Image {image_name} has different number of tags {len(image_tags)} from other images {num_tags}!"

            for tag in image_tags:
                #Check if TAG_LEFT exists
                if TAG_LEFT not in image_tags[tag]:
                    return JSON_STATUS_ERROR, f"Tag {tag} has no left!"
                
                #Check if TAG_TOP exists
                if TAG_TOP not in image_tags[tag]:
                    return JSON_STATUS_ERROR, f"Tag {tag} has no top!"
                
                #Check if TAG_WIDTH exists
                if TAG_WIDTH not in image_tags[tag]:
                    return JSON_STATUS_ERROR, f"Tag {tag} has no width!"
                
                #Check if TAG_HEIGHT exists
                if TAG_HEIGHT not in image_tags[tag]:
                    return JSON_STATUS_ERROR, f"Tag {tag} has no height!"
                
                #Check if TAG_CLASS exists
                if TAG_CLASS not in image_tags[tag]:
                    return JSON_STATUS_ERROR, f"Tag {tag} has no class!"
                
                #Check if TAG_COLOR_SELECTED exists
                if TAG_COLOR_SELECTED not in image_tags[tag]:
                    return JSON_STATUS_ERROR, f"Tag {tag} has no color_selected!"
                
                #Check if TAG_COLOR_UNSELECTED exists
                if TAG_COLOR_UNSELECTED not in image_tags[tag]:
                    return JSON_STATUS_ERROR, f"Tag {tag} has no color_unselected!"
                
                #Check if TAG_ACTIVE exists
                if TAG_ACTIVE not in image_tags[tag]:
                    return JSON_STATUS_ERROR, f"Tag {tag} has no active!"
                
                #Check if TAG_TYPE exists
                if TAG_TYPE not in image_tags[tag]:
                    return JSON_STATUS_ERROR, f"Tag {tag} has no type!"
                
                #Check if TAG_TYPE_MULTIPLE_CALCULATED is valid
                if image_tags[tag][TAG_TYPE] == TAG_TYPE_MULTIPLE_CALCULATED and TAG_TYPE_MULTIPLE_INITIAL not in image_tags[tag]:
                    return JSON_STATUS_ERROR, f"Tag {tag} has no initial value for multiple calculated!"
                
                #Check if TAG_TYPE_MULTIPLE_INITIAL is valid
                if image_tags[tag][TAG_TYPE] == TAG_TYPE_MULTIPLE_INITIAL and TAG_TYPE_MULTIPLE_FINAL not in image_tags[tag]:
                    return JSON_STATUS_ERROR, f"Tag {tag} has no final value for multiple initial!"
                
                #Check if TAG_TYPE_MULTIPLE_FINAL is valid
                if image_tags[tag][TAG_TYPE] == TAG_TYPE_MULTIPLE_FINAL and TAG_TYPE_MULTIPLE_INITIAL not in image_tags[tag]:
                    return JSON_STATUS_ERROR, f"Tag {tag} has no initial value for multiple final!"
                
        return JSON_STATUS_SUCCESS, "Project configuration is valid!"
    

    #############################
    ## MIGRATION FUNCTIONS
    #############################
    def migrate_config_json(project_id, current_version):
        """
        Migrate the config file
        """
        if current_version == CONFIG_VERSION_0_0_1:
            ConfigUtils.migrate_config_json_0_0_1_to_0_0_2(project_id)
            current_version = CONFIG_VERSION_0_0_2

        if current_version == CONFIG_VERSION_0_0_2:
            ConfigUtils.migrate_config_json_0_0_2_to_0_0_3(project_id)
            current_version = CONFIG_VERSION_0_0_3

        if current_version == CONFIG_VERSION_0_0_3:
            ConfigUtils.migrate_config_json_0_0_3_to_0_0_4(project_id)
            current_version = CONFIG_VERSION_0_0_4

        if current_version == CONFIG_VERSION_1_0_0:
            ConfigUtils.migrate_config_json_0_0_4_to_1_0_0(project_id)
            current_version = CONFIG_VERSION_0_0_4

    def migrate_config_json_0_0_1_to_0_0_2(project_id):
        """
        Migrate the config file from version 0.0.1 to 0.0.2
        """
        config_json = ConfigUtils.get_config_json(project_id, migrate_if_needed=False)
        if config_json is None:
            return False
        
        config_json[CONFIG_VERSION] = CONFIG_VERSION_0_0_2
        for image in config_json[CONFIG_IMAGES]:
            image_path_real = os.path.join(app.config["UPLOAD_FOLDER"], project_id, image["name"]).replace('\\', '/')
            img_format = get_image_size(image_path_real)
            image_height, image_width = img_format.get_dimensions()
            image["height"] = image_height
            image["width"] = image_width
            for tag in image["tags"]:
                image["tags"][tag]["tag_color"] = "#008000"
                #check class if exists
                if not "class" in image["tags"][tag]:
                    image["tags"][tag]["class"] = ""

            ConfigUtils.save_config_json(project_id, config_json)

        return True
    
    def migrate_config_json_0_0_2_to_0_0_3(project_id):
        """
        Migrate the config file from version 0.0.2 to 0.0.3
        """
        config_json = ConfigUtils.get_config_json(project_id, migrate_if_needed=False)
        if config_json is None:
            return False
        
        config_json[CONFIG_VERSION] = CONFIG_VERSION_0_0_3
        for image in config_json[CONFIG_IMAGES]:
            for tag in image["tags"]:
                color_default = image["tags"][tag]["color"]
                #delete color from tag
                del image["tags"][tag]["color"]
                image["tags"][tag]["color_selected"] = "#FFFFFF"
                image["tags"][tag]["color_unselected"] = color_default

        ConfigUtils.save_config_json(project_id, config_json)
        return True
    
    def migrate_config_json_0_0_3_to_0_0_4(project_id):
        """
        Migrate the config file from version 0.0.3 to 0.0.4
        """
        config_json = ConfigUtils.get_config_json(project_id, migrate_if_needed=False)
        if config_json is None:
            return False
        
        config_json[CONFIG_VERSION] = CONFIG_VERSION_0_0_4
        for image in config_json[CONFIG_IMAGES]:
            for tag in image["tags"]:
                color_selectd = image["tags"][tag]["color_selected"]
                color_unselectd = image["tags"][tag]["color_unselected"]
                image["tags"][tag]["color_selected"] = color_unselectd
                image["tags"][tag]["color_unselected"] = color_selectd

        ConfigUtils.save_config_json(project_id, config_json)
        return True
    
    def migrate_config_json_0_0_4_to_1_0_0(project_id):
        """
        Migrate the config file from version 0.0.4 to 0.0.1
        """
        config_json = ConfigUtils.get_config_json(project_id, migrate_if_needed=False)
        if config_json is None:
            return False
        
        config_json[CONFIG_VERSION] = CONFIG_VERSION_1_0_0

        ConfigUtils.save_config_json(project_id, config_json)
        return True