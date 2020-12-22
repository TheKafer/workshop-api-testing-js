const agent = require('superagent');
const { expect } = require('chai');
const statusCode = require('http-status-codes');

const repostitory = 'https://github.com/aperdomob/redirect-test';
const redirectRepository = 'https://github.com/aperdomob/new-redirect-test';

describe('Given a repository', () => {
  describe('When get the head repository', () => {
    let responseHead;

    before(async () => {
      try {
        await agent.head(repostitory);
      } catch (response) {
        responseHead = response;
      }
    });

    it('Then should have the redirect information', () => {
      expect(responseHead.status).to.equal(statusCode.StatusCodes.MOVED_PERMANENTLY);
      expect(responseHead.response.headers.location).to.equal(redirectRepository);
    });

    describe('And consume the url with redirect', () => {
      let oldRequestResponse;

      before(async () => {
        oldRequestResponse = await agent.get(repostitory);
      });

      it('Then url should be redirected', () => {
        expect(oldRequestResponse.status).to.equal(statusCode.StatusCodes.OK);
      });
    });
  });
});
