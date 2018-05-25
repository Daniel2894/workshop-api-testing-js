const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';
const githubUserName = 'aperdomob';


describe('Github API test', () => {
  describe('get method', () => {
    it('Should return the name, company and location', () =>
      agent.get(`${urlBase}/users/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          expect(response.status).to.equal(statusCode.OK);
          expect(response.body.name).to.equal('Alejandro Perdomo');
          expect(response.body.company).to.equal('PSL');
          expect(response.body.location).to.equal('Colombia');
        }));

    it('Should return the repository name, privacy and description', () =>
      agent.get(`${urlBase}/users/${githubUserName}/repos`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          const repository = response.body.find(repo => repo.name === 'jasmine-awesome-report');

          expect(response.status).to.equal(statusCode.OK);
          expect(repository.full_name).to.equal(`${githubUserName}/jasmine-awesome-report`);
          expect(repository.private).to.equal(false);
          expect(repository.description).to.equal('An awesome html report for Jasmine');
        }));
  });
});
