import { useEffect, useState } from "react";

import { marked } from "marked";

import "@/styles/md.css";

const md: string = `# Welcome to Fomowell — The High-Speed Bitcoin Layer 2 for Runes

Still missing out on opportunities because of Bitcoin's slow, expensive transactions? It's time to stop waiting.

**Fomowell transforms the IC into a high-performance Layer 2 for Bitcoin**, fundamentally solving the problems of speed and cost. Think of it this way: we've placed the "execution layer" for trades on the high-speed IC, while keeping the "settlement and security layer" firmly anchored to the Bitcoin mainnet.

Most importantly, to guarantee ultimate decentralization and security, **all of Fomowell's core Canisters (smart contracts) will be governed by Fomowell SNS DAO**. This means all future upgrades and treasury management are controlled by community vote, eliminating the risk of malicious developers or single points of failure.

This is the secret to why trading on Fomowell is both lightning-fast and rock-solid.

## Fomowell's Unique Two-Stage Trading Model

We've designed a complete journey for every Rune, from community consensus to the open market.

### Stage 1: The Fair Launch Accelerator (Bonding Curve)

*   **Core Mechanic:** A \`y = e\\^x\` community-driven pricing curve.
*   **How It Works:** Every new Rune is born here with no insiders or pre-allocations. The price is driven entirely by every community purchase, rising fairly and transparently.
*   **The Goal:** When the community's combined effort pushes a pool to **0.211 BTC**, the launch is successful.

### Stage 2: The Open Market (AMM)

*   **Core Mechanic:** The classic \`k = x * y\` Automated Market Maker model.
*   **How It Works:** After a successful launch, Fomowell **automatically deploys the Rune for you on the Bitcoin mainnet**, making it a true on-chain asset. Simultaneously, most of the funds are injected into an AMM liquidity pool, unlocking free trade.
*   **Infinite Possibilities:** Here, the price is determined by market supply and demand in the ultimate testing ground for legends.

---

## Fomowell's Core Advantages

*   **Blazing-Fast Layer 2 Speed (IC-Powered):** By using IC as a Bitcoin Layer 2, every transaction is confirmed in **an average of just 2 seconds**. In the fast-paced world of memes, speed is everything.
*   **Decentralized Security (SNS-Governed):** The platform is governed by the community via an SNS DAO, with open-source code and transparent decision-making. Your asset security is guaranteed by decentralized consensus, not a single entity.
*   **True Bitcoin Assets:** While trades are instant on the IC, your final Rune assets are **deployed on the Bitcoin mainnet**, ensuring they are secure, decentralized, and truly yours.
*   **Extremely Low Creation Barrier:** For a small fee of just **3,333 sats**, you can turn your idea into reality. This fee is designed to prevent bot spam.
*   **Transparent and Flat Fee:** We charge a simple, flat platform fee of **1%** on all trades.

---

## Two-Tier Referral System: Your Influence, Your Earnings

*   **Tier 1 Rewards (Direct Referrals):** Earn **20%** of the trading fees from users you directly invite.
*   **Tier 2 Rewards (Indirect Referrals):** Earn **5%** of the trading fees from users invited by your direct referrals.

Withdraw your earnings anytime your rewards balance reaches **10,000 sats**.

---

## Stop Waiting. Act Now!

The Bitcoin Runes era has begun. The biggest risk is watching from the sidelines.

**Join Fomowell and seize your FOMO opportunity at the speed of Layer 2!**`;

export default function AboutPage() {
	const [content, setContent] = useState("");

	const init = async () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const htmlContent = (await marked(md)) as string;
		setContent(htmlContent);
	};

	useEffect(() => {
		void init();
	}, []);

	return (
		<div dangerouslySetInnerHTML={{ __html: content }} className="mdCon" />
	);
}
