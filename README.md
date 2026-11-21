# Mini Arcade

A lightweight, self-contained web arcade featuring 10 classic browser games, player nickname tracking, and global high-score leaderboards.

## Features
- **10 Browser Games**: Tic-tac-toe (vs AI), Memory Cards, Guess the Number, Snake, Rock-paper-scissors, Whack-a-Mole, Simon Says, Reaction Time Test, Higher or Lower, and 2048-lite.
- **Pure Frontend**: Vanilla HTML5, CSS3, and modern JavaScript. No build step, no npm, no external CDNs, fully offline-capable at runtime.
- **Backend**: Python 3.12+ with Flask and pure-Python PyMySQL driver.
- **Database**: MySQL 8 storing players, games, and scores with automatic table initialization and seeding.
- **Zero-Friction Identity**: Player name stored in browser `localStorage`, with automated account creation on first score submission.

---

## Environment Variables

The application reads configuration exclusively from environment variables:

| Variable | Description | Default |
|---|---|---|
| `DB_HOST` | MySQL hostname or IP address | `db` |
| `DB_PORT` | MySQL connection port | `3306` |
| `DB_NAME` | MySQL database name | `arcade` |
| `DB_USER` | MySQL username (Required) | *(None)* |
| `DB_PASSWORD` | MySQL password (Required) | *(None)* |
| `PORT` | HTTP server listening port | `8080` |

---

## Local Setup & Running

### 1. Prerequisites
- Python 3.12+
- A running MySQL 8 database instance with a database named `arcade` (or as configured in `DB_NAME`).

### 2. Create and Activate Virtual Environment
```bash
python -m venv .venv

# On Linux / macOS:
source .venv/bin/activate

# On Windows:
.venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements-dev.txt
```

### 4. Configure Environment Variables
Set the database connection variables for your environment:

**Linux / macOS:**
```bash
export DB_HOST="localhost"
export DB_PORT="3306"
export DB_NAME="arcade"
export DB_USER="arcade"
export DB_PASSWORD="your-password"
export PORT="8080"
```

**Windows (PowerShell):**
```powershell
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_NAME="arcade"
$env:DB_USER="arcade"
$env:DB_PASSWORD="your-password"
$env:PORT="8080"
```

### 5. Start the Application
Run directly with Python:
```bash
python -m app.app
```

Or using Gunicorn (production / Linux):
```bash
gunicorn -w 4 -b 0.0.0.0:8080 "app.app:create_app()"
```

Open your browser and navigate to:
```
http://localhost:8080
```

---

## Running Tests

Run the pytest test suite (executes isolated tests without needing a running MySQL database):
```bash
pytest
```
Or for verbose output:
```bash
pytest -v
```

## DevOps

This project uses Git, Docker, Compose and CI/CD.
