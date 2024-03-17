import os
import random

from flask import render_template, url_for, send_file, send_from_directory, after_this_request
from icecream import ic
from zipfile import ZipFile

from app.constant import *

from app.project.ProjectUtils import ProjectUtils
from app.project.ExportUtils import ExportUtils

class ExportBackupUtils:


    def export_backup(project_id):
        '''
        Get all the images from project_name and create a zip file with the images and configuration file
        '''
        base_path = ProjectUtils.get_project_path(project_id)
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)
        ExportUtils.initialize_project_to_export(project_id)

        configuration_path = os.path.join(base_path, CONFIG_JSON).replace('\\', '/')

        #Get all images in base_path and create a zip file
        all_files = [f for f in os.listdir(base_path) if os.path.isfile(os.path.join(base_path, f))]
        all_images = [file for file in all_files if file.split('.')[-1] in VALID_IMAGE_EXTENSIONS]
        #Zip the images
        zip_file_name = project_id + '_backup.zip'
        zip_file_path = os.path.join(base_tmp_path, zip_file_name).replace('\\', '/')
        with ZipFile(zip_file_path, 'w') as zipf:
            zipf.write(configuration_path, arcname=CONFIG_JSON)
            for img in all_images:
                img_path = os.path.join(base_path, img).replace('\\', '/')
                zipf.write(img_path, arcname=img)

        return ExportUtils.send_zip_file(zip_file_path, zip_file_name)
