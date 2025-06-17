import numpy as np
import os
import pickle
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications import vgg16, resnet50, mobilenet
import tensorflow as tf

model1=vgg16.VGG16(weights='imagenet', include_top=False, pooling='avg')
model2=resnet50.ResNet50(weights='imagenet', include_top=False, pooling='avg')
model3=mobilenet.MobileNet(weights='imagenet', include_top=False, pooling='avg')  

# Fonction d'indexation
def indexation(output_file, model, preprocess_input):
    features = []
    for j in os.listdir(files):
        data = os.path.join(files, j)
        if not data.endswith(".jpg"):
            continue
        file_name = os.path.basename(data)
        image = load_img(data, target_size=(224, 224))
        image = img_to_array(image)
        image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))
        image = preprocess_input(image)
        feature = model.predict(image)
        feature = np.array(feature[0])
        features.append((data, feature))
    with open(output_file, "wb") as output:
        pickle.dump(features, output)
# Chemin vers le dossier des images
files = '../features/images/image.orig'
# Génération des descripteurs
indexation("VGG16.pkl", model1, tf.keras.applications.vgg16.preprocess_input)
indexation("Resnet50.pkl", model2, tf.keras.applications.resnet50.preprocess_input)
indexation("MobileNet.pkl", model3, tf.keras.applications.mobilenet.preprocess_input)