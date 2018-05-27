const agent = require('superagent-promise')(require('superagent'), Promise);

const { expect } = require('chai');

const urlBase = 'https://api.github.com';


describe('Github API test post and patch method', () => {
  let user;
  let username;


  before(() => {
    const userQuery = agent.get(`${urlBase}/user`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        user = response.body;
        username = user.login;
      });
    return userQuery;
  });


  it('The user have a public repository', () => {
    expect(user.public_repos).to.be.above(0);
  });

  describe('get the list of repositories', () => {
    let repository;
    let repositories;

    before(() => {
      const reposQuery = agent.get(`${urlBase}/users/${username}/repos`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          repositories = response.body;
          repository = repositories.find(repo => repo.name === 'workshop-api-testing-js');
        });
      return reposQuery;
    });

    it('Should exist the repository workshop-api-testing-js', () => {
      expect(repository).to.not.equal(undefined);
    });
  });
});
