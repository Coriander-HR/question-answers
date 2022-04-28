const express = require('express');
const logger = require('morgan');
const mongo = require('./database/mongo/index.js');
const postgres =require('./database/postgres/index.js')


const qaRouter = require('./routes/qa/index');

const app = express();
// postgres.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });

// postgres.authenticate().then(connection => {
//     console.log('Connected to postgres.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });
  

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));


app.use('/qa', qaRouter);

module.exports = app;
