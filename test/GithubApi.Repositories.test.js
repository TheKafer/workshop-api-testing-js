const agent = require('superagent');
const chai = require('chai');
const md5 = require('md5');

chai.use(require('chai-subset'));

const { expect } = chai;

const url = 'https://api.github.com';

describe('Given a user the github', () => {
  const username = 'aperdomob';
  const repositorySearch = 'jasmine-awesome-report';
  const expectedMd5 = '0e62b07144b4fa997eedb864ff93e26b';
  const falseMd5 = '0e62b07144b4fa997eedb864ff93527b'
  const format = {
    name: 'README.md',
    path: 'README.md',
    sha: 'b9900ca9b34077fe6a8f2aaa37a173824fa9751d'
  };

  describe('when get user', () => {
    let repositories;
    let repository;
    let user;
   
    before(async () => {
      const userResponse = await agent.get(`${url}/users/${username}`).auth('token', process.env.ACCESS_TOKEN).set('User-Agent', 'agent');
      user = userResponse.body;
      const repositoriesResponse = await agent.get(`${url}/users/${username}/repos`).auth('token', process.env.ACCESS_TOKEN).set('User-Agent', 'agent');
      repositories = repositoriesResponse.body;
      repository = repositories.find((rep) => rep.name === repositorySearch);
    });

    it('Then the user should have been obtained', () => {
      expect(user.name).to.equal('Alejandro Perdomo');
      expect(user.company).to.equal('PSL');
      expect(user.location).to.equal('Colombia');
    });

    it('Then should have the repository', () => {
      expect(repository.full_name).to.equal('aperdomob/jasmine-awesome-report');
      expect(repository.private).to.equal(false);
      expect(repository.description).to.equal('An awesome html report for Jasmine');
    });

    describe('When download the zip of repository', () => {
      let zip;

      before(async () => {
        const downloadResponse = await agent.get(`${repository.svn_url}/archive/master.zip`).auth('token', process.env.ACCESS_TOKEN).set('User-Agent', 'agent').buffer(true);
        zip = downloadResponse;
      });

      it('Then the repository should be downloaded', () => {
        expect(md5(zip.text)).to.not.equal(falseMd5);
      });

      describe('When get files', () => {
        let listFiles;
        let readme;
        let fileContent;

        before(async () => {
          const readmeResponse = await agent.get(`${repository.url}/contents`).auth('token', process.env.ACCESS_TOKEN).set('User-Agent', 'agent');

          listFiles = readmeResponse.body;
          readme = listFiles.find((file) => file.name === 'README.md');

          const downloadReadmeResponse = await agent.get(readme.download_url);
          fileContent = downloadReadmeResponse.text;
        });

        it('Then the file should be downloaded', () => {
          expect(readme).containSubset(format);
          expect(md5(fileContent)).to.equal(expectedMd5);
        });
      });
    });
  });
});
