const agent = require('superagent');
const chai = require('chai');
const statusCode = require('http-status-codes');

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
    let gist;

    const createGist = {
      description: 'this is an example about promise',
      public: true,
      files: {
        'ExamplePromise.js': {
          content: code
        }
      }
    };

    let newGistResponse;

    before(async () => {
      newGistResponse = await agent
        .post(`${urlBase}/gists`, createGist)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);

      gist = newGistResponse.body;
    });

    it('Then a new gist should be created', () => {
      expect(newGistResponse.status).to.equal(statusCode.CREATED);
      expect(gist).to.containSubset(createGist);
    });

    describe('And get the new gist', () => {
      let gistResponse;

      before(async () => {
        gistResponse = await agent
          .get(gist.url)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
      });

      it('Then the Gits should be accessible', () => expect(gistResponse.status).to.equal(statusCode.OK));

      describe('When delete a gist', () => {
        let deleteGistQuery;

        before(async () => {
          deleteGistQuery = await agent
            .del(gist.url)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);
        });

        it('Then the gist should be deleted', () => expect(deleteGistQuery.status).to.equal(statusCode.NO_CONTENT));
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
