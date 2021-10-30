# CrowdCoin
### A decentralized ethereum blockchain based crowdfunding platform inspired by [kickstarter.com](https://www.kickstarter.com) 

The purpose of this project is to increase the credibility of crowdfunding campaigns created by platforms such as kickstarter.com with the use of blockchain. 
- A user can become a manager of a campaign by creating a campaign and assigning a minimum contribution(in wei) that can be made to that campaign. 
- Anyone who is interested in a campaign can support that campaign by contributing some amount of eth
- The manager can create funding requests for campaigns by specifying a description, funding amount and the recipient(address) who will be receiving the fund
- At least 50% of those who contributed to the campaign needs to approve a funding request in order for the manager to be able to finalize the funding and transfer the amount to the recipient of the funding request

This approach of using blockchain for crowdfunding will not only increase the transparency but also reduce possible fraudulent activities that can take place in traditional crowdfunding platforms

## Demo URL: https://crowd-coin-kaje94.vercel.app
> Make sure to have metamask plugin installed with goeril network selected as this project is intended to work with only goeril network

## Prerequisites
- Google chrome with metamask plugin installed
- Infura endpoint to deploy contract (https://infura.io)
- Wallet mnemonic with the first wallet address containing some eth required to deploy the initial contract
- Metamask plugin should ideally be in the same network that infura url is pointing to
- Node.js
- Yarn (preferred) or NPM

## How to run

Install the required dependencies
```sh
yarn
```

Compile contracts in `ethereum>contracts>Campaign.sol`
```sh
yarn compile-contracts
```

Test compiled Campaign contract
```
yarn test
```

Update the `INFURA_ENDPOINT` & `WALLET_MNEMONIC` in .env file with your wallet mnemonic & infura endpoint
```
WALLET_MNEMONIC=""
INFURA_ENDPOINT=
```

Deploy the compiled contract using the first address in your mnemonic wallet and make sure to copy deployed contract address that gets logged
```sh
yarn deploy-contracts
```

Update the `NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS` in .env file with the contract address that was logged in the previous step
```
NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS=
```

To run Next.js in development mode, run the following command and visit localhost:3000
```sh
yarn dev
```

To run Next.js in production mode, run the following commands and visit localhost:3000
```sh
yarn build
yarn start
```

## Future work
- Add SSR & Pagination to request page(`pages/campaigns/[address]/requests/index.js`)
- Improve overall UI/UX