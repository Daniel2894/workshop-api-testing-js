const chai = require('chai');
const statusCode = require('http-status-codes');
const isomorphic = require('isomorphic-fetch');

chai.use(require('chai-subset'));

const { expect } = chai;

const jsCode = `
function wait(method, time) {
  return new Promise((resolve) => {
    setTimeout(resolve(method()), time);
  });
}
`;

const defaultHeaders = {
  Authorization: `token ${process.env.ACCESS_TOKEN}`
};

const urlBase = 'https://api.github.com';

describe('Testing the Delete methods in the Github API', () => {
  describe('When create a gist with the isomorphic-fetch library', () => {
    const createGist = {
      description: 'this is an example about promise',
      public: true,
      files: {
        'promise.js': {
          content: jsCode
        }
      }
    };

    let responseCreateGistStatus;
    let responseCreateGist;

    before(() =>
      isomorphic(`${urlBase}/gists`, {
        method: 'POST',
        body: JSON.stringify(createGist),
        headers: defaultHeaders
      })
        .then((response) => {
          responseCreateGistStatus = response.status;
          return response.json();
        })
        .then((body) => {
          responseCreateGist = body;
          return body;
        }));

    it('Should create the gist with fetch', () => {
      expect(responseCreateGistStatus).to.equal(statusCode.CREATED);
      expect(responseCreateGist).to.containSubset(createGist);
      expect(responseCreateGist.description).to.equal(createGist.description);
      expect(responseCreateGist.public).to.equal(true);
    });


    describe('Testing if the gist really exist with fetch', () => {
      let responseGetGistStatus;

      before(() =>
        isomorphic(responseCreateGist.url, {
          method: 'GET',
          headers: defaultHeaders
        })
          .then((response) => {
            responseGetGistStatus = response.status;
          }));

      it('Should exist the gist created with fetch', () => {
        expect(responseGetGistStatus).to.equal(statusCode.OK);
      });

      describe('Deleting the gist with alternative library', () => {
        let responseDeleteGist;

        before(() =>
          isomorphic(responseCreateGist.url, {
            method: 'DELETE',
            headers: defaultHeaders
          })
            .then((response) => {
              responseDeleteGist = response;
            }));

        it('Should delete the gist created', () => {
          expect(responseDeleteGist.status).to.equal(statusCode.NO_CONTENT);
        });

        describe('Want to verify if the gist is really gone', () => {
          let responseGistDeleted;
          before(() =>
            isomorphic(responseCreateGist.url, {
              method: 'GET',
              headers: defaultHeaders
            })
              .then((response) => {
                responseGistDeleted = response.status;
              }));

          it('Should exist the gist created', () => {
            expect(responseGistDeleted).to.equal(statusCode.NOT_FOUND);
          });
        });
      });
    });
  });
});
