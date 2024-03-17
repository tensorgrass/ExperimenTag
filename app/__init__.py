from flask import Flask, session
from flask_socketio import SocketIO


# Create the Flask application and the Flask-SQLAlchemy object.
app = Flask(__name__, template_folder='templates')
socketio = SocketIO(app)
app.config.from_object("configuration.DevelopmentConfig")


from app.general.general_controller import general_bp
from app.project.project_controller import project_bp
from app.image_tag.image_tag_controller import image_tag_bp

app.register_blueprint(general_bp)
app.register_blueprint(project_bp)
app.register_blueprint(image_tag_bp)





