const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';

describe('Github API test PUT method', () => {
  it('Should follow a user', () => {
    agent.put(`${urlBase}/user/following/${githubUserName}`)
      .then((response) => {
        expect(response.status).to.equal(statusCode.NO_CONTENT);
        expect(response.body).to.be.empty();
      });
  });
});
