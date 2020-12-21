const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect, assert } = require('chai');

describe('Given a user github', () => {
  const urlApi = 'https://api.github.com';
  const username = 'aperdomob';

  describe('When the user wants to follow a user', () => {
    let followResponse;

    before(async () => {
      followResponse = await agent.put(`${urlApi}/user/following/${username}`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('Then should be a response', () => {
      expect(followResponse.status).to.eql(statusCode.StatusCodes.NO_CONTENT);
      expect(followResponse.body).to.eql({});
    });

    describe('And he wants to know followed users', () => {
      let user;

      before(async () => {
        const listResponse = await agent.get(`${urlApi}/user/following`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');

        user = listResponse.body.find((list) => list.login === username);
      });

      it(`Then should be followed to ${username}`, () => {
        assert.exists(user);
      });
    });
  });
  describe('And wanna follow the same user again', () => {
    let followUserAgainResponse;
    let user;

    before(async () => {
      followUserAgainResponse = await agent.put(`${urlApi}/user/following/${username}`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);

      const userFollow = await agent.get(`${urlApi}/user/following`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
      user = userFollow.body.find((list) => list.login === username);
    });

    it('then verify the method is idempotent', () => {
      expect(followUserAgainResponse.status).to.eql(statusCode.StatusCodes.NO_CONTENT);
      expect(followUserAgainResponse.body).to.eql({});
    });

    it(`then should be followed to ${username}`, () => {
      assert.exists(user);
    });
  });
});
