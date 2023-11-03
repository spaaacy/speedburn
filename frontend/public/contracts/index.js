import speedburnConfig from "./SpeedBurn.json";
import marketplaceConfig from "./Marketplace.json";
import colosseumConfig from "./Colosseum.json";

export const { abi: speedburn } = speedburnConfig;
export const { abi: marketplace } = marketplaceConfig;
export const { abi: colosseum } = colosseumConfig;

export const address = {
  speedburn: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  marketplace: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",    
  timelock: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  colosseum: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
};

export default {address, speedburn, marketplace, colosseum};