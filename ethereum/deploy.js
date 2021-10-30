const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  process.env.WALLET_MNEMONIC,
  // remember to change this to your own phrase by providing in in the .env file!
  process.env.INFURA_ENDPOINT
  // remember to change this to your own endpoint by providing in in the .env file!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "1000000", gasPrice: "5000000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  console.log(
    `Please add contract address to the .env file as NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS=${result.options.address}`
  );
};
deploy();
