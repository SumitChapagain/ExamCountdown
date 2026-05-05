const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PLAYERS_FILE = path.join(__dirname, 'players.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files from current directory

// Initialize players.json if it doesn't exist
if (!fs.existsSync(PLAYERS_FILE)) {
  fs.writeFileSync(PLAYERS_FILE, JSON.stringify([]));
}

// Get all players
app.get('/api/players', (req, res) => {
  try {
    const data = fs.readFileSync(PLAYERS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read players data' });
  }
});

// Update all players
app.post('/api/players', (req, res) => {
  try {
    const newPlayers = req.body;
    if (!Array.isArray(newPlayers)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    fs.writeFileSync(PLAYERS_FILE, JSON.stringify(newPlayers, null, 2));
    res.json({ success: true, message: 'Players updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save players data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
