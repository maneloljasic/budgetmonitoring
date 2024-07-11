const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');

// Route to handle AJAX request for fetching report data
router.get('/fetchReportData', reportsController.fetchReportData);

// Route to handle AJAX request for fetching chart data
router.get('/fetchChartData', reportsController.fetchChartData);

// Add this new route for Excel export
router.get('/exportToExcel', reportsController.exportToExcel);

// Add this new route for Excel export
router.get('/getReportsDepList', reportsController.getReportsDepList);

module.exports = router;