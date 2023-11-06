import Proposal from "@/models/proposal";
import { connectToDb } from "@/util/database";
import { ethers } from "ethers";

export const GET = async (req, res) => {
  try {
    // Use this is production only
    // const provider = new ethers.getDefaultProvider();
    // const currentBlock = await provider.getBlockNumber();

    // Use this for dev only
    const blockNumber = req.nextUrl.searchParams.get("block_number");
    
    await connectToDb();
    const proposals = await Proposal.where('voteEnd').gt(blockNumber).populate("author");
    return new Response(JSON.stringify(proposals), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error, { status: 500 });
  }
};
