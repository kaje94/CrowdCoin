import web3 from "./web3";
import Campaign from "./build/Campaign.json";

const instance = (address) => {
  return new web3.eth.Contract(JSON.parse(Campaign.interface), address);
};

export default instance;