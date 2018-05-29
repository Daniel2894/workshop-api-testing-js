const agent = require('superagent-promise')(require('superagent'), Promise);
const chai = require('chai');
const statusCode = require('http-status-codes');

chai.use(require('chai-subset'));

const { expect } = chai;

const jsCode = `
function wait(method, time) {
  return new Promise((resolve) => {
    setTimeout(resolve(method()), time);
  });
}
`;

const urlBase = 'https://api.github.com';

describe('Testing the Delete methods in the Github API', () => {
  describe('When create a gist', () => {
    const createGist = {
      description: 'this is an example about promise',
      public: true,
      files: {
        'promise.js': {
          content: jsCode
        }
      }
    };


    let gist;
    let code;
    let newGistQuery;


    before(() => {
      newGistQuery = agent.post(`${urlBase}/gists`, createGist)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          code = response.status;
          gist = response.body;
        });
      return newGistQuery;
    });

    it.only('Should create the gist', () => {
      expect(code).to.equal(statusCode.CREATED);
      expect(gist.description).to.equal(createGist.description);
      expect(gist.public).to.equal(true);
      expect(gist).to.containSubset(createGist);
    });
  });
});

