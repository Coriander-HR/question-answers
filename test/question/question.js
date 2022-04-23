const request = require('supertest');
const assert = require('assert');




// request(app)
//   .get('/qa')
//   .expect('Content-Type', /json/)
//   .expect('Content-Length', '15')
//   .expect(200)
//   .end(function(err, res) {
//     if (err) throw err;
//   });

  const testQuestion = (app) => {
    describe('GET /qa/questions', function() {
        it('responds with json and status code 200', function(done) {
          request(app)
            .get('/qa')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
      });


  }
  module.exports = testQuestion
