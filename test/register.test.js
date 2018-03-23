'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app } = require('../index');
const User = require('../models/User.model');
const { TEST_DATABASE_URL } = require('../config');
const { dbConnect, dbDisconnect } = require('../db-mongoose');

process.env.NODE_ENV = 'test';

process.stdout.write('\x1Bc\n'); // Clear the console before each run

const expect = chai.expect;
chai.use(chaiHttp);

/* ========== TESTING HOOKS ========== */

before(function () {
  return dbConnect(TEST_DATABASE_URL);
});

after(function () {
  return dbDisconnect();
});



/* ========== ROUTE TESTS ========== */
describe('tests for registerRouter: /register', () => {

  describe('verify the required fields are present in the req.body', () => {
    const email = 'stephen@gmail.com';
    const username = 'steph30';
    const password = 'dubnation';
    const teamName = 'three-peat';

    it('should fail without an email', () => {
      return chai.request(app)
        .post('/register')
        .send({ username, password, teamName })
        .then(res => {
          expect(res).to.not.exist;
        })
        .catch(err => {
          const res = err.response;
          expect(res.body.message).to.equal('Please fill out the \'email\' section.');
          expect(res).to.have.status(422);
        });
    });

    it('should fail without a username', () => {
      return chai.request(app)
        .post('/register')
        .send({ email, password, teamName })
        .then(res => {
          expect(res).to.not.exist;
        })
        .catch(err => {
          const res = err.response;
          expect(res.body.message).to.equal('Please fill out the \'username\' section.');
          expect(res).to.have.status(422);
        });
    });

    it('should fail without a password', () => {
      return chai.request(app)
        .post('/register')
        .send({ email, username, teamName })
        .then(res => {
          expect(res).to.not.exist;
        })
        .catch(err => {
          const res = err.response;
          expect(res.body.message).to.equal('Please fill out the \'password\' section.');
          expect(res).to.have.status(422);
        });
    });

    it('should fail without a team name', () => {
      return chai.request(app)
        .post('/register')
        .send({ email, username, password  })
        .then(res => {
          expect(res).to.not.exist;
        })
        .catch(err => {
          const res = err.response;
          expect(res.body.message).to.equal('Please fill out the \'teamName\' section.');
          expect(res).to.have.status(422);
        });
    });

  });


  describe('verify that the email, username, password && teamName fields do not have whitespace', () => {
    const email = 'stephen@gmail.com';
    const username = 'steph30';
    const password = 'dubnation';
    const teamName = 'three-peat';

    it('should fail if the email has whitespace', () => {
      return chai.request(app)
        .post('/register')
        .send({ email: 'stephen@gmail.com ', username, password, teamName })
        .then(res => {
          expect(res).to.not.exist;
        })
        .catch(err => {
          const res = err.response;
          expect(res.body.message).to.equal('Your \'email\' cannot begin or end with whitespace');
          expect(res).to.have.status(422);
        });
    });

    it('should fail if the username has whitespace', () => {
      return chai.request(app)
        .post('/register')
        .send({ email, username: 'steph30 ', password, teamName })
        .then(res => {
          expect(res).to.not.exist;
        })
        .catch(err => {
          const res = err.response;
          expect(res.body.message).to.equal('Your \'username\' cannot begin or end with whitespace');
          expect(res).to.have.status(422);
        });
    });

    it('should fail if the password has whitespace', () => {
      return chai.request(app)
        .post('/register')
        .send({ email, username, password: 'dubnation ', teamName })
        .then(res => {
          expect(res).to.not.exist;
        })
        .catch(err => {
          const res = err.response;
          expect(res.body.message).to.equal('Your \'password\' cannot begin or end with whitespace');
          expect(res).to.have.status(422);
        });
    });

    it('should fail if the team name has whitespace', () => {
      return chai.request(app)
        .post('/register')
        .send({ email, username, password, teamName: 'three-peat ' })
        .then(res => {
          expect(res).to.not.exist;
        })
        .catch(err => {
          const res = err.response;
          expect(res.body.message).to.equal('Your \'teamName\' cannot begin or end with whitespace');
          expect(res).to.have.status(422);
        });
    });

  });


  // describe('user creation', () => {
  //   const email = 'stephen@gmail.com';
  //   const username = 'steph30';
  //   const password = 'dubnation';
  //   const teamName = 'three-peat';

  //   it('should fail if the username already exists', () => {
  //     return User.create({ email, username, password, teamName })
  //       .then(() => {
  //         return chai.request(app)
  //           .post('/register')
  //           .send({ email, username, password, teamName });
  //       })
  //       .then(res => {
  //         expect(res).to.not.exist;
  //       })
  //       .catch(err => {
  //         // const res = err.response;
  //         console.log('ERR: ', err);
  //         expect(err.body.message).to.equal('The username already exists');
  //       });
  //   });

  //   it('should create a new user and make sure the pw is hashed', () => {
  //     return chai.request(app)
  //       .post('/register')
  //       .send({ username, password })
  //       .then(res => {
  //         expect(res).to.have.status(201);
  //         expect(res.body).to.be.an('object');
  //         expect(res.body).to.have.keys('id', 'fullname', 'username', 'teamName', 'team');
  //         expect(res.body.username).to.equal(username);
  //         return User.findOne({ username: username });
  //       })
  //       .then(user => {
  //         expect(user).to.not.be.null;
  //         return user.validatePassword(password);
  //       })
  //       .then(result => {
  //         expect(result).to.be.true;
  //       });
  //   });
  // });


});