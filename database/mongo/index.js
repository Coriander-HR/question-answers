const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URL, { dbName: 'question-answers' })
.then((db) => { 
console.log('connected to mongodb on', db.connections[0].port, 'using', db.connections[0].name)
})
.catch((err) => console.log('server error', err))


