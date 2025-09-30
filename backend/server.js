const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const users = [];
const SECRET = 'your_jwt_secret';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Health check

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the CashMoneyFintech API backend!');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running!' });
});

// User registration
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  if (users.find(u => u.username === username)) return res.status(409).json({ error: 'User exists' });
  users.push({ username, password });
  res.json({ message: 'User registered' });
});

// User login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// Auth middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Protected user info
app.get('/api/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// File upload
const upload = multer({ dest: 'uploads/' });
app.post('/api/upload', authenticate, upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename, originalname: req.file.originalname });
});

// Example RESTful endpoint
app.get('/api/items', (req, res) => {
  res.json([
    { id: 1, name: 'Item One' },
    { id: 2, name: 'Item Two' }
  ]);
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
