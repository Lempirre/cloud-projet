import pickle

with open('features/VGG16.pkl', 'rb') as f:
    data = pickle.load(f)

print(f"Type: {type(data)}")
print(f"Taille: {len(data)}")

# Si c'est une liste
if isinstance(data, list):
    print("Premier élément :", data[0])
# Si c'est un dict
elif isinstance(data, dict):
    print("Clé(s):", list(data.keys())[:5])
    print("Exemple entrée:", data[list(data.keys())[0]])
