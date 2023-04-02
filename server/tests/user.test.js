const request = require('supertest');
const express = require('express');

describe('POST /user/register', function() {
    it('responds with json', function(done) {
      request(app)
        .post('/user/register')
        .send({
            name: 'Bobby',
            username: 'Bob', 
            email: 'bob@gmail.com',
            password: '123abc'
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          return done();
        });
    });
  });