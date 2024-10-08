const { task } = require("hardhat/config")
const { networkConfig } = require("../helper-hardhat-config")

task("burn-and-cross")
    .addOptionalParam("chainselector", "chain seletor of dest chain")
    .addOptionalParam("receiver", "receiver address on dest chain")
    .addParam("tokenid", "token ID to be crossed chain")
    .setAction(async(taskArgs, hre) => {
        let chainSelector
        let receiver
        const tokenId = taskArgs.tokenid
        const { firstAccount } = await getNamedAccounts()

        if(taskArgs.chainSelector) {
            chainSelector = taskArgs.chainselector
        } else {
            chainSelector = networkConfig[network.config.chainId].companionChainSelector
            console.log("chainselector is not set in command")
        }
        console.log(`chainselector is ${chainSelector}`)

        if(taskArgs.receiver) {
            chainSelector = taskArgs.receiver
        } else {
            const nftProolLockAndReleaseDeployment = 
                await hre.companionNetworks["destChain"].deployments.get("NFTPoolLockAndRelease")
            receiver = (await nftProolBurnAndMintDeployment).address 
            console.log("reveiver is not set in command")
        }
        console.log(`receiver's address is ${receiver}`)

        // transfer link token to address of the pool
        const linkTokenAddress = networkConfig[network.config.chainId].linkToken
        const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddress)
        const nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint")
        const transferTx = await linkToken.transfer(nftPoolBurnAndMint.target, ethers.parseEther("10"))
        await transferTx.wait(6)
        const balance = linkToken.balanceOf(nftPoolBurnAndMint.target)
        console.log(`balance of pool is ${balance}`)

        // approve pool address to call transferFrom
        const wnft = await ethers.getContract("WrappedMyToken", firstAccount)
        wnft.approve(nftPoolBurnAndMint.target, tokenId)
        console.log("approve success.")

        // call burnAndSentNFT
        const burnAndSentNFTtx = await nftPoolBurnAndMint.burnAndSendNFT(
            tokenId,
            firstAccount,
            chainSelector,
            receiver
        )
        console.log(`ccip transction is sent, the tx hash is ${burnAndSentNFTtx.hash}`)
})

module.exports = {}