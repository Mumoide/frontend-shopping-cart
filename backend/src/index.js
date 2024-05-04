const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const taskRoutes = require('./routes/tasks.routes')
const path = require('path');

const app = express();

app.use(cors());
app.use(morgan('dev'))
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(taskRoutes);

app.listen(3001)
console.log('Server on port 3001')