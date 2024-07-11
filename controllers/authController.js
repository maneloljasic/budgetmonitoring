const bcrypt = require('bcrypt');
const pool = require('../db'); // Assumes db.js is in the root directory

exports.register = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await pool.query(
      'INSERT INTO test.users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, firstName, lastName, hashedPassword]
    );

    req.session.userId = newUser.rows[0].id; // Assumes user ID is returned
    //console.log('User registered successfully:', newUser.rows[0].email);
    message = firstName + ' ' + lastName;
    res.redirect(`/reports?message=${encodeURIComponent(message)}`); // Redirect to reports page after successful registration
  } catch (error) {
    console.error('Error during registration:', error.message, error.stack);
    res.send('Error during registration.');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM test.users WHERE email = $1', [email]);

    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(password, user.rows[0].password);

      if (validPassword) {
        req.session.userId = user.rows[0].id; // Assumes user ID is in the rows
        //console.log('User logged in successfully:', email);
        message = user.rows[0].first_name + ' ' + user.rows[0].last_name;
        res.redirect(`/reports?message=${encodeURIComponent(message)}`); // Redirect to reports page after successful login
      } else {
        message = 'Проверьте, правильно ли Вы вводите пароль либо логин!';
        //console.log('Invalid password attempt for:', email);
        res.redirect(`/login?message=${encodeURIComponent(message)}`); // Redirect to reports page after successful login
        //res.send('Invalid email or password.');
      }
    } else {
      message = 'Пользователь не найден!';
      //console.log('User not found during login attempt:', email);
      res.redirect(`/login?message=${encodeURIComponent(message)}`); // Redirect to reports page after successful login
      //res.send('User not found.');
    }
  } catch (error) {
    console.error('Error during login:', error.message, error.stack);
    res.send('Error during login.');
  }
};