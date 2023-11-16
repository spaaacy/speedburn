import { Alchemy, Network } from "alchemy-sdk";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
    const alchemy = new Alchemy({ apiKey: process.env.ALCHEMY_API_KEY, network: Network.ETH_MAINNET })
    const communities = []
    // FIXME: Use real address in production
    const nftsOwned = await alchemy.nft.getNftsForOwner("vitalik.eth")
    for (const nft of nftsOwned.ownedNfts) {
        const metadata = {
            name: nft.contract.name,
            address: nft.contract.address,
            symbol: nft.contract.symbol
        }
        if (!communities.find((community) => community.symbol === metadata.symbol)) {
            communities.push(metadata)
        }
    }
    return new Response(JSON.stringify(communities), { status: 200 });
}