function ensureAuthenticated(req, res, next) {
    if (!req.session.userId) {
        console.log("User not authenticated, redirecting to login page.");
        res.redirect('/login');
    } else {
        console.log("User authenticated, proceeding to requested page.");
        next();
    }
}

module.exports = {
    ensureAuthenticated,
};