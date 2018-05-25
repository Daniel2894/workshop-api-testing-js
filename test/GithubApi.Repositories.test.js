const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect } = require('chai');
const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
const md5 = require('md5');



const urlBase = 'https://api.github.com';


describe('Github API test', () => {
  const githubUserName = 'aperdomob';

  describe('get the info user', () => {
    it('Should return the name, company and location', () =>
      agent.get(`${urlBase}/users/${githubUserName}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          expect(response.status).to.equal(statusCode.OK);
          expect(response.body.name).to.equal('Alejandro Perdomo');
          expect(response.body.company).to.equal('PSL');
          expect(response.body.location).to.equal('Colombia');
        }));
  });

  describe('test the repositories', () => {
    let repositories;
    let repository;

    describe('get the repositories data', () => {
      before(() => {
        const query = agent.get(`${urlBase}/users/${githubUserName}/repos`)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            repositories = response.body;
            repository = repositories.find(repo => repo.name === 'jasmine-awesome-report');
          });
        return query;
      });

      it('Should return the repository name, privacy and description', () => {
        expect(repository.full_name).to.equal(`${githubUserName}/jasmine-awesome-report`);
        expect(repository.private).to.equal(false);
        expect(repository.description).to.equal('An awesome html report for Jasmine');
      });
    });


    describe('get a repository', () => {
      const expectedMD5 = '1ed0130a7216203cc3e5b79b9c434aa8';
      let zip;

      before(() => {
        const query = agent.get(`${repository.svn_url}/archive/${repository.default_branch}.zip`)
          .auth('token', process.env.ACCESS_TOKEN)
          .buffer(true)
          .then((response) => {
            zip = response.text;
          });
        return query;
      });

      it('Should download the .zip repository', () => {
        expect(md5(zip)).to.equal(expectedMD5);
      });
    });

    describe('test the files in the repo', () => {
      const filename = 'README.md';
      let readme;
      let files;
      const expectedSha = '9bcf2527fd5cd12ce18e457581319a349f9a56f3';

      before(() => {
        const query = agent.get(`${repository.url}/contents`)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            files = response.body;
            readme = files.find(file => file.name === 'README.md');
          });
        return query;
      });

      it('Should have README.md', () => {
        expect(readme.name).to.equal(filename);
        expect(readme.sha).to.equal(expectedSha);
      });

      describe('test the download of files in the repo', () => {
        const expectedMD5 = '8a406064ca4738447ec522e639f828bf';
        let file;

        before(() => {
          const query = agent.get(readme.download_url)
            .auth('token', process.env.ACCESS_TOKEN)
            .then((response) => {
              file = response.text;
            });
          return query;
        });

        it('should download the README file', () => {
          expect(md5(file)).to.equal(expectedMD5);
        });
      });
    });
  });

  describe('test the repositories', () => {
    let repositories;
    let repository;

    describe('get the repositories data', () => {
      before(() => {
        const query = agent.get(`${urlBase}/users/${githubUserName}/repos`)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            repositories = response.body;
            repository = repositories.find(repo => repo.name === 'jasmine-awesome-report');
          });
        return query;
      });

      it('Should return the repository name, privacy and description', () => {
        expect(repository.full_name).to.equal(`${githubUserName}/jasmine-awesome-report`);
        expect(repository.private).to.equal(false);
        expect(repository.description).to.equal('An awesome html report for Jasmine');
      });
    });


    describe('get a repository', () => {
      const expectedMD5 = '1ed0130a7216203cc3e5b79b9c434aa8';
      let zip;

      before(() => {
        const query = agent.get(`${repository.svn_url}/archive/${repository.default_branch}.zip`)
          .auth('token', process.env.ACCESS_TOKEN)
          .buffer(true)
          .then((response) => {
            zip = response.text;
          });
        return query;
      });

      it('Should download the .zip repository', () => {
        expect(md5(zip)).to.equal(expectedMD5);
      });
    });

    describe('test the files in the repo', () => {
      const filename = 'README.md';
      let readme;
      let files;
      const expectedSha = '9bcf2527fd5cd12ce18e457581319a349f9a56f3';

      before(() => {
        const query = agent.get(`${repository.url}/contents`)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            files = response.body;
            readme = files.find(file => file.name === 'README.md');
          });
        return query;
      });

      it('Should have README.md', () => {
        expect(readme.name).to.equal(filename);
        expect(readme.sha).to.equal(expectedSha);
        expect(readme.path).to.equal(filename);
        expect(readme).to.containSubset({
          type: 'file'
        });
      });

      describe('test the download of files in the repo', () => {
        const expectedMD5 = '8a406064ca4738447ec522e639f828bf';
        let file;

        before(() => {
          const query = agent.get(readme.download_url)
            .auth('token', process.env.ACCESS_TOKEN)
            .then((response) => {
              file = response.text;
            });
          return query;
        });

        it('should download the README file', () => {
          expect(md5(file)).to.equal(expectedMD5);
        });
      });
    });
  });
});
