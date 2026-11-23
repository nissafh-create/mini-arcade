import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import pytest
from app.app import create_app

@pytest.fixture
def client(monkeypatch):
    # Set FLASK_ENV to testing so create_app skips real DB initialization
    monkeypatch.setenv("FLASK_ENV", "testing")
    app = create_app(init_db_on_start=False)
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test GET /health returns 200 and {'status': 'ok'} without touching DB."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "nope"}

def test_post_scores_rejects_invalid_username(client):
    """Test POST /api/scores rejects username with invalid characters or length."""
    # Too short
    res = client.post("/api/scores", json={"username": "a", "game_slug": "snake", "score": 100})
    assert res.status_code == 400
    # Invalid characters (space, punctuation)
    res = client.post("/api/scores", json={"username": "bad name!", "game_slug": "snake", "score": 100})
    assert res.status_code == 400
    # Too long (over 20 characters)
    res = client.post("/api/scores", json={"username": "a" * 21, "game_slug": "snake", "score": 100})
    assert res.status_code == 400

def test_post_scores_rejects_negative_score(client):
    """Test POST /api/scores rejects negative score or score > 1000000."""
    res_neg = client.post("/api/scores", json={"username": "player1", "game_slug": "snake", "score": -5})
    assert res_neg.status_code == 400

    res_huge = client.post("/api/scores", json={"username": "player1", "game_slug": "snake", "score": 1000001})
    assert res_huge.status_code == 400

def test_get_leaderboard_unknown_returns_404(client, monkeypatch):
    """Test GET /api/leaderboard/unknown returns 404 when game does not exist."""
    # Mock db.get_leaderboard to return None for unknown slug
    from app import db
    monkeypatch.setattr(db, "get_leaderboard", lambda slug: None)

    response = client.get("/api/leaderboard/unknown-slug-xyz")
    assert response.status_code == 404
    assert "error" in response.get_json()
