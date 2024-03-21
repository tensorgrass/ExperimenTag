CONFIG_VERSION_0_0_1 = "0.0.1"
CONFIG_VERSION_0_0_2 = "0.0.2"
CONFIG_VERSION_0_0_3 = "0.0.3"
CONFIG_VERSION_0_0_4 = "0.0.4"
CONFIG_VERSION_1_0_0 = "1.0.0"
CONFIG_VERSION_CURRENT = CONFIG_VERSION_1_0_0

SESSION_CONFIG_CURRENT_ID = "config_current_id_"

UPLOAD_FOLDER = "UPLOAD_FOLDER"
UPLOADS_FOLDER = "uploads"

UPLOAD_IMAGES_TITLE = "Upload images"
UPLOAD_VIDEO_TITLE = "Upload video"
IMPORT_TITLE = "Import"
IMAGE_TAG_TITLE = "Image tag"
EXPORT_TITLE = "Export"

JSON_PROJECT_ID = "id"
JSON_PROJECT_NAME = "name"
JSON_PROJECT_NUM_IMAGES = "num_images"
JSON_PROJECT_URL_DESTINATION = "url_destination"
JSON_PROJECT_ERROR = "error"
JSON_PROJECT_ERROR_MESSAGE = "error_message"
JSON_PROJECT_NUM = "project_num"

PROJECTS_JSON = "projects.json"
PROJECTS_JSON_VERSION = "version"
PROJECTS_JSON_NEXT_PROJECT = "next_project"
PROJECTS_JSON_PROJECTS = "projects"

PROJECTS_JSON_PROJECTS_NAME = "name"

PROJECTS_JSON_VERSION_0_0_1 = "0.0.1"

CONFIG_JSON = "config.json"
CONFIG = "config"
CONFIG_IMAGES = "images"
CONFIG_VERSION = "version"

CONFIG_IMAGES_NAME = "name"
CONFIG_IMAGES_HEIGHT = "height"
CONFIG_IMAGES_WIDTH = "width"
CONFIG_IMAGES_TAGS = "tags"

JSON_OPERATION = "operation"
JSON_STATUS = "status"
JSON_STATUS_SUCCESS = "success"
JSON_STATUS_ERROR = "error"
JSON_MESSAGE = "message"
JSON_DATA = "data"
JSON_DATA_PROJECT_ID = "project_id"
JSON_DATA_PROJECT_NAME = "project_name"
JSON_DATA_IMAGE_NAME = "image_name"
JSON_DATA_FORMAT = "format"
JSON_SAVE_TAGS = "save_tags"
JSON_NUM_CURRENT_IMG = "num_current_img"
JSON_IMG_TAGS = "img_tags"
JSON_IMAGE = "image"
JSON_URL_FOR_TAG_IMAGES = "url_for_tag_images"

RESULT_JSON = "result.json"
RESULT_JSON_ADDED_IMAGES = "added_images"
RESULT_JSON_UPDATED_IMAGES = "updated_images"
RESULT_JSON_ACTION_TAGS = "action_tags"
RESULT_JSON_IMPORT_ZIP = "import_zip"

TAG_LEFT = "left"
TAG_TOP = "top"
TAG_WIDTH = "width"
TAG_HEIGHT = "height"
TAG_CLASS = "class"
TAG_COLOR_SELECTED = "color_selected"
TAG_COLOR_SELECTED_DEFAULT = "#008000"
TAG_COLOR_UNSELECTED = "color_unselected"
TAG_COLOR_UNSELECTED_DEFAULT = "#FFFFFF"
TAG_ACTIVE = "active"
TAG_TYPE = "tag_type"
TAG_TYPE_MULTIPLE_CALCULATED = "multi_calc"
TAG_TYPE_MULTIPLE_INITIAL = "multi_ini"
TAG_TYPE_MULTIPLE_FINAL = "multi_fin"

TAG_TYPE_SINGLE = "single"
TAG_TYPE_LINEAR = "linear"
TAG_TYPE_CURVE = "curve"

VALID_IMPORT_FORMATS = ['backup', 'backup_zip', 'yolov8', 'yolov8_zip']
IMPORT_ZIP_FORMATS = ['backup_zip', 'yolov8_zip']
IMPORT_FORMAT_BACKUP = 'backup'
IMPORT_FORMAT_BACKUP_ZIP = 'backup_zip'
IMPORT_FORMAT_YOLOV8 = 'yolov8'
IMPORT_FORMAT_YOLOV8_ZIP = 'yolov8_zip'

ACTION_TAGS_KEEP = "keep_tags"
ACTION_TAGS_CLEAN = "clean_tags"

VALID_ZIP_EXTENSIONS = ['zip']
VALID_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png']
VALID_VIDEO_EXTENSIONS = ['mp4']
VALID_IMPORT_EXTENSIONS = ['jpg', 'jpeg', 'png', 'txt', 'yaml', 'yml', 'json']

VALID_EXPORT_FORMATS = ['backup', 'yolov8']
EXPORT_FORMAT_BACKUP = 'backup'
EXPORT_FORMAT_YOLOV8 = 'yolov8'

PARAMETER_VALID = "valid"
PARAMETER_TEST = "test"
PARAMETER_TRAIN = "train"
PARAMETER_IMAGES_TO_EXPORT = "images_to_export"

IMAGES_TO_EXPORT_ALL_IMAGES = "all_images"
IMAGES_TO_EXPORT_ONLY_WITH_TAGS = "only_with_tags"

DATA_YAML = "data.yaml"
DATA_YAML_YOLOV8 = """
train: ../train/images
val: ../valid/images
test: ../test/images

nc: [num_classes]
names: [class_names]
"""
DATA_YAML_YOLOV8_NC = "[num_classes]"
DATA_YAML_YOLOV8_NAMES = "[class_names]"