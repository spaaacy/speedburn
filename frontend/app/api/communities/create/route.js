import Community from "@/models/community";
import { connectToDb } from "@/util/database"
import { Alchemy, Network } from "alchemy-sdk";

export const POST = async (req, res) => {
   try {
      const { address, user } = await req.json();
      const alchemy = new Alchemy({ apiKey: process.env.ALCHEMY_API_KEY, network: Network.ETH_MAINNET })
      const metadata = await alchemy.nft.getContractMetadata(address)
      await connectToDb();
      await Community.create({ name: metadata.name, symbol: metadata.symbol, address, members: [user] })
      return new Response("Community has been created!", { status: 200 })
   } catch (error) {
      console.error(error);
      return new Response(error, { status: 500 })

   }
}