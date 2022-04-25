const request = require('supertest');
const assert = require('assert');

  const testQuestion = (app) => {
    describe('GET /qa/questions', function() {
      it('responds with json and status code 200', function(done) {
        request(app)
          .get('/qa/questions?product_id=1')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
      it('responds with Product ID OF 1',function(done) {
        request(app)
          .get('/qa/questions?product_id=1')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(function(res) {
            const body = {product_id: res.body.product_id};
            res.body = body;
          })
          .expect(200, {
            product_id: '1'
          }, done);
      });
      it('responds with 5 questions and no reported questions',function(done) {
        request(app)
          .get('/qa/questions?product_id=1')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(function(res) {
            const body = {length: res.body.results.filter(question => !question.reported).length};
            res.body = body;
          })
          .expect(200,  {length: 5}, done);
      });
    });

  }
  module.exports = testQuestion
