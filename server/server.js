require('source-map-support').install();

import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 5000;

// Include static assets. Not advised for production
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile('/index.html');
});

app.listen(port);
console.log('Server running http://localhost:' + port);
