const agent = require('superagent');
const responseTime = require('superagent-response-time');
const { expect } = require('chai');

const urlApi = 'https://api.github.com';

describe('Given a github user', () => {
  describe('When gets all users', () => {
    let queryTime;

    before(async () => {
      await agent
        .get(`${urlApi}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .use(responseTime((request, time) => {
          queryTime = time;
        }));
    });

    it('Then it should have a response less than 5 seconds', () => {
      expect(queryTime).to.be.at.below(5000);
    });
  });

  describe('When get only 10 users', () => {
    let users;

    before(async () => {
      const response = await agent
        .get(`${urlApi}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .query({ per_page: 10 });

      users = response.body;
    });

    it('Then the number of filtered users should be equals to 10', () => {
      expect(users.length).to.equal(10);
    });
  });

  describe('When get only 50 users', () => {
    let users;

    before(async () => {
      const oneHundredUsersQuery = await agent
        .get(`${urlApi}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent')
        .query({ per_page: 50 });

      users = oneHundredUsersQuery.body;
    });

    it('Then the number of filtered users should be equals to 50', () => {
      expect(users.length).to.equal(50);
    });
  });
});
