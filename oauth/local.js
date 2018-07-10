const route = require('express').Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../database/modles/user');
const DatabaseAPIClass = require('../database/api-functions');
const APIHelperFunctions = new DatabaseAPIClass(User);

passport.serializeUser((userid, done) => {
    //userid will be stuffed in cookie
    done(null, userid)
});

passport.deserializeUser((userid, done) => {
    //reimplement it using FindById function of mongoose
    APIHelperFunctions.getSpecificData({'_id': userid})
        .then((user) => {
            if (!user) {
                done(new Error("no such user"))
            }
            done(null, user)
        }).catch((err) => {
        done(err)
    })
});

passport.use(new LocalStrategy((username, password, done) => {

    APIHelperFunctions.getSpecificData({'primaryEmail': username})
        .then(user => {
            if (!user) {
                done(new Error('No such user'))
            } else {
                if (user.password !== password) {
                    done(new Error('Wrong password'))
                } else {
                    console.log("successful local login");
                }
            }
            //below line will pass user to serialize user phase
            done(null, user._id)
        })
        .catch(err => {
            done(err)
        })
}));

route.post('/login', passport.authenticate('local', {
    failureRedirect: '/login-page.html',
    successRedirect: '/User-dashboard.html',
}));

// post request to sign-up don't need passportJS
route.post('/signup', (req, res) => {
    APIHelperFunctions.getSpecificData({primaryEmail: req.body.primaryEmail}) // regex to check if _id is valid mongo id- /^[0-9a-fA-F]{24}$/
        .then(currentUser => {

            if (currentUser) {
                res.send("email already linked with a account")
                // disable sign-up button till username is unique
                // create AJAX request(refresh button) from frontend to check for username uniqueness
            } else {

                APIHelperFunctions.addCollection(req.body)
                    .then(createdUser => {
                        res.redirect('/User-dashboard.html')
                    });
            }
        })
        .catch(err => console.error(err));

});

exports = module.exports = {
    route
};