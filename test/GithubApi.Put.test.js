const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect, assert } = require('chai');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';


describe('Github API test PUT method', () => {
  describe('follow users on Github', () => {
    it('Should follow a user', () => {
      agent.put(`${urlBase}/user/following/${githubUserName}`)
        .then((response) => {
          expect(response.status).to.equal(statusCode.NO_CONTENT);
          expect(response.body).to.be.empty();
        });
    });
  });

  describe('Working with the list of followers', () => {
    let followQuery;
    before(() => {
      followQuery = agent.get(`${urlBase}/user/following`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          response.body.find(user => user.login === githubUserName);
        });
    });

    it(`Should be followed ${githubUserName}`, () => {
      followQuery.then(user => assert.exists(user));
    });
  });
});
