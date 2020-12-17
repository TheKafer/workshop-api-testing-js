const agent = require('superagent');
const statusCode = require('http-status-codes');
const chai = require('chai');

const { expect } = chai;

const url = 'https://httpbin.org/';

describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await agent.get(`${url}ip`);

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await agent.get(`${url}get`).query(query);

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body.args).to.eql(query);
  });

  it('Consume HEAD Service', async () => {
    const response = await agent.head(`${url}headers`);

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.headers).to.have.property('date');
    expect(response.headers).to.have.property('content-length');
    expect(response.body).to.eql({});
  });

  it('Consume PATCH Service', async () => {
    const args = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await agent.patch(`${url}patch`).send(args);

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body.json).to.eql(args);
  });

  it('Consume PUT Service', async () => {
    const args = {
      name: 'John',
      age: 31,
      city: 'New York'
    };

    const response = await agent.put(`${url}put`).send(args);

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body.json).to.eql(args);
  });

  it('Consume DELETE Service', async () => {
    const args = {
      name: 'John',
      age: 31,
      city: 'New York'
    };

    const response = await agent.del(`${url}delete`).send(args);

    expect(response.status).to.equal(statusCode.StatusCodes.OK);
    expect(response.body.json).to.eql(args);
  });
});
