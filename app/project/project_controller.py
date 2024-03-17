from flask import Blueprint

project_bp = Blueprint('project', __name__, url_prefix='/project')

import app.project.project_operations_controller
import app.project.project_upload_images_controller
import app.project.project_upload_video_controller
import app.project.project_import_project_controller
import app.project.project_export_controller
import app.project.project_upload_images_controller