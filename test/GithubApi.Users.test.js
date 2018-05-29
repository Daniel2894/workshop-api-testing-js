const agent = require('superagent-promise')(require('superagent'), Promise);
const responseTime = require('superagent-response-time');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';

describe.only('For getting all users', () => {
  let queryTime;
  before(() => {
    const allUsersQuery = agent.get(`${urlBase}/users`)
      .auth('token', process.env.ACCESS_TOKEN)
      .use(responseTime((response, time) => {
        queryTime = time;
      })).then(() => 0);
    return allUsersQuery;
  });

  it('Should have a time response below to 5 sec', () => {
    expect(queryTime).to.be.at.below(5000);
  });
});
