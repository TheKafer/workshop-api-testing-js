const isomorphic = require('isomorphic-fetch');
const chai = require('chai');
const statusCode = require('http-status-codes');
const agent = require('superagent');

chai.use(require('chai-subset'));

const { expect } = chai;

const code = `
let promise = new Promise(function(resolve, reject) {
    // the function is executed automatically when the promise is constructed
  
    // after 1 second signal that the job is done with the result "done"
    setTimeout(() => resolve("done"), 1000);
  });
`;

const urlBase = 'https://api.github.com';

describe('Given a github user', () => {
  describe('When create a gist', () => {
    const defaultHeaders = {
      Authorization: `token ${process.env.ACCESS_TOKEN}`
    };
    let gist;
    let status;

    const createGist = {
      description: 'this is an example about promise',
      public: true,
      files: {
        'ExamplePromise.js': {
          content: code
        }
      }
    };

    before(async () => {
      const parameters = {
        method: 'POST',
        body: JSON.stringify(createGist),
        headers: defaultHeaders
      };

      const response = await isomorphic(`${urlBase}/gists`, parameters);
      status = response.status;
      gist = await response.json();
    });

    it('Then a new gist should be created', () => {
      expect(status).to.equal(statusCode.StatusCodes.CREATED);
      expect(gist).to.containSubset(createGist);
    });

    describe('And get the new gist', () => {
      let gistResponse;

      before(async () => {
        gistResponse = await isomorphic(gist.url, {
          method: 'GET',
          headers: {
            Authorization: `token ${process.env.ACCESS_TOKEN}`
          }
        });
      });

      it('Then the Gits should be accessible', () => expect(gistResponse.status).to.equal(statusCode.StatusCodes.OK));

      describe('When delete a gist', () => {
        let deleteGistQuery;

        before(async () => {
          deleteGistQuery = await isomorphic(gist.url, { method: 'DELETE', headers: defaultHeaders });
        });

        it('Then the gist should be deleted', () => expect(deleteGistQuery.status).to.equal(statusCode.StatusCodes.NO_CONTENT));
      });

      describe('And try to get the delete gist', () => {
        let responseStatus;

        before(async () => {
          try {
            await agent
              .get(gist.url)
              .set('User-Agent', 'agent')
              .auth('token', process.env.ACCESS_TOKEN);
          } catch (response) {
            responseStatus = response.status;
          }
        });

        it('Then the Gits should not be accessible', () => {
          expect(responseStatus).to.equal(statusCode.NOT_FOUND);
        });
      });
    });
  });
});
