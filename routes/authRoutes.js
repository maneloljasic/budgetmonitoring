const express = require('express');
const router = express.Router();
const authViewController = require('../controllers/authViewController');

router.get('/login', (req, res) => {
  try {
    authViewController.getLoginPage(req, res);
    //console.log('Rendering login page.');
  } catch (error) {
    console.error(`Error rendering login page: ${error.message}\n${error.stack}`);
    res.status(500).send('Error rendering login page.');
  }
});

router.get('/register', (req, res) => {
  try {
    authViewController.getRegisterPage(req, res);
    //console.log('Rendering register page.');
  } catch (error) {
    console.error(`Error rendering register page: ${error.message}\n${error.stack}`);
    res.status(500).send('Error rendering register page.');
  }
});

module.exports = router;