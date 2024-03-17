import os
class BaseConfig(object):
    'Base configuracion'
    SECRET_KEY = os.urandom(24)
    DEBUG = True
    TESTING = False
    UPLOAD_FOLDER = 'app/static/uploads'
    MAX_CONTENT_PATH = 1024 * 1024 * 1024


class ProductionConfig(BaseConfig):
    'Produccion configuracion'
    DEBUG = False
class DevelopmentConfig(BaseConfig):
    'Desarrollo configuracion'
    DEBUG= True
    TESTING= True
    SECRET_KEY= 'Replace this key in production enviroment'
    SQLALCHEMY_TRACK_MODIFICATIONS = False    # Avoids SQLAlchemy warning
   


    