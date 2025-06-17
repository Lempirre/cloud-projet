# --- Build stage: installer les dépendances ---
FROM python:3.10-slim AS build
WORKDIR /app

COPY Cloud-Backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY Cloud-Backend/ ./

# --- Runtime stage: image finale allégée ---
FROM python:3.10-slim
WORKDIR /app

# Récupérer paquets et code
COPY --from=build /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=build /app /app

# Exposer le port 5000 attendu par votre code
EXPOSE 5000

# Lancer votre app sur 0.0.0.0:5000
CMD ["python", "run.py"]
