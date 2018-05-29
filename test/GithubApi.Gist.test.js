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

    it('Should create the gist', () => {
      expect(code).to.equal(statusCode.CREATED);
      expect(gist.description).to.equal(createGist.description);
      expect(gist.public).to.equal(true);
      expect(gist).to.containSubset(createGist);
    });

    describe('Testing if the gist really exist', () => {
      let gistQuery;

      before(() => {
        gistQuery = agent.get(gist.url)
          .auth('token', process.env.ACCESS_TOKEN);
      });

      it('Should exist the gist created', () => {
        gistQuery.then((response) => {
          expect(response.status).to.equal(statusCode.OK);
        });
      });

      describe('Deleting the gist', () => {
        let deleteQuery;

        before(() => {
          deleteQuery = agent.del(gist.url)
            .auth('token', process.env.ACCESS_TOKEN);
        });

        it('Should delete the gist created', () => {
          deleteQuery.then((response) => {
            expect(response.status).to.equal(statusCode.NO_CONTENT);
          });
        });

        describe('Want to verify if the gist is really gone', () => {
          let gistQueryDeleted;
          before(() => {
            gistQueryDeleted = agent.get(gist.url)
              .auth('token', process.env.ACCESS_TOKEN);
          });

          it('Should exist the gist created', () => {
            gistQueryDeleted.catch((response) => {
              expect(response.status).to.equal(statusCode.NOT_FOUND);
            });
          });
        });
      });
    });
  });
});

