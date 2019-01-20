const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/key')
const passport = require('passport');


const validateRegisterInput = require('../../validations/register');
const validateLoginInput = require('../../validations/login');

router.get('/', (req, res) => res.send('abc'));

router.post('/register', (req, res) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                const { errors, isValid } = validateRegisterInput(req.body);
                errors.username = 'Username already exists'
                return res.status(400).json(errors);
            } else {
                const { errors, isValid } = validateRegisterInput(req.body);
                if (!isValid) {
                    console.log('register');
                    return res.status(400).json(errors);
                } else {
                    const newUser = new User({
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password
                    })

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                console.log('failed 2');
                                throw err;
                            };
                            newUser.password = hash;
                            newUser.save()
                                .then(user => res.json(user))
                                .catch(err => console.log(err));
                        })
                    })
                }

            }

        })
});


router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    const { errors, isValid } = validateLoginInput(req.body);
    console.log(errors);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    User.findOne({ username })
        .then(user => {

            if (!user) {
                return res.status(404).json({ username: 'Username not found' });
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const payload = { id: user.id, username: user.username }
                        console.log(payload);
                        jwt.sign(payload, keys.secretOrKey, { expiresIn: 1000 }, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            });
                        });
                    } else {
                        return res.status(400).json({ password: 'Password incorrect' });
                    }
                });
        });
})


router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user.username);
})

module.exports = router;