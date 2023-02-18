import { ethers } from "hardhat";

async function main() {
    const mintedNFT = await ethers.getContractFactory("MintedNFT");
    const [owner] = await ethers.getSigners();
    const MintedNFT = await mintedNFT.deploy();
    await MintedNFT.deployed();
    console.log("NFT contract address", MintedNFT.address);

    const IPFS = "QmUQSsHjhLwU3MLGkvbdSw72ckbena33QYtnNZCSTgaPHv";

    const Minted = await MintedNFT.safeMint(owner.address, IPFS);
    console.log(Minted);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});