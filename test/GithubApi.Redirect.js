const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect } = require('chai');
const statusCode = require('http-status-codes');

const oldUrl = 'https://github.com/aperdomob/redirect-test';
const newUrl = 'https://github.com/aperdomob/new-redirect-test';


describe('Testing head method in the Github API', () => {
  describe('if i call an old URL', () => {
    let query;
    before(() => {
      query = agent.head(oldUrl)
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('Should have redirect information', () =>
      query.catch((error) => {
        expect(error.response.headers.location).to.equal(newUrl);
        expect(error.status).to.equal(statusCode.MOVED_PERMANENTLY);
      }));
  });

  describe('When get to the new URL', () => {
    let redirectionQuery;
    before(() => {
      redirectionQuery = agent.get(oldUrl)
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('Should redirect correctly', () => {
      redirectionQuery.then((response) => {
        expect(response.status).to.equal(statusCode.OK);
      });
    });
  });
});
