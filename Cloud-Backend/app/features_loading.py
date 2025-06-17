import pickle
import numpy as np
import os

# === 1. Dictionnaire reprenant les noms et chemins des descripteurs ===
descriptors_data = {
    'vgg16': 'static/features/VGG16.pkl',
    'resnet50': 'static/features/Resnet50.pkl',
    'mobilenet': 'static/features/MobileNet.pkl'
}

# === 2. Chargement des descripteurs ===
features_data = {key: pickle.load(open(path, 'rb')) for key, path in descriptors_data.items()}

# === 3. Exemple : lecture des descripteurs provenant de VGG16 ===
features = features_data['vgg16']  # Dictionnaire {image_name: feature_vector}

# === 4. Chargement du vecteur de caractéristiques de l'image requête ===
query_feature_path = 'static/features/query_feature.pkl'
with open(query_feature_path, 'rb') as f:
    query_feature = pickle.load(f)  # Vecteur numpy

# === 5. Fonction de distance euclidienne ===
def euclidean_distance(vec1, vec2):
    return np.linalg.norm(vec1 - vec2)

# === 6. Fonction de recherche des images les plus similaires ===
def search_similar_images(query_feature, features, top_k=5):
    distances = []
    for image_id, feat_vec in features.items():
        dist = euclidean_distance(query_feature, feat_vec)
        distances.append((image_id, dist))
    distances.sort(key=lambda x: x[1])  # Tri par distance croissante
    return distances[:top_k]

# === 7. Recherche des images similaires ===
top_k = 5
similar_images = search_similar_images(query_feature, features, top_k=top_k)

# === 8. Affichage des résultats ===
print("Images les plus similaires à l'image requête :")
for i, (image_id, distance) in enumerate(similar_images, 1):
    print(f"{i}. {image_id} — Distance : {distance:.4f}")
