exports.getLoginPage = (req, res) => {
  try {
    res.render('login', { title: 'Login', message: req.query.message });
    //console.log('Rendering login page.');
  } catch (error) {
    //console.error(`Error rendering login page: ${error.message}\n${error.stack}`);
    res.status(500).send('Error rendering login page.');
  }
};

exports.getRegisterPage = (req, res) => {
  try {
    res.render('register', { title: 'Register' });
    //console.log('Rendering register page.');
  } catch (error) {
    //console.error(`Error rendering register page: ${error.message}\n${error.stack}`);
    res.status(500).send('Error rendering register page.');
  }
};