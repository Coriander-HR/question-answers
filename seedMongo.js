const mongo = require('./database/mongo/index.js');
const fs = require('fs');
const csv = require('csv-parser');
const Question = require('./database/mongo/models/Question.js');
const Answer = require('./database/mongo/models/Answer.js');
const Indexes = require('./database/mongo/models/Indexes.js')
const cluster = require('cluster');
const os = require('os');
const numCpu = os.cpus().length/2;

const getFileContents = async (filepath) => {
    let data = [];
    return new Promise(function(resolve, reject) {
      fs.createReadStream(filepath)
        .pipe(csv())
        .on('error', error => reject(error))
        .on('data', row => {
            data.push(row)
        })
        .on('end', () => {
            const clusterData = data.filter((_,index) => index % numCpu === cluster.worker.id - 1)
            data = [];
            resolve(clusterData);
        });
    });
  }
  const addToMongoQuestions = async(path) => {
    console.log(`worker ${cluster.worker.id} is starting adding Question]`);
    console.time(`worker ${cluster.worker.id} timer for Adding Question`);
    let data = await getFileContents(path)
    let count = 0;
    let writeData = [];
    let writeIndexes = [];
    for (let i = 0; i< data.length; i++) {
        const {id, product_id, body, date_written, asker_name, asker_email, reported, helpful} = data[i];
        const _id = id;
        writeData.push({
            insertOne: {
                document:{
                    _id,
                    product_id,
                    question_body: body,
                    question_date : date_written,
                    asker_name,
                    asker_email,
                    reported,
                    helpful
                }
            }
        })
        writeIndexes.push({
                updateOne: {
                filter: {_id : product_id},
                update: {$push: {questions:`${_id}`} },
                upsert: true /* in my case I want to create record if it does not exist */
            }
        })

        if (writeData.length > 10000) {
            await Question.bulkWrite(writeData)
            .catch(err => {
                console.error(err);
            })
            await Indexes.bulkWrite(writeIndexes)
            .catch(err => {
                console.error(err);
            })

            count +=10000;
            console.log(`worker ${cluster.worker.id} added ${count} Questions toDB`);
            writeData = [];
            writeIndexes = [];
        } 
    }
    await Question.bulkWrite(writeData)
    .catch(err => {
        console.error(err);
    })
    await Indexes.bulkWrite(writeIndexes)
    .catch(err => {
        console.error(err);
    })
    writeData = [];
    writeIndexes = [];
    console.log(`worker ${cluster.worker.id} finished question`);
    console.timeEnd(`worker ${cluster.worker.id} timer for Adding Question`);
}



const addToMongoAnswers = async(path) => {
    console.log(`worker ${cluster.worker.id} starting adding answer`);
    console.time(`worker ${cluster.worker.id} timer for Adding answer`);
    let count = 0;
    let writeData = [];
    let writeQuestion =[];

    let data = await getFileContents(path);

    for (let i = 0; i< data.length; i++) {
        const {id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful} = data[i];
        const _id = id
        writeData.push({
            insertOne: {
                document:{
                    _id,
                    body,
                    date : date_written,
                    answerer_name,
                    answerer_email,
                    reported,
                    question_helpfulness: helpful
                }
            }
        })
        writeQuestion.push({
            updateOne: {
            filter: {_id : `${question_id}`},
            update: {$push: {answers:`${_id}`} },
        }
    })

        if (writeData.length > 20000 ) {
            await Answer.bulkWrite(writeData)
            .catch(err => {
                console.error(err);
            });
            await Question.bulkWrite(writeQuestion)
            .catch(err => {
                console.error(err);
            });
            
            count += 20000;
            console.log(`worker ${cluster.worker.id} added ${count} Answers toDB`)
            writeData = [];
            writeQuestion =[];
        } 
    }

    await Answer.bulkWrite(writeData)
    .catch(err => {
        console.error(err);
    })
    await Question.bulkWrite(writeQuestion)
    .catch(err => {
        console.error(err);
    });
    data = [];
    writeData = [];
    count = 0;
    console.log(`worker ${cluster.worker.id}finished answer`);
    console.timeEnd(`worker ${cluster.worker.id} timer for Adding answer`);
}


const addPhoto = async(path) => {
    console.log(`worker ${cluster.worker.id} starting adding photos`)
    console.time(`worker ${cluster.worker.id} timer for Adding photos`)
    let updates = [];
    let data = await getFileContents(path);

    for (let i = 0; i< data.length; i++) { 
        const {answer_id, url} = data[i];
        updates.push({
            updateOne: {
                filter: {_id: `${answer_id}`},
                update: {$push: {photos:url} },
            }
        })
    }
    await Answer.bulkWrite(updates)
    .catch(err => {
        console.error(err);
    })
    updates = [];
    console.log(`worker ${cluster.worker.id} done adding photos`)
    console.timeEnd(`worker ${cluster.worker.id} timer for Adding photos`)
}

const seedData = async () => {
    console.time('SEEDING DB');
    if (cluster.isMaster) {
        for (let i =0 ; i< numCpu; i++) {
          cluster.fork()
        }
        cluster.on('exit', (worker, code, signal) => {
          cluster.fork()
        })
    } else {
        await addToMongoQuestions('../data/questions.csv');
        await addToMongoAnswers('../data/answers.csv');
        await addPhoto('../data/answers_photos.csv');
        console.timeEnd('SEEDING DB');
    }
}

seedData()





