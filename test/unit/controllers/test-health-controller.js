const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const res = require('express/lib/response');
const healthController = require(
  '../../../server/controllers/health-controller',
);

const { expect } = chai;
const sandbox = sinon.createSandbox();
chai.use(sinonChai);

// example unit test of health controller
describe('Test health controller', () => {
  before(() => {
    sandbox.stub(res, 'json');
  });

  afterEach(() => {
    sandbox.reset();
  });

  after(() => {
    sandbox.restore();
  });

  it('should return status UP', () => {
    const mockReq = {};

    healthController.getHealth(mockReq, res);
    expect(res.json).to.have.been.calledOnceWith({
      status: 'UP',
    });
  });
});
