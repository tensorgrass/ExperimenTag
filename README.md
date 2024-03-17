# ExperimenTag by TensorGrass

# Web Tool for Simple Image Tagging

This is a simple Python Flask app designed for image tagging. It uses Bootstrap 4.6.0 sb-admin-2 and FontAwesome for the frontend. It doesn't require a database or login functionality, and all data is stored on the local disk. The tool is easy to modify to adapt new features.

## Features

### Upload Images
- Upload a single image or an entire directory.
- Upload a video, which will automatically be decomposed into images.

### Import Project
- Import a backup project.
- Import a backup project from a ZIP file.
- Import a YOLOv8 format into the project.
- Import a YOLOv8 format into the project from a ZIP file.

### Export Project
- Export a backup project in a ZIP file.
- Export a YOLOv8 format in a ZIP file.

### Tag Image
- Tag images using a visual interface.
- Add tags with one click.
- Delete tags.
- Enforce one class per tag.
- Customize tag colors for selected and unselected states.
- Share tags among similar images and calculate similarity using linear calculations.

## Installation
First install python 3.10
https://www.python.org/downloads/release/python-31013/

To create a virtual environment in Python in a directory named `venv`, you can use the `venv` module that comes with Python 3. You can create the virtual environment using the following command in your terminal:
In download project directory execute this:

```bash
python -m venv venv
```

This command creates a directory named `venv` (or whatever name you choose), where it installs a copy of the Python interpreter, the standard library, and various supporting files.

Once you've created a virtual environment, you can activate it using the following command:

On Windows:

```bash
.\venv\Scripts\activate
```

On Unix or MacOS:

```bash
source venv/bin/activate
```

After activating the virtual environment, your shell prompt will change to show the name of the activated environment. In this environment, you can use `pip` to install packages that will be local to this environment.

To install the required libraries, navigate to the project directory and run the following command:

```bash
pip install -r requirements.txt
```

To execute the application, run the following command:

```bash
python app.py
```

## Technical Specifications
- **Framework**: Python 3.10.10 Flask 1.1.2
- **Frontend**: Bootstrap 4.6.0 sb-admin-2, FontAwesome
- **Database**: None (Data stored locally on disk)
- **Authentication**: None
- **Storage**: Local disk