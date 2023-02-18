import { ethers } from "hardhat";

async function main() {
  //uniswap router address
  const ROUTER = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  //dai token address
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  //uni token address
  const UNI = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";
  //dai holder
  const DAIHolder = "0x748dE14197922c4Ae258c7939C7739f3ff1db573";
  //uniswap factory address
  const UNISWAPFACTORY = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
  //pair liquidity address
  const LiquidPair = "0xf00e80f0DE9aEa0B33aA229a4014572777E422EE";

  let time = 1876588399;

  const amountToSwap = await ethers.utils.parseEther("100");
  console.log(amountToSwap);

  const amountToSwap2 = await ethers.utils.parseEther("0");
  console.log(amountToSwap2);

  const sent = ethers.utils.parseEther("1");

  //impersonation of a DAI Holder
  const helpers = require("@nomicfoundation/hardhat-network-helpers");
  await helpers.impersonateAccount(DAIHolder);
  const impersonatedSigner = await ethers.getSigner(DAIHolder);

  const Uniswap = await ethers.getContractAt("IUniswap", ROUTER);

  const DaiContract = await ethers.getContractAt("IToken", DAI);

  const UniContract = await ethers.getContractAt("IToken", UNI);

  const UniPairContract = await ethers.getContractAt("IToken", LiquidPair); 

  //approving the router to spend/remove both tokens 
  await DaiContract.connect(impersonatedSigner).approve(ROUTER, amountToSwap);
  await UniContract.connect(impersonatedSigner).approve(ROUTER, amountToSwap);

  //balance of uni token and dai token
  const uniBalance = await UniContract.balanceOf(DAIHolder);
  console.log(`Uni balance before ${uniBalance}`);

  const daiBalance = await DaiContract.balanceOf(DAIHolder);
  console.log(`Dai balance before ${daiBalance}`);

  //add liquidity to both dai and uni token
  await Uniswap.connect(impersonatedSigner).addLiquidity(
    DAI,
    UNI,
    6500,
    1000,
    2100,
    300,
    DAIHolder,
    time
  );

  //balance of uni token and dai token after transaction
  const uniBalanceAfter = await UniContract.balanceOf(DAIHolder);
  console.log(`uniBalanceAfter ${uniBalanceAfter}`);

  const daiBalanceAfter = await DaiContract.balanceOf(DAIHolder);
  console.log(`Dai balance After ${daiBalanceAfter}`);

    //approve ROUTER  to remove DAI 
  await DaiContract.connect(impersonatedSigner).approve(ROUTER, amountToSwap);

  //add liquity eth 
  await Uniswap.connect(impersonatedSigner).addLiquidityETH(
    DAI,
    amountToSwap,
    0,
    amountToSwap2,
    DAIHolder,
    time,
    {
      value: sent,
    }
  );

  console.log("liquidity has been added to ether successfully");

  const LiquidBalance = await UniPairContract.connect(impersonatedSigner).balanceOf(impersonatedSigner.address);
  console.log(`LiquidBalance is ${LiquidBalance}`);

  await UniPairContract.connect(impersonatedSigner).approve(ROUTER, amountToSwap);

  //remove liquidity
  await Uniswap.connect(impersonatedSigner).removeLiquidity(
    DAI,
    UNI,
    2000,
    0,
    0,
    DAIHolder,
    time
  );

  const LiquidBalanceAfter = await UniPairContract.connect(impersonatedSigner).balanceOf(impersonatedSigner.address);
  console.log(`LiquidBalance after is ${LiquidBalanceAfter}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});