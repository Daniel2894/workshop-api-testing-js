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

describe.only('Testing the Delete methods in the Github API', () => {
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

    let responseCreateGist;

    before(() =>
      agent.post(`${urlBase}/gists`, createGist)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          responseCreateGist = response;
        }));

    it('Should create the gist', () => {
      expect(responseCreateGist.status).to.equal(statusCode.CREATED);
      expect(responseCreateGist.body.description).to.equal(createGist.description);
      expect(responseCreateGist.body.public).to.equal(true);
      expect(responseCreateGist.body).to.containSubset(createGist);
    });

    describe('Testing if the gist really exist', () => {
      let responseGetGist;

      before(() =>
        agent.get(responseCreateGist.body.url)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            responseGetGist = response;
          }));

      it('Should exist the gist created', () => {
        expect(responseGetGist.status).to.equal(statusCode.OK);
      });

      describe('Deleting the gist', () => {
        let responseDeleteGist;

        before(() =>
          agent.del(responseCreateGist.body.url)
            .auth('token', process.env.ACCESS_TOKEN)
            .then((response) => {
              responseDeleteGist = response;
            }));

        it('Should delete the gist created', () => {
          expect(responseDeleteGist.status).to.equal(statusCode.NO_CONTENT);
        });

        describe('Want to verify if the gist is really gone', () => {
          let responseGistDeleted;
          before(() =>
            agent.get(responseCreateGist.body.url)
              .auth('token', process.env.ACCESS_TOKEN)
              .catch((response) => {
                responseGistDeleted = response;
              }));

          it('Should exist the gist created', () => {
            expect(responseGistDeleted.status).to.equal(statusCode.NOT_FOUND);
          });
        });
      });
    });
  });
});

