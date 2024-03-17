from flask import request, abort
from functools import wraps

from app.constant import *
from app.project.ProjectUtils import ProjectUtils


def validate_project_id(f):
  @wraps(f)
  def decorated_function(*args, **kwargs):
    # get the project_name arguments from kwargs and check if it exists in the directory
    project_id = kwargs.get('project_id')

    if not ProjectUtils.exists_project(project_id):
      abort(404)
    return f(*args, **kwargs)
  return decorated_function

def validate_import_formats(f):
  @wraps(f)
  def decorated_function(*args, **kwargs):
    # get the project_name arguments from kwargs and check if it exists in the directory
    format = kwargs.get('format')

    if format not in VALID_IMPORT_FORMATS:
      abort(404)
    return f(*args, **kwargs)
  return decorated_function

def validate_export_formats(f):
  @wraps(f)
  def decorated_function(*args, **kwargs):
    # get the project_name arguments from kwargs and check if it exists in the directory
    format = kwargs.get('format')

    if format not in VALID_EXPORT_FORMATS:
      abort(404)
    return f(*args, **kwargs)
  return decorated_function