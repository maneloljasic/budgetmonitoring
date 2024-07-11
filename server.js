// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const morgan = require('morgan'); // Import morgan for logging
const authController = require('./controllers/authController'); // Import the authController
const logoutController = require('./controllers/logoutController'); // Import the logoutController
const reportsController = require('./controllers/reportsController'); // Import the reportsController
const reportRoutes = require('./routes/reportRoutes'); // Import the reportRoutes
const authRoutes = require('./routes/authRoutes'); // Import the authRoutes
const { ensureAuthenticated } = require('./middlewares'); // Import the authentication middleware

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Use morgan for logging HTTP requests
app.use(morgan('dev')); // 'dev' format logs the method, URL, status, response time

// Use express-session for handling sessions
app.use(session({
  secret: process.env.SESSION_SECRET, // This should be in your .env file
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' } // Adjusted based on environment
}));

// Serve static files
app.use(express.static('public'));

// Registration route
app.post('/register', authController.register);

// Login route
app.post('/login', authController.login);

// Logout route
app.get('/logout', logoutController.logout);

// Reports page route, now protected by ensureAuthenticated middleware
app.get('/reports', ensureAuthenticated, reportsController.getReportsPage);

// Use reportRoutes for handling '/reports' path, protected by ensureAuthenticated middleware
app.use('/reports', ensureAuthenticated, reportRoutes);

// Use authRoutes for handling authentication views
app.use(authRoutes);

// Define a simple route for testing
app.get('/', (req, res) => {
  //res.send('BudgetMonitoring App is running!');
  res.redirect('/login');
});

// Listen on a predefined port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`An error occurred: ${err.message}\n${err.stack}`);
  res.status(500).send('Something broke!');
  // Log the error details including timestamp, request method, and URL
  console.error(`[${new Date().toISOString()}] Error processing request ${req.method} ${req.url}: ${err.message}\n${err.stack}`);
});