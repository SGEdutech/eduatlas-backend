const mongoose = require('mongoose');
const uri = require('../config').MONGO.URI;

mongoose.connect('mongodb://localhost/atlasbase')
    .then(() => console.log('DB\'s connected niggas!!!'))
    .catch(err => console.error(err));