import requests

url = 'http://localhost:5000/search'

data = {
    'filename': 'ton_image.jpg',
    'descriptor': 'vgg16',
    'similarity': 'euclidean',
    'topn': '20'
}

response = requests.post(url, data=data)

print(response.status_code)
print(response.json())
