import os
import json

from icecream import ic

from app.constant import *
from app.project.ProjectUtils import ProjectUtils

class ResultUtils:
    def get_result_json(project_id, create_if_not_exists=True):
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)
        if not os.path.exists(base_tmp_path) and create_if_not_exists:
            os.makedirs(base_tmp_path)
        result_path = os.path.join(base_tmp_path, RESULT_JSON).replace('\\', '/')
        #Check file exists
        result_json = None
        if os.path.isfile(result_path):
            #read json file from result_path
            with open(result_path, 'r') as f:
                result_json = json.load(f)
        else:
            if create_if_not_exists:
                result_json = {RESULT_JSON_ADDED_IMAGES: [],
                               RESULT_JSON_UPDATED_IMAGES: [],
                               RESULT_JSON_ACTION_TAGS: ACTION_TAGS_CLEAN,
                               RESULT_JSON_IMPORT_ZIP: ""
                              }
        return result_json
    
    def save_result_json(project_id, result_json):
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)
        result_path = os.path.join(base_tmp_path, RESULT_JSON).replace('\\', '/')
        with open(result_path, 'w') as f:
            f.write(json.dumps(result_json, indent=4))