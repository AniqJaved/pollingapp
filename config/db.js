const mongoose = require('mongoose');

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(
    'mongodb+srv://aniqjaved:aniqjaved@polling-app.w5a9xhb.mongodb.net/?retryWrites=true&w=majority'
    ).then(()=>console.log('MongoDB Connected')).catch(err => console.log(err));
