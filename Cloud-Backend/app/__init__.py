from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # Autoriser les requêtes du frontend Next.js
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

    from .routes import main
    app.register_blueprint(main)

    # Healthcheck pour Docker
    @app.route("/health", methods=["GET"])
    def health():
        return "OK", 200

    return app
