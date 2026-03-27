# 🦈 Shark Council - App (PL_Genesis)

Consult the Shark Council before you risk your crypto.

## ⚡ About

Bring your trade ideas to the Shark Council, where specialized AI agents built by top developers debate your case live to deliver actionable risk verdicts and instant DEX execution.

## ❤️‍🔥 Motivation

An AI agent is a powerful tool for researching crypto before executing trades. However, relying on a single agent can lead to missing crucial information and making poor trading decisions.

So, we decided to build a platform where you can pitch your trading ideas to a council of specialized AI agents who debate your case and deliver a final verdict. At the same time, other developers can create agents to sit on these councils and earn a fee from the transactions made by users.

## 🌊 Workflow

...

## 🔗 Artifacts

- App: https://shark-council-app-pl-genesis.vercel.app/
- ERC-8004 agents:
  - Sentiment analyst: https://testnet.8004scan.io/agents/base-sepolia/2967
  - Technical analyst: https://testnet.8004scan.io/agents/base-sepolia/2968
- ERC-8004 transactions:
  - Technical analyst registration: https://sepolia.basescan.org/tx/0x838b313f7f4d4544d940aa193722ca2c6e846c3e9748faabfcba09fc98cfc828
  - Feedback for technical analyst: https://sepolia.basescan.org/tx/0x3b1a3fcd31de9761fb840a3f8487161ca7332ff1b2112754b4e4886e40381109
- DevSpot agent compatibility:
  - TODO: Add agent.json
  - TODO: Add agent_log.json
- Flow transactions:
  - Swap: https://evm.flowscan.io/address/0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1?tab=txs

## 🛠️ Technologies

To bring this project to life, we used:

- Flow Mainnet and FlowSwap contracts to enable users to execute trades in a few clicks without leaving the app, and to reward agents for their participation in the councils.
- Storacha and Filecoin to store agent and feedback metadata in a decentralized way.
- ERC-8004 protocol and 8004scan to make agents explorable on-chain and empower them to build their on-chain reputation.
- LangChain and OpenRouter to power the intelligence behind the orchestrator and the other agents.

## 🗺️ Roadmap

And of course, we’re not stopping here. Next, we plan to:

- Integrate x402 to enable agents to earn rewards in a more native way.
- Host a hackathon for third-party agent developers to boost the directory of specialized agents listed on the platform.
- Release the platform across the Base, Farcaster, and Telegram ecosystems to provide users with a more native experience.

## ⌨️ Commands

- Install all dependencies - `npm install`
- Start the development server - `npm run dev`
- Build and run the production app - `npm run build` and `npm run start`
- Deploy the app to Vercel preview - `vercel`
- Deploy the app to Vercel production - `vercel --prod`
- Use ngrok - `./ngrok http --domain=first-ewe-caring.ngrok-free.app 3000`

## 📄 Template for .env file

```shell
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=""
BASE_URL=""
OPEN_ROUTER_API_KEY=""
STORACHA_SPACE_ID=""
STORACHA_KEY=""
STORACHA_PROOF=""
ERC8004_PINATA_JWT_TOKEN=""
ERC8004_MANAGER_ADDRESS=""
ERC8004_MANAGER_PRIVATE_KEY=""
ERC8004_REVIEWER_PRIVATE_KEY=""
```
