const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/:p', (req, res) => {
  const p = req.params.p;
  if(['quiz','dashboard','upload','flashcards','mocktest'].includes(p)) {
    res.sendFile(path.join(__dirname, 'public', p + '.html'));
  } else res.redirect('/');
});
app.listen(3002, () => console.log('http://localhost:3002'));