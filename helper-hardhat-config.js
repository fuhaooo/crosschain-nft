developmentChains = ["local", "hardhat"]
const networkConfig = {
    11155111: {
        name: "sepolia",
        router: "0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93",
        linkToken: "0xE4aB69C077896252FAFBD49EFD26B5D171A32410", 
        companionChainSelector: "16281711391670634445"
    },
    80002: {
        name: "amoy",
        router: "0x9C32fCB86BF0f4a1A8921a9Fe46de3198bb884B2",
        linkToken: "0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904",
        companionChainSelector: "10344971235874465080"
    } 
}
module.exports = {
    developmentChains,
    networkConfig
}