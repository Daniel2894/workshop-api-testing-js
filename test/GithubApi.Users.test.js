const agent = require('superagent-promise')(require('superagent'), Promise);
const responseTime = require('superagent-response-time');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';

describe.only('For getting all users', () => {
  let queryTime;
  let usersPagination;

  before(() => {
    agent
      .get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        usersPagination = response.body.length;
      });

    const usersQuery = agent
      .get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .use(responseTime((request, time) => {
        queryTime = time;
      })).then(() => 0);

    return usersQuery;
  });


  it('Should have a time response below to 5 sec', () => {
    expect(queryTime).to.be.at.below(5000);
  });

  it('Should have 30 users by default', () => {
    expect(usersPagination).to.equal(30);
  });

  describe('Getting only 10 users', () => {
    let usersTenPagination;
    before(() =>
      agent
        .get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .query({ per_page: 10 })
        .then((response) => {
          usersTenPagination = response.body.length;
        }));

    it('Should get only 10 users', () => {
      expect(usersTenPagination).to.equal(10);
    });

    describe('Getting 50 users', () => {
      let usersFifthyPagination;
      before(() =>
        agent
          .get(`${urlBase}/users`)
          .auth('token', process.env.ACCESS_TOKEN)
          .query({ per_page: 50 })
          .then((response) => {
            usersFifthyPagination = response.body.length;
          }));

      it('Should get 50 users', () => {
        expect(usersFifthyPagination).to.equal(50);
      });
    });
  });
});
