import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { providers } from "ethers";

async function main() {
  //uniswap router address
  const ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  //dai token address
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  //uni token address
  const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  //dai holder
  const DAIHolder = "0x748dE14197922c4Ae258c7939C7739f3ff1db573";

  let time = 1876588399;

  const amountADesired = await ethers.utils.parseEther("0.1");
  console.log(amountADesired);

  const amountAMin = await ethers.utils.parseEther("0.1");
  console.log(amountAMin);

  const amountBDesired = await ethers.utils.parseEther("0.1");
  console.log(amountBDesired);

  const amountBMin = await ethers.utils.parseEther("0.1");
  console.log(amountBMin);

  const Uniswap = await ethers.getContractAt("IUniswap", ROUTER);

  const helpers = require("@nomicfoundation/hardhat-network-helpers");
  await helpers.impersonateAccount(DAIHolder);
  const impersonatedSigner = await ethers.getSigner(DAIHolder);

  const DaiContract = await ethers.getContractAt("IToken", DAI);

  const UniContract = await ethers.getContractAt("IToken", UNI);

  const holderBalance = await DaiContract.balanceOf(DAIHolder);
  console.log(`Dai balance before ${holderBalance}`);

  await DaiContract.connect(impersonatedSigner).approve(ROUTER, amountADesired);
  await DaiContract.connect(impersonatedSigner).approve(ROUTER, amountAMin);

  await UniContract.connect(impersonatedSigner).approve(ROUTER, amountBDesired);
  await DaiContract.connect(impersonatedSigner).approve(ROUTER, amountBMin);

  const uniBalance = await UniContract.balanceOf(DAIHolder);
  console.log(`uniBalance ${uniBalance}`);

  await Uniswap.connect(impersonatedSigner).addLiquidity(
    UNI,
    DAI,
    amountADesired,
    amountAMin,
    amountBDesired,
    amountBMin,
    DAIHolder,
    time
  );

}

// 150,000 000 000 000 000 000 000

//150 014 568 346 647 994 343 514

// 150 000 000 000 000 000 000 249

// 15,110,085 000 000 000 000 000 000
//15,110 185 000 000 000 000 000 000

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});