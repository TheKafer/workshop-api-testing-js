const agent = require('superagent');
const { expect } = require('chai');

const urlApi = 'https://api.github.com';
const namePublicRepo = 'workshop-api-testing-js';

describe('Given a github user', () => {
  let user;
  let repository;

  before(async () => {
    const response = await agent.get(`${urlApi}/user`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    user = response.body;
    const listResponse = await agent.get(user.repos_url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    repository = listResponse.body.find((list) => list.name === namePublicRepo);
  });

  describe('when wanna all repositories', () => {
    it('Then should have public repositories', () => {
      expect(user.public_repos).to.be.greaterThan(0);
    });
  });

  describe('And wanna select repository', () => {
    it('Then should have the public repository', () => {
      expect(repository).to.not.equal(undefined);
    });

    describe('And wanna create a new issue', () => {
      const newIssue = {
        title: 'this is my first issue created by api'
      };
      const bodyIssue = {
        body: ':)'
      };
      let issue;

      before(async () => {
        const issueResponse = await agent.post(`${urlApi}/repos/${repository.full_name}/issues`, newIssue)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');
        issue = issueResponse.body;
      });

      describe('When modify an issue', () => {
        let modifiedIssue;

        before(async () => {
          const response = await agent.patch(`${urlApi}/repos/${user.login}/${repository.name}/issues/${issue.number}`, bodyIssue)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent');

          modifiedIssue = response.body;
        });

        it('Then add the body', () => {
          expect(modifiedIssue.title).to.equal(newIssue.title);
          expect(modifiedIssue.body).to.equal(bodyIssue.body);
        });
      });

      it('Then the issue should be created', () => {
        expect(issue.title).to.equal(newIssue.title);
        expect(issue.body).to.equal(null);
      });
    });
  });
});
