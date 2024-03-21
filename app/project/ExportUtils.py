import os
import shutil
import time

from flask import send_file
from flask import current_app as app
from icecream import ic

from app.constant import *
from app.project.ProjectUtils import ProjectUtils

class ExportUtils:
        
    def initialize_project_to_export(project_id):
        ProjectUtils.delete_temporal_directories(project_id)
        ProjectUtils.generate_temporal_directories(project_id)

    def send_zip_file(zip_file_path, zip_file_name):
        #Check if zip file exists
        ic(os.path.isfile(zip_file_path))
        file_handle = open(zip_file_path, 'rb')
        return send_file(file_handle, as_attachment=True, mimetype='application/zip', download_name=zip_file_name)