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

    describe('insert an issue', () => {
      const firstIssue = {
        title: 'testing post method'
      };
      const editedIssue = {
        body: 'adding a body to an issue'
      };
      let issue;


      before(() => {
        const newIssueQuery = agent.post(`${urlBase}/repos/${username}/${repository.name}/issues`, firstIssue)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            issue = response.body;
          });
        return newIssueQuery;
      });

      it('Should create the issue', () => {
        expect(issue.title).to.equal(firstIssue.title);
        expect(issue.body).to.equal(null);
      });

      describe('Issue modified', () => {
        let modifiedIssue;

        before(() => {
          const modifiedQuery = agent.patch(`${urlBase}/repos/${username}/${repository.name}/issues/${issue.number}`, editedIssue)
            .auth('token', process.env.ACCESS_TOKEN)
            .then((response) => {
              modifiedIssue = response.body;
            });
          return modifiedQuery;
        });

        it('Should add a body to the issue', () => {
          expect(modifiedIssue.title).to.equal(issue.title);
          expect(modifiedIssue.body).to.equal(editedIssue.body);
        });
      });
    });
  });
});
