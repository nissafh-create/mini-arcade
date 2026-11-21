import os, time, pymysql, pymysql.cursors

# 10 default games for database seeding
GAMES = [
    ("Tic-tac-toe", "tic-tac-toe"), ("Memory Cards", "memory-cards"),
    ("Guess the Number", "guess-number"), ("Snake", "snake"),
    ("Rock-paper-scissors", "rock-paper-scissors"), ("Whack-a-Mole", "whack-a-mole"),
    ("Simon Says", "simon-says"), ("Reaction Time Test", "reaction-time"),
    ("Higher or Lower", "higher-lower"), ("2048-lite", "2048-lite")
]

def get_connection():
    """Connect to MySQL using environment variables."""
    return pymysql.connect(
        host=os.environ.get("DB_HOST", "db"),
        port=int(os.environ.get("DB_PORT", 3306)),
        database=os.environ.get("DB_NAME", "arcade"),
        user=os.environ.get("DB_USER"),
        password=os.environ.get("DB_PASSWORD"),
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )

def init_db(max_retries=30, delay=2):
    """Retry DB connection for up to 60s, create tables, and seed games."""
    conn = None
    for attempt in range(1, max_retries + 1):
        try:
            conn = get_connection()
            break
        except Exception as err:
            print(f"[DB] Attempt {attempt}/{max_retries} failed ({err}). Retrying in {delay}s...")
            time.sleep(delay)
    if not conn:
        print("[DB ERROR] Failed to connect to MySQL database after 60 seconds.")
        raise ConnectionError("MySQL connection failed after retries.")

    try:
        with conn.cursor() as cur:
            cur.execute("""CREATE TABLE IF NOT EXISTS players (
                id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(20) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)""")
            cur.execute("""CREATE TABLE IF NOT EXISTS games (
                id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50) NOT NULL,
                slug VARCHAR(50) UNIQUE NOT NULL)""")
            cur.execute("""CREATE TABLE IF NOT EXISTS scores (
                id INT AUTO_INCREMENT PRIMARY KEY, player_id INT NOT NULL, game_id INT NOT NULL,
                score INT NOT NULL, played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (player_id) REFERENCES players(id), FOREIGN KEY (game_id) REFERENCES games(id))""")
            cur.execute("SELECT COUNT(*) AS cnt FROM games")
            if cur.fetchone()["cnt"] == 0:
                cur.executemany("INSERT INTO games (name, slug) VALUES (%s, %s)", GAMES)
                print("[DB] Seeded 10 default games.")
        print("[DB] Database ready.")
    finally:
        conn.close()

def get_games():
    """Fetch all available games."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, slug FROM games ORDER BY id")
            return cur.fetchall()
    finally:
        conn.close()

def get_leaderboard(game_slug):
    """Fetch top 10 scores for a game. Returns None if game slug is not found."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM games WHERE slug = %s", (game_slug,))
            game = cur.fetchone()
            if not game:
                return None
            cur.execute("""SELECT p.username, s.score, DATE_FORMAT(s.played_at, '%%Y-%%m-%%d %%H:%%i:%%s') AS played_at
                FROM scores s JOIN players p ON s.player_id = p.id
                WHERE s.game_id = %s ORDER BY s.score DESC, s.played_at ASC LIMIT 10""", (game["id"],))
            return cur.fetchall()
    finally:
        conn.close()

def save_score(username, game_slug, score):
    """Record player score, inserting player if first visit."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM games WHERE slug = %s", (game_slug,))
            game = cur.fetchone()
            if not game:
                return False, 404
            cur.execute("SELECT id FROM players WHERE username = %s", (username,))
            player = cur.fetchone()
            if not player:
                cur.execute("INSERT INTO players (username) VALUES (%s)", (username,))
                player_id = cur.lastrowid
            else:
                player_id = player["id"]
            cur.execute("INSERT INTO scores (player_id, game_id, score) VALUES (%s, %s, %s)",
                        (player_id, game["id"], score))
            return True, 201
    finally:
        conn.close()
