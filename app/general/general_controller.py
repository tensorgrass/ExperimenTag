from flask import Blueprint, render_template, abort, session
from flask import request, url_for, redirect, send_from_directory
from app import app
import os


general_bp = Blueprint('general', __name__)

# @general_bp.before_request
# @login_required
# def constructor():
#     pass

@general_bp.route('/')
def general():

    return render_template('general/general.html') 
