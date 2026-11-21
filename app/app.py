import os, re
from flask import Flask, jsonify, request, send_from_directory
from app import db

# Validation regex: 2 to 20 letters, digits, and underscores
USERNAME_REGEX = re.compile(r"^[A-Za-z0-9_]{2,20}$")

def create_app(init_db_on_start=True):
    """Application factory for Mini Arcade Flask web app."""
    app = Flask(__name__, static_folder="static")

    if init_db_on_start and os.environ.get("FLASK_ENV") != "testing":
        db.init_db()

    @app.route("/health")
    def health():
        """Health check route returning 200 ok without database call."""
        return jsonify({"status": "ok"}), 200

    @app.route("/api/games")
    def list_games():
        """Return list of arcade games."""
        return jsonify(db.get_games()), 200

    @app.route("/api/leaderboard/<game_slug>")
    def leaderboard(game_slug):
        """Return top 10 scores for game or 404 if unknown."""
        scores = db.get_leaderboard(game_slug)
        if scores is None:
            return jsonify({"error": "Game not found"}), 404
        return jsonify(scores), 200

    @app.route("/api/scores", methods=["POST"])
    def add_score():
        """Validate payload and store new score."""
        data = request.get_json(silent=True) or {}
        username, slug, score = data.get("username"), data.get("game_slug"), data.get("score")

        if not username or not isinstance(username, str) or not USERNAME_REGEX.match(username):
            return jsonify({"error": "Username must be 2-20 alphanumeric characters or underscores"}), 400
        if not isinstance(score, int) or isinstance(score, bool) or score < 0 or score > 1000000:
            return jsonify({"error": "Score must be an integer between 0 and 1,000,000"}), 400
        if not slug or not isinstance(slug, str):
            return jsonify({"error": "Invalid game_slug"}), 400

        ok, status = db.save_score(username, slug, score)
        if not ok:
            return jsonify({"error": "Game not found" if status == 404 else "Save error"}), status
        return jsonify({"message": "Score saved successfully"}), 201

    @app.route("/")
    def index():
        """Serve home page."""
        return send_from_directory(app.static_folder, "index.html")

    @app.route("/<path:path>")
    def static_proxy(path):
        """Serve frontend static files (HTML, CSS, JS)."""
        return send_from_directory(app.static_folder, path)

    return app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app = create_app()
    app.run(host="0.0.0.0", port=port)
