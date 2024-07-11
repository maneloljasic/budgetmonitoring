function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error(`Error during session destruction: ${err.message}\n${err.stack}`);
            res.status(500).send('Error logging out.');
        } else {
            //console.log("User logged out successfully.");
            res.redirect('/login');
        }
    });
}

module.exports = {
    logout,
};