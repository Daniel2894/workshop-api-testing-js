const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect } = require('chai');
const statusCode = require('http-status-codes');

const oldUrl = 'https://github.com/aperdomob/redirect-test';
const newUrl = 'https://github.com/aperdomob/new-redirect-test';


describe('Testing head method in the Github API', () => {
  describe('if i call an old URL', () => {
    let errorMsg;
    before(() =>
      agent.head(oldUrl)
        .catch((error) => {
          errorMsg = error;
        }));

    it('Should have redirect information', () => {
      expect(errorMsg.response.headers.location).to.equal(newUrl);
      expect(errorMsg.status).to.equal(statusCode.MOVED_PERMANENTLY);
    });
  });

  describe('When get to the new URL', () => {
    let responseNewUrl;
    before(() =>
      agent.get(oldUrl)
        .then((response) => {
          responseNewUrl = response;
        }));

    it('Should redirect correctly', () => {
      expect(responseNewUrl.status).to.equal(statusCode.OK);
    });
  });
});
