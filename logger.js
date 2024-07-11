const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create a write stream (in append mode) for logging to a file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Setup the logger
const logger = morgan('combined', { stream: accessLogStream });

module.exports = logger;