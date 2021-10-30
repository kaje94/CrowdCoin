import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  // Remember to add NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS to .env file after deploying the factory contract
  process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS
);

export default instance;
