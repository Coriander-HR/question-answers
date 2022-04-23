const mongo = require('./database/mongo/index.js');
const fs = require('fs');
const csv = require('csv-parser');
const Question = require('./database/mongo/models/Question.js');
const Answer = require('./database/mongo/models/Answer.js');
const Indexes = require('./database/mongo/models/Indexes.js')




// const addToMongoAnswers = async(path) => {
//     console.time('timer2')

//     const data = await getFileContents(path);
//     for (let i = 0; i< data.length; i++) {
//         const {id, question_id, body, date_written, answerer_name, answerer_email, reported, helpful} = data[i];
//         let answer = await new Answer({
//                 id,
//                 body,
//                 date : date_written,
//                 answerer_name,
//                 answerer_email,
//                 reported,
//                 question_helpfulness: helpful
//             });
//         await answer.save();
//         let question = await Question.findOne({id: question_id});
//         if (question) {
//             question.answers.push(answer._id);
//             await question.save();
//         }
//     }
//     console.log('finished answer');
//     console.timeEnd('timer2')
// }

// const addImgToAnswer = async(path) => {
//     console.time('timer3')

//     const data = await getFileContents(path);
//     for (let i = 0; i< data.length; i++) {
//         const {answer_id, url} = data[i];
//         let answer = await Answer.findOne({id: answer_id});
//         if (answer) {
//             answer.photos.push(url);
//             await answer.save();
//         }
//     }
//     console.log('finished img');
//     console.timeEnd('timer3')
// }

// addToMongoQuestions('../data/questions.csv');
// addToMongoAnswers('../data/answers.csv');
// addImgToAnswer('../data/answers_photos.csv');


const getFileContents = async (filepath) => {
    const data = [];
  
    return new Promise(function(resolve, reject) {
      fs.createReadStream(filepath)
        .pipe(csv())
        .on('error', error => reject(error))
        .on('data', row => {
            data.push(row)
        })
        .on('end', () => {
          resolve(data);
        });
    });
  }
  const addToMongoQuestions = async(path) => {
    console.log('starting adding Question');
    console.time('timer for Adding Question');
    const data = await getFileContents(path);
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

            count ++;
            console.log(count);
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
    console.log('finished question');
    console.timeEnd('timer for Adding Question');
}



const addToMongoAnswers = async(path) => {
    console.log('starting adding answer');
    console.time('timer for Adding answer');
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

        if (writeData.length > 50000 ) {
            console.time(`bulkwrite answer ${count}`);
            await Answer.bulkWrite(writeData)
            .catch(err => {
                console.error(err);
            });
            await Question.bulkWrite(writeQuestion)
            .catch(err => {
                console.error(err);
            });
            console.timeEnd(`bulkwrite answer ${count}`);
            count ++;
            console.log(count);
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
    console.log('finished answer');
    console.timeEnd('timer for Adding answer');
}


const addPhoto = () => {
    console.log('starting adding photos')
    console.time('timer for Adding photos')
    let updates = [];
    fs.createReadStream('../data/answers_photos.csv').pipe(csv())
        .on('data', row => {
            const {answer_id, url} = row
            updates.push({
                updateOne: {
                    filter: {_id: `${answer_id}`},
                    update: {$push: {photos:url} },
                }
            })
        })
        .on('end', async () => {
            await Answer.bulkWrite(updates)
                .catch(err => {
                    console.error(err);
                })
            updates = [];
            console.log('done adding photos')
            console.timeEnd('timer for Adding photos')
        })    
}


addToMongoQuestions('../data/questions.csv')
addToMongoAnswers('../data/answers.csv');
addPhoto();




