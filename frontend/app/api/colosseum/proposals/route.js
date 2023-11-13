import Proposal from "@/models/proposal";
import { connectToDb } from "@/util/database";

export const GET = async (req, res) => {
  try {
    // Use this is production only
    // const provider = new ethers.getDefaultProvider();
    // const currentBlock = await provider.getBlockNumber();

    // Use this for dev only
    const blockNumber = req.nextUrl.searchParams.get("block_number");
    
    await connectToDb();
    (parseInt(blockNumber)+1);
    const activeProposals = await Proposal.where('voteEnd').gt(parseInt(blockNumber)-1).populate("author");
    const pastProposals = await Proposal.where('voteEnd').lte(parseInt(blockNumber)-1).populate("author");
    return new Response(JSON.stringify({activeProposals, pastProposals}), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(error, { status: 500 });
  }
};
