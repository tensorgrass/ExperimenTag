import os
import random

from icecream import ic
from zipfile import ZipFile
from pathlib import Path

from app.constant import *
from app.project.ConfigUtils import ConfigUtils

from app.project.ProjectUtils import ProjectUtils
from app.project.ExportUtils import ExportUtils

class ExportYoloV8Utils:
    
    def export_yolov8(project_id, valid_percentage, test_percentage, train_percentage, images_to_export):
        '''
        Export project to a specific yolov8 format in zip file
        '''
        ic()
        base_path = ProjectUtils.get_project_path(project_id)
        base_tmp_path = ProjectUtils.get_project_tmp_path(project_id)

        ExportUtils.initialize_project_to_export(project_id)

        valid_images, test_images, train_images, class_names = \
            ExportYoloV8Utils.get_image_organization_and_tag_list_yolov8(project_id, valid_percentage, test_percentage, train_percentage, images_to_export)
        data_yaml = ExportYoloV8Utils.generate_data_yaml_yolov8(class_names)

        #Zip the images
        zip_file_name = project_id + '_yolov8.zip'
        zip_file_path = os.path.join(base_tmp_path, zip_file_name).replace('\\', '/')
        config_json = ConfigUtils.get_config_json(project_id) 
        with ZipFile(zip_file_path, 'w') as zipf:
            zipf.writestr(DATA_YAML, data_yaml)
            for image in config_json[CONFIG_IMAGES]:
                img_name = image[CONFIG_IMAGES_NAME]
                img_path = os.path.join(base_path, img_name).replace('\\', '/')

                #Creeate yolov8 coco format
                #img_name get the name of the image and change the extension to .txt
                tag_file_name = Path(img_name).stem + '.txt'
                img_height = image[CONFIG_IMAGES_HEIGHT]
                img_width = image[CONFIG_IMAGES_WIDTH]
                tags = image[CONFIG_IMAGES_TAGS]
                tag_file = ExportYoloV8Utils.generate_tag_file_yolov8(tags, img_width, img_height, class_names)
                
                if img_name in valid_images:
                    zipf.write(img_path, arcname=os.path.join("valid", "images", img_name).replace('\\', '/'))
                    zipf.writestr(os.path.join("valid", "labels", tag_file_name).replace('\\', '/'), tag_file) 
                elif img_name in test_images:
                    zipf.write(img_path, arcname=os.path.join("test", "images", img_name).replace('\\', '/'))
                    zipf.writestr(os.path.join("test", "labels", tag_file_name).replace('\\', '/'), tag_file)
                elif img_name in train_images:
                    zipf.write(img_path, arcname=os.path.join("train", "images", img_name).replace('\\', '/'))
                    zipf.writestr(os.path.join("train", "labels", tag_file_name).replace('\\', '/'), tag_file)

        return ExportUtils.send_zip_file(zip_file_path, zip_file_name)


    def get_image_organization_and_tag_list_yolov8(project_id, valid_percentage, test_percentage, train_percentage, images_to_export):
        all_images = []
        class_names = []
        config_json = ConfigUtils.get_config_json(project_id)
        for image in config_json[CONFIG_IMAGES]:
            num_tag_active = 0
            for tag in image[CONFIG_IMAGES_TAGS]:
                class_name = image[CONFIG_IMAGES_TAGS][tag][TAG_CLASS]
                if class_name not in class_names:
                    class_names.append(class_name)
                if image[CONFIG_IMAGES_TAGS][tag][TAG_ACTIVE]:
                    num_tag_active += 1
            if    images_to_export == IMAGES_TO_EXPORT_ALL_IMAGES \
               or (images_to_export == IMAGES_TO_EXPORT_ONLY_WITH_TAGS and num_tag_active > 0):
                all_images.append(image[CONFIG_IMAGES_NAME])

        #Split all_images in valid, test and train the percentages in random order
        #Get the number of images for each percentage
        num_images = len(all_images)
        num_valid = int(num_images * int(valid_percentage) / 100)
        num_test = int(num_images * int(test_percentage) / 100)
        num_train = int(num_images * int(train_percentage) / 100)
        #Random order all_images
        random.shuffle(all_images)
        #Get the images for each percentage
        valid_images = all_images[:num_valid]
        test_images = all_images[num_valid:num_valid+num_test]
        train_images = all_images[num_valid+num_test:]

        return valid_images, test_images, train_images, class_names
    
    def generate_data_yaml_yolov8(class_names):
        return DATA_YAML_YOLOV8.replace(DATA_YAML_YOLOV8_NC, str(len(class_names))).replace(DATA_YAML_YOLOV8_NAMES, str(class_names))
    
    def generate_tag_file_yolov8(tags, img_width, img_height, class_names):
        tag_file = ""
        for tag_name in tags:
            tag = tags[tag_name]
            class_name = tag[TAG_CLASS]
            ic(class_names)
            ic(class_name)
            id_class_name = class_names.index(class_name)

            left = tag[TAG_LEFT]
            top = tag[TAG_TOP]
            width = tag[TAG_WIDTH]
            height = tag[TAG_HEIGHT]
            x_center = str(round(((left + width / 2) / img_width), 8))
            y_center = str(round(((top + height / 2) / img_height), 8))
            w_tag = str(round((width / img_width), 8))
            h_tag = str(round((height / img_height), 8))

            tag_file += f"{id_class_name} {x_center} {y_center} {w_tag} {h_tag}\n"
        return tag_file
