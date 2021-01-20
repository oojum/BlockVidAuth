const _deploy_contracts = require("../migrations/2_deploy_contracts");

const VidAuth = artifacts.require("VidAuth");

contract(VidAuth, (accounts) => {
  it("should create a new record for a video", () => {
    return VidAuth.deployed().then(async (instance) => {
      const hash =
        "7e5941f066b2070419995072dac7323c02d5ae107b23d8085772f232487fecae";

      await instance.addNewVid(hash);

      const owner = await instance.getOwnerFromHash(hash);

      assert.equal(owner, accounts[0], "owner was not set");
    });
  });

  it("should create another record for a video", () => {
    return VidAuth.deployed().then(async (instance) => {
      const hash =
        "8e5941f066b2070419995072dac7323c02d5ae107b23d8085772f232487fecae";

      await instance.addNewVid(hash);

      const vidHashArray = await instance.getVidsFromOwner(accounts[0]);

      const expectedArray = [
        "7e5941f066b2070419995072dac7323c02d5ae107b23d8085772f232487fecae",
        "8e5941f066b2070419995072dac7323c02d5ae107b23d8085772f232487fecae",
      ];

      assert.deepEqual(
        vidHashArray,
        expectedArray,
        "vidHash was not added for owner"
      );
    });
  });
});
