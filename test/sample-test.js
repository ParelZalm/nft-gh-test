const { expect } = require("chai");
const { ethers } = require("hardhat");
// const { isCallTrace } = require("hardhat/src/internal/hardhat-network/stack-traces/message-trace");

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });

describe("MyNFT", function(){
  it("should mint and transfer an NFT to someone", async function(){
    const GHTest = await ethers.getContractFactory("GHTest");
    const ghtest = await GHTest.deploy();
    await ghtest.deployed();

    const recipient = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
    const metaDataURI = 'cid/test.png';

    let balance = await ghtest.balanceOf(recipient);
    expect(balance).to.equal(0);

    const newlyMintedToken = await ghtest.payToMint(recipient, metaDataURI, { value: ethers.utils.parseEther('.05')});

    balance = await ghtest.balanceOf(recipient);

    expect (await ghtest.isContentOwned(metaDataURI)).to.equal(true);
  });
});