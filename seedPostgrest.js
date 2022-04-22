const postgres = require('./database/postgres/index.js')
const Question = require('./database/postgres/models/Question')
const fs = require('fs');
const config = require('./database/postgres/db.config')
const { Pool, Client} = require('pg')
var copyFrom = require('pg-copy-streams').from;

const client = new Client({
  host: config.HOST,
  port: config.PORT,
  user: config.USER,
  database:config.DB,
  password: config.PASSWORD,
})
client.connect()

//   postgres.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
// });


const seedQuestion = async (file) => {
  console.log('Seeding Questions to Database')
  console.time('Seeding questions')
  await Question.sync()
  var stream = client.query(copyFrom('COPY "Questions" FROM STDIN CSV HEADER'))
  var fileStream = fs.createReadStream(file)
  fileStream.on('error', (error) =>{
      console.log(`Error in reading file: ${error}`)
  })
  stream.on('error', (error) => {
      console.log(`Error in copy command: ${error}`)
  })
  stream.on('end', () => {
      console.log(`Completed loading data into `)
      client.end()
  })
  fileStream.pipe(stream);
  console.log('Finish Seeding Questions to Database')
  console.timeEnd('Seeding questions')
}


seedQuestion('../data/questions.csv')
